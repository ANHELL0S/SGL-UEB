import { useState } from 'react'
import { SampleForm } from './SampleForm'
import { ModalAction } from '../../Modal/ActionModal'
import { SampleResultForm } from './SampleResultForm'
import { ToastGeneric } from '../../../../../components/Toasts/Toast'
import { SampleService } from '../../../../../services/api/sample.api'

// CRUD - SAMPLE

export const ModalCreateSample = ({ onClose, onSuccess, accessData }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		container: '',
		amount: '',
		unit_measurement: '',
		status: '',
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
			const newData = {
				...data,
				quote: accessData?.quote?.id_quote,
			}
			const response = await SampleService.createSampleRequest(newData)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Nueva muestra',
			buttonSubmit: 'Ok, crear muestra',
			buttonLoading: 'Creando muestra...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <SampleForm {...modalProps} />
}

export const ModalUpdateSample = ({ sample, onClose, onSuccess, accessData }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: sample?.name || '',
		container: sample?.container || '',
		status: sample?.status || '',
		amount: sample?.amount || '',
		unit_measurement: sample?.unit_measurement || '',
	})

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = async data => {
		const uptData = {
			...data,
			quote: accessData?.quote?.id_quote,
		}
		setLoading(true)
		try {
			const response = await SampleService.updateRequest(sample?.id_sample, uptData)
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
			title: 'Editar muestra',
			description_a: `Estás a punto de editar la muestra`,
			description_b: `${sample?.name}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando muestra...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <SampleForm {...modalProps} />
}

export const ModalDeleteSample = ({ sample, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await SampleService.deletePeramanentRequest(sample?.id_sample)
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
			title: 'Eliminado muestra',
			delete: 'Esta acción eliminará permanentemente el registro, y todas sus interacciones.',
			description_a: `Estás a punto de eliminar la muestra`,
			description_b: `${sample?.name}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando muestra...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

// CRUD - RESULT

export const ModalCreateResult = ({ onClose, onSuccess, sample, accessData }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		analysis: '',
		result: '',
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
			const newData = {
				...data,
				sample: sample.id_sample,
			}
			const response = await SampleService.addResultRequest(newData)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Añadir resultado',
			buttonSubmit: 'Ok, crear resultado',
			buttonLoading: 'Creando resultado...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		experiments: accessData.experiments,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <SampleResultForm {...modalProps} />
}

export const ModalUpdateResult = ({ onClose, onSuccess, sample, accessData }) => {
	console.log(sample)
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		result: sample?.result || '',
		analysis: sample?.id_analysis_fk || '',
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
			const newData = {
				...data,
				sample: sample.id_sample_fk,
			}
			const response = await SampleService.UpdateResultRequest(sample?.id_sample_result, newData)
			ToastGeneric({ type: 'success', message: response?.data?.message })
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
			title: 'Editar resultado',
			buttonSubmit: 'Ok, editar resultado',
			buttonLoading: 'Editando resultado...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		experiments: accessData.experiments,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <SampleResultForm {...modalProps} />
}

export const ModalDeleteResult = ({ sample, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await SampleService.deletePeramanentResultRequest(sample?.id_sample_result)
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
			title: 'Eliminar resultado',
			delete: 'Esta acción eliminará permanentemente el registro, y todas sus interacciones.',
			description_a: `Estás a punto de eliminar el resultado de la muestra`,
			description_b: `${sample?.name}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando resultado...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
