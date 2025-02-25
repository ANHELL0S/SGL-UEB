import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit-table'
import { env } from '../../../config/env-config.js'
import { transporter, defaultFromEmail } from '../../../config/mailer-config.js'

export const sendMailRequestAccess = async (newData, usuario) => {
	return new Promise((resolve, reject) => {
		const subject = 'Cotización pendiente de aprobación'

		// Datos de la cotización
		const full_name = newData.name // Nombre de la persona que solicitó la cotización
		const code = newData.code // Código de la cotización
		const direction = newData.direction // Dirección
		const dni = newData.dni // DNI
		const phone = newData.phone // Teléfono

		// HTML para el correo
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
													<h2>¡Hola ${usuario.names}! 👋</h2>
													<p>Se ha creado una nueva cotización. A continuación, se encuentran los detalles:</p>
													<p><strong>Código de Cotización:</strong> ${code}</p>
													<p><strong>Nombre del Solicitante:</strong> ${full_name}</p>
													<p><strong>DNI:</strong> ${dni}</p>
													<p><strong>Teléfono:</strong> ${phone}</p>
													<p><strong>Dirección:</strong> ${direction}</p>

													<p>Para aprobar o rechazar la cotización, por favor ingresa al siguiente enlace: <a href="${env.URL_MAIN}/cotizaciones/${code}" target="_blank">${env.URL_MAIN}/cotizaciones/${code}</a></p>

													<p>Si necesitas asistencia adicional, no dudes en contactarnos a través de nuestro soporte: <a href="https://wa.me/0980868530" target="_blank">Soporte</a></p>
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

export const sendMailQuotation = async (newData, institutionData) => {
	return new Promise((resolve, reject) => {
		try {
			// Crear el documento PDF con márgenes definidos
			const doc = new PDFDocument({ margin: 50 })
			const buffers = []

			// Capturar los datos del PDF
			doc.on('data', buffers.push.bind(buffers))
			doc.on('end', () => {
				const pdfBuffer = Buffer.concat(buffers)
				const pdfBase64 = pdfBuffer.toString('base64')

				// Configuración del correo
				const subject = 'Tu Cotización'
				const html = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: auto; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <p>Hola ${newData.name},</p>
              <p>Adjunto encontrarás el PDF de tu cotización con el código <strong>${newData.code}</strong>.</p>
              <p>Gracias por confiar en nosotros.</p>
            </div>
          </body>
          </html>
        `

				const mailOptions = {
					from: `UEB - SGL <${defaultFromEmail}>`,
					to: newData.email,
					subject,
					html,
					attachments: [
						{
							filename: 'cotizacion.pdf',
							content: pdfBuffer,
							contentType: 'application/pdf',
						},
					],
				}

				// Enviar el correo
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.error('Error al enviar correo:', error)
						return reject(error)
					} else {
						console.log('Correo enviado:', info.response)
						// Devuelve el PDF en Base64 además de haber enviado el correo
						return resolve(pdfBase64)
					}
				})
			})

			const __dirname = path.dirname(new URL(import.meta.url).pathname)
			const logoPath = path.join(__dirname, '../../../assets/images/UEB.png')
			const logoIVPath = path.join(__dirname, '../../../assets/images/logo_IV.png')

			const imageWidth = 250
			const imageY = doc.y // posición vertical actual

			// Logo a la izquierda
			if (fs.existsSync(logoPath)) {
				// Se posiciona en el margen izquierdo
				doc.image(logoPath, doc.page.margins.left, imageY, { width: imageWidth })
			}

			// Logo a la derecha
			if (fs.existsSync(logoIVPath)) {
				// Se calcula la posición x para que el logo esté a la derecha:
				// Se resta el margen derecho y el ancho de la imagen al ancho total de la página
				const rightX = doc.page.width - doc.page.margins.right - imageWidth
				doc.image(logoIVPath, rightX, imageY, { width: imageWidth - 40 })
			}

			doc.moveDown(4.5)

			if (institutionData) {
				doc.fontSize(12).text(institutionData.name, { align: 'left' })
				doc.moveDown(0.5)
				doc.fontSize(10).text(institutionData.address, { align: 'left' })
				doc.moveDown(0.5)
				doc.fontSize(10).text(institutionData.contact, { align: 'left' })
				doc.moveDown(2)
			}

			doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke()
			doc.moveDown(2)

			// Datos de identificación
			doc
				.font('Helvetica-Bold')
				.fontSize(12)
				.fillColor('#333')
				.text(`${newData.code}`, { align: 'right' })
				.fontSize(10)
				.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' })
			doc.moveDown()

			/*** Información del Cliente ***/
			doc.font('Helvetica-Bold').fontSize(12).fillColor('#333').text('Datos del cliente:', { underline: false })
			doc.moveDown(0.5)
			doc
				.font('Helvetica')
				.fontSize(11)
				.fillColor('#333')
				.text(`Nombre: ${newData.name}`)
				.text(`Email: ${newData.email}`)
				.text(`Dirección: ${newData.direction}`)
				.text(`Cédula: ${newData.dni}`)
				.text(`Teléfono: ${newData.phone}`)
			doc.moveDown()

			/*** Detalles de la Cotización ***/
			doc.font('Helvetica-Bold').fontSize(12).text('Datos de la muestra:', { underline: false })
			doc.moveDown(0.5)
			doc
				.font('Helvetica')
				.fontSize(11)
				.text(`Tipo: ${newData.type_sample}`)
				.text(`Cantidad: ${newData.amount_sample}`)
				.text(`Detalle: ${newData.detail_sample}`)
			doc.moveDown()

			/*** Tabla de Análisis (Experimentos) ***/
			if (newData.experiments && newData.experiments.length > 0) {
				// Definir la estructura de la tabla
				const table = {
					headers: [
						{ label: 'Análisis', property: 'name', width: 170 },
						{ label: 'Categoría', property: 'category', width: 170 },
						{ label: 'Cnt', property: 'amount', width: 50 },
						{
							label: 'Precio',
							property: 'public_price',
							width: 80,
							renderer: value => `$ ${Number(value).toFixed(2)}`,
						},
						{
							label: 'Total',
							property: 'total_cost',
							width: 40,
							renderer: value => `$ ${Number(value).toFixed(2)}`,
						},
					],
					datas: [],
				}

				let subtotal = 0
				newData.experiments.forEach((item, index) => {
					const exp = item.experiment
					const publicPrice = parseFloat(exp.public_price)
					const amount = parseFloat(exp.amount)
					const total_cost = parseFloat(exp.total_cost)
					subtotal += total_cost

					table.datas.push({
						num: index + 1,
						name: exp.name,
						category: exp.category ? exp.category.name : 'N/A',
						public_price: publicPrice,
						amount,
						total_cost,
					})
				})

				doc.moveDown(0.5)
				// Renderizar la tabla con pdfkit-table
				doc.table(table, {
					prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
					prepareRow: () => doc.font('Helvetica').fontSize(10),
				})

				// Calcular y mostrar totales
				const iva = subtotal * 0.15
				const total = subtotal + iva
				doc.moveDown(0.5)
				doc
					.font('Helvetica-Bold')
					.fontSize(11)
					.text(`Subtotal: $ ${subtotal.toFixed(2)}`, { align: 'right' })
					.text(`IVA (15%): $ ${iva.toFixed(2)}`, { align: 'right' })
					.text(`Total: $ ${total.toFixed(2)}`, { align: 'right' })
				doc.font('Helvetica')
			}

			// Finalizar la creación del PDF
			doc.end()
		} catch (error) {
			console.error('Error generando PDF o enviando correo:', error)
			reject(error)
		}
	})
}
