import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Ferrari Club España',
  description: 'Política de Privacidad del Ferrari Club España. Información sobre el tratamiento de datos personales.',
  alternates: { canonical: '/privacidad/' },
};

export default function PrivacidadPage() {
  return (
    <>
      <section className="priv-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Política de Privacidad' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">INFORMACIÓN LEGAL</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">POLÍTICA DE<br /><span style={{ color: 'var(--red)' }}>PRIVACIDAD</span></h1>
          <div style={{ width: '60px', height: '2px', background: 'var(--red)', marginTop: '2rem', boxShadow: '0 0 8px var(--red)' }} data-r="up" />
        </div>
      </section>

      <section style={{ background: 'var(--b90)' }}>
        <div className="cnt">
          <div className="priv-body">
            <span className="priv-badge">RGPD · LOPDGDD · ACTUALIZADA AGO 2026</span>

            <h2 className="priv-h2">1. Responsable del Tratamiento</h2>
            <p className="priv-p">En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), se informa que el Responsable del Tratamiento de los datos personales recabados a través de este sitio web es:</p>
            <ul className="priv-ul">
              <li><strong style={{ color: 'var(--w90)' }}>Nombre:</strong> Ferrari Club España</li>
              <li><strong style={{ color: 'var(--w90)' }}>Domicilio:</strong> Calle Constancia 41, Entreplanta, 28002 Madrid</li>
              <li><strong style={{ color: 'var(--w90)' }}>Email de contacto:</strong> <a href="mailto:ferrari@ferrariclubespana.com" className="priv-a">ferrari@ferrariclubespana.com</a></li>
              <li><strong style={{ color: 'var(--w90)' }}>Teléfono:</strong> +34 91 575 41 60</li>
            </ul>

            <h2 className="priv-h2">2. Finalidad del Tratamiento</h2>
            <p className="priv-p">Los datos personales que nos facilites serán tratados para las siguientes finalidades:</p>
            <ul className="priv-ul">
              <li>Atender y gestionar las consultas, solicitudes de información o contacto que nos envíes a través del formulario de contacto o por correo electrónico.</li>
              <li>Gestionar el proceso de adhesión como socio del Ferrari Club España y administrar la relación de membresía.</li>
              <li>Enviar comunicaciones relacionadas con las actividades, eventos y noticias del club, siempre que hayas prestado tu consentimiento expreso para ello.</li>
              <li>Cumplir con las obligaciones legales aplicables a la asociación.</li>
            </ul>

            <h2 className="priv-h2">3. Base Jurídica del Tratamiento</h2>
            <p className="priv-p">El tratamiento de tus datos personales se fundamenta en las siguientes bases legales:</p>
            <ul className="priv-ul">
              <li><strong style={{ color: 'var(--w90)' }}>Consentimiento explícito</strong> (art. 6.1.a RGPD): para el envío de comunicaciones informativas y de marketing relacionadas con el club.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Ejecución de un contrato o relación asociativa</strong> (art. 6.1.b RGPD): para la gestión de la membresía y la prestación de los servicios del club.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Interés legítimo</strong> (art. 6.1.f RGPD): para atender consultas y solicitudes de información remitidas voluntariamente a través de los canales de contacto.</li>
            </ul>

            <h2 className="priv-h2">4. Destinatarios de los Datos</h2>
            <p className="priv-p">Con carácter general, Ferrari Club España no cederá ni comunicará tus datos personales a terceros, salvo que exista obligación legal o que sea estrictamente necesario para la prestación de los servicios del club (por ejemplo, entidades bancarias para el cobro de cuotas, o proveedores de servicios informáticos sujetos a acuerdos de confidencialidad).</p>
            <p className="priv-p">En ningún caso se realizarán transferencias internacionales de datos fuera del Espacio Económico Europeo sin las garantías adecuadas exigidas por la normativa aplicable.</p>

            <h2 className="priv-h2">5. Plazo de Conservación</h2>
            <p className="priv-p">Los datos personales se conservarán durante el tiempo estrictamente necesario para atender la finalidad para la que fueron recabados y, en todo caso:</p>
            <ul className="priv-ul">
              <li>Datos de consultas y formularios de contacto: hasta 3 años desde la última comunicación.</li>
              <li>Datos de socios: durante la vigencia de la relación asociativa y, posteriormente, hasta que prescriban las eventuales responsabilidades legales derivadas.</li>
            </ul>

            <h2 className="priv-h2">6. Derechos del Interesado</h2>
            <p className="priv-p">De conformidad con el RGPD y la LOPDGDD, tienes derecho a:</p>
            <ul className="priv-ul">
              <li><strong style={{ color: 'var(--w90)' }}>Acceso:</strong> conocer qué datos personales tuyos tratamos.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Supresión:</strong> solicitar la eliminación de tus datos cuando, entre otros motivos, ya no sean necesarios para los fines para los que fueron recogidos.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Limitación:</strong> solicitar la restricción del tratamiento de tus datos en determinados casos.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
              <li><strong style={{ color: 'var(--w90)' }}>Retirada del consentimiento</strong> en cualquier momento, sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.</li>
            </ul>
            <p className="priv-p">Para ejercer cualquiera de estos derechos, puedes dirigirte a nosotros por escrito a la dirección postal indicada o mediante correo electrónico a <a href="mailto:ferrari@ferrariclubespana.com" className="priv-a">ferrari@ferrariclubespana.com</a>, acompañando copia de tu documento de identidad.</p>

            <h2 className="priv-h2">7. Derecho de Reclamación</h2>
            <p className="priv-p">Si consideras que el tratamiento de tus datos personales no se ajusta a la normativa vigente, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), autoridad de control competente en España:</p>
            <ul className="priv-ul">
              <li>Sitio web: <a href="https://www.aepd.es" target="_blank" rel="noopener" className="priv-a">www.aepd.es ↗</a></li>
              <li>Dirección: C/ Jorge Juan, 6, 28001 Madrid</li>
              <li>Teléfono: 901 100 099</li>
            </ul>

            <h2 className="priv-h2">8. Seguridad de los Datos</h2>
            <p className="priv-p">Ferrari Club España aplica las medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo, incluyendo cifrado de las comunicaciones (HTTPS), control de acceso a los datos y formación del personal en materia de protección de datos.</p>

            <h2 className="priv-h2">9. Cookies</h2>
            <p className="priv-p">Este sitio web puede utilizar cookies técnicas estrictamente necesarias para su correcto funcionamiento. No se utilizan cookies de seguimiento o publicitarias sin consentimiento previo.</p>

            <h2 className="priv-h2">10. Modificaciones</h2>
            <p className="priv-p">Ferrari Club España se reserva el derecho a actualizar esta Política de Privacidad para adaptarla a novedades legislativas o jurisprudenciales. Cualquier modificación será publicada en esta misma página con la fecha de actualización correspondiente.</p>

            <p className="priv-last">Última actualización: agosto de 2026 · Ferrari Club España · C/ Constancia 41, 28002 Madrid · <a href="mailto:ferrari@ferrariclubespana.com" className="priv-a">ferrari@ferrariclubespana.com</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
