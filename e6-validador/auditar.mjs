import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const modules = process.env.PETCARE_AUDIT_MODULES;
const auditRequire = modules ? createRequire(path.join(modules, '..', 'package.json')) : require;
const lighthouse = (await import(pathToFileURL(auditRequire.resolve('lighthouse')).href)).default;
const lighthouseRequire = createRequire(auditRequire.resolve('lighthouse'));
const chromeLauncher = lighthouseRequire('chrome-launcher');
const axePath = auditRequire.resolve('axe-core/axe.min.js');
let playwright;
try {
    playwright = auditRequire('playwright');
} catch {
    playwright = require(path.resolve(path.dirname(process.execPath), '../node_modules/playwright'));
}

const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(option('--root', process.cwd()));
const phase = option('--fase', 'final');
if (!['inicial', 'final'].includes(phase)) throw new Error('A fase deve ser inicial ou final.');
const output = path.resolve(option('--saida', path.join(process.cwd(), 'e6-validador', phase)));
fs.mkdirSync(output, { recursive: true });

const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, data) => {
        if (error) return res.writeHead(404).end();
        const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
        res.setHeader('Content-Type', (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
        res.end(data);
    });
});

let chrome;
let browser;
try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    console.log(`Auditoria ${phase}: ${base}`);
    const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    browser = await playwright.chromium.launch({ executablePath: chromePath });
    chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check'] });
    const summaries = [];
    for (const name of ['index', 'contacto', 'artigo']) {
        const url = `${base}/${name}.html`;
        const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
        await page.goto(url, { waitUntil: 'load' });
        await page.evaluate(async () => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
        await page.addScriptTag({ path: axePath });
        const axe = await page.evaluate(async () => window.axe.run(document));
        fs.writeFileSync(path.join(output, `${name}-axe.json`), JSON.stringify(axe, null, 2));
        await page.close();
        const result = await lighthouse(url, {
            port: chrome.port,
            onlyCategories: ['accessibility', 'best-practices', 'seo'],
            output: ['json', 'html'],
            locale: 'pt-PT',
            logLevel: 'error'
        });
        if (result.lhr.runtimeError) throw new Error(JSON.stringify(result.lhr.runtimeError));
        fs.writeFileSync(path.join(output, `${name}-lighthouse.json`), result.report[0]);
        fs.writeFileSync(path.join(output, `${name}-lighthouse.html`), result.report[1]);
        const summary = {
            pagina: `${name}.html`,
            fase: phase,
            lighthouse: result.lhr.lighthouseVersion,
            axe: axe.testEngine.version,
            scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
            violacoes: axe.violations.map(rule => ({ id: rule.id, impacto: rule.impact, descricao: rule.help, elementos: rule.nodes.length })),
            revisaoManual: axe.incomplete.map(rule => ({ id: rule.id, elementos: rule.nodes.length })),
            falhasLighthouse: Object.entries(result.lhr.audits).filter(([, audit]) => audit.score !== null && audit.score < 1).map(([id, audit]) => ({ id, titulo: audit.title, score: audit.score }))
        };
        summaries.push(summary);
        console.log(JSON.stringify(summary));
    }
    fs.writeFileSync(path.join(output, 'resumo.json'), JSON.stringify(summaries, null, 2) + '\n');
} finally {
    if (browser) await browser.close();
    if (chrome) await chrome.kill();
    await new Promise(resolve => server.close(resolve));
}
