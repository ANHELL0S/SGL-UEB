import { useState } from 'react'

export const useDropdown = () => {
	const [dropdownVisible, setDropdownVisible] = useState(null)
	const toggleDropdown = id => setDropdownVisible(prev => (prev === id ? null : id))

	return {
		dropdownVisible,
		toggleDropdown,
		setDropdownVisible,
	}
}
