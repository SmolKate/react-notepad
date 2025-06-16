import { useState, type ChangeEvent, type FormEvent } from 'react'
import { isEmail, isLessThanLength, isMoreThanLength } from '../utils/validators'
import { useHandleChange } from '../hooks/useHandleChange'
import { TextInput, Button } from '../ui'
import './style.css'

export interface SignupValues {
    name: string
    email: string
    password: string
    repeat_password: string
}

// interface Signup {
//     onSubmit: (value: SignupValues) => void
// }

const Registration = () => {

    const [passwordError, setPasswordError] = useState('')

    const validators = {
        name: [isMoreThanLength(5), isLessThanLength(100)],
        email: [isEmail()],
        password: [isMoreThanLength(5), isLessThanLength(10)],
        repeat_password: [isMoreThanLength(5), isLessThanLength(10)],
    }

    const { values, errors, handleChange } = useHandleChange({
        name: '',
        email: '',
        password: '',
        repeat_password: '',
    }, validators)


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { password, repeat_password} = values
        if (password && repeat_password && password !==repeat_password) {
            setPasswordError('Пароли должны совпадать')
            return
        }
        console.log({ values })
    }

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordError('')
        handleChange(e)
    }


    return (
        <form onSubmit={handleSubmit} className="registration-form">
            <div>Регистрация</div>
            <TextInput
                name='name'
                label='Имя'
                onChange={handleChange}
                value={values.name}
                error={errors?.name}
            />
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
                onChange={onPasswordChange}
                value={values.password}
                error={errors?.password || passwordError}
            />
            <TextInput
                name='repeat_password'
                type='password'
                label='Повторите пароль'
                onChange={onPasswordChange}
                value={values.repeat_password}
                error={errors?.repeat_password || passwordError}
            />
            <Button type="submit">Ок</Button>
        </form>
    )
}

export { Registration }