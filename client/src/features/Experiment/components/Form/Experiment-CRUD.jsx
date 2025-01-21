import { useState } from 'react'
import { ExperimentForm } from './Experiment-form'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import {
	createExperimentRequest,
	updateExperimentRequest,
	deleteExperimentRequest,
	changeStatusExperimentRequest,
} from '../../../../services/api/experiment.api'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		public_price: '',
		internal_price: '',
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
			const response = await createExperimentRequest(data)
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
			title: 'Nuevo experimento',
			description: 'Por favor, asegúrate de ingresar los datos correctos para la creación del nuevo experimento.',
			info: 'Ten en cuenta que la cédula que registres se asigna como parte de la contraseña.',
			buttonSubmit: 'Ok, crear experimento',
			buttonLoading: 'Creando experimento...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ExperimentForm {...modalProps} />
}

export const ModalUpdate = ({ experiment, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: experiment?.name || '',
		public_price: experiment?.public_price || '',
		internal_price: experiment?.internal_price || '',
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
			const response = await updateExperimentRequest(experiment?.id_experiment, data)
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
			title: 'Editar experimento',
			description_a: `Estás a punto de editar el experimento`,
			description_b: `${experiment?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando experimento...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ExperimentForm {...modalProps} />
}

export const ModalStatusActive = ({ experiment, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await changeStatusExperimentRequest(experiment?.id_experiment, { status: experiment?.status })
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
			title: 'Habilitar experimento',
			description_a: `Estás a punto de habilitar al experimento`,
			description_b: `${experiment?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, habilitar experimento',
			buttonLoading: 'Habilitando experimento...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalStatusDesactive = ({ experiment, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await changeStatusExperimentRequest(experiment?.id_experiment, { status: experiment?.status })
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
			title: 'Inhabilitar experimento',
			description_a: `Estás a punto de inhabilitar el experimento`,
			description_b: `${experiment?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, inhabilitar',
			buttonLoading: 'Inhabilitando experimento...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDelete = ({ experiment, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await deleteExperimentRequest(experiment?.id_experiment)
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
			title: 'Eliminar experimento',
			description_a: `Estás a punto de eliminar el experimento al laboratorio`,
			description_b: `${experiment?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando experimento...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
