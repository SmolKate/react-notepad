import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Snackbar from '@mui/material/Snackbar'
import { useAuth } from '../context/AuthProvider'
import { Button } from '../ui'
import { db, type Note } from '../model/db'
import { NoteFormPopup } from '../components/NoteFormPopup'
import { NoteItem } from '../components/NoteItem'

const Home = () => {
    const auth = useAuth()

    const initialState = {
        error: '',
        title: '',
        content: ''
    }

    const notes = useLiveQuery(
        async () => {
        let notes = [] as Note[]
        if (auth?.userId) notes = await db.note.where({ userId: Number(auth?.userId) }).toArray()
        return notes
        }, []
    )
    const [isCreateMode, setCreateMode] = useState(false)
    const [snackbarText, setSnackbarText] = useState('')


    const onAddNoteClick = () => {
        setCreateMode(true)
    }

    return (
        <>
            <div>Home</div>
            <Button onClick={() => auth?.signout()}>Выйти</Button>
            <div className="note-wrapper">
                <h3>Список заметок</h3>
                <div>
                    {notes?.map(note => <NoteItem note={note} setSnackbarText={setSnackbarText} />)}
                </div>
                <Button onClick={onAddNoteClick}>Добавить заметку</Button>
                <Snackbar
                    open={!!snackbarText}
                    autoHideDuration={5000}
                    onClose={() => setSnackbarText('')}
                    message={snackbarText}
                />
                <NoteFormPopup isCreateMode={isCreateMode} callback={() => setCreateMode(false)} initialState={initialState} />
            </div>
        </>
    )
}

export { Home }