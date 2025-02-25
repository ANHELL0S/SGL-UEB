import { useState } from 'react'
import { ParameterForm } from './Parameter-form'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { ParameterService } from '../../../../services/api/experiment.api'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		public_price: '',
		category: '',
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
			const response = await ParameterService.createRequest(data)
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
			title: 'Nuevo parametro',
			buttonSubmit: 'Ok, crear parametro',
			buttonLoading: 'Creando parametro...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ParameterForm {...modalProps} />
}

export const ModalUpdate = ({ parameter, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: parameter?.name || '',
		public_price: parameter?.public_price || '',
		category: parameter?.category || '',
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
			const response = await ParameterService.updateRequest(parameter?.id_experiment_parameter, data)
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
			title: 'Editar parametro',
			description_a: `Estás a punto de editar el parametro`,
			description_b: `${parameter?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando parametro...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ParameterForm {...modalProps} />
}

export const ModalStatusActive = ({ parameter, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ParameterService.changeStatusRequest(parameter?.id_experiment_parameter, {
				status: parameter?.status,
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
			title: 'Habilitar parametro',
			description_a: `Estás a punto de habilitar al parametro`,
			description_b: `${parameter?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, habilitar parametro',
			buttonLoading: 'Habilitando parametro...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalStatusDesactive = ({ parameter, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ParameterService.changeStatusRequest(parameter?.id_experiment_parameter, {
				status: parameter?.status,
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
			title: 'Inhabilitar parametro',
			description_a: `Estás a punto de inhabilitar el parametro`,
			description_b: `${parameter?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, inhabilitar',
			buttonLoading: 'Inhabilitando parametro...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDelete = ({ parameter, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await ParameterService.deleteRequest(parameter?.id_experiment_parameter)
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
			title: 'Eliminar parametro',
			delete:
				'Esta acción no eliminará permanentemente el parametro, sino que lo marcará como eliminado. Puedes restaurarlo en cualquier momento.',
			description_a: `Estás a punto de eliminar el parametro`,
			description_b: `${parameter?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando parametro...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalRestore = ({ parameter, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await ParameterService.restoreRequest(parameter?.id_experiment_parameter)
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
			title: 'Restaurar parametro',
			description_a: `Estás a punto de restaurar el parametro`,
			description_b: `${parameter?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, restaurar',
			buttonLoading: 'Restaurando parametro...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDeletePermanent = ({ parameter, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await ParameterService.deletePermanentRequest(parameter?.id_experiment_parameter)
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
			title: 'Eliminado permanente',
			delete: 'Esta acción eliminará permanentemente el registro, y todas sus interacciones.',
			description_a: `Estás a punto de eliminar el parametro`,
			description_b: `${parameter?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando categoria...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
