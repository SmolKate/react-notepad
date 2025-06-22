import { useState, type ChangeEvent } from 'react'

const useHandleChange = <T>(initialValues: T, validators?: {[key: string]: ((value: string) => string | undefined)[]}) => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<{[key: string]: string | undefined} | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
        const target = e?.target as HTMLInputElement
        
        setValues(prevState => ({
            ...prevState,
            [target.name]: value ?? target.value
        }))

        if (validators) {
            const inputValidators = validators?.[target.name] ?? []
            for (let i = 0; i < inputValidators.length; i++) {
                const error = inputValidators[i](target.value)
                setErrors(prevState => ({
                    ...prevState,
                    [target.name]: error
                }))
                if (error) break
            }
        }
    }

    return {values, errors, handleChange} as {values: T, errors: {[key in keyof T]: string} | null, handleChange: (e: ChangeEvent<HTMLInputElement>, value?: string) => void}
}

export { useHandleChange }