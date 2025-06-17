import { createContext, useContext, useState } from 'react'
import { db } from '../model/db'
import { useLiveQuery } from 'dexie-react-hooks'

interface AuthContext {
    userName: string | null
    signin: (userEmail: string, userPassword: string, callback?: VoidFunction) => void
    signout: (callback?: VoidFunction) => void
}

const AuthContext = createContext<AuthContext | null>(null)

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userName, setUserName] = useState<string | null>(null)

    const users = useLiveQuery(
        async () => {
        const users = await db.user.toArray()
        return users
        }, []
    )

    const signin = (userEmail: string, userPassword: string, callback?: VoidFunction) => {
        const userIndex = users?.findIndex((user) => user.email === userEmail && user.password === userPassword)
        if (users && userIndex !== -1 && userIndex !== undefined) {
            callback?.()
            setUserName(users[userIndex].name)
        }
    }
    const signout = (callback?: VoidFunction) => {
        setUserName(null)
        localStorage.removeItem('user')
        callback?.()
    }
    const value = {
        userName,
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