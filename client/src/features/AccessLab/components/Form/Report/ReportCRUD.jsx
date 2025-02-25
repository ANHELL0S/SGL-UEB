import { useState } from 'react'
import { SampleForm } from './ReportForm'
import { ModalAction } from '../../Modal/ActionModal'
import { ToastGeneric } from '../../../../../components/Toasts/Toast'
import { ReportService } from '../../../../../services/api/report.api'

// CRUD - REPORT

export const ModalEmitedReport = ({ report, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReportService.changeStatusReportRequest(report?.id_report)
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
			title: 'Emitir informe',
			description_a: `Estás a punto de marcar como emitido el reporte`,
			description_b: `${report?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, cambiar',
			buttonLoading: 'Cambiando estado...',
		},
		actionType: 'success',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalNotEmitedReport = ({ report, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReportService.changeStatusReportRequest(report?.id_report)
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
			title: 'No emitir informe',
			description_a: `Estás a punto de marcar como no emitido el reporte`,
			description_b: `${report?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, cambiar',
			buttonLoading: 'Cambiando estado...',
		},
		actionType: 'warning',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}

export const ModalDeletedReport = ({ report, onClose, onSuccess }) => {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		try {
			const response = await ReportService.deleteReportRequest(report?.id_report)
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
			title: 'Eliminar informe',
			delete: 'Esta acción eliminará permanentemente el informe.',
			description_a: `Estás a punto de eliminar la muestra`,
			description_b: `${report?.code}.`,
			description_c: '¿Está seguro?',
			buttonCancel: 'No, mantenlo',
			buttonSubmit: 'Ok, eliminar',
			buttonLoading: 'Eliminando informe...',
		},
		actionType: 'danger',
		loading,
		onClose,
		onSubmit: handleSubmit,
	}

	return <ModalAction {...modalProps} />
}
