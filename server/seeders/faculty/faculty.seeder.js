import { data } from './data.js'
import { faculty_Scheme, career_Scheme } from '../../schema/schemes.js'

export const facultiesAndCareers = async () => {
	try {
		const existingFaculties = await faculty_Scheme.findAll()

		if (existingFaculties.length > 0) {
			console.log('Seeder -> Facultades ya existen, el Seeder no se ejecuta.')
			return
		}

		for (const [facultyName, careers] of Object.entries(data)) {
			// Crear o buscar la facultad
			let faculty = await faculty_Scheme.findOne({ where: { name: facultyName } })

			if (!faculty) {
				faculty = await faculty_Scheme.create({ name: facultyName })
				//console.log(`Facultad creada: ${facultyName}`)
			}

			// Procesar las carreras de la facultad
			for (const careerData of careers) {
				const existingCareer = await career_Scheme.findOne({
					where: { name: careerData.name, id_faculty_fk: faculty.id_faculty },
				})

				if (!existingCareer) {
					await career_Scheme.create({
						name: careerData.name,
						id_faculty_fk: faculty.id_faculty,
					})
					//	console.log(`Carrera creada: ${careerData.name} en ${facultyName}`)
				}
			}
		}

		console.log('Seeder -> Facultades y Carreras procesadas exitosamente.')
	} catch (error) {
		console.error('Error al ejecutar el seeder:', error.message)
	}
}
