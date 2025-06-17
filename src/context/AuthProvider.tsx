import { createContext, useContext, useState } from 'react'

interface AuthContext {
    userId: string | null
    signin: (newUserId: string, callback?: VoidFunction) => void
    signout: (callback?: VoidFunction) => void
}

const AuthContext = createContext<AuthContext | null>(null)

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState(localStorage.getItem('user'))

    const signin = (newUserId: string, callback?: VoidFunction) => {
        setUserId(newUserId)
        localStorage.setItem('user', newUserId)
        callback?.()
    }
    const signout = (callback?: VoidFunction) => {
        setUserId(null)
        localStorage.removeItem('user')
        callback?.()
    }
    const value = {
        userId,
        signin,
        signout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    useAuth,
}