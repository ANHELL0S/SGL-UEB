export const overlayVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
}

export const modalVariants = {
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
