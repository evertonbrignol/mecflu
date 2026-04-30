/* =========================================================
   SHARED UTILITIES — MecFlu
   Funções utilitárias compartilhadas por todos os experimentos.
   Inclua este arquivo ANTES do script específico do experimento.
   ========================================================= */
'use strict';

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
