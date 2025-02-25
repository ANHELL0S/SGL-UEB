import { useState } from 'react'
import { LabForm } from './AsignedLabForm'
import { ToastGeneric } from '../../../../../components/Toasts/Toast'
import { AccessService } from '../../../../../services/api/accessLab.api'

export const ModalasignedLab = ({ onClose, onSuccess, access, assignedLabs }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		labs: assignedLabs || [],
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
			const response = await AccessService.asignedLabRequest(newData)
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
			title: 'Asignar laboratorio',
			buttonSubmit: 'Ok, asignar laboratorio/s',
			buttonLoading: 'Asignando laboratorio/s...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <LabForm {...modalProps} />
}
