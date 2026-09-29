/* Roble FX — efectos visuales compartidos, inspirados en React Bits y portados
 * a JS/CSS vanilla (la web no usa React). Se activan por atributos data-* y se
 * incluyen con <script src="/roble-fx.js" defer></script> en cualquier página.
 *
 * Efectos:
 *   [data-fx="shiny"]      brillo que recorre el texto
 *   [data-fx="gradient"]   degradado animado en el texto
 *   [data-fx="count"]      número que sube desde 0 (usa el nº ya escrito o data-to)
 *   [data-reveal]          aparición suave al entrar en pantalla (scroll reveal)
 *   .fx-spotlight          luz que sigue el ratón (tarjetas)
 *   .fx-tilt               inclinación 3D marcada hacia el ratón + reflejo
 *   .fx-glow               borde con luz que gira (tarjetas destacadas/premium)
 *   .fx-shine              reflejo que se desliza al pasar el ratón (botones)
 *   .fx-bg                 fondo animado sutil (malla cálida en movimiento)
 *
 * Respeta prefers-reduced-motion: si el usuario lo pide, todo queda estático.
 */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── estilos ── */
  function estilos() {
    if (document.getElementById('fx-css')) return;
    var s = document.createElement('style');
    s.id = 'fx-css';
    s.textContent = [
      /* Shiny: un brillo claro recorre el texto */
      '[data-fx="shiny"]{',
        'background:linear-gradient(120deg,currentColor 40%,rgba(255,255,255,.85) 50%,currentColor 60%);',
        'background-size:200% 100%;-webkit-background-clip:text;background-clip:text;',
        '-webkit-text-fill-color:transparent;color:inherit;animation:roble-shiny 4s linear infinite}',
      '@keyframes roble-shiny{0%{background-position:150% 0}100%{background-position:-150% 0}}',
      /* Gradient: degradado rojo de la marca animándose */
      '[data-fx="gradient"]{',
        'background:linear-gradient(90deg,var(--accent,#DC0000),var(--gold,#FFD200),var(--accent,#DC0000));',
        'background-size:200% auto;-webkit-background-clip:text;background-clip:text;',
        '-webkit-text-fill-color:transparent;animation:roble-grad 6s linear infinite}',
      '@keyframes roble-grad{to{background-position:200% center}}',
      /* Scroll reveal: parte oculto y sube al entrar */
      '[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}',
      '[data-reveal].fx-in{opacity:1;transform:none}',
      /* Spotlight: luz radial que sigue el ratón */
      '.fx-spotlight{position:relative;--fx-mx:50%;--fx-my:50%}',
      '.fx-spotlight::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;',
        'background:radial-gradient(220px circle at var(--fx-mx) var(--fx-my),rgba(220,0,0,.16),transparent 70%);',
        'opacity:0;transition:opacity .35s ease}',
      '.fx-spotlight:hover::after,.fx-spotlight:focus-within::after{opacity:1}',
      '.fx-spotlight>*{position:relative;z-index:1}',
      /* Tilt: inclinación 3D (marcada). El JS pone rotate/scale en línea. */
      '.fx-tilt{transition:transform .25s cubic-bezier(.16,1,.3,1)}',
      '.fx-tilt:hover{will-change:transform}',
      '.fx-tilt::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;',
        'background:radial-gradient(circle at var(--fx-mx,50%) var(--fx-my,50%),rgba(255,255,255,.18),transparent 55%);',
        'opacity:0;transition:opacity .3s ease}',
      '.fx-tilt:hover::after{opacity:1}',
      /* BorderGlow: borde con luz que gira (para tarjetas destacadas/premium) */
      '.fx-glow{position:relative}',
      '.fx-glow::before{content:"";position:absolute;inset:-1.5px;border-radius:inherit;z-index:0;padding:1.5px;',
        'background:conic-gradient(from var(--fx-ang,0deg),transparent 0deg,var(--accent,#DC0000) 60deg,var(--gold,#FFD200) 140deg,transparent 220deg,transparent 360deg);',
        '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);',
        '-webkit-mask-composite:xor;mask-composite:exclude;',
        'opacity:.9;animation:roble-glow 4s linear infinite}',
      '@keyframes roble-glow{to{--fx-ang:360deg}}',
      '@property --fx-ang{syntax:"<angle>";inherits:false;initial-value:0deg}',
      '.fx-glow>*{position:relative;z-index:1}',
      /* SpecularButton: reflejo que se desliza al pasar el ratón */
      '.fx-shine{position:relative;overflow:hidden}',
      '.fx-shine::after{content:"";position:absolute;top:0;left:-120%;width:70%;height:100%;z-index:2;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-18deg);transition:left .6s ease}',
      '.fx-shine:hover::after{left:130%}',
      /* ScrollFloat: el título sube palabra a palabra al entrar en pantalla */
      '[data-fx="float"]{display:inline-block}',
      '[data-fx="float"] .fx-w{display:inline-block;opacity:0;transform:translateY(90%) rotate(2deg);',
        'transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}',
      '[data-fx="float"].fx-in .fx-w{opacity:1;transform:none}',
      '[data-fx="float"] .fx-lin{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em}',
      /* StarBorder: punto de luz que recorre el perímetro del botón */
      /* fx-shine recorta con overflow:hidden, así que el borde luminoso va DENTRO
         del botón (inset 0) en lugar de sobresalir. Ambos efectos conviven. */
      '.fx-star{position:relative}',
      '.fx-star::before{content:"";position:absolute;inset:0;z-index:3;padding:1.5px;border-radius:inherit;',
        'background:conic-gradient(from var(--fx-ang2,0deg),transparent 0deg,transparent 300deg,var(--gold,#FFD200) 340deg,#fff 350deg,var(--gold,#FFD200) 360deg);',
        '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);',
        '-webkit-mask-composite:xor;mask-composite:exclude;',
        'opacity:0;transition:opacity .3s ease;animation:roble-star 3s linear infinite}',
      '.fx-star:hover::before,.fx-star:focus-visible::before{opacity:1}',
      '@keyframes roble-star{to{--fx-ang2:360deg}}',
      '@property --fx-ang2{syntax:"<angle>";inherits:false;initial-value:0deg}',
      /* Borde reactivo: la línea del contorno se ilumina donde está el cursor */
      '.fx-spotlight::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;',
        'padding:1px;background:radial-gradient(240px circle at var(--fx-mx) var(--fx-my),rgba(255,40,0,.55),transparent 65%);',
        '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);',
        '-webkit-mask-composite:xor;mask-composite:exclude;',
        'opacity:0;transition:opacity .35s ease}',
      '.fx-spotlight:hover::before,.fx-spotlight:focus-within::before{opacity:1}',
      /* Fondo animado sutil: malla cálida que se desplaza despacio */
      '.fx-bg{position:relative;isolation:isolate}',
      '.fx-bg::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:.5;',
        'background:radial-gradient(60% 60% at 20% 10%,rgba(220,0,0,.14),transparent 60%),',
        'radial-gradient(50% 50% at 85% 30%,rgba(255,210,0,.06),transparent 60%),',
        'radial-gradient(40% 40% at 50% 100%,rgba(255,40,0,.10),transparent 60%);',
        'background-size:200% 200%;animation:roble-bg 18s ease-in-out infinite alternate}',
      '@keyframes roble-bg{0%{background-position:0% 0%}100%{background-position:100% 100%}}',
      (reduce
        ? '[data-fx="shiny"],[data-fx="gradient"]{animation:none}[data-reveal]{opacity:1;transform:none;transition:none}' +
          '.fx-glow::before,.fx-bg::before,.fx-star::before{animation:none}' +
          '[data-fx="float"] .fx-w{opacity:1;transform:none;transition:none}'
        : '')
    ].join('');
    document.head.appendChild(s);
  }

  /* ── CountUp: anima un número desde 0 hasta su valor final ── */
  function countUp(el) {
    var destino = parseFloat((el.getAttribute('data-to') || el.textContent || '0').replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.'));
    if (!isFinite(destino)) return;
    var sufijo = el.getAttribute('data-suffix') || '';
    var prefijo = el.getAttribute('data-prefix') || '';
    if (reduce) { el.textContent = prefijo + destino.toLocaleString('es-ES') + sufijo; return; }
    // Duración proporcional a la magnitud: los números grandes merecen más recorrido
    var dur = Math.min(2600, Math.max(1100, 900 + Math.log10(Math.max(destino, 1)) * 420));
    var t0 = null;
    el.style.willChange = 'contents';

    function paso(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / dur, 1);
      // expo.out: arranca rápido y frena con suavidad al llegar
      var ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = prefijo + Math.round(ease * destino).toLocaleString('es-ES') + sufijo;
      if (p < 1) requestAnimationFrame(paso);
      else {
        el.textContent = prefijo + destino.toLocaleString('es-ES') + sufijo;
        el.style.willChange = 'auto';
      }
    }
    requestAnimationFrame(paso);
  }

  /* ── ScrollFloat: parte el texto en palabras para que suban escalonadas.
        Conserva los <em> del titular (la palabra resaltada del diseño). ── */
  function partePalabras(el) {
    if (el.__partido) return;
    el.__partido = true;

    var piezas = [];
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (t.trim()) piezas.push({ txt: t, em: false });
        });
      } else if (n.nodeType === 1) {
        // Un <em> puede llevar varias palabras: cada una sube por separado
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (t.trim()) piezas.push({ txt: t, em: true });
        });
      }
    });
    if (!piezas.length) return;

    el.textContent = '';
    piezas.forEach(function (p, i) {
      var linea = document.createElement('span');
      linea.className = 'fx-lin';
      var palabra = document.createElement(p.em ? 'em' : 'span');
      palabra.className = 'fx-w';
      palabra.textContent = p.txt;
      palabra.style.transitionDelay = (i * 55) + 'ms';
      linea.appendChild(palabra);
      el.appendChild(linea);
      if (i < piezas.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* ── observador para reveal + count (se disparan al entrar en pantalla) ── */
  var io = null;

  function observa() {
    var reveal = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    var counts = Array.prototype.slice.call(document.querySelectorAll('[data-fx="count"]'));
    var floats = Array.prototype.slice.call(document.querySelectorAll('[data-fx="float"]'));

    // El troceado en palabras se hace ya, para que no haya salto al animar
    floats.forEach(partePalabras);

    if (!('IntersectionObserver' in window)) {
      reveal.forEach(function (el) { el.classList.add('fx-in'); });
      floats.forEach(function (el) { el.classList.add('fx-in'); });
      counts.forEach(countUp);
      return;
    }

    // Un único observer para todos los efectos de entrada
    if (!io) {
      io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          if (el.hasAttribute('data-reveal')) {
            var d = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
            if (d) el.style.transitionDelay = d + 'ms';
            el.classList.add('fx-in');
          }
          if (el.getAttribute('data-fx') === 'float') el.classList.add('fx-in');
          if (el.getAttribute('data-fx') === 'count') countUp(el);
          io.unobserve(el);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    }

    reveal.concat(counts, floats).forEach(function (el) {
      if (el.__observado) return;
      el.__observado = true;
      io.observe(el);
    });
  }

  /* ── spotlight: la luz sigue al ratón dentro de cada tarjeta.
        Listener por elemento (no global) y una escritura por frame. ── */
  function spotlight() {
    if (reduce) return;
    document.querySelectorAll('.fx-spotlight').forEach(function (el) {
      if (el.__spot) return;
      el.__spot = true;
      var raf = null, x = 0, y = 0;

      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          el.style.setProperty('--fx-mx', x + 'px');
          el.style.setProperty('--fx-my', y + 'px');
          raf = null;
        });
      }, { passive: true });

      // La capa de composición solo existe mientras el cursor está encima
      el.addEventListener('mouseenter', function () { el.style.willChange = 'transform'; });
      el.addEventListener('mouseleave', function () {
        el.style.willChange = 'auto';
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    });
  }

  /* ── tilt: inclina la tarjeta hacia el cursor (marcado, con luz) ── */
  var AMPL = 12;   // amplitud de rotación en grados
  function tilt() {
    if (reduce) return;
    document.querySelectorAll('.fx-tilt').forEach(function (el) {
      if (el.__tilt) return; el.__tilt = true;   // no enganchar dos veces
      var raf = null, rx = 0, ry = 0;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var ox = e.clientX - r.left - r.width / 2;
        var oy = e.clientY - r.top - r.height / 2;
        rx = ((oy / (r.height / 2)) * -AMPL).toFixed(2);
        ry = ((ox / (r.width / 2)) * AMPL).toFixed(2);
        el.style.setProperty('--fx-mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--fx-my', (e.clientY - r.top) + 'px');
        if (!raf) raf = requestAnimationFrame(function () {
          el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.04)';
          raf = null;
        });
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /* Red de seguridad: si algo impidiera que el observer disparase (salto directo
     a un ancla, pestaña en segundo plano al cargar…), el texto nunca debe quedar
     invisible. A los 4 s se revela lo que siga oculto y esté ya en pantalla. */
  function rescate() {
    setTimeout(function () {
      document.querySelectorAll('[data-fx="float"]:not(.fx-in),[data-reveal]:not(.fx-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('fx-in');
      });
    }, 4000);
  }

  function init() {
    estilos();
    observa();
    spotlight();
    tilt();
    rescate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Reobservar elementos que se pintan después (tarjetas de API, etc.).
  window.__fxRefresh = function () { observa(); tilt(); };
})();
