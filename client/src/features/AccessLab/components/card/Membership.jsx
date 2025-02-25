import { LabsCard } from './Labs'
import { useRoles } from '@/helpers/roleControl.helper'
import { useAllExperimentToAccessStore } from '../../../../hooks/useExperiment'
import { AnalysisCard } from './AnalysCard'

export const MembershipCard = ({ accessData }) => {
	const { experimentsToAcessData, loading, error, fetchExperimentsToAccessData } = useAllExperimentToAccessStore(
		accessData?.id_access
	)

	if (error) {
		return (
			<div className='grid col-span-1 gap-2 text-sm'>
				<p className='text-sm text-red-500'>Error: {error}</p>
			</div>
		)
	}

	const { loading: loadingRoles, error: errorRoles, userRoles } = useRoles()

	return (
		<>
			{loading && loadingRoles ? (
				<>
					<section className='col-span-1'>
						<div className='grid md:grid-cols-1 gap-4'>
							<div className='bg-slate-100 dark:bg-gray-700 p-4 h-16 w-full rounded-xl animate-pulse'></div>
							<div className='bg-slate-100 dark:bg-gray-700 p-4 h-40 w-full rounded-xl animate-pulse'></div>
							<div className='bg-slate-100 dark:bg-gray-700 p-4 h-40 w-full rounded-xl animate-pulse'></div>
						</div>
					</section>
				</>
			) : (
				<>
					<div className='h-screen overflow-auto space-y-4'>
						<div className='grid col-span-1 text-sm p-3 bg-violet-200 rounded-xl'>
							<p className='text-sm font-medium text-slate-600'>
								<strong>Grupo/s: </strong>
								{accessData?.grupe}
							</p>
						</div>

						<div className='grid col-span-1 gap-3 text-sm dark:text-gray-300 text-slate-600 pt-2'>
							<LabsCard accessData={accessData} />
						</div>

						<div className='grid col-span-1 gap-3 text-sm dark:text-gray-300 text-slate-600 pt-2'>
							<AnalysisCard accessData={accessData} />
						</div>
					</div>
				</>
			)}
		</>
	)
}
