export const sendResponse = (res, statusCode, message = '', data = {}) => {
	if (!message) message = '¡Ops! Ha ocurrido un error. Intentalo más tarde.'

	return res.status(statusCode).json({
		status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
		code: statusCode,
		message,
		data,
	})
}
