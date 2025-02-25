import { BiSolidHeart } from 'react-icons/bi'
import { DEV_INFO } from '../../helpers/constants.helper'

export const Footer = () => {
	return (
		<>
			<footer>
				<div className='flex flex-col sm:flex-row items-center justify-between text-slate-500 dark:text-gray-500 text-xs gap-2 pt-3 sm:gap-0'>
					<span>&copy; {new Date().getFullYear()} SGL - UEB. Todos los derechos reservados</span>
					<div className='flex items-center gap-1'>
						<span className='flex gap-1 text-xs font-medium'>
							Made with
							<BiSolidHeart className='text-red-500' size={14} />
							by
						</span>
						<div className='flex items-center gap-2'>
							<a
								href={DEV_INFO.FB}
								className='block text-xs font-medium underline transition-colors duration-200 hover:text-neutral-700'
								target='_blank'
								rel='noopener noreferrer'>
								{DEV_INFO.NAME}
							</a>
						</div>
					</div>
				</div>
			</footer>
		</>
	)
}
