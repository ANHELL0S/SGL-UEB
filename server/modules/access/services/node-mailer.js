import { env } from '../../../config/env-config.js'
import { transporter, defaultFromEmail } from '../../../config/mailer-config.js'
import { formatISOToDate } from '../../../shared/utils/time-util.js'

export const sendMailRequestAccess = async (accessData, usuario) => {
	return new Promise((resolve, reject) => {
		// Cambiamos el subject para reflejar que es un acceso pendiente
		const subject = 'Acceso pendiente de aprobación'

		// Extraemos la información de accessData (puedes desestructurar directamente si accessData ya es un objeto plano)
		// Si accessData viene con dataValues, accedemos a esa propiedad:
		const data = accessData.dataValues || accessData
		const {
			code,
			status,
			type_access,
			resolution_approval,
			reason,
			topic,
			datePermanenceStart,
			datePermanenceEnd,
			grupe,
			attached,
			observations,
			clauses,
		} = data

		// Construimos el HTML para el correo usando la información de acceso
		const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .header img {
            width: 200px;
          }
          .content {
            text-align: left;
            padding: 20px;
          }
          .content h2 {
            color: #3b444d;
            font-size: 18px;
            margin-bottom: 10px;
          }
          .content p {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
          }
          .content .important {
            color: #3b4552;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>¡Hola ${usuario.full_name}! 👋</h2>
            <p>Se ha creado una nueva investigación. A continuación, se encuentran los detalles:</p>
            <p><strong>Código de Acceso:</strong> ${code}</p>
            <p><strong>Resolución de Aprobación:</strong> ${resolution_approval}</p>
            <p><strong>Razón:</strong> ${reason}</p>
            <p><strong>Tema:</strong> ${topic}</p>
            <p><strong>Fecha de Inicio:</strong> ${formatISOToDate(datePermanenceStart)}</p>
            <p><strong>Fecha de Fin:</strong> ${formatISOToDate(datePermanenceEnd)}</p>
            <p><strong>Grupo:</strong> ${grupe}</p>
            <p><strong>Adjunto:</strong> ${attached}</p>
            <p><strong>Observaciones:</strong> ${observations}</p>
            <p><strong>Cláusulas:</strong> ${clauses}</p>
            <p>Para aprobar o rechazar el acceso, por favor ingresa al siguiente enlace: 
              <a href="${env.URL_MAIN}/investigaciones/${code}" target="_blank">${
			env.URL_MAIN
		}/investigaciones/${code}</a>
            </p>
            <p>Si necesitas asistencia adicional, no dudes en contactarnos a través de nuestro soporte: 
              <a href="https://wa.me/0980868530" target="_blank">Soporte</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

		// Configuración del correo
		const mailOptions = {
			from: `UEB - SGL <${defaultFromEmail}>`,
			to: usuario.email,
			subject: subject,
			html: html,
		}

		// Enviar el correo
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log('Error al enviar correo:', error)
				reject(error)
			} else {
				console.log('Correo enviado:', info.response)
				resolve(true)
			}
		})
	})
}
