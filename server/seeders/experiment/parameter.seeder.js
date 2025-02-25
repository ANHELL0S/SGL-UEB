import { PARAMETER } from './data-parameter.js'
import { experiments_parameter_Scheme, experiments_category_Scheme } from '../../schema/schemes.js'

export const experimentSeeder = async () => {
	try {
		const dataFound = await experiments_parameter_Scheme.findAll()
		if (dataFound.length > 0) {
			console.log('Seeder -> Experimentos - Parámetros ya existen, el Seeder no se ejecuta.')
			return
		}

		const categories = await experiments_category_Scheme.findAll()
		const categoryMap = categories.reduce((map, category) => {
			map[category.name] = category.id_experiment_category
			return map
		}, {})

		const parametersToCreate = []

		PARAMETER.forEach(parameter => {
			const categoryId = categoryMap[parameter.category]

			if (!categoryId) {
				console.warn(`Seeder -> Categoría no encontrada para el parámetro: ${parameter.name}. Skipping.`)
				return
			}

			parametersToCreate.push({
				id_experiment_category_fk: categoryId,
				name: parameter.name,
				public_price: parameter.public_price,
			})
		})

		if (parametersToCreate.length > 0) await experiments_parameter_Scheme.bulkCreate(parametersToCreate)

		console.log('Seeder -> Experimentos - Parámetros creados exitosamente.')
	} catch (error) {
		console.error('Error al crear Experimentos - Parámetros predeterminados:', error.message)
	}
}
