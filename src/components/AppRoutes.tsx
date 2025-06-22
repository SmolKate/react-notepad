import { Route, Routes } from 'react-router-dom'
// import Home from '../pages/Home'
// import CategoriesLayout from '../layout/CategoriesLayout'
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

                {/* <Route path={appPaths.contentRoot} element={<CategoriesLayout />}>
                    <Route path={appPaths.category(':name')} element={<PrivateRoute><Category /></PrivateRoute>} />
                    <Route path={appPaths.character} element={<PrivateRoute><Character /></PrivateRoute>} />
                    <Route path={appPaths.location} element={<PrivateRoute><Place /></PrivateRoute>} />
                    <Route path={appPaths.episode} element={<PrivateRoute><Episode /></PrivateRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Route> */}
            </Routes>
        </>
    )
}

export default AppRoutes