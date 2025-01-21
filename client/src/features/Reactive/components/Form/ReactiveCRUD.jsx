import { useState } from 'react'
import { ModalAction } from '../Modal/ActionModal'
import { UploadedFileModal } from '../Modal/UploadedFileModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import {
	createLabRequest,
	updateLabRequest,
	deleteLabRequest,
	changeStatusLabRequest,
	removeAnalystLabRequest,
} from '../../../../services/api/lab.api'
import { ReactiveForm } from './ReactiveForm'

import {
	uploadedFileRequest,
	createReactiveRequest,
	changeStatusReactiveRequest,
} from '../../../../services/api/reactive.api'

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
			const response = await uploadedFileRequest(formData)
			ToastGeneric({ type: 'success', message: response.message })
			onSuccess()
			onClose()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
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
		initial_quantity: '',
		quantity_consumed: '',
		current_quantity: '',

		cas: '',
		expiration_date: '',
		is_controlled: '',
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
			const response = await createReactiveRequest(data)
			ToastGeneric({ type: 'success', message: response.message })
			onSuccess()
			onClose()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
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

export const ModalUpdate = ({ lab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: lab.name || '',
		location: lab.location || '',
		description: lab.description || '',
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
			const response = await updateLabRequest(lab?.id_lab, data)
			ToastGeneric({ type: 'success', message: response.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Editar laboratorio',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando laboratorio...',
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
			const response = await changeStatusReactiveRequest(reactive.id_reactive, { status: reactive.status })
			ToastGeneric({ type: 'success', message: response.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Deshabilitar reactivo',
			description_a: `Estás a punto de deshabilitar el reactivo`,
			description_b: `${reactive.name}`,
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
			const response = await changeStatusReactiveRequest(reactive.id_reactive, { status: reactive.status })
			ToastGeneric({ type: 'success', message: response.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Habilitar reactivo',
			description_a: `Estás a punto de habilitar al reactivo`,
			description_b: `${reactive.name}`,
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

export const ModalDelete = ({ lab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await deleteLabRequest(lab.id_lab)
			ToastGeneric({ type: 'success', message: response.message })
			onClose()
			onSuccess()
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Eliminar laboratorio',
			description_a: `Estás a punto de eliminar al laboratorio`,
			description_b: `${lab.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando laboratorio...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
