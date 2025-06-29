import { Route, Routes } from 'react-router-dom'
import { appPaths } from '../utils/appPaths'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Registration } from '../pages/Registration'
import { NotFound } from '../pages/NotFound'
import PrivateRoute from './PrivateRoute'
import { NoteProvider } from '../context/NoteProvider'

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route
                    path={appPaths.home}
                    element={
                    <PrivateRoute>
                        <NoteProvider>
                            <Home />
                        </NoteProvider>
                    </PrivateRoute>
                    }
                />
                <Route path={appPaths.login} element={<Login />} />
                <Route path={appPaths.registration} element={<Registration />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default AppRoutes