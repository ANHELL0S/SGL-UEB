import { useState } from 'react'
import { AccessLabForm } from './AccessLabForm'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { AccessService } from '../../../../services/api/accessLab.api'
import { useNavigate } from 'react-router-dom'
import { PATH_PRIVATE } from '@/helpers/constants.helper'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		resolution_approval: '',
		quote: '',
		faculty: '',
		career: '',
		reason: '',
		topic: '',
		datePermanenceStart: '',
		datePermanenceEnd: '',
		director: { name: '', dni: '', email: '' },
		applicant: [{ name: '', dni: '', email: '' }],
		labs: [],
		grupe: '',
		observations: '',
		clauses: '',
		attached: '',
		experiments: [],
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
			const response = await AccessService.createRequest(data)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onSuccess()
			onClose()
			navigate(PATH_PRIVATE.LAB_ACCESS_DETAIL.replace(':slug', response.data.data.code))
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Nueva investigación',
			buttonSubmit: 'Ok, crear acceso',
			buttonLoading: 'Creando acceso...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <AccessLabForm {...modalProps} />
}

export const ModalUpdate = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		resolution_approval: accessLab?.resolution_approval || '',
		faculty: accessLab?.faculties || '',
		career: accessLab?.careers || '',
		reason: accessLab?.reason || '',
		topic: accessLab?.topic || '',
		datePermanenceStart: accessLab?.datePermanenceStart || '',
		datePermanenceEnd: accessLab?.datePermanenceEnd || '',
		grupe: accessLab?.grupe || '',
		director: {
			name: accessLab?.directors?.[0]?.name || '',
			dni: accessLab?.directors?.[0]?.dni || '',
			email: accessLab?.directors?.[0]?.email || '',
		},
		applicant: accessLab?.applicants,
		labs: accessLab?.labs,
		observations: accessLab?.observations || '',
		clauses: accessLab?.clauses || '',
		attached: accessLab?.attached || '',
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
			const response = await AccessService.updateRequest(accessLab?.id_access, data)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Editar investigación',
			description_a: `Estás a punto de editar la investigación`,
			description_b: `${accessLab?.description}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando investigación...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <AccessLabForm {...modalProps} />
}

export const ModalApproved = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await AccessService.changeStatusRequest(accessLab?.id_access, { status: 'approved' })
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Aprobar acceso',
			description_a: `Estás a punto de aprobar el acceso`,
			description_b: `${accessLab?.code}"`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, aprobar',
			buttonLoading: 'Aprobando acceso...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalPending = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await AccessService.changeStatusRequest(accessLab?.id_access, { status: 'pending' })
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Pendiente acceso',
			description_a: `Estás a punto poner en pendiente el acceso de`,
			description_b: `${accessLab?.code}"`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, pendiente',
			buttonLoading: 'Pendiente acceso...',
		},
		actionType: 'warning',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalRejected = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await AccessService.changeStatusRequest(accessLab?.id_access, { status: 'rejected' })
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Rechazar acceso',
			description_a: `Estás a punto de rechazar el acceso de`,
			description_b: `${accessLab?.code}"`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, rechazar',
			buttonLoading: 'Rechazando acceso...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDelete = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await AccessService.deleteRequest(accessLab?.id_access)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Eliminar acceso',
			delete:
				'Esta acción no eliminará permanentemente el acceso, sino que lo marcará como eliminado. Puedes restaurarlo en cualquier momento.',
			description_a: `Estás a punto de eliminar el acceso de`,
			description_b: `${accessLab?.code}"`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar acceso',
			buttonLoading: 'Eliminando acceso...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalRestore = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await AccessService.restoreRequest(accessLab?.id_access)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Restaurar acceso',
			description_a: `Estás a punto de restaurar el acceso`,
			description_b: `${accessLab?.quote?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, restaurar',
			buttonLoading: 'Restaurando acceso...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDeletePermanent = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await AccessService.deletePermanentRequest(accessLab?.id_access)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Eliminado permanente',
			delete: 'Esta acción eliminará permanentemente el registro, y todas sus interacciones.',
			description_a: `Estás a punto de eliminar el acceso`,
			description_b: `${accessLab?.quote?.code}.`,
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
