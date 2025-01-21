export const FILE_TYPES = {
	XLSX: {
		mimeTypes: [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/wps-office.xlsx',
			'application/vnd.ms-excel',
		],
		extensions: ['.xlsx'],
		name: 'XLSX',
	},
	PDF: {
		mimeTypes: ['application/pdf'],
		extensions: ['.pdf'],
		name: 'PDF',
	},
	IMAGES: {
		mimeTypes: ['image/jpeg', 'image/png'],
		extensions: ['.jpg', '.jpeg', '.png'],
		name: 'PGN, JPEG, JPG',
	},
}
