import { useState } from 'react'
import { AccessLabForm } from './AccessLabForm'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import {
	createAccessLabRequest,
	updateAccessLabRequest,
	deleteAccessLabRequest,
	changeStatusAccessLabRequest,
} from '../../../../services/api/accessLab.api'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		type_access: '',
		faculty: '',
		career: '',
		reason: '',
		topic: '',
		startTime: '',
		endTime: '',
		director: { name: '', dni: '', email: '' },
		applicant: [{ name: '', dni: '', email: '' }],
		labs: [],
		observations: '',
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
			const response = await createAccessLabRequest(data)
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
			title: 'Nuevo acceso',
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
		type_access: accessLab?.type_access || '',
		faculty: accessLab?.faculties?.[0]?.id_faculty || '', // Default to the first faculty's id
		career: accessLab?.careers?.[0]?.id_career || '', // Default to the first career's id
		reason: accessLab?.reason || '',
		topic: accessLab?.topic || '',
		startTime: accessLab?.startTime || '',
		endTime: accessLab?.endTime || '',
		director: {
			name: accessLab?.directors?.[0]?.name || '',
			dni: accessLab?.directors?.[0]?.dni || '',
			email: accessLab?.directors?.[0]?.email || '',
		},
		applicant: accessLab?.applicants?.map(applicant => ({
			name: applicant.name || '',
			dni: applicant.dni || '',
			email: applicant.email || '',
		})) || [{ name: '', dni: '', email: '' }], // Default to an empty applicant if none
		labs:
			accessLab?.labs?.map(lab => ({
				id_lab: lab.id_lab || '',
				name_lab: lab.name_lab || '',
			})) || [],
		observations: accessLab?.observations || '',
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
			const response = await updateAccessLabRequest(accessLab?.id_access_lab, data)
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
			title: 'Editar acceso',
			description_a: `Estás a punto de editar el acceso al laboratorio`,
			description_b: `${accessLab?.description}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando acceso...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <AccessLabForm {...modalProps} />
}

export const ModalQuote = ({ accessLab, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		names: '',
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
			const response = await updateAccessLabRequest(accessLab?.id_access_lab, data)
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
			title: 'Editar acceso',
			description_a: `Estás a punto de editar el acceso al laboratorio`,
			description_b: `${accessLab?.description}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando acceso...',
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
			const response = await changeStatusAccessLabRequest(accessLab?.id_access_lab, { status: 'approved' })
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
			title: 'Aprobar acceso',
			description_a: `Estás a punto de aprobar el acceso de`,
			description_b: `${accessLab?.applicant_names} con razón "${accessLab?.experiment?.name_experiment}"`,
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
			const response = await changeStatusAccessLabRequest(accessLab?.id_access_lab, { status: 'pending' })
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
			title: 'Pendiente acceso',
			description_a: `Estás a punto poner en pendiente el acceso de`,
			description_b: `${accessLab?.applicant_names} con razón "${accessLab?.experiment?.name_experiment}"`,
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
			const response = await changeStatusAccessLabRequest(accessLab?.id_access_lab, { status: 'rejected' })
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
			title: 'Rechazar acceso',
			description_a: `Estás a punto de rechazar el acceso de`,
			description_b: `${accessLab?.applicant_names} con razón "${accessLab?.experiment?.name_experiment}"`,
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
			const response = await deleteAccessLabRequest(accessLab?.id_access_lab)
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
			title: 'Eliminar acceso',
			description_a: `Estás a punto de eliminar el acceso al laboratorio de`,
			description_b: `${accessLab?.applicant_names} con razón "${accessLab?.experiment?.name_experiment}"`,
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
