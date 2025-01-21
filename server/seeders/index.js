import { labSeeder } from './lab/lab.seeder.js'
import { userSeeder } from './user/user.seeder.js'
import { rolesSeeder } from './role/role.seeder.js'
import { experimentSeeder } from './experiment/experiment.seeder.js'
import { configSeeder } from './config/config.seeder.js'
import { facultiesAndCareers } from './faculty/faculty.seeder.js'
import { unitMeasurementSeeder } from './unit_measurement/unit_measurement.seeder.js'

export const runSeeders = async () => {
	try {
		await configSeeder()
		await rolesSeeder()
		await userSeeder()
		await labSeeder()
		await experimentSeeder()
		await facultiesAndCareers()
		await unitMeasurementSeeder()
	} catch (error) {
		console.error('Error al ejecutar las inyecciones:', error.message)
	}
}
