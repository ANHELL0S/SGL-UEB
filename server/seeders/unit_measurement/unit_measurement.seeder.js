import { units_measurement } from './data.js'
import { unit_measurement_Schema } from '../../schema/schemes.js'

export const unitMeasurementSeeder = async () => {
	try {
		const existingLabs = await unit_measurement_Schema.findAll()

		if (existingLabs.length > 0) {
			console.log('Seeder -> Unidades de medida ya existen, el Seeder no se ejecuta.')
			return
		}

		await Promise.all(
			units_measurement.map(async units => {
				await unit_measurement_Schema.create({
					name: units.name,
					unit: units.unit,
				})
			})
		)

		console.log('Seeder -> Unidades de medida creados exitosamente.')
	} catch (error) {
		console.error('Error al crear unidades de medida predeterminados:', error.message)
	}
}
