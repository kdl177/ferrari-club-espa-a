import type { Metadata } from 'next';
import PaginaLegal from '@/components/PaginaLegal';

export const metadata: Metadata = {
  title: 'Política de cookies — Ferrari Club España',
  description: 'Qué cookies usa la web del Ferrari Club España: solo técnicas para el área de socios. La estadística de visitas no usa cookies.',
  alternates: { canonical: '/cookies/' },
};

const COOKIES = [
  ['authjs.session-token', 'Mantiene abierta la sesión en el área de socios.', 'Hasta cerrar sesión o 30 días'],
  ['authjs.csrf-token', 'Protege el formulario de acceso frente a envíos falsificados.', 'Sesión del navegador'],
  ['authjs.callback-url', 'Recuerda a qué página volver tras entrar al área de socios.', 'Sesión del navegador'],
];

export default function CookiesPage() {
  return (
    <PaginaLegal titulo="Política de" rojo="cookies" actualizada="LSSI · GUÍA AEPD">
      <h2 className="priv-h2">1. Qué cookies usa esta web</h2>
      <p className="priv-p">Esta web solo instala cookies técnicas, necesarias para que funcione el área de socios. Están exentas de consentimiento según el artículo 22.2 de la Ley 34/2002 y solo se crean cuando un socio inicia sesión.</p>
      <div style={{ overflowX: 'auto' }}>
        <table className="tabla-cookies">
          <thead><tr><th>Cookie</th><th>Para qué sirve</th><th>Duración</th></tr></thead>
          <tbody>
            {COOKIES.map(([n, f, d]) => (<tr key={n}><td><code>{n}</code></td><td>{f}</td><td>{d}</td></tr>))}
          </tbody>
        </table>
      </div>
      <p className="priv-p">En la web publicada con HTTPS, los nombres llevan delante el prefijo de seguridad <code>__Secure-</code> o <code>__Host-</code>.</p>

      <h2 className="priv-h2">2. Estadística de visitas</h2>
      <p className="priv-p">Para saber cuántas visitas recibe la web se usa Vercel Web Analytics, que no instala cookies ni guarda datos que identifiquen a quien visita: solo cuenta páginas vistas de forma agregada.</p>

      <h2 className="priv-h2">3. Contenido de terceros</h2>
      <p className="priv-p">Algunas noticias incluyen vídeos de YouTube y la página de contacto un mapa de OpenStreetMap. Al reproducirlos, esos servicios pueden aplicar sus propias políticas.</p>

      <h2 className="priv-h2">4. Cómo gestionarlas</h2>
      <p className="priv-p">Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si bloqueas las técnicas, no podrás entrar en el área de socios.</p>
    </PaginaLegal>
  );
}
