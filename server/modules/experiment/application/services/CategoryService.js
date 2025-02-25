import { CategoryDTO } from '../../domain/dtos/CategoryDTO.js'
import { CategoryRepository } from '../repository/CategoryRepository.js'

export class CategoryService {
	static async getAll(page, limit, search) {
		const offset = (page - 1) * limit
		const dataFound = await CategoryRepository.getAll(offset, limit, search)
		return {
			totalRecords: dataFound.count,
			totalPages: Math.ceil(dataFound.count / limit),
			currentPage: parseInt(page, 10),
			recordsPerPage: parseInt(limit, 10),
			categories: dataFound.rows.map(data => CategoryDTO.toResponse(data)),
		}
	}

	static async getById(id) {
		const dataFound = await CategoryRepository.getById(id)
		return CategoryDTO.toResponse(dataFound)
	}

	static async create(data, transaction) {
		const dataFormater = CategoryDTO.toCreate({ ...data })
		return await CategoryRepository.create(dataFormater, transaction)
	}

	static async update(id, data, transaction) {
		const formaterData = CategoryDTO.toUpdate({ ...data })
		return await CategoryRepository.update(id, formaterData, transaction)
	}

	static async delete(id, transaction) {
		return await CategoryRepository.delete(id, transaction)
	}

	static async restore(id, transaction) {
		return await CategoryRepository.restore(id, transaction)
	}

	static async deletePermanent(id, transaction) {
		return await CategoryRepository.deletePermanent(id, transaction)
	}
}
