import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../model/db'
import { useLiveQuery } from 'dexie-react-hooks'

interface AuthContext {
    userName: string | null
    userId: string | null
    signin: (userEmail: string, userPassword: string, callback?: VoidFunction) => void
    signout: (callback?: VoidFunction) => void
}

const AuthContext = createContext<AuthContext | null>(null)

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userName, setUserName] = useState<string | null>(null)
    const [userId, setUserId] = useState(localStorage.getItem('userId'))

    const users = useLiveQuery(
        async () => {
        const users = await db.user.toArray()
        return users
        }, []
    )

    useEffect(() => {
        const currentUserName = users?.find(({ id }) => id.toString() === userId)?.name
        setUserName(currentUserName ?? null)
    }, [users, userId])

    const signin = (userEmail: string, userPassword: string, callback?: VoidFunction) => {
        const userIndex = users?.findIndex((user) => user.email === userEmail && user.password === userPassword)
        if (users && userIndex !== -1 && userIndex !== undefined) {
            callback?.()
            setUserId(users[userIndex].id.toString())
            localStorage.setItem('userId', users[userIndex].id.toString())
        }
    }
    const signout = (callback?: VoidFunction) => {
        setUserId(null)
        localStorage.removeItem('user')
        callback?.()
    }
    const value = {
        userName,
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