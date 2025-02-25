import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	AlignmentType,
	Table,
	TableRow,
	TableCell,
	WidthType,
	BorderStyle,
} from 'docx'
import { formatISOToDate, getDateNow } from '../../../shared/utils/time-util.js'

export const generateAntioxidantReportWordDoc = (sample, newReport) => {
	// ---------------------------
	// 1. DATOS PREVIOS
	// ---------------------------
	const encabezadoInstitucion = 'VICERRECTORADO DE INVESTIGACIÓN Y VINCULACIÓN'
	const nombreLaboratorio = 'LABORATORIOS DE INVESTIGACIÓN Y VINCULACIÓN'
	const codigo = 'FPG12-01'
	const version = '1'
	const anio = '2021'
	const pagina = '1'

	// Datos de la muestra
	const solicitantes =
		sample?.quote?.name ??
		(sample?.quote?.access?.dataValues?.access_applicants?.length
			? sample.quote.access.dataValues.access_applicants.map(app => app.name).join(', ')
			: '')
	const muestra = sample?.name
	const uebCode = sample?.results?.length
		? sample.results
				.sort((a, b) => (a.result.code_assigned_ueb || 0) - (b.result.code_assigned_ueb || 0))
				.map(item => `INV ${item.result.code_assigned_ueb}`)
				.join(', ')
		: ''
	const estadoMuestra = sample?.status
	const envaseRecepcion = sample?.container

	const firstResult = sample?.results?.length ? sample.results[0].result : {}
	const analisisRequeridos =
		sample?.results && sample.results.length > 0
			? [...new Set(sample.results.map(item => item.result.experiments_parameter?.name).filter(Boolean))].join(', ')
			: ''

	const fechaRecepcion = formatISOToDate(sample.createdAt)
	const fechaAnalisis = formatISOToDate(firstResult.createdAt)
	const fechaInforme = getDateNow()
	const tecnicoAsignado = sample?.user?.code

	// ---------------------------
	// 2. TABLA DE ENCABEZADO
	// ---------------------------
	const encabezadoTable = new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		rows: [
			new TableRow({
				children: [
					new TableCell({
						width: { size: 70, type: WidthType.PERCENTAGE },
						borders: noBorders(),
						children: [
							new Paragraph({
								children: [
									new TextRun({
										text: encabezadoInstitucion,
										bold: true,
										size: 20,
									}),
								],
							}),
							new Paragraph({
								children: [
									new TextRun({
										text: nombreLaboratorio,
										bold: true,
										size: 20,
									}),
								],
							}),
						],
					}),
					new TableCell({
						width: { size: 30, type: WidthType.PERCENTAGE },
						borders: noBorders(),
						children: [
							new Paragraph({
								children: [new TextRun({ text: `Código: ${codigo}`, size: 20 })],
								alignment: AlignmentType.RIGHT,
							}),
							new Paragraph({
								children: [new TextRun({ text: `Versión: ${version}`, size: 20 })],
								alignment: AlignmentType.RIGHT,
							}),
							new Paragraph({
								children: [new TextRun({ text: `Año: ${anio}`, size: 20 })],
								alignment: AlignmentType.RIGHT,
							}),
							new Paragraph({
								children: [new TextRun({ text: `Página: ${pagina}`, size: 20 })],
								alignment: AlignmentType.RIGHT,
							}),
						],
					}),
				],
			}),
		],
	})

	// ---------------------------
	// 3. TÍTULO "INFORME DE RESULTADOS" (CENTRADO)
	// ---------------------------
	const tituloInforme = new Paragraph({
		children: [
			new TextRun({
				text: 'INFORME DE RESULTADOS',
				bold: true,
				size: 28,
			}),
		],
		alignment: AlignmentType.CENTER,
	})

	// ---------------------------
	// 4. "INFORME DE ENSAYOS Nº (code)" ALINEADO A LA DERECHA
	//    (fuera de la tabla de descripción)
	// ---------------------------
	const informeEnsayosNumero = new Paragraph({
		children: [
			new TextRun({
				text: `INFORME DE ENSAYOS Nº ${newReport.code}`,
				bold: true,
				size: 20,
			}),
		],
		alignment: AlignmentType.RIGHT,
	})

	// ---------------------------
	// 5. TABLA DE "DESCRIPCIÓN DE LA MUESTRA"
	// ---------------------------
	const descripcionTable = new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		rows: [
			// Fila con título "Descripción de la muestra"
			new TableRow({
				children: [
					new TableCell({
						borders: fullBorder(),
						columnSpan: 2,
						children: [
							new Paragraph({
								children: [
									new TextRun({
										text: 'Descripción de la muestra',
										bold: true,
										size: 24,
									}),
								],
								alignment: AlignmentType.CENTER,
							}),
						],
					}),
				],
			}),
			// Filas con datos
			makeRow('Solicitantes', solicitantes),
			makeRow('Muestra', muestra),
			makeRow('Código asignado UEB', uebCode),
			makeRow('Estado de la muestra', estadoMuestra),
			makeRow('Envase de recepción', envaseRecepcion),
			makeRow('Análisis requerido(s)', analisisRequeridos),
			makeRow('Fecha de recepción', fechaRecepcion),
			makeRow('Fecha de análisis', fechaAnalisis),
			makeRow('Fecha de informe', fechaInforme),
			makeRow('Técnico (s) asignado', tecnicoAsignado),
		],
	})

	// ---------------------------
	// 6. TÍTULO "RESULTADOS OBTENIDOS"
	// ---------------------------
	const tituloResultados = new Paragraph({
		children: [
			new TextRun({
				text: 'RESULTADOS OBTENIDOS',
				bold: true,
				size: 24,
			}),
		],
		alignment: AlignmentType.LEFT,
	})

	// ---------------------------
	// 7. TABLA DE RESULTADOS
	// ---------------------------
	const resultadosData = sample?.results?.map(item => {
		const r = item.result
		return {
			codigoLab: `INV ${r.code_assigned_ueb}`,
			analisis: r.experiments_parameter?.name || '',
			resultado: r.result || '',
		}
	})

	const resultadosTable = new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		rows: [
			new TableRow({
				children: [makeHeaderCell('Cód. UEB'), makeHeaderCell('Análisis'), makeHeaderCell('Resultado')],
			}),
			...resultadosData.map(
				d =>
					new TableRow({
						children: [makeDataCell(d.codigoLab), makeDataCell(d.analisis), makeDataCell(d.resultado)],
					})
			),
		],
	})

	// ---------------------------
	// 8. FIRMAS
	// ---------------------------
	const firma1 = new Paragraph({
		children: [new TextRun({ text: 'Ing. Favian Bayas PhD.', bold: true, size: 22 })],
		alignment: AlignmentType.CENTER,
	})
	const firma2 = new Paragraph({
		children: [new TextRun({ text: 'Director DIVIUEB', bold: true, size: 22 })],
		alignment: AlignmentType.CENTER,
	})

	// ---------------------------
	// 9. CREACIÓN DEL DOCUMENTO
	// ---------------------------
	const doc = new Document({
		creator: 'Tu Sistema',
		title: 'INFORME DE RESULTADOS',
		description: 'Documento que replica el formato del ejemplo',
		sections: [
			{
				children: [
					encabezadoTable,
					new Paragraph({ text: '' }),
					// 1) Título principal centrado
					tituloInforme,
					// 2) Título secundario a la derecha (INFORME DE ENSAYOS Nº...)
					informeEnsayosNumero,
					new Paragraph({ text: '' }),
					// Tabla con "Descripción de la muestra"
					descripcionTable,
					new Paragraph({ text: '' }),
					tituloResultados,
					resultadosTable,
					new Paragraph({ text: '' }),
					firma1,
					firma2,
				],
			},
		],
	})

	return doc
}

/* -------------------------------------------
   Funciones auxiliares
------------------------------------------- */
function noBorders() {
	return { top: noneBorder(), bottom: noneBorder(), left: noneBorder(), right: noneBorder() }
}

function noneBorder() {
	return { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
}

function fullBorder() {
	return {
		top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
		bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
		left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
		right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
	}
}

function makeRow(label, value) {
	return new TableRow({
		children: [
			new TableCell({
				borders: fullBorder(),
				width: { size: 30, type: WidthType.PERCENTAGE },
				children: [
					new Paragraph({
						children: [new TextRun({ text: label, bold: true, size: 22 })],
					}),
				],
			}),
			new TableCell({
				borders: fullBorder(),
				width: { size: 70, type: WidthType.PERCENTAGE },
				children: [
					new Paragraph({
						children: [new TextRun({ text: value || '', size: 22 })],
					}),
				],
			}),
		],
	})
}

function makeHeaderCell(text) {
	return new TableCell({
		borders: fullBorder(),
		children: [
			new Paragraph({
				children: [new TextRun({ text, bold: true, size: 22 })],
				alignment: AlignmentType.CENTER,
			}),
		],
	})
}

function makeDataCell(text) {
	return new TableCell({
		borders: fullBorder(),
		children: [
			new Paragraph({
				children: [new TextRun({ text, size: 22 })],
				alignment: AlignmentType.CENTER,
			}),
		],
	})
}
