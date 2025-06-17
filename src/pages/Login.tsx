import { type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useHandleChange } from '../hooks/useHandleChange'
import { isEmail, isLessThanLength, isMoreThanLength } from '../utils/validators'
import { Button, TextInput } from '../ui'
import type { PrivateRouteState } from '../components/PrivateRoute'
import { useAuth } from '../context/AuthProvider'
import './style.css'

export interface SiginValues {
    email: string,
    password: string,
}

// interface Signin {
//     onSubmit: (value: SiginValues) => void
// }

const Login = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const location = useLocation() 
    const state = location.state as PrivateRouteState

    const validators = {
        email: [isEmail()],
        password: [isMoreThanLength(5), isLessThanLength(10)]
    }

    const {values, errors, handleChange} = useHandleChange({
        email: '',
        password: '',
    }, validators)

    const handleSubmit = (e: FormEvent<HTMLFormElement | undefined>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const userName = formData.get('email') as string
        auth?.signin(userName, () => {
            navigate(state?.from ?? '/')
        })
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div>Авторизация</div>
            <TextInput
                name='email'
                type='email'
                label='Email'
                onChange={handleChange}
                value={values.email}
                error={errors?.email}
            />
            <TextInput
                name='password'
                type='password'
                label='Пароль'
                onChange={handleChange}
                value={values.password}
                error={errors?.password}
            />
            <Button type="submit">Войти</Button>
        </form>
    )
}

export { Login }