import { useState } from 'react'
import { ReactiveForm } from './SampleForm'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { ReactiveService } from '../../../../services/api/reactive.api'

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
			const response = await ReactiveService.createReactiveRequest(data)
			ToastGeneric({ type: 'success', message: response.data.message })
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

export const ModalUpdate = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: reactive.name || '',
		location: reactive.location || '',
		description: reactive.description || '',
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
			const response = await ReactiveService.updateLabRequest(lab?.id_lab, data)
			ToastGeneric({ type: 'success', message: response.data.message })
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

export const ModalStatus = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.changeStatusReactiveRequest(reactive.id_reactive, {
				status: reactive.status,
			})
			ToastGeneric({ type: 'success', message: response.data.message })
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

export const ModalDelete = ({ reactive, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReactiveService.deleteReactiveRequest(reactive?.id_reactive)
			ToastGeneric({ type: 'success', message: response.data.message })
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
			title: 'Eliminar reactivo',
			description_a: `Estás a punto de eliminar el reactivo`,
			description_b: `${reactive.name}`,
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
