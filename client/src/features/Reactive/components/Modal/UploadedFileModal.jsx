import { LuX } from 'react-icons/lu'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../../components/Button/Button'
import { BiSolidFile, BiSolidFileBlank, BiSolidTrash } from 'react-icons/bi'

export const UploadedFileModal = ({ text, loading, onClose, onSubmit, onFileChange }) => {
	const [modalOpen, setModalOpen] = useState(false)
	useEffect(() => setModalOpen(true), [])

	const [file, setFile] = useState(null)

	const handleFileChange = e => {
		const selectedFile = e.target.files[0]
		setFile(selectedFile)
		onFileChange(e)
	}

	const handleDrop = e => {
		e.preventDefault()
		const droppedFile = e.dataTransfer.files[0]
		setFile(droppedFile)
		onFileChange({ target: { files: [droppedFile] } })
	}

	const handleDragOver = e => e.preventDefault()

	useEffect(() => setModalOpen(true), [])

	const handleRemoveFile = () => {
		setFile(null)
		onFileChange({ target: { files: [] } })
	}

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
						className='relative w-full max-w-lg p-6 m-2 space-y-4 rounded-2xl bg-white shadow-xl dark:bg-gray-800'
						variants={modalVariants}
						onClick={e => e.stopPropagation()}>
						<div className='flex items-center justify-between'>
							<h3 className='text-lg font-semibold text-slate-600 dark:text-gray-100'>{text.title}</h3>

							<Button
								variant='none'
								size='small'
								disabled={loading}
								onClick={() => {
									setModalOpen(false)
									setTimeout(onClose, 300)
								}}>
								<LuX size={16} />
							</Button>
						</div>

						<form className='space-y-3' onSubmit={onSubmit}>
							<div className='grid grid-cols-1 space-y-2'>
								<div className='flex w-full flex-col items-center justify-center text-slate-400 dark:text-gray-300'>
									{!file && (
										<label
											className='group flex h-48 w-full flex-col rounded-md border-2 border-dashed text-center dark:border-gray-700 dark:hover:bg-gray-700/40 transition-all ease-in-out duration-200'
											onDrop={handleDrop}
											onDragOver={handleDragOver}>
											<div className='flex h-full w-full cursor-pointer flex-col items-center justify-center text-center gap-4'>
												<BiSolidFileBlank size={55} />
												<p className='text-base font-medium'>Busca o arratra tu archivo</p>
												<div className='space-y-1 text-xs font-medium dark:text-gray-400'>
													<p>Tamaño maximo 5 MB</p>
													<p>Archivos soportados: XLSX</p>
												</div>
											</div>
											<input id='file-input' type='file' className='hidden' onChange={handleFileChange} />
										</label>
									)}

									{file && (
										<div className='flex w-full items-center justify-between rounded-md p-2 text-slate-500 dark:bg-gray-700/50 dark:text-gray-300'>
											<div className='flex items-center'>
												<BiSolidFile size={20} />
												<p className='ml-2 text-sm font-medium'>{file.name}</p>
											</div>
											<button
												type='button'
												onClick={handleRemoveFile}
												className='flex items-center justify-center rounded-full p-2 text-slate-500 dark:text-gray-400 transition-all ease-in-out duration-200 hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-500/40 dark:hover:text-red-400'>
												<BiSolidTrash />
											</button>
										</div>
									)}
								</div>
							</div>

							<div className='flex flex-col justify-end gap-4 pt-2 font-semibold sm:flex-row'>
								<Button
									disabled={loading}
									onClick={() => {
										setModalOpen(false)
										setTimeout(onClose, 300)
									}}
									variant='none'
									type='button'
									size='small'>
									{text.buttonCancel}
								</Button>

								<Button variant='primary' type='submit' size='small' disabled={!file} loading={loading}>
									{loading ? text.buttonLoading : text.buttonSubmit}
								</Button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
