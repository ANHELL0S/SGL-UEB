import { useState } from 'react'
import { ReactiveForm } from './ReactiveForm'
import { ModalAction } from '../Modal/ActionModal'
import { UploadedFileModal } from '../Modal/UploadedFileModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { ReactiveService } from '../../../../services/api/reactive.api'

export const ModalUploadedFile = ({ onClose, onSuccess }) => {
	const [file, setFile] = useState(null)
	const [loading, setLoading] = useState(false)

	const handleFileChange = e => setFile(e.target.files[0])

	const handleSubmit = async event => {
		event.preventDefault()
		setLoading(true)
		try {
			const formData = new FormData()
			formData.append('file', file)
			const response = await ReactiveService.uploadedFileRequest(formData)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onSuccess()
			onClose()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Subir archivo',
			info1: 'Arrastra o selecciona tu archivo en formato Excel (.xlsx).',
			info2: 'Los productos con códigos primarios repetidos se consolidarán sumando las cantidades.',
			buttonSubmit: 'Ok, añadir productos',
			buttonLoading: 'Creando...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		onClose,
		onSubmit: handleSubmit,
		onFileChange: handleFileChange,
	}

	return <UploadedFileModal {...modalProps} />
}

export const ModalCreate = ({ onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		code: '',
		unit: '',
		number_of_containers: '',
		current_quantity: '',
		cas: '',
		expiration_date: '',
		control_tracking: '',
	})

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = async data => {
		setLoading(true)
		try {
			const response = await ReactiveService.createRequest(data)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onSuccess()
			onClose()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Nuevo reactivo',
			description: 'Por favor, asegúrate de ingresar los datos correctos para la creación del nuevo reactivo.',
			info: 'Ten en cuenta que la cédula que registres se asigna como parte de la contraseña.',
			buttonSubmit: 'Ok, crear reactivo',
			buttonLoading: 'Creando reactivo...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ReactiveForm {...modalProps} />
}

export const ModalUpdate = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: reactive?.name || '',
		code: reactive?.code || '',
		unit: reactive?.unit?.unit || '',
		number_of_containers: String(reactive?.number_of_containers || ''),
		current_quantity: String(reactive?.current_quantity || ''),
		cas: reactive?.cas || '',
		control_tracking: reactive?.control_tracking || '',
		expiration_date: reactive?.expiration_date || '',
	})

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}
	const handleSubmit = async data => {
		setLoading(true)
		try {
			const response = await ReactiveService.updateRequest(reactive?.id_reactive, data)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Editar reactivo',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando reactivo...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ReactiveForm {...modalProps} />
}

export const ModalDesactive = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.changeStatusRequest(reactive?.id_reactive, {
				status: reactive.status,
			})
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Deshabilitar reactivo',
			description_a: `Estás a punto de deshabilitar el reactivo`,
			description_b: `${reactive?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, deshabilitar',
			buttonLoading: 'Deshabilitando reactivo...',
		},
		actionType: 'warning',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalActive = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.changeStatusRequest(reactive?.id_reactive, {
				status: reactive.status,
			})
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Habilitar reactivo',
			description_a: `Estás a punto de habilitar al reactivo`,
			description_b: `${reactive?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, habilitar',
			buttonLoading: 'Habilitando reactivo...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDelete = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.deleteRequest(reactive?.id_reactive)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Eliminar reactivo',
			delete:
				'Esta acción no eliminará permanentemente el reactivo, sino que lo marcará como eliminado. Puedes restaurarlo en cualquier momento.',
			description_a: `Estás a punto de eliminar el reactivo`,
			description_b: `${reactive?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando reactivo...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalRestore = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.restoreRequest(reactive?.id_reactive)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Restaurar reactivo',
			description_a: `Estás a punto de restaurar el reactivo`,
			description_b: `${reactive?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, restaurar',
			buttonLoading: 'Restaurando reactivo...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDeletePermanent = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.deletePermanentRequest(reactive?.id_reactive)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error?.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Eliminar reactivo',
			delete: 'Esta acción eliminará permanentemente el registro, y todas sus interacciones.',
			description_a: `Estás a punto de eliminar el reactivo`,
			description_b: `${reactive?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando reactivo...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
