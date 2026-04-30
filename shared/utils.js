/* =========================================================
   SHARED UTILITIES — MecFlu
   Funções utilitárias compartilhadas por todos os experimentos.
   Inclua este arquivo ANTES do script específico do experimento,
   com os atributos data-root e data-cookie-services:

   <script src="../../shared/utils.js"
           data-root="../../"
           data-cookie-services="Google Fonts, MathJax"></script>
   ========================================================= */
'use strict';

const _script = document.currentScript;
const ROOT = (_script && _script.getAttribute('data-root')) || '';
const COOKIE_SERVICES = (_script && _script.getAttribute('data-cookie-services')) || 'Google Fonts';

/** Formata número com 6 casas decimais */
function fmt(n) {
    return n.toFixed(6);
}

/** Converte cor hex em rgba com opacidade */
function hexRgba(hex, a) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
    const n = parseInt(c, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

(function initFooter() {
    if (document.querySelector('.site-footer')) return;
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <p>Desenvolvido para estudo pessoal para a disciplina de <strong>Mecânica dos Fluidos</strong></p>
        <nav class="footer-links">
            <a href="${ROOT}politica-de-privacidade.html">Política de Privacidade</a>
            <span class="footer-sep">·</span>
            <a href="${ROOT}termos-de-uso.html">Termos de Uso</a>
        </nav>
    `;
    document.body.appendChild(footer);
})();

(function initCookieBanner() {
    if (document.getElementById('cookie-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <p class="cookie-text">
            Este site utiliza recursos de terceiros (${COOKIE_SERVICES}) que podem registrar dados técnicos de acesso.
            Nenhum dado pessoal é coletado diretamente por este site.
            Saiba mais na nossa <a href="${ROOT}politica-de-privacidade.html">Política de Privacidade</a>.
        </p>
        <button class="cookie-btn" id="cookie-accept">Entendi</button>
    `;
    document.body.appendChild(banner);

    if (localStorage.getItem('mecflu_cookie_consent')) {
        banner.classList.add('hidden');
    }
    document.getElementById('cookie-accept').addEventListener('click', function () {
        localStorage.setItem('mecflu_cookie_consent', '1');
        banner.classList.add('hidden');
    });
})();

(function initGlobalModal() {
    const topbarInner = document.querySelector('.topbar-inner');
    if (topbarInner && !document.getElementById('open-disclaimer')) {
        const btn = document.createElement('button');
        btn.id = 'open-disclaimer';
        btn.className = 'topbar-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" transform="translate(0, -2) scale(0.9)"/>
                <line x1="10" y1="9" x2="10" y2="13"/>
                <line x1="10" y1="17" x2="10.01" y2="17"/>
            </svg>
            Aviso Acadêmico
        `;
        topbarInner.appendChild(btn);
    }

    if (!document.getElementById('disclaimer-modal')) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'disclaimer-modal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal">
                <header class="modal-header">
                    <div class="modal-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" transform="translate(0, -2) scale(0.9)"/>
                            <line x1="10" y1="9" x2="10" y2="13"/>
                            <line x1="10" y1="17" x2="10.01" y2="17"/>
                        </svg>
                    </div>
                    <h2 class="modal-title">Aviso de Responsabilidade Acadêmica</h2>
                </header>
                <div class="modal-body">
                    <p>O <strong>MecFlu</strong> é um simulador virtual desenvolvido para fins de estudo pessoal acadêmico. Embora um grande esforço seja feito para garantir a exatidão das equações e simulações, você <strong>nunca deve confiar cegamente</strong> nos resultados aqui apresentados.</p>
                    <p>Use esta ferramenta como um apoio visual para o seu aprendizado, mas <strong>sempre revise os cálculos</strong> utilizando sua própria calculadora, materiais de aula e livros base.</p>
                    <div class="modal-highlight">
                        <p><strong>Encontrou algum problema ou erro?</strong></p>
                        <p>Por favor, ajude a melhorar este projeto! Relate o erro enviando um e-mail para <a href="mailto:everton.brignol@ufpel.edu.br">everton.brignol@ufpel.edu.br</a>. Se possível, inclua um print da tela descrevendo o que aconteceu.</p>
                    </div>
                </div>
                <footer class="modal-footer">
                    <button id="close-disclaimer" class="modal-btn">Ciente, entendi</button>
                </footer>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    const modal = document.getElementById('disclaimer-modal');
    const btnOpen = document.getElementById('open-disclaimer');
    const btnClose = document.getElementById('close-disclaimer');

    function openModal() { modal.classList.add('active'); }
    function closeModal() {
        modal.classList.remove('active');
        localStorage.setItem('mecflu_aviso_ciente', '1');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (!localStorage.getItem('mecflu_aviso_ciente')) {
        setTimeout(openModal, 400);
    }
})();
