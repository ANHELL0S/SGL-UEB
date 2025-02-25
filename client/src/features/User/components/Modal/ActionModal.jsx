import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../../components/Button/Button'

export const ModalAction = ({ text, actionType, loading, onClose, onSubmit }) => {
	const [modalOpen, setModalOpen] = useState(false)
	useEffect(() => setModalOpen(true), [])

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.2, ease: 'easeIn' },
		},
	}

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.9, y: 0, transition: { duration: 0.2, ease: 'easeIn' } },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { duration: 0.2, ease: 'easeIn' },
		},
		exit: {
			opacity: 0,
			scale: 1,
			y: 0,
			transition: { duration: 0.2, ease: 'easeIn' },
		},
	}

	return (
		<AnimatePresence>
			{modalOpen && (
				<motion.div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
					initial='hidden'
					animate='visible'
					exit='hidden'
					variants={overlayVariants}>
					<motion.div
						className='relative w-full max-w-lg p-6 m-2 space-y-4 rounded-xl bg-slate-50 shadow-xl dark:bg-gray-800'
						variants={modalVariants}
						onClick={e => e.stopPropagation()}>
						<div className='space-y-1'>
							<h3 className='text-lg font-semibold text-slate-600 dark:text-gray-100'>{text.title}</h3>
							<p className='text-sm font-medium text-red-600 dark:text-red-400'>
								<span>{text?.delete}</span>
							</p>
						</div>
						<p className='text-sm text-slate-600 font-medium dark:text-gray-300'>
							{text.description_a} <strong>{text.description_b}</strong> {text.description_c}
						</p>

						<div className='flex justify-end space-x-4'>
							<Button
								onClick={() => {
									setModalOpen(false)
									setTimeout(onClose, 200)
								}}
								disabled={loading}
								variant='none'
								size='small'>
								{text.buttonCancel}
							</Button>

							<Button onClick={onSubmit} variant={actionType} size='small' loading={loading}>
								{loading ? text.buttonLoading : text.buttonSubmit}
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
