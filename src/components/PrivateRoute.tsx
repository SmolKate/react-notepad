import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { appPaths } from '../utils/appPaths'

export interface PrivateRouteState {
    from: string
}

const PrivateRoute = ({ children }: {children: React.ReactNode}) => {
    const auth = useAuth()
    const location = useLocation()

    if (!auth?.userName) return <Navigate to={appPaths.login} state={{ from: location.pathname }} replace/>
    return children
}

export default PrivateRoute