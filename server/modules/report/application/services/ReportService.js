import { ReportDTO } from '../../domain/dtos/ReportDTO.js'
import { ReportRepository } from '../repository/ReportRepository.js'

export class ReportService {
	static async getAll(page, limit, search, startUTC, endUTC, selectedSample, statusReport, selectedUsers) {
		const offset = limit ? (page - 1) * limit : null
		const result = await ReportRepository.findAll(
			offset,
			limit,
			search,
			startUTC,
			endUTC,
			selectedSample,
			statusReport,
			selectedUsers
		)

		return {
			totalRecords: result.count,
			totalPages: limit ? Math.ceil(result.count / limit) : 1,
			currentPage: limit ? parseInt(page, 10) : 1,
			recordsPerPage: limit ? parseInt(limit, 10) : result.count,
			reports: result.rows.map(data => ReportDTO.toResponse(data)),
		}
	}

	static async getAllToSample(id) {
		const result = await ReportRepository.getAllToSample(id)
		return {
			totalRecords: result.count,
			reports: result.rows.map(data => ReportDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await ReportRepository.findReportById(id)
		return dataFound ? ReportDTO.toResponse(dataFound) : null
	}

	static async update(id, id_user, transaction) {
		const findReport = await ReportRepository.findReportById(id)
		if (!findReport) return { code: 404, error: 'Reporte no encontrado.' }

		if (findReport.senior_analyst !== id_user) return { code: 403, error: 'No eres el responsable de este reporte.' }

		const dataToUpdate = {
			isIssued: !findReport.isIssued,
		}
		return await ReportRepository.updateReport(id, dataToUpdate, transaction)
	}

	static async delete(id, id_user, transaction) {
		const findReport = await ReportRepository.findReportById(id)
		if (!findReport) return { code: 404, error: 'Reporte no encontrado.' }

		if (findReport.senior_analyst !== id_user) return { code: 403, error: 'No eres el responsable de este reporte.' }

		return await ReportRepository.delete(id, transaction)
	}
}
