import { useState } from 'react'
import { AnalysisForm } from './AsignedAnalysisForm'
import { ToastGeneric } from '../../../../../components/Toasts/Toast'
import { AccessService } from '../../../../../services/api/accessLab.api'

export const ModalCreatedAsignedAnalysis = ({ onClose, onSuccess, access, analysisData }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
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
		const newData = {
			...data,
			access: access.id_access,
		}
		setLoading(true)
		try {
			const response = await AccessService.createdAnalysisPertainToAcessRequest(newData)
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
			title: 'Análisis requeridos',
			buttonSubmit: 'Ok, añadir análisis',
			buttonLoading: 'Añadiendo análisis...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		analysis: analysisData?.data?.analysis,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <AnalysisForm {...modalProps} />
}
