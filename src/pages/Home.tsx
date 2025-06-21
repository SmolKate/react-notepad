import { useAuth } from '../context/AuthProvider'
import { Button } from '../ui'
import { Sidebar } from '../components/Sidebar'
import { Workspace } from '../components/Workspace'
import { NoteFormPopup } from '../components/NoteFormPopup'
import { useState } from 'react'

const Home = () => {
    const auth = useAuth()
    const [isCreateMode, setCreateMode] = useState(false)
    
    const userId = auth?.userId as string
    const initialState = {
        error: '',
        title: '',
        content: ''
    }

    const onAddNoteClick = () => {
        setCreateMode(true)
    }

    return (
        <div className="home-page">
            <div className="menu">
                <Button size="small" onClick={onAddNoteClick}>Добавить заметку</Button>
                <Button size="small" onClick={() => auth?.signout()}>Выйти</Button>
            </div>
            <div className="content">
                <Sidebar userId={userId} />
                <Workspace />
            </div>
            <NoteFormPopup isCreateMode={isCreateMode} callback={() => setCreateMode(false)} initialState={initialState} />
        </div>
    )
}

export { Home }