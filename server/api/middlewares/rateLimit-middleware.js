import rateLimit from 'express-rate-limit'
import { parseWindowMs } from '../../utils/time-util.js'

const limiterRequest = ({ maxRequests = 70, time = '1m' } = {}) => {
	const windowMsInMilliseconds = parseWindowMs(time)

	return rateLimit({
		time: windowMsInMilliseconds,
		max: maxRequests,
		message: {
			message: `¡Has hecho demasiadas peticiones! Por favor, espera ${time} antes de intentarlo de nuevo.`,
		},
		keyGenerator: req => req.ip,
	})
}

export { limiterRequest }
