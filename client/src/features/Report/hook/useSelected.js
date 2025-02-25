import { useState } from 'react'

export const useSelected = () => {
	const [selected, setSelected] = useState(null)

	return {
		selected,
		setSelected,
	}
}
