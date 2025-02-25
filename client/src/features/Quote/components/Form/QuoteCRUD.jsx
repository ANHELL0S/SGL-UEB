import { useState } from 'react'
import { ModalAction } from '../Modal/ActionModal'
import { ToastGeneric } from '../../../../components/Toasts/Toast'
import { QuoteService } from '../../../../services/api/quote.api'
import { QuoteForm } from './QuoteForm'
import { BillForm } from './BillForm'
import { PATH_PRIVATE } from '../../../../helpers/constants.helper'
import { useNavigate } from 'react-router-dom'

export const ModalCreate = ({ onClose, onSuccess }) => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		type_access: 'internal',
		type_sample: '',
		amount_sample: '',
		detail_sample: '',
		name: '',
		dni: '',
		email: '',
		phone: '',
		direction: '',
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
			const response = await QuoteService.createQuoteRequest(data)
			ToastGeneric({ type: 'success', message: response?.data?.message })
			onSuccess()
			onClose()
			navigate(PATH_PRIVATE.ACCESS_QUOTE_DETAIL.replace(':slug', response.data.data.quote.code))
		} catch (error) {
			ToastGeneric({ type: 'error', message: error.message })
		} finally {
			setLoading(false)
		}
	}

	const modalProps = {
		text: {
			title: 'Nueva cotización',
			buttonSubmit: 'Ok, crear cotización',
			buttonLoading: 'Creando cotización...',
			buttonCancel: 'No, cancelar',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <QuoteForm {...modalProps} />
}

export const ModalUpdate = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		type_quote: quote.type_quote || '',
		type_sample: quote.type_sample || '',
		amount_sample: quote.amount_sample || '',
		detail_sample: quote.detail_sample || '',
		name: quote.name || '',
		dni: quote.dni || '',
		email: quote.email || '',
		phone: quote.phone || '',
		direction: quote.direction || '',
		experiments: quote.experiments || [],
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
			const response = await QuoteService.updateRequest(quote?.id_quote, data)
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
			title: 'Editar cotización',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, editar',
			buttonLoading: 'Editando cotización...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <QuoteForm {...modalProps} />
}

export const ModalBill = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		bill: quote.bill || '',
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
			const response = await QuoteService.addBillRequest(quote?.id_quote, data)
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
			title: 'Añadir deposito',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, añadir',
			buttonLoading: 'Añadiendo deposito...',
		},
		loading,
		formData,
		onClose,
		onChange: handleChange,
		onSubmit: handleSubmit,
	}

	return <BillForm {...modalProps} />
}

export const ModalApproved = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await QuoteService.changeStatusRequest(quote?.id_quote, { status: 'approved' })
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
			title: 'Aprobar cotización',
			description_a: `Estás a punto de aprobar la cotización`,
			description_b: `${quote?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, aprobar',
			buttonLoading: 'Aprobando cotización...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalPending = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await QuoteService.changeStatusRequest(quote?.id_quote, { status: 'pending' })
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
			title: 'Pendiente cotización',
			description_a: `Estás a punto poner en pendiente la cotización`,
			description_b: `${quote?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, pendiente',
			buttonLoading: 'Pendiente cotización...',
		},
		actionType: 'warning',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalRejected = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const response = await QuoteService.changeStatusRequest(quote?.id_quote, { status: 'rejected' })
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
			title: 'Rechazar cotización',
			description_a: `Estás a punto de rechazar la cotización`,
			description_b: `${quote?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, rechazar',
			buttonLoading: 'Rechazando cotización...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDelete = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await QuoteService.deleteRequest(quote.id_quote)
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
			title: 'Eliminar cotización',
			delete:
				'Esta acción no eliminará permanentemente la cotización, sino que lo marcará como eliminada. Puedes restaurarla en cualquier momento.',
			description_a: `Estás a punto de eliminar la cotización`,
			description_b: `${quote?.code}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando cotización...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalRestore = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await QuoteService.restoreRequest(quote.id_quote)
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
			title: 'Restaurar cotización',
			description_a: `Estás a punto de restaurar la cotización`,
			description_b: `${quote?.code}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, restaurar',
			buttonLoading: 'Restaurando cotización...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDeletePermanent = ({ quote, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await QuoteService.deletePermanentRequest(quote.id_quote)
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
			description_a: `Estás a punto de eliminar la cotización`,
			description_b: `${quote?.code}`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando cotización...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
