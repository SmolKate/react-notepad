import { useAuth } from '../context/AuthProvider'
import { Button } from '../ui'

const Home = () => {
    const auth = useAuth()

    return (
        <>
            <div>Home</div>
            <Button onClick={() => auth?.signout()}>Выйти</Button>
        </>
    )
}

export { Home }