import { ROLES, TAG, PATH_PRIVATE } from '../../../helpers/constants.helper'
import {
	BiSolidAnalyse,
	BiSolidCollection,
	BiSolidDashboard,
	BiSolidDollarCircle,
	BiSolidFileBlank,
	BiSolidFlask,
	BiSolidFoodMenu,
	BiSolidFridge,
	BiSolidLayer,
	BiSolidShapes,
	BiSolidUser,
} from 'react-icons/bi'

export const sections = [
	{
		label: 'Inicio',
		roles: [
			ROLES.GENERAL_ADMIN,
			ROLES.DIRECTOR,
			ROLES.SUPERVISOR,
			ROLES.TECHNICAL_ANALYST,
			ROLES.ACCESS_MANAGER,
			ROLES.GENERAL_ADMIN,
		],
		path: PATH_PRIVATE.DASHBOARD,
		icon: BiSolidDashboard,
		tag: TAG.MANAGER,
	},
	{
		label: 'Logs',
		roles: [ROLES.GENERAL_ADMIN],
		path: PATH_PRIVATE.LOGS,
		icon: BiSolidLayer,
		tag: TAG.MANAGER,
	},
	{
		label: 'Usuarios',
		roles: [ROLES.GENERAL_ADMIN],
		path: PATH_PRIVATE.USER,
		icon: BiSolidUser,
		tag: TAG.MANAGER,
	},
	{
		label: 'Mi laboratorio',
		roles: [ROLES.TECHNICAL_ANALYST],
		path: PATH_PRIVATE.LAB_ME,
		icon: BiSolidFridge,
		tag: TAG.MANAGER,
	},
	{
		label: 'Laboratorios',
		roles: [ROLES.SUPERVISOR],
		path: PATH_PRIVATE.LAB,
		icon: BiSolidCollection,
		tag: TAG.MANAGER,
	},
	{
		label: 'Servicios',
		roles: [ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR],
		path: PATH_PRIVATE.ACCESS_QUOTE,
		icon: BiSolidDollarCircle,
		tag: TAG.MANAGER,
	},
	{
		label: 'Investigaciones',
		roles: [ROLES.ACCESS_MANAGER, ROLES.DIRECTOR, ROLES.SUPERVISOR],
		path: PATH_PRIVATE.LAB_ACCESS,
		icon: BiSolidFoodMenu,
		tag: TAG.MANAGER,
	},
	{
		label: 'Muestras',
		roles: [ROLES.TECHNICAL_ANALYST],
		path: PATH_PRIVATE.LAB_SAMPLE,
		icon: BiSolidAnalyse,
		tag: TAG.MANAGER,
	},
	{
		label: 'Informes',
		roles: [ROLES.TECHNICAL_ANALYST],
		path: PATH_PRIVATE.REPORT,
		icon: BiSolidFileBlank,
		tag: TAG.MANAGER,
	},
	{
		label: 'Análisis',
		roles: [ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST],
		path: PATH_PRIVATE.lab_EXPERIMENT,
		icon: BiSolidFlask,
		tag: TAG.MANAGER,
	},
	{
		label: 'Inventario',
		roles: [ROLES.SUPERVISOR],
		path: PATH_PRIVATE.REACTIVES,
		icon: BiSolidShapes,
		tag: TAG.MANAGER,
	},
]
