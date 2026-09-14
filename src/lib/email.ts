import { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

const FROM = process.env.AUTH_EMAIL_FROM || 'Ferrari Club España <onboarding@resend.dev>';

const PLAN_LABEL: Record<string, string> = {
  base: 'Socio Base',
  activo: 'Socio Activo',
  familiar: 'Socio Familiar',
};

const ASUNTO_LABEL: Record<string, string> = {
  'info-general': 'Información general',
  'hacerse-socio': 'Hacerme socio del club',
  eventos: 'Inscripción a eventos',
  patrocinio: 'Patrocinio y colaboraciones',
  prensa: 'Prensa / Media',
  otro: 'Otro',
};

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function enviarEmailContactoAlClub(params: {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  asunto: string;
  ferrariModelo: string | null;
  mensaje: string;
  contactoId: string;
}) {
  const { nombre, apellidos, email, telefono, asunto, ferrariModelo, mensaje, contactoId } = params;
  const asuntoLabel = ASUNTO_LABEL[asunto] ?? asunto;

  // En modo prueba Resend solo entrega al email de la cuenta. En producción,
  // apuntar a la secretaría del club vía CLUB_NOTIFICATION_EMAIL.
  const destino = process.env.CLUB_NOTIFICATION_EMAIL || 'hidra.lucas.g45@gmail.com';

  const fila = (label: string, valor: string) =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(245,237,224,.12);font-size:12px;letter-spacing:1px;color:#E60000;text-transform:uppercase;width:150px;vertical-align:top">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(245,237,224,.12);font-size:14px;color:#F5EDE0;vertical-align:top">${valor}</td>
    </tr>`;

  return resend.emails.send({
    from: FROM,
    to: destino,
    replyTo: email,
    subject: `[Contacto web] ${asuntoLabel} — ${nombre} ${apellidos}`,
    html: `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#0D0907;font-family:Helvetica,Arial,sans-serif;color:#F5EDE0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0D0907;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1A1009;border:1px solid rgba(245,237,224,.15)">
        <tr><td style="height:3px;background:#CC0000;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:32px 36px 8px">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:#E60000;text-transform:uppercase">Nuevo mensaje desde la web</p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:normal;color:#F5EDE0">${esc(asuntoLabel)}</h1>
        </td></tr>
        <tr><td style="padding:16px 36px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${fila('Nombre', esc(`${nombre} ${apellidos}`))}
            ${fila('Email', `<a href="mailto:${esc(email)}" style="color:#F5EDE0">${esc(email)}</a>`)}
            ${telefono ? fila('Teléfono', `<a href="tel:${esc(telefono)}" style="color:#F5EDE0">${esc(telefono)}</a>`) : ''}
            ${ferrariModelo ? fila('Ferrari', esc(ferrariModelo)) : ''}
          </table>
        </td></tr>
        <tr><td style="padding:24px 36px 0">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#E60000;text-transform:uppercase">Mensaje</p>
          <div style="padding:16px;background:rgba(245,237,224,.04);border-left:2px solid #CC0000;font-size:14px;line-height:1.8;color:rgba(245,237,224,.9);white-space:pre-wrap">${esc(mensaje)}</div>
        </td></tr>
        <tr><td style="padding:24px 36px 32px">
          <p style="margin:0;font-size:11px;color:rgba(245,237,224,.4)">
            Responde directamente a este email para contestar a ${esc(nombre)}.<br>
            Referencia interna: ${esc(contactoId)}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function enviarEmailBienvenida(params: {
  email: string;
  nombre: string;
  plan: string;
  renuevaEn: Date | null;
}) {
  const { email, nombre, plan, renuevaEn } = params;
  const planLabel = PLAN_LABEL[plan] ?? 'Socio';
  const renovacion = renuevaEn
    ? renuevaEn.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://club-ferrari-espana.vercel.app';

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Bienvenido al Ferrari Club España',
    html: `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#0D0907;font-family:Helvetica,Arial,sans-serif;color:#F5EDE0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0D0907;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1A1009;border:1px solid rgba(245,237,224,.15)">
        <tr><td style="height:3px;background:#CC0000;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:40px 40px 8px">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;color:#E60000;text-transform:uppercase">Club Oficial desde 1988</p>
          <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:normal;letter-spacing:1px;color:#F5EDE0">
            Bienvenido a la<br><span style="color:#CC0000">familia Ferrari</span>
          </h1>
        </td></tr>
        <tr><td style="padding:24px 40px 0">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:rgba(245,237,224,.85)">
            Hola ${nombre},
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:rgba(245,237,224,.85)">
            Hemos recibido tu pago y tu alta como <strong style="color:#F5EDE0">${planLabel}</strong> ya está activa.
            Desde este momento tienes acceso al área privada de socios y al calendario completo de actividades del club.
          </p>
          ${renovacion ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.8;color:rgba(245,237,224,.6)">Tu cuota se renovará el ${renovacion}.</p>` : ''}
        </td></tr>
        <tr><td style="padding:16px 40px 32px">
          <a href="${siteUrl}/socios/" style="display:inline-block;background:#CC0000;color:#F5EDE0;text-decoration:none;padding:16px 32px;font-size:14px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">
            Acceder al área de socios
          </a>
          <p style="margin:16px 0 0;font-size:13px;line-height:1.7;color:rgba(245,237,224,.5)">
            Accedemos sin contraseña: introduce tu email y te enviaremos un enlace de acceso.
          </p>
        </td></tr>
        <tr><td style="padding:0 40px 40px">
          <div style="height:1px;background:rgba(245,237,224,.15);margin-bottom:20px"></div>
          <p style="margin:0;font-size:12px;line-height:1.9;color:rgba(245,237,224,.5)">
            Ferrari Club España<br>
            Calle Constancia 41, Entreplanta · 28002 Madrid<br>
            +34 91 575 41 60 · ferrari@ferrariclubespana.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
