import { motion } from 'framer-motion'

export const Dropdown = ({ children, className }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			exit={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={`absolute top-full right-0 mt-2 z-20 w-auto text-xs ${className}`}>
			<div className='w-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-gray-500 dark:bg-gray-700'>
				{children}
			</div>
		</motion.div>
	)
}
