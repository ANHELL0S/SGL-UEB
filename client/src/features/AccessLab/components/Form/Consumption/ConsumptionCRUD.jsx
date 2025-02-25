import { useState } from 'react'
import { ConsumptionForm } from './ConsumptionForm'
import { ModalAction } from '../../Modal/ActionModal'
import { ToastGeneric } from '../../../../../components/Toasts/Toast'
import { ConsumptionReactiveService } from '../../../../../services/api/consumptionReactive.api'

export const ModalCreateConsumption = ({ onClose, onSuccess, accessData }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		reactive: '',
		lab: '',
		amount: '',
		analysis: '',
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
			const response = await ConsumptionReactiveService.createRequest(newData)
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
			title: 'Nuevo consumo',
			buttonSubmit: 'Ok, crear comsumo',
			buttonLoading: 'Creando consumo...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		accessData,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <ConsumptionForm {...modalProps} />
}

export const ModalDeleteConsumption = ({ consumption, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ConsumptionReactiveService.deletePeramanentRequest(consumption?.id_consumption_reactive)
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
			title: 'Eliminado consumo',
			delete: `Esta acción eliminará permanentemente el registro y la cantidad consumida se sumará al reactivo.`,
			description_a: `Estás a punto de eliminar el consumo`,
			description_b: `${consumption?.reactive?.name} (${consumption?.amount} ${consumption?.reactive?.units_measurement?.unit}).`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando consumo...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
