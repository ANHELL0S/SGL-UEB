import { useState } from 'react'
import { CategoryForm } from './Category-form'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { CategoryService } from '../../../../services/api/experiment.api'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
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
			const response = await CategoryService.createRequest(data)
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
			title: 'Nueva categoria',
			buttonSubmit: 'Ok, crear categoria',
			buttonLoading: 'Creando categoria...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <CategoryForm {...modalProps} />
}

export const ModalUpdate = ({ category, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: category?.name || '',
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
			const response = await CategoryService.updateRequest(category?.id_experiment_category, data)
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
			title: 'Editar categoria',
			description_a: `Estás a punto de editar la categoria`,
			description_b: `${category?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando categoria...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <CategoryForm {...modalProps} />
}

export const ModalDelete = ({ category, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await CategoryService.deleteRequest(category?.id_experiment_category)
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
			title: 'Eliminar categoria',
			description_a: `Estás a punto de eliminar la categoria`,
			description_b: `${category?.name}`,
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

export const ModalRestore = ({ category, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await CategoryService.restoreRequest(category?.id_experiment_category)
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
			title: 'Restaurar categoria',
			description_a: `Estás a punto de restaurar la categoria`,
			description_b: `${category?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, restaurar',
			buttonLoading: 'Restaurando categoria...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDeletePermanent = ({ category, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await CategoryService.deletePermanentRequest(category?.id_experiment_category)
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
			description_a: `Estás a punto de eliminar la categoria`,
			description_b: `${category?.name}`,
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
