import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit-table'

// 1. Función auxiliar para calcular los anchos de columnas con límite máximo:
function autoSizeColumns(doc, headers, rows) {
	const allRows = [headers, ...rows]
	const colCount = headers.length
	let colMaxWidths = new Array(colCount).fill(0)
	const MAX_WIDTH = 162 // Ancho máximo permitido para cada columna

	doc.font('Helvetica').fontSize(9)

	allRows.forEach(row => {
		row.forEach((cellText, colIndex) => {
			const text = String(cellText)
			const textWidth = doc.widthOfString(text)
			const paddedWidth = textWidth + 15 // Agregamos un poco de padding
			if (paddedWidth > colMaxWidths[colIndex]) {
				colMaxWidths[colIndex] = paddedWidth
			}
		})
	})

	// Limitamos cada columna al ancho máximo
	colMaxWidths = colMaxWidths.map(width => Math.min(width, MAX_WIDTH))

	// Calculamos el ancho disponible en la página (restando márgenes)
	const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
	const totalColumnsWidth = colMaxWidths.reduce((acc, curr) => acc + curr, 0)

	// Si el ancho total medido es menor que el disponible, lo escalamos proporcionalmente
	if (totalColumnsWidth < availableWidth) {
		const scaleFactor = availableWidth / totalColumnsWidth
		colMaxWidths = colMaxWidths.map(width => width * scaleFactor)
	}

	return colMaxWidths
}

async function generatePdfTable({ title, header, title_rows, rows, filename, institutionData }, res = null) {
	const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' })

	if (res) {
		res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
		res.setHeader('Content-Type', 'application/pdf')
		doc.pipe(res)
	}

	const __dirname = path.dirname(new URL(import.meta.url).pathname)
	const logoPath = path.join(__dirname, '../../assets/images/UEB.png')
	const logoIVPath = path.join(__dirname, '../../assets/images/logo_IV.png')

	const imageWidth = 250
	const imageY = doc.y // posición vertical actual

	try {
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

		doc.moveTo(30, doc.y).lineTo(820, doc.y).stroke()
		doc.moveDown(2)

		if (title) {
			doc.fontSize(15).text(`${title}`, { align: 'left' })
			doc.moveDown(0.8)
		}

		if (header) {
			Object.entries(header).forEach(([key, value]) => {
				doc.fontSize(10).text(`${value}`, { align: 'left' })
				doc.moveDown(0.5)
			})
			doc.moveDown(1.5)
		}

		// 2. Preparamos la estructura de la tabla
		const table = {
			headers: title_rows, // Array con los títulos de columna
			rows, // Array de arrays con los datos
		}

		// 3. Obtenemos un array con anchos calculados dinámicamente y ajustados al ancho disponible
		const columnsSize = autoSizeColumns(doc, title_rows, rows)

		// 4. Llamamos a doc.table usando columnsSize
		await doc.table(table, {
			columnsSize,
			prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
			prepareRow: (row, i) => doc.font('Helvetica').fontSize(9),
		})
	} catch (error) {
		console.error('Error generating PDF:', error)
	} finally {
		doc.end()
	}
}

export { generatePdfTable }
