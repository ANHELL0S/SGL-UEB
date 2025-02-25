import { CATEGORY } from './data_category.js'
import { experiments_category_Scheme } from '../../schema/schemes.js'

export const experimentCategorySeeder = async () => {
	try {
		const dataFound = await experiments_category_Scheme.findAll()

		if (dataFound.length > 0) {
			console.log('Seeder -> Experimentos - Categorias ya existen, el Seeder no se ejecuta.')
			return
		}
		const categories = Object.values(CATEGORY)
		await experiments_category_Scheme.bulkCreate(categories.map(categoryName => ({ name: categoryName })))

		console.log('Seeder -> Experimentos - Categorias creados exitosamente.')
	} catch (error) {
		console.error('Error al crear Experimentos - Categorias predeterminados:', error.message)
	}
}
