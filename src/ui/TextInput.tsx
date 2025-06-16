import TextField, { type TextFieldProps } from "@mui/material/TextField"

type TextInput = Omit<TextFieldProps, 'helperText' | 'error' > & {
    error: string | undefined
}

const TextInput = (props: TextInput) => {
    const { error, ...otherProps} = props
    
    return (
        <TextField
            variant="outlined"
            size="small"
            margin="normal"
            color="primary"
            error={Boolean(error)}
            helperText={error}
            {...otherProps}
        />
    )
}

export { TextInput }