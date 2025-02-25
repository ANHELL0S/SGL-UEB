import { useCallback, useEffect, useState } from 'react'
import { ReportService } from '../../../services/api/report.api'

export const useReportStore = id => {
	const [reportData, setReportData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchData = useCallback(async () => {
		try {
			setLoading(true)
			const response = await ReportService.getAllReportPertainToSampleRequest(id)
			setReportData(response.data)
			setError(null)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return { loading, error, reportData, fetchData }
}
