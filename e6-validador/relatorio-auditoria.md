# Relatório de auditoria E6 do PetCare

## Âmbito e método

Data: 15 de novembro de 2026. Páginas: `index.html`, `contacto.html` e `artigo.html`.

Ferramentas efetivamente executadas: Lighthouse 13.6.0 e axe-core 4.14.0, com Chrome em modo headless. As páginas foram servidas por HTTP em `127.0.0.1`, num servidor temporário. Lighthouse usou configuração móvel e as categorias de acessibilidade, boas práticas e SEO. Não foi executada uma auditoria de desempenho.

A fase inicial usou uma cópia da base do GitHub no commit `785bf73bdb7f620fe1a4c28cf7ec44067684d490`, a que já estava associada a tag E6. A fase final usou os ficheiros desta pasta após as correções. Os relatórios mantêm os endereços locais temporários de cada execução; esses endereços não são o site publicado.

## Comparação dos resultados automáticos

As contagens axe apresentam **regras com violação / elementos afetados**. Uma pontuação Lighthouse não é uma percentagem de conformidade WCAG.

| Página | Lighthouse acessibilidade inicial | Final | axe inicial regras / elementos | axe final | Boas práticas final | SEO final |
| --- | --- | --- | --- | --- | --- | --- |
| index.html | 93 | 100 | 1 / 6 | 0 / 0 | 96 | 91 |
| contacto.html | 97 | 100 | 1 / 1 | 0 / 0 | 96 | 90 |
| artigo.html | 100 | 100 | 1 / 1 | 0 / 0 | 96 | 90 |

O Artigo já tinha 100 no Lighthouse inicial, mas o axe encontrou uma falha de identificação das navegações. Esta diferença mostra a utilidade de combinar as duas ferramentas. A ausência de violações automáticas finais aplica-se às três páginas e aos estados analisados, não certifica todo o site nem todos os estados possíveis.

## Problemas encontrados e plano de correção

| Prioridade | Problema e evidência | Ação | Estado e confirmação |
| --- | --- | --- | --- |
| Alta | `color-contrast` na página inicial: seis ligações do menu afetadas | Definir cores legíveis da navbar em `css/personalizacoes.css` e verificar foco e estado ativo | Corrigido; deixou de aparecer no Lighthouse e no axe finais |
| Média | `heading-order` em Contactos: título h3 da legenda saltava um nível | Substituir o título de legenda por um parágrafo associado ao formulário com `aria-describedby` | Corrigido; sem ocorrência final |
| Média | `landmark-unique` no Artigo: navegação principal e índice sem nomes distintos | Atribuir `aria-label="Navegação principal"` e `aria-label="Índice do artigo"` | Corrigido; sem ocorrência final no axe |
| Média | Textos alternativos da página inicial incluíam uma indicação de clique sem ligação e descrições pouco fiéis | Retirar a indicação de clique e rever quatro descrições com as fotografias | Revisão de conteúdo efetuada; a adequação semântica depende de avaliação humana |
| Média | Dois seletores nativos de Contactos ficaram em `incomplete` no teste de contraste do axe: `#assunto` e `#animal` | Verificar apresentação dos estados aberto, fechado e selecionado no navegador e em sistemas operativos diferentes | Mantido em revisão manual; não convertido artificialmente em aprovação automática |
| Baixa | Lighthouse assinala ausência de meta descrição nas três páginas | Só acrescentar descrições se o requisito de não adicionar metadados for alterado | Mantido por opção de âmbito; SEO 91 na inicial e 90 nas outras duas |
| Baixa | Pedido automático a `/favicon.ico` devolve 404 no servidor de pré-visualização | Acrescentar um ícone de site numa evolução futura, se pretendido | Registado; não impede a navegação; boas práticas 96 |

## Verificações de interação realizadas

- Seis páginas em cinco larguras: 360, 480, 768, 1024 e 1280 px, total de 30 combinações.
- Nas 30 combinações, `documentElement.scrollWidth` coincidiu com `clientWidth`, sem deslocação horizontal.
- Verificados os alvos visíveis: nenhum inferior a 24 × 24 px CSS. O menu foi expandido nos tamanhos móveis para incluir as ligações na medição.
- Serviços e Produtos: uma, duas e três colunas nos intervalos definidos pela grelha Bootstrap.
- Menu: abertura por teclado, atualização de `aria-expanded` e visibilidade das ligações.
- Ligação “Saltar para o conteúdo”: primeiro foco por Tab e ativação com Enter.
- Acordeão: abertura com Enter, troca de resposta e fecho com Espaço; estados ARIA confirmados.
- Formulário: inválido sem os campos obrigatórios e válido com nome, email, assunto, mensagem e privacidade preenchidos. Não foi submetido um pedido POST.
- Fotografias carregadas durante a verificação e ausência de erros JavaScript de execução.

Os resultados detalhados estão em [verificacao-funcional.json](verificacao-funcional.json). As capturas foram feitas com o menu móvel expandido e os blocos details abertos, para tornar o seu conteúdo visível. Não foi realizado um teste com participantes ou uma avaliação completa com leitor de ecrã. Estes ensaios continuam recomendados para uma versão posterior.

## Artigo v1 e critério dos 60 por cento

- Local: `artigo.html`.
- Meta de trabalho adotada para a versão final: 2000 palavras de corpo de texto. Esta meta foi definida para tornar o critério verificável; a grelha fornecida não indica um número absoluto de palavras.
- Mínimo da v1: 1200 palavras, isto é, 60% dessa meta.
- Corpo desta versão: **1309 palavras**, equivalente a **65.5%** da meta de trabalho.
- Contagem: tokens de palavras e números nos parágrafos das secções do artigo, excluindo índice, títulos, navegação e referências. A contagem de um processador de texto pode diferir ligeiramente.
- A v1 cobre resumo, introdução, contributos, limitações, aplicação ao PetCare e conclusão. O estudo com utilizadores e a ampliação da discussão ficam para a revisão seguinte.

## Onde encontrar os relatórios originais

| Página | Lighthouse inicial | Lighthouse final | axe inicial e final |
| --- | --- | --- | --- |
| Inicial | [HTML](inicial/index-lighthouse.html) e [JSON](inicial/index-lighthouse.json) | [HTML](final/index-lighthouse.html) e [JSON](final/index-lighthouse.json) | [Inicial](inicial/index-axe.json) / [Final](final/index-axe.json) |
| Contactos | [HTML](inicial/contacto-lighthouse.html) e [JSON](inicial/contacto-lighthouse.json) | [HTML](final/contacto-lighthouse.html) e [JSON](final/contacto-lighthouse.json) | [Inicial](inicial/contacto-axe.json) / [Final](final/contacto-axe.json) |
| Artigo | [HTML](inicial/artigo-lighthouse.html) e [JSON](inicial/artigo-lighthouse.json) | [HTML](final/artigo-lighthouse.html) e [JSON](final/artigo-lighthouse.json) | [Inicial](inicial/artigo-axe.json) / [Final](final/artigo-axe.json) |

As imagens atuais estão em [capturas](capturas/), duas por página: `nome-360.png` e `nome-1280.png`. Os comprovativos anteriores da E5 continuam em `../e5-validador/capturas/`.

## Integridade do framework

Os hashes SHA-384 coincidem com os publicados na documentação oficial do Bootstrap 5.3.9. As personalizações foram feitas apenas em ficheiros próprios.

```text
bootstrap.min.css
sha384-yEPZ7jP9S0QKiUQ0m3jjsO4ProIW7wvR9gXkI7JOGa2XVsw53Yke2bsdkBbjmmiX

bootstrap.bundle.min.js
sha384-WyOxWvTyr1QaMPfiPJSv76iReVthorl5uWlFtZPyK0IEB0hGzo9y5Bp9mYanr8Bu
```

## Repetir a auditoria e preparar a entrega

O comando, as dependências e a configuração encontram-se no [README](../README.md). O script `auditar.mjs` inicia e fecha os processos de teste; `servir.mjs` mantém um servidor de pré-visualização até receber Ctrl+C.

A tag remota E6 foi preservada no seu commit original. Esta revisão do código, o relatório e o guia são resultados locais; ainda precisam de ser enviados ao repositório para corresponderem a uma nova entrega publicada. Não se deve mover uma tag existente para fazer parecer que já incluía ficheiros posteriores. O guia apresenta o envio da revisão e uma nova tag opcional, como E6-r1.

## Referências

- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/).
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview).
- [axe-core](https://github.com/dequelabs/axe-core).
- [Ferramentas de avaliação W3C WAI](https://www.w3.org/WAI/test-evaluate/tools/).
- [Base E6 no GitHub](https://github.com/leo-8-7/petcare/tree/785bf73bdb7f620fe1a4c28cf7ec44067684d490).
