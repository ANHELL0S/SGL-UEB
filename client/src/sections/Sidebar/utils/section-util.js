import { ROLES, TAG, PATH_PRIVATE } from '../../../helpers/constants.helper'
import {
	BiCoinStack,
	BiSolidAnalyse,
	BiSolidCollection,
	BiSolidDashboard,
	BiSolidDollarCircle,
	BiSolidFlask,
	BiSolidFoodMenu,
	BiSolidUser,
} from 'react-icons/bi'

export const sections = [
	{
		label: 'Inicio',
		roles: [ROLES.GENERAL_ADMIN, ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST],
		path: PATH_PRIVATE.DASHBOARD,
		icon: BiSolidDashboard,
		tag: TAG.MANAGER,
	},
	{
		label: 'Usuarios',
		roles: [ROLES.GENERAL_ADMIN],
		path: PATH_PRIVATE.USER,
		icon: BiSolidUser,
		tag: TAG.USER,
	},
	{
		label: 'Laboratorios',
		roles: [ROLES.SUPERVISOR, ROLES.GENERAL_ADMIN],
		path: PATH_PRIVATE.LAB,
		icon: BiSolidCollection,
		tag: TAG.LAB,
	},
	{
		label: 'Cotizaciones',
		roles: [ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR],
		path: PATH_PRIVATE.ACCESS_QUOTE,
		icon: BiSolidDollarCircle,
		tag: TAG.ACCESS,
	},
	{
		label: 'Accesos',
		roles: [ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR],
		path: PATH_PRIVATE.LAB_ACCESS,
		icon: BiSolidFoodMenu,
		tag: TAG.ACCESS,
	},
	{
		label: 'Experimentos',
		roles: [ROLES.SUPERVISOR],
		path: PATH_PRIVATE.lab_EXPERIMENT,
		icon: BiSolidFlask,
		tag: TAG.LAB,
	},
	{
		label: 'Muestras',
		roles: [ROLES.TECHNICAL_ANALYST],
		path: PATH_PRIVATE.LAB_SAMPLE,
		icon: BiSolidAnalyse,
		tag: TAG.LAB,
	},
	{
		label: 'Reactivos',
		roles: [ROLES.SUPERVISOR],
		path: PATH_PRIVATE.REACTIVES,
		icon: BiCoinStack,
		tag: TAG.REACTIVE,
	},
]
