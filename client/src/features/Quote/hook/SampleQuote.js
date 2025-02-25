import { useCallback, useEffect, useState } from 'react'
import { QuoteService } from '../../../services/api/quote.api'
import { SampleService } from '../../../services/api/sample.api'

export const useSampleQuoteLabStore = id => {
	const [sampleQuoteData, setSampleQuoteData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchSamples = useCallback(async () => {
		try {
			setLoading(true)
			const response = await QuoteService.getAllSampleToQuoteRequest(id)
			setSampleQuoteData(response.data)
			setError(null)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		fetchSamples()
	}, [fetchSamples])

	return { loading, error, sampleQuoteData, fetchSamples }
}

export const useSampleToQuote = id => {
	const [sampleQuoteData, setSampleQuoteData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchSamples = useCallback(async () => {
		try {
			setLoading(true)
			const response = await SampleService.getAllSampleToQuoteRequest(id)
			setSampleQuoteData(response.data)
			setError(null)
		} catch (error) {
			setError(error)
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		fetchSamples()
	}, [fetchSamples])

	return { loading, error, sampleQuoteData, fetchSamples }
}
