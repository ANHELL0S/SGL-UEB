import { env } from '../../config/env-config.js'
import { isProduction } from './isProduction-util.js'

export function startServer(app) {
	const PORT = env.PORT
	const allowedOrigins = env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : []

	app.listen(PORT, () => {
		console.log(`\n>> Server running     -> http://127.0.0.1:${PORT}`)
		isProduction()
			? console.log(`>> Connected db       -> ${env.MAIN_DB_NAME}`)
			: console.log(`>> Connected db       -> ${env.LOCAL_DB_NAME}`)
		console.log(`>> CORS Origins       -> ${allowedOrigins.join(' - ')}\n`)
		isProduction() ? '' : console.log(`>> Documentación API 	   -> ${env.URL_API}/api-docs\n`)
	})
}
