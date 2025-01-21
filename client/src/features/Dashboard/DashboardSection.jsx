import visitasVeterinarias from './data.json'
import { ChartCard } from './components/ChartCard'
import { useUserStore } from '../../hooks/useUser'
import { WidgetCard } from './components/WidgetCard'
import { useAllLabsStore } from '../../hooks/useLab'
import { useAllUsersStore } from '../../hooks/useUser'
import { useAllSamplesStore } from '../../hooks/useSample'
import { useAllReactivesStore } from '../../hooks/useReactive'
import { AppointmentCard } from './components/AppointmentCard'
import { LuFlaskRound, LuLayoutPanelLeft, LuPanelTopInactive, LuUser } from 'react-icons/lu'

const DashboardSection = () => {
	const { userStore, loading, error } = useUserStore()
	const { users } = useAllUsersStore()
	const { labs } = useAllLabsStore()
	const { reactives } = useAllReactivesStore()
	const { samples } = useAllSamplesStore()

	if (loading) return <div>Loading...</div>

	if (error) return <div>Error: {error}</div>

	return (
		<>
			<main className='space-y-6'>
				<section className='text-slate-600 dark:text-slate-100 flex items-center justify-between'>
					<h2 className='text-3xl font-bold'>Bienvenid@ 👋🏻, {userStore?.data?.names}!</h2>
				</section>

				{/* Información general */}
				<section className='space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						<WidgetCard icon={LuUser} title='Usuarios' value={users?.data?.totalRecords || 0} color='bg-cyan-400' />
						<WidgetCard
							icon={LuLayoutPanelLeft}
							title='Laboratorios'
							value={labs?.data?.totalRecords || 0}
							color='bg-blue-400'
						/>
						<WidgetCard
							icon={LuFlaskRound}
							title='Reactivos'
							value={reactives?.data?.totalRecords || 0}
							color='bg-purple-400'
						/>
						<WidgetCard
							icon={LuPanelTopInactive}
							title='Muestras'
							value={samples?.data?.totalRecords || 0}
							color='bg-emerald-400'
						/>
					</div>
				</section>

				{/* Citas recientes */}
				<section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-4'>
						<h3 className='text-xl font-medium text-slate-700 dark:text-slate-50'>Actividades recientes</h3>
						<div className='space-y-8'>
							{visitasVeterinarias.map((visita, index) => {
								const { nombre, especie, raza } = visita.mascota
								const { hora, descripcion } = visita.visita
								return (
									<AppointmentCard
										key={index}
										petName={nombre}
										petType={especie}
										raza={raza}
										time={hora}
										description={descripcion}
									/>
								)
							})}
						</div>
					</div>

					<div className='space-y-4'>
						<ChartCard />
						<ChartCard />
					</div>
				</section>
			</main>
		</>
	)
}

export { DashboardSection }
