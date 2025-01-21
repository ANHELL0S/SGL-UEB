import { lazy } from 'react'
import { PATH_PRIVATE, PATH_AUTH, PATH_PUBLIC } from '../helpers/constants.helper.js'

const routes_auth = [
	{
		path: PATH_AUTH.LOGIN,
		element: lazy(() => import('../pages/Auth/LoginPage.jsx')),
	},
	{
		path: PATH_AUTH.PASSWORD_RESET,
		element: lazy(() => import('../pages/Auth/PasswordResetPage.jsx')),
	},
	{
		path: PATH_AUTH.RECOVER_ACCOUNT,
		element: lazy(() => import('../pages/Auth/PasswordResetRequestPage.jsx')),
	},
]

const routes_privade = [
	{
		path: PATH_PRIVATE.DASHBOARD,
		element: lazy(() => import('../pages/Dashboard/DashboardPage.jsx')),
	},
	{
		path: PATH_PRIVATE.ACCOUNT,
		element: lazy(() => import('../pages/Account/AccountPage.jsx')),
	},
	{
		path: PATH_PRIVATE.USER,
		element: lazy(() => import('../pages/User/UserPage.jsx')),
	},
	{
		path: PATH_PRIVATE.LAB,
		element: lazy(() => import('../pages/Lab/LabPage.jsx')),
	},
	{
		path: PATH_PRIVATE.LAB_DETAIL,
		element: lazy(() => import('../pages/Lab/LabDetailPage.jsx')),
	},
	{
		path: PATH_PRIVATE.lab_EXPERIMENT,
		element: lazy(() => import('../pages/Lab/ExperimentPage.jsx')),
	},
	{
		path: PATH_PRIVATE.LAB_ACCESS,
		element: lazy(() => import('../pages/Lab/AccessLabPage.jsx')),
	},
	{
		path: PATH_PRIVATE.LAB_ACCESS_DETAIL,
		element: lazy(() => import('../pages/Lab/AccessLabDetailPage.jsx')),
	},
	{
		path: PATH_PRIVATE.LAB_SAMPLE,
		element: lazy(() => import('../pages/Lab/SamplePage.jsx')),
	},
	{
		path: PATH_PRIVATE.REACTIVES,
		element: lazy(() => import('../pages/Reactive/ReactivePage.jsx')),
	},
]

const routes_public = [
	{
		path: PATH_PUBLIC.ABOUT,
		element: lazy(() => import('../pages/About/AboutPage.jsx')),
	},
	{
		path: PATH_PUBLIC.NOT_FOUND,
		element: lazy(() => import('../pages/NotFound/NotFoundPage.jsx')),
	},
]

export { routes_public, routes_auth, routes_privade }
