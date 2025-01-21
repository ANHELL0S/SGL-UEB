import multer from 'multer'
import { FILE_TYPES } from '../constants/fileType-const.js'
import { sendResponse } from '../helpers/responseHandler-helper.js'

const storage = multer.memoryStorage()

const dynamicFileFilter = fileAlias => (req, file, cb) => {
	const fileType = FILE_TYPES[fileAlias]

	if (!fileType) return cb(new Error(`Invalid file type alias: ${fileAlias}`), false)

	const allowedMimeTypes = fileType.mimeTypes
	const allowedExtensions = fileType.extensions

	if (!allowedMimeTypes.includes(file.mimetype)) {
		return cb(new Error(`Solo permitidos ${fileAlias}`), false)
	}

	const fileExtension = file.originalname.split('.').pop().toLowerCase()
	if (!allowedExtensions.includes(`.${fileExtension}`)) {
		return cb(new Error(`Solo permitidos ${fileAlias}`), false)
	}

	req.fileType = file.mimetype
	cb(null, true)
}

export const uploadFile = fileAlias => {
	return (req, res, next) => {
		const upload = multer({
			storage,
			fileFilter: dynamicFileFilter(fileAlias),
		}).single('file')

		upload(req, res, err => {
			if (err) return sendResponse(res, 400, err.message)
			next()
		})
	}
}
