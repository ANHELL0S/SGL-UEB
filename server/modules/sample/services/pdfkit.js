import PDFDocument from 'pdfkit-table'
import { formatISOToDate, getDateNow } from '../../../shared/utils/time-util.js'

export const generateAntioxidantReportPDF = sample => {
	function drawLineWithLabelAndCenteredValue(doc, label, value, lineHeight = 20, valueColumnWidth = 300) {
		const { left, right } = doc.page.margins
		const pageWidth = doc.page.width - left - right
		const y = doc.y
		doc.font('Helvetica-Bold')
		// Dibuja el label a la izquierda
		doc.text(label, left, y, { align: 'left', width: 200 })

		doc.font('Helvetica')
		// Calcula el x para centrar el bloque del valor en la página
		const valueX = left + pageWidth / 2 - valueColumnWidth / 3
		// Dibuja el valor dentro del bloque, alineado a la izquierda
		doc.text(value, valueX, y, { align: 'left', width: valueColumnWidth })

		// Avanza la posición vertical
		doc.y = y + lineHeight
	}

	const doc = new PDFDocument({ margin: 50, size: 'A4' })

	doc.font('Helvetica-Bold').fontSize(14).text('INFORME DE RESULTADOS', { align: 'center' })
	doc.moveDown(1)

	// --- Descripción de la muestra ---
	doc.font('Helvetica-Bold').fontSize(12).text('DESCRIPCIÓN DE LA MUESTRA', { underline: false })
	doc.moveDown(1)

	doc.font('Helvetica').fontSize(10)
	const solicitanteValue =
		sample?.quote?.name ??
		(sample?.quote?.access?.dataValues?.access_applicants?.length
			? sample.quote.access.dataValues.access_applicants.map(applicant => applicant.name).join(', ')
			: 'Sin Datos')

	// Ordena los resultados por code_assigned_ueb (ascendente)
	const sortedResults =
		sample.results && sample.results.length > 0
			? [...sample.results].sort((a, b) => {
					const codeA = a.result.code_assigned_ueb || 0
					const codeB = b.result.code_assigned_ueb || 0
					return codeA - codeB
			  })
			: []

	// Se concatenan los códigos de todos los resultados, ya ordenados
	const uebCodes = sortedResults.map(item => `INV ${item.result.code_assigned_ueb}`).join(', ')

	// Se toma el primer resultado ordenado para algunos datos generales (si existen)
	const firstResult = sortedResults.length > 0 ? sortedResults[0].result : {}

	const analisisUnicos =
		sample?.results && sample.results.length > 0
			? [...new Set(sample.results.map(item => item.result.experiments_parameter?.name).filter(Boolean))].join(', ')
			: ''

	drawLineWithLabelAndCenteredValue(doc, 'Solicitante(s):', solicitanteValue)
	drawLineWithLabelAndCenteredValue(doc, 'Muestra:', sample.name)
	drawLineWithLabelAndCenteredValue(doc, 'Código asignado UEB:', uebCodes)
	drawLineWithLabelAndCenteredValue(doc, 'Estado de la muestra:', sample.status)
	drawLineWithLabelAndCenteredValue(doc, 'Envase de recepción:', sample.container)
	drawLineWithLabelAndCenteredValue(doc, 'Análisis requerido(s):', analisisUnicos)
	drawLineWithLabelAndCenteredValue(doc, 'Fecha de recepción:', formatISOToDate(sample.createdAt))
	drawLineWithLabelAndCenteredValue(
		doc,
		'Fecha de análisis:',
		firstResult.createdAt ? formatISOToDate(firstResult.createdAt) : ''
	)
	drawLineWithLabelAndCenteredValue(doc, 'Fecha de informe:', getDateNow())
	drawLineWithLabelAndCenteredValue(doc, 'Técnico (s) asignado:', sample.user?.code || '')

	doc.x = doc.page.margins.left
	doc.moveDown(2)

	// --- Resultados Obtenidos ---
	doc.font('Helvetica-Bold').fontSize(12).text('RESULTADOS OBTENIDOS', { underline: false })
	doc.moveDown(0.5)

	// Genera la tabla utilizando los resultados ya ordenados
	const tableData = sortedResults.map(item => {
		const res = item.result
		return {
			codigo_lab: `INV ${res.code_assigned_ueb}`,
			muestra: sample.name,
			analisis: res.experiments_parameter?.name || '',
			metodo: res.experiments_parameter?.experiments_category?.name || '',
			resultado: res.result || '',
		}
	})

	const resultsTable = {
		headers: [
			{ label: 'Cod', property: 'codigo_lab', width: 60 },
			{ label: 'Muestra', property: 'muestra', width: 100 },
			{ label: 'Análisis', property: 'analisis', width: 120 },
			{ label: 'Categoria', property: 'metodo', width: 150 },
			{ label: 'Resultado', property: 'resultado', width: 50 },
		],
		datas: tableData,
	}

	if (tableData.length > 0) {
		doc.table(resultsTable, {
			prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
			prepareRow: () => doc.font('Helvetica').fontSize(10),
		})
	} else {
		doc.text('No se encontraron resultados.', { align: 'center' })
	}

	doc.moveDown(0)
	doc.font('Helvetica').fontSize(9).text('Los resultados de los análisis corresponden a 3 determinaciones por muestra.')
	doc.moveDown(3)

	// --- Firma ---
	const signatureY = doc.page.height - doc.page.margins.bottom - 30
	doc.text('Ing. Favian Bayas PhD.', doc.page.margins.left, signatureY, {
		align: 'center',
		width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
	})
	doc.font('Helvetica-Bold')
	doc.text('Director DIVIUEB', {
		align: 'center',
		width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
	})

	return doc
}
