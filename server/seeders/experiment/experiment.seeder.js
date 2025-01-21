import { experiment_data } from './data.js'
import { experiments_Scheme } from '../../schema/schemes.js'

export const experimentSeeder = async () => {
	try {
		const existingLabs = await experiments_Scheme.findAll()

		if (existingLabs.length > 0) {
			console.log('Seeder -> Experimentos ya existen, el Seeder no se ejecuta.')
			return
		}

		await Promise.all(
			experiment_data.map(async experiment => {
				await experiments_Scheme.create({
					name: experiment.name,
					public_price: experiment.public_price,
					internal_price: experiment.internal_price,
				})
			})
		)

		console.log('Seeder -> Experimentos creados exitosamente.')
	} catch (error) {
		console.error('Error al crear experimentos predeterminados:', error.message)
	}
}
