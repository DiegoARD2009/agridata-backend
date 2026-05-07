import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({

  host: '74.125.69.108',
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  tls: {
    rejectUnauthorized: false
  }

});

transporter.verify((error, success) => {

  if (error) {
    console.error('❌ SMTP ERROR:', error);
  } else {
    console.log('✅ SMTP listo');
  }

});

console.log(
  'EMAIL_USER:',
  process.env.EMAIL_USER ? '✅ cargado' : '❌ undefined'
);
function getVerificationEmailHTML(verificationUrl, userName) {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verificación de correo</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

            <!-- HEADER con tu color de marca -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 40px 30px;">
                <h1 style="color:#ffffff; font-size:24px; margin:0;">¡Verifica tu correo!</h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 40px 40px 30px;">
                <p style="color:#374151; font-size:16px; margin:0 0 12px;">
                  Hola, <strong>${userName}</strong> 👋
                </p>
                <p style="color:#6B7280; font-size:15px; line-height:1.7; margin:0 0 30px;">
                  Gracias por registrarte. Solo falta un paso: confirma tu dirección de correo haciendo clic en el botón de abajo.
                </p>

                <!-- BOTÓN CTA -->
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius:8px;">
                      <a href="${verificationUrl}"
                         style="display:inline-block; padding:14px 36px; color:#ffffff; font-size:16px; font-weight:600; text-decoration:none; border-radius:8px;">
                        ✅ Verificar mi correo
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color:#9CA3AF; font-size:13px; margin:30px 0 0; text-align:center;">
                  Este enlace expira en <strong>24 horas</strong>.<br/>
                  Si no creaste esta cuenta, puedes ignorar este mensaje.
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" style="background:#F9FAFB; padding:20px; border-top:1px solid #E5E7EB;">
                <p style="color:#9CA3AF; font-size:12px; margin:0;">
                  © 2026 TuEmpresa — Todos los derechos reservados
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export async function sendVerificationEmail(
  toEmail,
  userName,
  verificationUrl
) {

  try {

    const response = await transporter.sendMail({
      from: `"AgriData" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: '✉️ Confirma tu correo electrónico — AgriData',
      html: getVerificationEmailHTML(
        verificationUrl,
        userName
      )
    });

    console.log('📩 Correo enviado:', response.messageId);

    return response;

  } catch (error) {

    console.error(
      '❌ Error enviando correo de verificación:',
      error
    );

    throw error;
  }
}


// ── RECORDATORIO DE ACTIVIDADES ───────────────────────────────────────
function getRecordatorioHTML(userName, nombreCultivo, tipoActividad, fechaProgramada) {
  const fecha = new Date(fechaProgramada).toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Recordatorio de actividad</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #15803d, #16a34a); padding: 40px 30px;">
                <h1 style="color:#ffffff; font-size:24px; margin:0;">🌱 AgriData</h1>
                <p style="color:#bbf7d0; margin:6px 0 0; font-size:14px;">Recordatorio de actividad programada</p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 40px 40px 30px;">
                <p style="color:#374151; font-size:16px; margin:0 0 8px;">
                  Hola, <strong>${userName}</strong> 👋
                </p>
                <p style="color:#6B7280; font-size:15px; line-height:1.7; margin:0 0 24px;">
                  Tienes una actividad agrícola programada para <strong>hoy</strong>. 
                  Aquí están los detalles:
                </p>

                <!-- CARD ACTIVIDAD -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="background:#f0fdf4; border-left:4px solid #16a34a; border-radius:8px; margin-bottom:24px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <p style="color:#15803d; font-size:18px; font-weight:bold; margin:0 0 12px;">
                        📋 ${tipoActividad}
                      </p>
                      <p style="color:#374151; font-size:15px; margin:6px 0;">
                        🌱 <strong>Cultivo:</strong> ${nombreCultivo}
                      </p>
                      <p style="color:#374151; font-size:15px; margin:6px 0;">
                        📅 <strong>Fecha:</strong> ${fecha}
                      </p>
                      <span style="display:inline-block; background:#dcfce7; color:#15803d;
                        padding:4px 14px; border-radius:20px; font-size:13px;
                        font-weight:bold; margin-top:10px;">
                        ⏰ Programada para hoy
                      </span>
                    </td>
                  </tr>
                </table>

                <p style="color:#6B7280; font-size:14px; line-height:1.6; margin:0 0 24px;">
                  Recuerda registrar el resultado de esta actividad en AgriData 
                  para llevar un mejor control de tu producción agrícola.
                </p>

                <!-- BOTÓN -->
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="background:#15803d; border-radius:8px;">
                      <a href="${process.env.FRONTEND_URL}/actividades"
                         style="display:inline-block; padding:14px 36px; color:#ffffff;
                         font-size:15px; font-weight:600; text-decoration:none; border-radius:8px;">
                        Ver mis actividades →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" style="background:#F9FAFB; padding:20px; border-top:1px solid #E5E7EB;">
                <p style="color:#9CA3AF; font-size:12px; margin:0;">
                  © 2026 AgriData — Todos los derechos reservados
                </p>
                <p style="color:#9CA3AF; font-size:12px; margin:6px 0 0;">
                  Este correo fue enviado automáticamente, por favor no respondas.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}


export async function sendRecordatorio(
  toEmail,
  userName,
  nombreCultivo,
  tipoActividad,
  fechaProgramada
) {

  try {

    const response = await transporter.sendMail({
      from: `"AgriData" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `⏰ Recordatorio: ${tipoActividad} — ${nombreCultivo}`,
      html: getRecordatorioHTML(
        userName,
        nombreCultivo,
        tipoActividad,
        fechaProgramada
      )
    });

    console.log(
      '📩 Recordatorio enviado:',
      response.messageId
    );

    return response;

  } catch (error) {

    console.error(
      '❌ Error enviando recordatorio:',
      error
    );

    throw error;
  }
}