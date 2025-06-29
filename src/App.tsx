import AppRoutes from './components/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthProvider'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
