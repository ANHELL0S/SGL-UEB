export const translateAccess = typeAccess => {
	switch (typeAccess) {
		case 'access_internal':
			return 'Investifación'
		case 'access_external':
			return 'Servicio'
		default:
			return 'Tipo de acceso desconocido'
	}
}
