import { Link } from 'react-router-dom'
import path_img from '../../assets/images/logo.png'
import { ImageCarousel } from './components/Banner/AuthCarousel'
import { Footer } from '../../sections/Footer/Footer'
import { PATH_AUTH } from '../../helpers/constants.helper'
import { SigningForm } from './components/Form/SigningForm'
import { BiSolidLocationPlus, BiSolidPhone } from 'react-icons/bi'

const LoginSection = () => {
	return (
		<>
			<div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
				<div className='grid md:grid-cols-2 items-center'>
					{/* Left Section */}
					<ImageCarousel />

					{/* Right Section (Login Form) */}
					<div className='max-w-md p-10 mx-auto flex flex-col gap-6'>
						<div className='text-start'>
							<img src={path_img} alt='logo' className='w-16 mb-4 object-contain' />
							<h3 className='text-slate-700 text-3xl font-bold'>Iniciar Sesión</h3>
							<p className='text-slate-500 text-sm mt-2 leading-relaxed'>¡Construyendo la universidad que queremos!</p>
						</div>

						<SigningForm />

						<div className='flex flex-wrap items-center justify-end gap-4 text-slate-500'>
							<div className='text-sm'>
								<Link
									to={PATH_AUTH.RECOVER_ACCOUNT}
									className='hover:underline font-medium transition-colors duration-300'>
									¿Olvidaste tu contraseña?
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Section */}
				<footer class='font-sans tracking-wide bg-slate-900 py-12 px-16 space-y-10'>
					<div class='grid max-md-grid-cols-1 lg:grid-cols-2 md:gap-20'>
						<div>
							<h4 class='text-slate-100 font-bold text-lg'>Sobre nosotros</h4>
							<p class='text-sm mt-6 text-slate-300'>
								En la Universidad Estatal de Bolivar, hemos desarrollado un Sistema de Gestión de Procesos de
								Laboratorios de Investigación para optimizar la administración de proyectos, equipos y datos. Nuestra
								plataforma facilita la colaboración, el seguimiento de experimentos y la gestión eficiente de recursos,
								impulsando la innovación y la excelencia científica.
							</p>
						</div>

						<div className='flex justify-center'>
							<ul class='grid sm:grid-cols-2 mt-12 gap-2'>
								<li class='flex items-center max-sm:mb-8'>
									<div class='bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shrink-0'>
										<BiSolidLocationPlus size={20} />
									</div>
									<p className='text-slate-100 text-sm ml-4'>92Q3+C3M, Provincia de, Guaranda</p>
								</li>

								<li class='flex items-center max-sm:mb-8'>
									<div class='bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shrink-0'>
										<BiSolidPhone size={20} />
									</div>
									<p className='text-slate-100 text-sm ml-4'>(593) 32983211 - 32980716</p>
								</li>
							</ul>
						</div>
					</div>

					<Footer />
				</footer>
			</div>
		</>
	)
}

export { LoginSection }
