export const sendResponse = (res, statusCode, message = '', data = {}) => {
	if (!message) message = '¡Ops! Ha ocurrido un error. Por favor, inténtalo de nuevo.'

	return res.status(statusCode).json({
		status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
		code: statusCode,
		message,
		data,
	})
}
