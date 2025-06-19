import TextField, { type TextFieldProps } from "@mui/material/TextField"

type TextInput = Omit<TextFieldProps, 'helperText' | 'error' > & {
    error?: string | undefined
    isError?: boolean
}

const TextInput = (props: TextInput) => {
    const { error, isError, ...otherProps} = props
    
    return (
        <TextField
            variant="outlined"
            size="small"
            margin="normal"
            color="primary"
            error={isError || Boolean(error)}
            helperText={error}
            {...otherProps}
        />
    )
}

export { TextInput }