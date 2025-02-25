import { useEffect, useState } from 'react'
import loginImg1 from '../../../../assets/images/loginImg1.jpg'
import loginImg2 from '../../../../assets/images/loginImg2.jpg'
import loginImg3 from '../../../../assets/images/loginImg3.jpg'

export const ImageCarousel = () => {
	const images = [loginImg1, loginImg2, loginImg3]

	const [currentIndex, setCurrentIndex] = useState(0)

	const [fade, setFade] = useState(true)
	const handleDotClick = index => {
		setFade(false)
		setTimeout(() => {
			setCurrentIndex(index)
			setFade(true)
		}, 300)
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setFade(false)
			setTimeout(() => {
				setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
				setFade(true)
			}, 200)
		}, 5000)
		return () => clearInterval(interval)
	}, [])
	return (
		<>
			<div className='hidden md:block w-full md:h-screen md:w-full relative'>
				<div className='relative h-full'>
					<img
						src={images[currentIndex]}
						alt='Desert landscape'
						className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
							fade ? 'opacity-100' : 'opacity-0'
						}`}
					/>
					<div className='absolute inset-0 bg-blue-900/20'></div>
					<div className='absolute bottom-12 left-12 text-white'>
						<h2 className='text-2xl md:text-4xl font-semibold mb-2'>Sistema de gestión</h2>
						<h2 className='text-2xl md:text-4xl font-semibold'>de laboratorios</h2>
						<div className='flex gap-2 mt-6'>
							{images.map((_, index) => (
								<div
									key={index}
									onClick={() => handleDotClick(index)}
									className={`w-5 h-1.5 rounded cursor-pointer transition-all duration-300 ease-in-out ${
										currentIndex === index ? 'bg-white' : 'bg-white/30'
									}`}></div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
