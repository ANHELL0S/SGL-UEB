import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext.jsx'
import { RoutesConfig } from './routes/config.routes.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { OfflineAlert } from './components/Banner/OfflineAlert.jsx'
import { NetworkStatusProvider } from './context/NetworkStatusContext.jsx'
import { SessionExpiredModal } from './components/Banner/SessionExpired.jsx'
import { useAuthAxios } from './config/instances.js'

function App() {
	const { showModal, closeModal } = useAuthAxios()

	return (
		<NetworkStatusProvider>
			<OfflineAlert />
			<ThemeProvider>
				<AuthProvider>
					<Router>
						<RoutesConfig />
					</Router>
					<SessionExpiredModal show={showModal} onClose={closeModal} />
				</AuthProvider>
			</ThemeProvider>
			<Toaster position={window.innerWidth < 768 ? 'top-center' : 'top-center'} />
		</NetworkStatusProvider>
	)
}

export default App
