import { useState, useCallback } from 'react'

export const useCreated = () => {
	const [dropdownVisible, setDropdownVisible] = useState(null)
	const toggleDropdown = id => setDropdownVisible(dropdownVisible === id ? null : id)

	const [showCreateModal, setShowCreateModal] = useState(false)
	const handleCreate = useCallback(() => {
		setShowCreateModal(true)
		setDropdownVisible(null)
	}, [])
	const toggleCreateModal = useCallback(() => setShowCreateModal(prev => !prev), [])

	return {
		dropdownVisible,
		toggleDropdown,
		showCreateModal,
		handleCreate,
		toggleCreateModal,
	}
}

export const useUpdated = () => {
	const [showUpdateModal, setShowUpdateModal] = useState(false)

	const handleUpdate = useCallback(() => setShowUpdateModal(true), [])
	const toggleUpdateModal = useCallback(() => setShowUpdateModal(prev => !prev), [])

	return {
		showUpdateModal,
		handleUpdate,
		toggleUpdateModal,
	}
}

export const useActived = () => {
	const [showActiveModal, setShowActiveModal] = useState(false)

	const handleActive = useCallback(() => setShowActiveModal(true), [])
	const toggleActiveModal = useCallback(() => setShowActiveModal(prev => !prev), [])

	return {
		showActiveModal,
		handleActive,
		toggleActiveModal,
	}
}

export const useDesactived = () => {
	const [showDesactiveModal, setShowDesactiveModal] = useState(false)

	const handleDesactive = useCallback(() => setShowDesactiveModal(true), [])
	const toggleDesactiveModal = useCallback(() => setShowDesactiveModal(prev => !prev), [])

	return {
		showDesactiveModal,
		handleDesactive,
		toggleDesactiveModal,
	}
}

export const useDelete = () => {
	const [selected, setSelected] = useState(null)
	const [dropdownVisible, setDropdownVisible] = useState(null)
	const toggleDropdown = id => setDropdownVisible(dropdownVisible === id ? null : id)

	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const handleDelete = useCallback(data => {
		setSelected(data)
		setShowDeleteModal(true)
		setDropdownVisible(null)
	}, [])
	const toggleDeleteModal = useCallback(() => setShowDeleteModal(prev => !prev), [])

	return {
		dropdownVisible,
		toggleDropdown,
		selected,
		showDeleteModal,
		handleDelete,
		toggleDeleteModal,
	}
}
