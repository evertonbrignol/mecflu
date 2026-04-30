# MecFlu — Guia para IA: Como Trabalhar Neste Projeto

> **Para qualquer IA (ou desenvolvedor) que for trabalhar neste projeto:**
> Leia este documento inteiro antes de fazer qualquer alteração.
> Ele contém as convenções, a estrutura de pastas e os passos exatos para adicionar novos experimentos.

---

## 1. Visão Geral do Projeto

**MecFlu** é um site estático (HTML + CSS + JS puro, sem frameworks ou bundlers) que funciona como um laboratório virtual de Mecânica dos Fluidos.  
Foi criado para **estudo pessoal** do autor (Everton Brignol) na disciplina de Mecânica dos Fluidos — Engenharia Ambiental e Sanitária, UFPel.

- **URL de produção:** `mecflu.engenhrariaambiental.eco.br`
- **Hospedagem:** Hostinger (site estático)
- **Repositório:** `git@github.com:evertonbrignol/mecflu.git`
- **Servidor de desenvolvimento local:** `npx serve .` (porta 3000)

---

## 2. Estrutura de Pastas

```
mecflu/
│
├── index.html                        ← Hub central (lista todos os experimentos)
├── style.css                         ← Design system global compartilhado
├── legal.css                         ← Estilos das páginas legais e cookie banner
├── politica-de-privacidade.html      ← Página de política de privacidade (LGPD)
├── termos-de-uso.html                ← Página de termos de uso (LGPD)
├── .gitignore
│
├── shared/
│   └── utils.js                      ← Funções utilitárias globais (ver seção 4)
│
└── experiments/
    └── newton/                        ← Experimento: Viscosidade de Newton
        ├── index.html                 ← Página do experimento
        └── newton.js                  ← JS exclusivo deste experimento
    (futuros experimentos aqui)
```

### Regra fundamental de isolamento

> **Cada experimento é uma página separada e completamente isolada.**  
> O JS de um experimento nunca é carregado na página de outro.  
> Não use variáveis globais em arquivos de experimento — elas já estão isoladas pelo escopo da página.

---

## 3. Design System (`style.css`)

O arquivo `style.css` define **tokens CSS** usados em todas as páginas. Nunca altere os valores de token sem intenção deliberada.

### Tokens principais

```css
--bg:          #f5f2ed   /* Fundo beige do conteúdo principal */
--bg-card:     #ffffff   /* Cards e painéis */
--bg-sidebar:  #1c2536   /* Sidebar e barras de navegação (navy escuro) */
--accent:      #2563eb   /* Cor de destaque principal (azul) */
--ink:         #1a1a2e   /* Texto primário */
--ink-mid:     #4a5568   /* Texto secundário */
--ink-light:   #718096   /* Texto terciário / placeholder */
--border:      #e2e0dc   /* Borda padrão */
--radius:      8px       /* Border radius padrão */
--radius-lg:   14px      /* Border radius de cards */
--serif:       'Source Serif 4', serif
--sans:        'Inter', sans-serif
--mono:        'JetBrains Mono', monospace
--sidebar-w:   300px     /* Largura da sidebar do experimento */
--exp-bar-h:   46px      /* Altura da barra de experimentos */
```

### Fontes carregadas (Google Fonts)
- `Source Serif 4` — títulos e equações textuais
- `Inter` — interface, labels, botões
- `JetBrains Mono` — valores numéricos, código

---

## 4. Utilitários Compartilhados (`shared/utils.js`)

Este arquivo declara funções **globais** (não usa `export`) disponíveis para qualquer experimento que o inclua.

```js
fmt(n)             // Formata número com 6 casas decimais → "0.200000"
hexRgba(hex, a)    // Converte cor hex em rgba com opacidade → "rgba(74,144,217,0.5)"
```

**Como incluir no HTML de um experimento:**
```html
<script src="../../shared/utils.js"></script>   <!-- SEMPRE antes do script do experimento -->
<script src="./nome-experimento.js"></script>
```

---

## 5. Como Adicionar um Novo Experimento

Siga **exatamente** esta sequência de passos.

### Passo 1 — Criar a pasta do experimento

```
experiments/nome-do-experimento/
├── index.html
└── nome-do-experimento.js
```

> Use kebab-case para o nome da pasta: `bernoulli`, `reynolds`, `continuidade`, etc.

---

### Passo 2 — Criar o `index.html` do experimento

Copie o template abaixo e substitua os campos marcados com `<!-- ALTERAR -->`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><!-- ALTERAR: Nome do Experimento --> — MecFlu</title>
    <meta name="description" content="<!-- ALTERAR: Descrição curta -->">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="../../legal.css">
    <!-- Adicione MathJax se usar fórmulas LaTeX -->
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body>
    <!-- TOPBAR — não alterar a estrutura, só o href do logo -->
    <nav class="topbar" id="topbar">
        <div class="topbar-inner">
            <a href="../../index.html" class="logo" title="Voltar ao Hub">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6m0 8v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/></svg>
                <span>MecFlu</span>
            </a>
            <span class="topbar-title">Laboratório de Mecânica dos Fluidos</span>
        </div>
    </nav>

    <!-- BARRA DE EXPERIMENTO — sempre inclua o link de volta -->
    <nav class="experiment-bar" id="experiment-bar">
        <div class="experiment-bar-inner">
            <a href="../../index.html" class="exp-back-link" title="Voltar ao Hub">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 4 6 10 12 16"/></svg>
                Experimentos
            </a>
            <button class="experiment-tab active" id="tab-<!-- ALTERAR: id-do-experimento -->">
                <!-- ALTERAR: SVG ícone representativo -->
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><!-- ícone --></svg>
                <span><!-- ALTERAR: Nome do Experimento --></span>
            </button>
        </div>
    </nav>

    <!-- CONTEÚDO DO EXPERIMENTO -->
    <div id="exp-<!-- ALTERAR: id -->" class="experiment active">
        <main class="layout">

            <!-- SIDEBAR com parâmetros -->
            <aside class="sidebar">
                <div class="sidebar-section">
                    <h2 class="sidebar-heading">Parâmetros</h2>
                    <!-- Adicione param-groups aqui (ver seção 6) -->
                </div>
                <div class="sidebar-section">
                    <button id="apply-params" class="apply-btn">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 10 8 14 16 6"/></svg>
                        Aplicar
                    </button>
                </div>
            </aside>

            <!-- ÁREA DE CONTEÚDO -->
            <div class="content">
                <header class="page-header">
                    <h1><!-- ALTERAR: Título do Experimento --></h1>
                    <p class="lead"><!-- ALTERAR: Descrição longa --></p>
                </header>
                <!-- Adicione seções de resultado, canvas, análise dimensional, etc. -->
            </div>

        </main>
    </div>

    <!-- RODAPÉ — caminhos fixos a partir de experiments/nome/ -->
    <footer class="site-footer">
        <p>Desenvolvido para estudo pessoal para a disciplina de <strong>Mecânica dos Fluidos</strong></p>
        <nav class="footer-links">
            <a href="../../politica-de-privacidade.html">Política de Privacidade</a>
            <span class="footer-sep">·</span>
            <a href="../../termos-de-uso.html">Termos de Uso</a>
        </nav>
    </footer>

    <!-- COOKIE BANNER — copie exatamente, só altere o href -->
    <div class="cookie-banner" id="cookie-banner">
        <p class="cookie-text">
            Este site utiliza recursos de terceiros (Google Fonts, MathJax) que podem registrar dados técnicos de acesso.
            Nenhum dado pessoal é coletado diretamente por este site.
            Saiba mais na nossa <a href="../../politica-de-privacidade.html">Política de Privacidade</a>.
        </p>
        <button class="cookie-btn" id="cookie-accept">Entendi</button>
    </div>

    <!-- SCRIPTS — ordem obrigatória -->
    <script src="../../shared/utils.js"></script>
    <script src="./nome-do-experimento.js"></script>
    <script>
        (function() {
            var banner = document.getElementById('cookie-banner');
            var btn    = document.getElementById('cookie-accept');
            if (localStorage.getItem('mecflu_cookie_consent')) banner.classList.add('hidden');
            btn.addEventListener('click', function() {
                localStorage.setItem('mecflu_cookie_consent', '1');
                banner.classList.add('hidden');
            });
        })();
    </script>
</body>
</html>
```

---

### Passo 3 — Criar o JS do experimento

O arquivo JS deve seguir o padrão IIFE para isolar variáveis:

```js
/* =========================================================
   EXPERIMENTO: Nome do Experimento
   Depende de: ../../shared/utils.js (fmt, hexRgba)
   ========================================================= */
(() => {
"use strict";
const $ = s => document.querySelector(s);

// Constantes físicas do experimento
const MINHA_CONSTANTE = 9.81;

// Referências aos elementos da UI
const ui = {
    // input1: $("#id-do-input"),
    // resultado: $("#id-do-resultado"),
    applyBtn: $("#apply-params"),
};

// Função principal de cálculo
function recalc() {
    // Use fmt() de shared/utils.js para formatar números
    // Use hexRgba() de shared/utils.js para cores canvas
}

// Event listeners
ui.applyBtn.addEventListener("click", () => {
    recalc();
    ui.applyBtn.classList.add("apply-btn--done");
    setTimeout(() => ui.applyBtn.classList.remove("apply-btn--done"), 1200);
});

// Inicialização
recalc();
})();
```

---

### Passo 4 — Adicionar o cartão no Hub (`index.html` raiz)

Localize o `div.hub-grid` no `index.html` raiz e adicione um novo cartão **antes** do cartão `exp-card--soon`:

```html
<a class="exp-card" href="experiments/nome-do-experimento/index.html" id="card-nome">
    <span class="exp-card-discipline">Mecânica dos Fluidos</span>
    <div class="exp-card-icon">
        <!-- SVG ícone representativo (20x20 viewBox) -->
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><!-- ... --></svg>
    </div>
    <div class="exp-card-title">Nome do Experimento</div>
    <p class="exp-card-desc">Descrição curta do que o experimento simula e o que o usuário pode aprender.</p>
    <span class="exp-card-btn">
        Abrir experimento
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="10" x2="16" y2="10"/><polyline points="11 5 16 10 11 15"/></svg>
    </span>
</a>
```

---

## 6. Componentes de UI Reutilizáveis

### Grupo de parâmetro (slider + input numérico)

```html
<div class="param-group">
    <div class="param-header">
        <label for="id-slider">Nome do Parâmetro <em>(símbolo)</em></label>
        <div class="param-value-wrap">
            <input type="number" id="id-val" class="param-input"
                   min="0" max="MAX" step="0.000001" value="VALOR_PADRAO">
            <span class="param-unit">unidade</span>
        </div>
    </div>
    <input type="range" id="id-slider" min="0" max="MAX" step="STEP" value="VALOR_PADRAO">
</div>
```

**Convenções:**
- O `id` do slider é sem sufixo: `#viscosity`
- O `id` do input numérico tem sufixo `-val`: `#viscosity-val`
- Todos os valores numéricos exibidos usam **6 casas decimais** via `fmt(n)` ou `.toFixed(6)`
- O slider atualiza em tempo real; o input numérico só aplica ao clicar "Aplicar"
- Ao digitar no input, adicione a classe `param-input--pending` no input e `apply-btn--pending` no botão

### Card de resultado

```html
<article class="card card--result">
    <span class="result-tag">Nome da Grandeza</span>
    <div class="result-equation">\[ formula = LaTeX \]</div>
    <code class="result-substitution" id="formula-subbed">formula = valores</code>
    <div class="result-number">
        <span id="resultado-id" class="result-value">--</span>
        <span class="result-unit">unidade</span>
    </div>
</article>
```

### Canvas de visualização

```html
<section class="card card--canvas" id="visualizacao">
    <div class="canvas-wrap">
        <canvas id="nomeCanvas"></canvas>
        <div class="canvas-labels">
            <span class="canvas-label canvas-label--top" id="label-top">Rótulo superior</span>
            <span class="canvas-label canvas-label--bottom">Rótulo inferior</span>
        </div>
    </div>
</section>
```

---

## 7. Convenções Gerais de Código

| Regra | Detalhe |
|-------|---------|
| **Precisão numérica** | Sempre 6 casas decimais. Use `fmt(n)` para resultados e `.toFixed(6)` para parâmetros |
| **Divisão por zero** | Proteja sempre: `y > 0 ? mu * (v / y) : 0` |
| **IDs únicos** | Todos os IDs devem ser únicos dentro de cada página |
| **IIFE** | Todo JS de experimento deve ficar dentro de `(() => { 'use strict'; ... })()` |
| **Sem jQuery / frameworks** | Use `document.querySelector` puro (atalho `const $ = s => document.querySelector(s)`) |
| **CSS no experimento** | Estilos específicos de um experimento vão em `<style>` inline no HTML ou num `.css` próprio na pasta do experimento — nunca em `style.css` |
| **Fontes** | Nunca altere as fontes carregadas. Novos experimentos copiam o mesmo `<link>` do Google Fonts |
| **MathJax** | Inclua o script só se o experimento usar fórmulas LaTeX. Use `\( \)` para inline e `\[ \]` para bloco |

---

## 8. Caminhos de Arquivo por Nível

| De onde | Para `style.css` | Para `shared/utils.js` | Para `politica-de-privacidade.html` |
|---------|-----------------|------------------------|--------------------------------------|
| `index.html` (raiz) | `style.css` | `shared/utils.js` | `politica-de-privacidade.html` |
| `experiments/newton/index.html` | `../../style.css` | `../../shared/utils.js` | `../../politica-de-privacidade.html` |
| Futuros `experiments/nome/index.html` | `../../style.css` | `../../shared/utils.js` | `../../politica-de-privacidade.html` |

---

## 9. Git e Fluxo de Trabalho

```bash
# Clonar o repositório
git clone git@github.com:evertonbrignol/mecflu.git

# Iniciar servidor local
npx serve .

# Após alterações: commit e push
git add -A
git commit -m "Descrição clara da alteração"
git push
```

### Boas mensagens de commit

```
feat: Adiciona experimento de Equação de Bernoulli
fix: Corrige divisão por zero quando y=0 em Newton
style: Ajusta cores do card de resultado
refactor: Extrai função de cálculo para utils.js
```

---

## 10. Contexto Legal (LGPD)

O site é um **experimento de estudo pessoal**. As páginas legais já estão criadas e não precisam ser alteradas com frequência. Se precisar atualizar:

- **Política de Privacidade:** `politica-de-privacidade.html`
- **Termos de Uso:** `termos-de-uso.html`
- **Contato do responsável:** `everton.brignol@ufpel.edu.br`

O cookie banner usa `localStorage.getItem('mecflu_cookie_consent')` para persistir o consentimento. Não mude a chave.

---

## 11. Checklist para Novo Experimento

Antes de fazer commit de um novo experimento, verifique:

- [ ] Pasta criada em `experiments/nome/`
- [ ] `index.html` com todos os caminhos `../../` corretos
- [ ] `nome.js` com IIFE e `'use strict'`
- [ ] `<script src="../../shared/utils.js">` carregado **antes** do JS do experimento
- [ ] Todos os valores numéricos exibidos com 6 casas decimais
- [ ] Proteção contra divisão por zero
- [ ] Botão "Aplicar" com feedback visual (`apply-btn--done`)
- [ ] Cookie banner copiado corretamente com paths `../../`
- [ ] Link "← Experimentos" na barra do experimento apontando para `../../index.html`
- [ ] Cartão adicionado no hub (`index.html` raiz)
- [ ] Testado no servidor local (`npx serve .`)
