import Button, { type ButtonProps } from "@mui/material/Button"

type Button = Omit<ButtonProps, 'variant' >

const ButtonComponent = (props: Button) => {
    const { children, ...otherProps} = props
    
    return (
        <Button
            variant="contained"
            {...otherProps}
        >
            {children}
        </Button>
     
    )
}

export { ButtonComponent as Button }