export const translateAccess = typeAccess => {
	switch (typeAccess) {
		case 'access_internal':
			return 'Interno'
		case 'access_external':
			return 'Externo'
		default:
			return 'Tipo de acceso desconocido'
	}
}
