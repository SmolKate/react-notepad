import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean,
    error: string
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)

        this.state = {
            hasError: false,
            error: '',
        }
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            error: error.message
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log({ error, errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return <h4>Что-то пошло не так...</h4>
        }
        return this.props.children
    }
}

export default ErrorBoundary