import { AccessLabDTO } from '../../domain/dtos/AccessLabDTO.js'
import { AccessLabRepository } from '../repository/AccesslabRepository.js'
import { STATUS_ACCESS, TYPE_ACCESS } from '../../../../shared/constants/access-const.js'
import { QUOTE } from '../../../../shared/constants/payment-const.js'
import {
	access_analysis_Scheme,
	access_applicant_Scheme,
	access_career_Scheme,
	access_director_Scheme,
	access_faculty_Scheme,
	access_lab_Scheme,
	access_Scheme,
	experiments_parameter_Scheme,
	quotes_experiments_Scheme,
} from '../../../../schema/schemes.js'

export class AccessLabService {
	static async getAll(page, limit, search) {
		const offset = (page - 1) * limit
		const result = await AccessLabRepository.findAllAccessLabs(offset, limit, search)
		return {
			totalRecords: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			access_labs:
				result.rows && result.rows.length > 0 ? result.rows.map(data => AccessLabDTO.toResponse(data)) : null,
		}
	}

	static async getAllPertainLab(id, page, limit, search) {
		const offset = (page - 1) * limit
		const result = await AccessLabRepository.findAllAccessPertainLab(id, offset, limit, search)

		const getWeekNumber = date => {
			const startDate = new Date(date.getFullYear(), 0, 1)
			const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000))
			return Math.ceil((days + 1) / 7)
		}

		// Obtener la fecha actual
		const today = new Date()

		// Obtener los últimos tres años
		const currentYear = today.getFullYear()
		const years = [currentYear - 2, currentYear - 1, currentYear]

		// Función para verificar si una fecha está dentro de los últimos 3 meses
		const isInLastThreeMonths = date => {
			const threeMonthsAgo = new Date()
			threeMonthsAgo.setMonth(today.getMonth() - 3)
			return date >= threeMonthsAgo && date <= today
		}

		// Función para verificar si una fecha está dentro de la última semana
		const isInLastTwoWeeks = date => {
			const twoWeeksAgo = new Date()
			twoWeeksAgo.setDate(today.getDate() - 14)
			return date >= twoWeeksAgo && date <= today
		}

		// Agrupando las métricas por fecha, mes, año, semana, status y type_access
		const metrics = result?.rows?.reduce(
			(acc, { createdAt, status, type_access }) => {
				const date = new Date(createdAt)
				const dayKey = date.toISOString().split('T')[0] // YYYY-MM-DD
				const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` // YYYY-MM
				const yearKey = date.getFullYear().toString() // YYYY
				const weekKey = `${date.getFullYear()}-W${getWeekNumber(date).toString().padStart(2, '0')}` // YYYY-Wxx

				// Solo contar el día actual en totalByDay
				if (dayKey === today.toISOString().split('T')[0]) {
					acc.byDay[dayKey] = acc.byDay[dayKey] || {
						total: 0,
						status: {
							[STATUS_ACCESS.PENDING]: 0,
							[STATUS_ACCESS.APPROVED]: 0,
							[STATUS_ACCESS.REJECTED]: 0,
						},
						typeAccess: {
							[TYPE_ACCESS.INTERNAL]: 0,
							[TYPE_ACCESS.PUBLIC]: 0,
						},
					}
					acc.byDay[dayKey].total += 1
					acc.byDay[dayKey].status[status] += 1
					acc.byDay[dayKey].typeAccess[type_access] += 1
				}

				// Contar solo los últimos 3 meses en totalByMonth
				if (isInLastThreeMonths(date)) {
					acc.byMonth[monthKey] = acc.byMonth[monthKey] || {
						total: 0,
						status: {
							[STATUS_ACCESS.PENDING]: 0,
							[STATUS_ACCESS.APPROVED]: 0,
							[STATUS_ACCESS.REJECTED]: 0,
						},
						typeAccess: {
							[TYPE_ACCESS.INTERNAL]: 0,
							[TYPE_ACCESS.PUBLIC]: 0,
						},
					}
					acc.byMonth[monthKey].total += 1
					acc.byMonth[monthKey].status[status] += 1
					acc.byMonth[monthKey].typeAccess[type_access] += 1
				}

				// Contar solo las últimas 2 semanas en totalByWeek
				if (isInLastTwoWeeks(date)) {
					acc.byWeek[weekKey] = acc.byWeek[weekKey] || {
						total: 0,
						status: {
							[STATUS_ACCESS.PENDING]: 0,
							[STATUS_ACCESS.APPROVED]: 0,
							[STATUS_ACCESS.REJECTED]: 0,
						},
						typeAccess: {
							[TYPE_ACCESS.INTERNAL]: 0,
							[TYPE_ACCESS.PUBLIC]: 0,
						},
					}
					acc.byWeek[weekKey].total += 1
					acc.byWeek[weekKey].status[status] += 1
					acc.byWeek[weekKey].typeAccess[type_access] += 1
				}

				// Total global por año no cambia
				acc.byYear[yearKey] = acc.byYear[yearKey] || {
					total: 0,
					status: {
						[STATUS_ACCESS.PENDING]: 0,
						[STATUS_ACCESS.APPROVED]: 0,
						[STATUS_ACCESS.REJECTED]: 0,
					},
					typeAccess: {
						[TYPE_ACCESS.INTERNAL]: 0,
						[TYPE_ACCESS.PUBLIC]: 0,
					},
				}
				acc.byYear[yearKey].total += 1
				acc.byYear[yearKey].status[status] += 1
				acc.byYear[yearKey].typeAccess[type_access] += 1

				// Acumulando los totales globales para status
				acc.totalByStatus[status] += 1

				// Acumulando los totales globales para typeAccess
				acc.totalByTypeAccess[type_access] += 1

				return acc
			},
			{
				byDay: {},
				byMonth: {},
				byYear: {},
				byWeek: {},
				totalByStatus: {
					[STATUS_ACCESS.PENDING]: 0,
					[STATUS_ACCESS.APPROVED]: 0,
					[STATUS_ACCESS.REJECTED]: 0,
				},
				totalByTypeAccess: {
					[TYPE_ACCESS.INTERNAL]: 0,
					[TYPE_ACCESS.PUBLIC]: 0,
				},
			}
		)

		// Asegurarse de incluir los últimos tres años aunque no haya registros
		years.forEach(year => {
			if (!metrics.byYear[year]) {
				metrics.byYear[year] = {
					total: 0,
					status: {
						[STATUS_ACCESS.PENDING]: 0,
						[STATUS_ACCESS.APPROVED]: 0,
						[STATUS_ACCESS.REJECTED]: 0,
					},
					typeAccess: {
						[TYPE_ACCESS.INTERNAL]: 0,
						[TYPE_ACCESS.PUBLIC]: 0,
					},
				}
			}
		})

		return {
			totalRecords: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			access_labs: result.rows.map(data => AccessLabDTO.toResponse(data)),
			metrics: {
				totalByDay: metrics.byDay,
				totalByMonth: metrics.byMonth,
				totalByYear: metrics.byYear,
				totalByWeek: metrics.byWeek,
				totalByStatus: metrics.totalByStatus,
				totalByTypeAccess: metrics.totalByTypeAccess,
			},
		}
	}

	static async getAllPertainToAnalyst(id, page, limit, search) {
		const analysResponsibleLab = await AccessLabRepository.getLaByAnalyst(id)
		const offset = (page - 1) * limit
		const result = await AccessLabRepository.findAllAccessPertainLab(analysResponsibleLab, offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			access_labs: (result.rows || []).map(data => AccessLabDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await AccessLabRepository.findAccessLabById(id)
		return dataFound ? AccessLabDTO.toResponse(dataFound) : null
	}

	static async getByCode(code) {
		const foundData = await AccessLabRepository.findAccessLabByCode(code)
		if (!foundData) return { code: 404, error: 'Acceso no encontrado.' }
		return foundData ? AccessLabDTO.toResponse(foundData) : null
	}

	static async create(data, transaction) {
		const dataFormater = AccessLabDTO.toCreate(data)

		const createdAtDate = new Date()

		// Se genera el código de fecha en formato YYMMDD.
		const dateCode = `${createdAtDate.getFullYear().toString().slice(2)}${(createdAtDate.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${createdAtDate.getDate().toString().padStart(2, '0')}`

		// Secuencia por defecto en caso de no existir registros previos.
		const defaultSequence = '000000'
		let lastSequence = defaultSequence

		// Verificamos si existen registros en access_Scheme.
		const records = await access_Scheme.findAll()

		if (records && records.length > 0) {
			// Tomamos el último registro del arreglo.
			const lastRecord = records[records.length - 1]
			const lastCode = lastRecord.code // Ejemplo: "AC_252415_000009"

			// Se separa el código por guiones bajos para extraer la secuencia.
			const parts = lastCode.split('_')
			if (parts.length === 3) lastSequence = parts[2]
		}

		// Incrementamos la secuencia.
		const newSequenceNumber = parseInt(lastSequence, 10) + 1
		const sequenceCode = newSequenceNumber.toString().padStart(lastSequence.length, '0')

		// Se forma el código de acceso combinando el prefijo, la fecha y la nueva secuencia.
		const accessCode = `INV_${dateCode}_${sequenceCode}`

		// Se crea la nueva cotización utilizando el repositorio correspondiente.
		const newQuote = await AccessLabRepository.createQuote({ type_quote: dataFormater.type_quote }, transaction)

		const access = await AccessLabRepository.createAccess(
			{ ...dataFormater, id_quote_fk: newQuote.id_quote, code: accessCode },
			transaction
		)

		if (dataFormater.experiments && dataFormater.experiments.length > 0) {
			const experimentAssociations = await Promise.all(
				dataFormater.experiments.map(async exp => {
					const experiment = await experiments_parameter_Scheme.findByPk(exp.id)

					const pricePublic = parseFloat(experiment?.dataValues?.public_price) || 0
					const amount = parseFloat(exp.amount) || 0
					const totalCost = pricePublic * amount

					return {
						id_access_fk: access.id_access,
						id_experiment_fk: exp.id,
						amount: exp.amount,
						total_cost: totalCost,
					}
				})
			)

			await access_analysis_Scheme.bulkCreate(experimentAssociations, { transaction })
		}

		if (dataFormater.id_faculty_fk) {
			await AccessLabRepository.createAccessFaculty(
				{ id_access_fk: access.id_access, id_faculty_fk: dataFormater.id_faculty_fk },
				transaction
			)
		}

		if (dataFormater.id_career_fk) {
			await AccessLabRepository.createAccessCareer(
				{ id_access_fk: access.id_access, id_career_fk: dataFormater.id_career_fk },
				transaction
			)
		}

		if (dataFormater.director.name || dataFormater.director.dni || dataFormater.director.email) {
			await AccessLabRepository.createAccessDirector(
				{
					id_access_fk: access.id_access,
					name: dataFormater.director.name,
					dni: dataFormater.director.dni,
					email: dataFormater.director.email,
				},
				transaction
			)
		}

		if (Array.isArray(dataFormater.applicant) && dataFormater.applicant.length > 0) {
			const applicantsData = dataFormater.applicant.map(applicant => ({
				id_access_fk: access.id_access,
				name: applicant.name,
				dni: applicant.dni,
				email: applicant.email,
			}))

			for (const applicant of applicantsData) await AccessLabRepository.createAccessApplicant(applicant, transaction)
		}

		if (Array.isArray(dataFormater.labs) && dataFormater.labs.length > 0) {
			const labsData = dataFormater.labs.map(lab => ({
				id_access_fk: access.id_access,
				id_lab_fk: lab.id_lab_fk,
			}))

			for (const lab of labsData) await AccessLabRepository.createAccessLabs(lab, transaction)
		}

		return access
	}

	static async update(id, data, transaction) {
		// Transformamos los datos utilizando el DTO correspondiente
		const accessLabData = AccessLabDTO.toUpdate({ ...data })

		// Actualizamos el registro principal sin modificar el código existente
		const updatedAccess = await AccessLabRepository.updateAccess(id, accessLabData, transaction)

		/**
		 * ACTUALIZACIÓN DE ASOCIACIONES
		 */

		// 1. Experimentos:
		// Eliminamos las asociaciones previas
		await access_analysis_Scheme.destroy({
			where: { id_access_fk: id },
			force: true,
			transaction,
		})
		// Si hay nuevos experimentos, se crean sus asociaciones
		if (accessLabData.experiments && accessLabData.experiments.length > 0) {
			const experimentAssociations = await Promise.all(
				accessLabData.experiments.map(async exp => {
					// Se busca el experimento para obtener el precio público
					const experiment = await experiments_parameter_Scheme.findByPk(exp.id)
					const pricePublic = parseFloat(experiment?.dataValues?.public_price) || 0
					const amount = parseFloat(exp.amount) || 0
					const totalCost = pricePublic * amount
					return {
						id_access_fk: id,
						id_experiment_fk: exp.id,
						amount: exp.amount,
						total_cost: totalCost,
					}
				})
			)
			await access_analysis_Scheme.bulkCreate(experimentAssociations, { transaction })
		}

		// 2. Facultad:
		// Eliminamos la asociación previa de facultad
		await access_faculty_Scheme.destroy({
			where: { id_access_fk: id },
			force: true,
			transaction,
		})
		// Si se envía una nueva facultad, se crea la asociación
		if (accessLabData.id_faculty_fk) {
			await access_faculty_Scheme.create(
				{ id_access_fk: id, id_faculty_fk: accessLabData.id_faculty_fk },
				{ transaction }
			)
		}

		// 3. Carrera:
		// Eliminamos la asociación previa de carrera utilizando el modelo correspondiente
		await access_career_Scheme.destroy({
			where: { id_access_fk: id },
			force: true,
			transaction,
		})
		if (accessLabData.id_career_fk) {
			await access_career_Scheme.create({ id_access_fk: id, id_career_fk: accessLabData.id_career_fk }, { transaction })
		}

		// 4. Director:
		// Eliminamos la asociación previa de director
		await access_director_Scheme.destroy({
			where: { id_access_fk: id },
			force: true,
			transaction,
		})
		if (
			accessLabData.director &&
			(accessLabData.director.name || accessLabData.director.dni || accessLabData.director.email)
		) {
			await access_director_Scheme.create(
				{
					id_access_fk: id,
					name: accessLabData.director.name,
					dni: accessLabData.director.dni,
					email: accessLabData.director.email,
				},
				{ transaction }
			)
		}

		// 5. Solicitantes (applicant):
		// Eliminamos las asociaciones previas de solicitantes
		await access_applicant_Scheme.destroy({
			where: { id_access_fk: id },
			force: true,
			transaction,
		})
		// Creamos las nuevas asociaciones de solicitantes
		if (Array.isArray(accessLabData.applicant) && accessLabData.applicant.length > 0) {
			const applicantsData = accessLabData.applicant.map(applicant => ({
				id_access_fk: id,
				name: applicant.name,
				dni: applicant.dni,
				email: applicant.email,
			}))
			for (const applicant of applicantsData) {
				await access_applicant_Scheme.create(applicant, { transaction })
			}
		}

		// 6. Laboratorios (labs):
		// Eliminamos las asociaciones previas de laboratorios
		await access_lab_Scheme.destroy({
			where: { id_access_fk: id },
			force: true,
			transaction,
		})
		// Creamos las nuevas asociaciones de laboratorios
		if (Array.isArray(accessLabData.labs) && accessLabData.labs.length > 0) {
			const labsData = accessLabData.labs.map(lab => ({
				id_access_fk: id,
				id_lab_fk: lab.id_lab_fk,
			}))
			for (const lab of labsData) {
				await access_lab_Scheme.create(lab, { transaction })
			}
		}

		return updatedAccess
	}

	static async chageStatus(id, data, transaction) {
		return AccessLabRepository.updateAccess(id, data, transaction)
	}

	static async delete(id, transaction) {
		return AccessLabRepository.deleteAccess(id, transaction)
	}

	static async restore(id, transaction) {
		return AccessLabRepository.restoreAccess(id, transaction)
	}

	static async deletePermanent(id, transaction) {
		return AccessLabRepository.deletePermanentAcess(id, transaction)
	}
}
