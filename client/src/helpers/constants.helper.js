export const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ENDPOINT_API = {
	AUTH: `${BASE_URL}/auth`,
	USER: `${BASE_URL}/user`,
	ROLE: `${BASE_URL}/role`,
	FACULTY: `${BASE_URL}/faculty`,
	KARDEX: `${BASE_URL}/kardex`,
	CONSUMPTION_REACTIVE: `${BASE_URL}/consumption-reactive`,
	SAMPLE: `${BASE_URL}/sample`,
	REPORT: `${BASE_URL}/report`,
	REACTIVE: `${BASE_URL}/reactive`,
	REACTIVE_UNIT_MEARUREMENT: `${BASE_URL}/unit-measurement`,
	LAB: `${BASE_URL}/lab`,
	LAB_ACCESS: `${BASE_URL}/access`,
	LOG: `${BASE_URL}/log`,
	LAB_QUOTES: `${BASE_URL}/quote`,
	EXPERIMENT_CATEGORY: `${BASE_URL}/experiment/category`,
	EXPERIMENT_PARAMETER: `${BASE_URL}/experiment/parameter`,
}

export const PATH_AUTH = {
	LOGIN: '/',
	REGISTER: '/crear-cuenta',
	RECOVER_ACCOUNT: '/recuperar-contraseña',
	PASSWORD_RESET: '/restablecer-contraseña/:token',
}

export const PATH_PRIVATE = {
	HOME: '/',
	DASHBOARD: '/inicio',
	ACCOUNT: '/mi-cuenta',
	USER: '/usuarios',
	LOGS: '/logs',
	LAB: '/laboratorios',
	LAB_ME: '/mi-laboratorio',
	LAB_DETAIL: '/laboratorios/:slug',
	LAB_ACCESS: '/investigaciones',
	LAB_ACCESS_DETAIL: '/investigaciones/:slug',
	ACCESS_QUOTE: '/servicios',
	ACCESS_QUOTE_DETAIL: '/servicios/:slug',
	LAB_SAMPLE: '/muestras',
	LAB_SAMPLE_DETAIL: '/muestras/:slug',
	lab_EXPERIMENT: '/análisis',
	REPORT: '/informes',
	REACTIVES: '/inventario',
}

export const PATH_PUBLIC = {
	NOT_FOUND: '*',
	ABOUT: '/sobre-nosotros',
}

// TAG SECTION SIDEBAR
export const TAG = {
	MANAGER: 'Admistración',
	USER: 'Usuarios',
	LAB: 'Laboratorio',
	INVENTORY: 'Inventario',
	REACTIVE: 'Reactivos',
	ACCESS: 'Accesos',
}

export const ROLES = {
	DIRECTOR: 'director',
	SUPERVISOR: 'supervisor',
	TECHNICAL_ANALYST: 'analyst',
	GENERAL_ADMIN: 'general_admin',
	ACCESS_MANAGER: 'access_manager',
}

export const ROLES_ES = {
	director: 'Director',
	supervisor: 'Supervisor',
	analyst: 'Analista',
	general_admin: 'Administrador',
	access_manager: 'Accesos',
}

export const DEV_INFO = {
	NAME: 'Angelo G',
	FB: 'https://www.facebook.com/ANHELL0s',
}
