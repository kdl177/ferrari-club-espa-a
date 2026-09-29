# Brief — Web del Club de Propietarios Ferrari

> **Pega este documento entero al inicio del nuevo chat.** Contiene la paleta, tipografía,
> los efectos React Bits y los métodos de trabajo con los que se construyó el proyecto Roble
> (directorio de carpintería) — replicados y adaptados para Ferrari.

---

## Qué construir
Web para un **club de propietarios de Ferrari**: eventos exclusivos, rutas/quedadas,
registro de miembros con su coche, zona privada de socios, noticias/galería.
Enfoque **premium y exclusivo**, no comercial.

Estética: **oscura deportiva** — fondo negro/carbón, rojo Ferrari de acento, amarillo del
escudo como toque. Dinámico, tipo web oficial de superdeportivo.

Contacto de la agencia: SIMBAI — hidra.lucas.g45@gmail.com. **Si falta un dato (teléfono, precio,
nombre real), usar `[PLACEHOLDER]`, nunca inventar.**

---

## Sistema de diseño (tokens CSS — poner en `:root`)

```css
:root {
  /* Paleta oscura deportiva Ferrari */
  --bg:        #0A0A0B;   /* negro carbón */
  --bg2:       #131316;   /* superficie oscura (bandas) */
  --surface:   #1A1A1E;   /* tarjetas */
  --text-1:    #F5F5F7;   /* blanco casi puro */
  --text-2:    #B4B4BC;   /* gris claro */
  --text-3:    #7C7C86;   /* gris medio */
  --accent:    #DC0000;   /* ROJO FERRARI (Rosso Corsa) */
  --accent-2:  #FF2800;   /* rojo brillante (hover/glow) */
  --accent-lt: #2A1214;   /* rojo muy oscuro (fondos sutiles) */
  --gold:      #FFD200;   /* amarillo escudo (toque/premium) */
  --border:    #2A2A30;   /* borde oscuro */
  --border-lt: #3A3A42;
  --success:   #2FBF71;
  --error:     #FF4D4D;

  /* Tipografía — mismas familias que Roble, valen perfecto para deportivo */
  --font-display: 'Space Grotesk', system-ui, sans-serif;  /* títulos, técnico */
  --font-serif:   'Fraunces', Georgia, serif;              /* acento editorial (palabra resaltada) */
  --font-body:    'DM Sans', system-ui, sans-serif;        /* cuerpo */
  --font-mono:    'JetBrains Mono', monospace;             /* datos, etiquetas, cifras */

  --ease-out: cubic-bezier(.16,1,.3,1);
}
```
Carga las fuentes desde Google Fonts con el patrón preload no bloqueante.
**Alternativa Ferrari-flavour**: para los números/velocímetros queda muy bien una fuente
condensada (p.ej. "Archivo" o "Oswald") — opcional.

### Contraste (accesibilidad WCAG AA — verificar siempre)
El texto sobre fondo oscuro debe tener ratio ≥ 4.5. Blanco `#F5F5F7` sobre `#0A0A0B` pasa
de sobra. El rojo `#DC0000` como **texto** sobre negro ronda el límite — para texto pequeño
usa `#FF2800` o el rojo solo para acentos/fondos, no para párrafos largos.

---

## El patrón de "palabra resaltada" (clave de la identidad)
En Roble, cada título grande lleva UNA palabra en **Fraunces itálica + color de acento**.
Para Ferrari: la palabra clave del título en **Fraunces itálica + rojo Ferrari** (o dorado).

```html
<h1 class="hero-h1">El club de <em>propietarios</em> Ferrari</h1>
```
```css
h1 em, h2 em, [class*="-h1"] em, [class*="-h2"] em {
  font-family: var(--font-serif); font-style: italic; font-weight: 400;
  color: var(--accent);
}
```
Aplícalo SOLO a titulares grandes (h1, h2 de sección hero), **nunca** a micro-títulos de
formulario/filtro — ahí el acento se diluye. (Lección aprendida en Roble.)

---

## Efectos React Bits — ya portados a `fx.js` (incluido en esta carpeta)
Copia `fx.js` a la raíz de la web e inclúyelo con `<script src="/fx.js" defer></script>`.
Se activan por clases/atributos (respetan `prefers-reduced-motion`):

| Efecto | Cómo activarlo | Uso ideal en Ferrari |
|---|---|---|
| **ScrollReveal** | `data-reveal` + `data-reveal-delay="80"` | entrada escalonada de tarjetas/secciones |
| **CountUp** | `data-fx="count"` (usa el nº escrito o `data-to`) | cifras: nº socios, CV, 0-100, año |
| **GradientText** | `data-fx="gradient"` | palabra del título con degradado rojo animado |
| **ShinyText** | `data-fx="shiny"` | brillo que recorre un texto |
| **TiltedCard** | clase `fx-tilt` | tarjetas de coche/evento (inclinación 3D al ratón) |
| **BorderGlow** | clase `fx-glow` | tarjeta destacada / plan de socio premium (borde rojo girando) |
| **SpecularButton** | clase `fx-shine` | botones CTA (reflejo al pasar el ratón) |
| **SpotlightCard** | clase `fx-spotlight` | tarjetas (luz roja sigue el cursor) |
| **Animated BG** | clase `fx-bg` | fondo de sección (malla roja en movimiento) |

Si pintas tarjetas por JS (dinámicas), llama a `window.__fxRefresh()` después de inyectarlas
para que el reveal/tilt se active en ellas.

**Efectos "hero" extra** (canvas 2D, se escriben a mano por página, como en Roble/para-anunciantes):
- **Partículas** flotando (chispas/humo de escape) en el hero.
- **SplitText** — titular que sube palabra a palabra al cargar.
- Fondo de rejilla animada (encaja con lo técnico/racing).

> Cuidado con conflictos: NO pongas `data-reveal` sobre elementos que ya tengan su propio
> reveal (GSAP), ni `fx-tilt` sobre tarjetas con `:hover { transform }` — se pelean. Y los
> contadores `data-fx="count"` que se rellenan por fetch: fija el destino con `data-to`, no
> con textContent (condición de carrera). (Bugs reales que ya nos pasaron en Roble.)

---

## Método de trabajo (así se logra la calidad)
1. **Antes de generar**: brief mínimo (nombre, secciones, CTA, contacto real). Si falta algo,
   preguntar primero — no generar con placeholders y corregir después.
2. **Estructura por secciones**, cada una un momento visual. Para "mixto dramático": alterna
   secciones oscuras y claras (aunque aquí la base ya es oscura → juega con negro puro ↔ carbón ↔
   rojo profundo).
3. **Verificación real, no a ojo**: tras generar, abrir la página en un navegador headless
   (Playwright) y comprobar: sin overflow horizontal (`scrollWidth === innerWidth`),
   sin errores de consola, favicon presente, imágenes con `alt`, contraste AA, y en **móvil**
   (viewport 390px) que nada se solape.
4. **Validar el JS** de cada HTML antes de dar nada por bueno (los `<script>` inline con
   `node --check`, saltando los bloques JSON-LD que son falsos positivos).
5. **Iterar leyendo capturas**: hacer screenshot desktop (1440) y móvil (390), mirarlas de
   verdad, corregir lo que se vea roto.

## Reglas que no se rompen (del proyecto Roble)
- **No inventar datos** (teléfonos, precios, nombres de socios). Placeholder si falta.
- **No emojis en el HTML de cliente** — SVG inline siempre (iconos, flechas).
- No romper lo que funciona; tocar solo lo que la tarea pide.
- No meter error-handling para casos imposibles; sí en los límites (fetch, input de usuario).
- Escapar SIEMPRE el texto de usuario antes de meterlo en innerHTML (o usar
  `createElement + textContent`) — evita XSS.

---

## Despliegue (si se usa Vercel, como Roble)
- Web estática, sin build. Deploy: `vercel --prod --yes` desde la carpeta.
- Si el chatbot/IA usa Anthropic: clave en variable de entorno `ANTHROPIC_API_KEY`
  (nunca en el código ni en el chat).
- CSP en `vercel.json` con whitelist de hosts (fonts, cualquier CDN que uses).

---

## Idea de secciones para el club de propietarios
1. **Hero** oscuro — titular grande ("El club de *propietarios* Ferrari") + partículas/split + CTA "Hazte socio".
2. **Cifras** — nº de socios, años del club, eventos/año, modelos representados (CountUp).
3. **Por qué unirte** — tarjetas con tilt/glow (eventos exclusivos, rutas, zona privada, seguro/ventajas).
4. **Próximos eventos / rutas** — tarjetas con fecha, ubicación, plazas.
5. **Galería** — coches de los socios (grid con reveal + lightbox).
6. **Hazte socio** — planes/cuota (tarjeta destacada con `fx-glow`), formulario de alta con el coche.
7. **Zona de socios** (login) — acceso privado.
8. **CTA final** + footer.
```
```
