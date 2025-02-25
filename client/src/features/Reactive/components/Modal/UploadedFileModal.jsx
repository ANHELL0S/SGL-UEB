import { LuX } from 'react-icons/lu'
import { useState, useEffect } from 'react'
import { Banner } from '../Banner/Banner'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../../components/Button/Button'
import { BiSolidCloudUpload, BiSolidDownload, BiSolidFile, BiSolidFileBlank, BiSolidTrash } from 'react-icons/bi'

export const UploadedFileModal = ({ text, loading, onClose, onSubmit, onFileChange }) => {
	const [modalOpen, setModalOpen] = useState(false)
	useEffect(() => setModalOpen(true), [])

	const [file, setFile] = useState(null)

	const handleFileChange = e => {
		const selectedFile = e.target.files[0]
		setFile(selectedFile)
		onFileChange(e)
	}

	const [dragActive, setDragActive] = useState(false)
	const handleDragEnter = e => {
		e.preventDefault()
		setDragActive(true)
	}

	const handleDragLeave = e => {
		e.preventDefault()
		setDragActive(false)
	}

	const handleDrop = e => {
		e.preventDefault()
		setDragActive(false)
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
							<h3 className='text-xl font-semibold text-slate-600 dark:text-gray-100'>{text.title}</h3>

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
								<div class='bg-blue-100 text-blue-600 dark:text-sky-200 dark:bg-cyan-800/50 p-4 text-xs space-y-3'>
									<p class='font-medium'>Para usar la carga masiva de reactivos, ten en cuenta lo siguiente:</p>
									<ul class='list-disc list-inside text-left font-medium space-y-1.5'>
										<li>
											<strong>Número de envases: </strong>Número entero.
										</li>
										<li>
											<strong>Cantidad: </strong>Números (decimales o enteros). Ejm: 666.6
										</li>
										<li>
											<strong>Unidad: </strong>Descarga el adjunto.
										</li>
										<li>
											<strong>CAS: </strong>Opcional.
										</li>
										<li>
											<strong>Fecha de vencimiento: </strong>Opcional (mes/día/año).
										</li>
										<li>
											<strong>Fiscalización: </strong>Si está sujeto a seguimiento (si o no).
										</li>
									</ul>

									<div className='flex items-center gap-4'>
										<a
											href='https://docs.google.com/spreadsheets/d/e/2PACX-1vQMyAvKrAGWGdRL6OEE9yvMTjzx-fr52wzfUB_2b3NljyoO8oLrSpljIytu5nTjm2cVj7FEMNyyNAEQ/pub?output=xlsx'
											className='inline-block bg-slate-600 hover:bg-slate-700 dark:bg-slate-300 dark:hover:bg-slate-200 dark:text-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors'>
											<div className='flex items-center gap-1'>
												<BiSolidDownload />
												<span>Plantilla reactivos</span>
											</div>
										</a>

										<a
											href='https://docs.google.com/spreadsheets/d/e/2PACX-1vTYHie9ZNq6ROdaD63nWmxf2b7Yxv1jlZJh6SR-w5V7JzGv60gWh6AdxbBtYC43583MdXyRDGN5ftcf/pub?output=xlsx'
											className='inline-block bg-slate-600 hover:bg-slate-700 dark:bg-slate-300 dark:hover:bg-slate-200 dark:text-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors'>
											<div className='flex items-center gap-1'>
												<BiSolidDownload />
												<span>Unidades medida</span>
											</div>
										</a>
									</div>
								</div>

								<div className='flex w-full flex-col items-center justify-center text-slate-500 dark:text-gray-300 pt-4'>
									{!file && (
										<label
											className='group flex h-48 w-full flex-col rounded-md border-2 border-dashed text-center dark:border-gray-700 dark:hover:bg-gray-700/40 transition-all ease-in-out duration-200'
											onDrop={handleDrop}
											onDragOver={handleDragOver}
											onDragEnter={handleDragEnter}
											onDragLeave={handleDragLeave}>
											<div className='flex h-full w-full cursor-pointer flex-col items-center justify-center text-center gap-4'>
												{dragActive ? (
													<>
														<BiSolidCloudUpload size={55} />
														<p className='text-base font-medium'>Soltar archivo</p>
													</>
												) : (
													<>
														<BiSolidFileBlank size={55} />
														<p className='text-base font-medium'>Busca o arrastra tu archivo</p>
														<div className='space-y-1 text-xs dark:text-gray-400'>
															<p>Tamaño máximo 5 MB</p>
															<p>Archivos soportados: XLSX</p>
														</div>
													</>
												)}
											</div>
											<input id='file-input' type='file' className='hidden' onChange={handleFileChange} />
										</label>
									)}

									{file && (
										<div className='flex w-full items-center justify-between rounded-md p-2 text-slate-500  dark:border-gray-600 dark:text-gray-300 border-dashed border-2 border-slate-300'>
											<div className='flex items-center'>
												<BiSolidFile size={20} />
												<p className='ml-2 text-sm font-medium'>{file.name}</p>
											</div>
											<Button variant='none' type='submit' size='small' onClick={handleRemoveFile} disabled={loading}>
												<BiSolidTrash size={16} className='text-red-400' />
											</Button>
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
