import { useState } from 'react'
import { UserForm } from './UserForm'
import {
	createUserRequest,
	updateUserRequest,
	deleteUserRequest,
	changeStatusUsersRequest,
} from '../../../../services/api/user.api'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		names: '',
		email: '',
		phone: '',
		dni: '',
		code: '',
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
			const response = await createUserRequest(data)
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
			title: 'Crear usuario',
			info: 'Para generar la contraseña se toma la cédula y el código, ejemplo: 0999999999ABCD',
			buttonSubmit: 'Ok, crear usuario',
			buttonLoading: 'Creando usuario...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <UserForm {...modalProps} />
}

export const ModalUpdate = ({ user, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		names: user?.names,
		email: user?.email,
		phone: user?.phone,
		dni: user?.dni,
		code: user?.code,
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
			const response = await updateUserRequest(user?.id_user, data)
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
			title: 'Editar usuario',
			buttonSubmit: 'Ok, editar usuario',
			buttonLoading: 'Editando usuario...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <UserForm {...modalProps} />
}

export const ModalDesactive = ({ user, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await changeStatusUsersRequest(user?.id_user, { active: user?.active })
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
			title: 'Deshabilitar usuario',
			description_a: `Estás a punto de deshabilitar al usuario`,
			description_b: `${user?.names}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, deshabilitar',
			buttonLoading: 'Deshabilitando usuario...',
		},
		actionType: 'warning',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalActive = ({ user, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await changeStatusUsersRequest(user?.id_user, { active: user?.active })
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
			title: 'Habilitar usuario',
			description_a: `Estás a punto de habilitar al usuario`,
			description_b: `${user?.names}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, habilitar usuario',
			buttonLoading: 'Habilitando usuario...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDelete = ({ user, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await deleteUserRequest(user?.id_user)
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
			title: 'Eliminar usuario',
			description_a: `Estás a punto de eliminar el usuario`,
			description_b: `${user?.names}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar usuario',
			buttonLoading: 'Eliminando usuario...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
