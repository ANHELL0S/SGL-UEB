import { AccessLabDTO } from '../../domain/dtos/AccessLabDTO.js'
import { AccessLabRepository } from '../repository/AccesslabRepository.js'
import { AccessLabEntity } from '../../domain/entities/AccessLabEntity.js'
import { STATUS_ACCESS, TYPE_ACCESS } from '../../../../shared/constants/access-const.js'

export class AccessLabService {
	static async getAll(page, limit, search) {
		const offset = (page - 1) * limit
		const result = await AccessLabRepository.findAllAccessLabs(offset, limit, search)

		return {
			totalRecords: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			access_labs: result.rows.map(data => AccessLabDTO.toResponse(data)),
		}
	}

	static async getAllPertainLab(id, page, limit, search) {
		const offset = (page - 1) * limit
		const result = await AccessLabRepository.findAllAccessPertainLab(id, offset, limit, search)

		// Función para obtener la semana del año a partir de una fecha
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
		const metrics = result.rows.reduce(
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

	static async getById(id) {
		const userFound = await AccessLabRepository.findAccessLabById(id)
		return AccessLabDTO.toResponse(userFound)
	}

	static async create(data, transaction) {
		const dataFormater = new AccessLabEntity(data)
		const access = await AccessLabRepository.createAccess(dataFormater, transaction)

		if (dataFormater.type_access !== 'access_external') {
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
				id_lab_fk: lab.id_lab,
			}))

			for (const lab of labsData) await AccessLabRepository.createAccessLab(lab, transaction)
		}

		return access
	}

	static async update(id, data, transaction) {
		const accessLabData = AccessLabEntity.formaterData({ ...data })
		const updatedAccessLab = await AccessLabRepository.updateAccessLab(id, accessLabData, transaction)
		return updatedAccessLab
	}

	static async delete(id, transaction) {
		return AccessLabRepository.deleteAccessLab(id, transaction)
	}
}
