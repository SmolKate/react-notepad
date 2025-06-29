const isEmail = () => (value: string) =>{
    let error
    const isEmail = value
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    if (!isEmail) error = 'Неправильный формат'
    return error
}

const isMoreThanLength = (min: number) => (value: string) => {
    let error
    if (value.length < min) error = `Количество символов должно быть больше ${min}`
    return error
}

const isLessThanLength = (max: number) => (value: string) => {
    let error
    if (value.length > max) error = `Количество символов не должно превышать ${max}`
    return error
}

export {
    isEmail,
    isMoreThanLength,
    isLessThanLength,
}