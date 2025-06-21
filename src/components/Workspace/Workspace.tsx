import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useCurrentNote } from '../../context/CurrentNoteProvider'
import { Button } from '../../ui'
import { NoteFormPopup } from '../NoteFormPopup'
import './style.css'

const Workspace = () => {
    const [isEditMode, setEditMode] = useState(false)
    const [snackbarText, setSnackbarText] = useState('')
    const contextCurrentNote = useCurrentNote()

    const { title, content } = contextCurrentNote?.currentNote ?? {}

    const initialState = {
        title: title ?? '',
        content: content ?? '',
    }

    const onEditClick = () => {
        setEditMode(true)
    }

    const onDeleteClick = async () => {
        const errorCallback = () => {
            setSnackbarText('Не удалось выполнить операцию. Попробуйте позже.')
        }
        contextCurrentNote?.deleteNote(errorCallback)

    }
    
    return (
        <div className="workspace">
            Workspace
            {contextCurrentNote?.currentNote && (
                <>
                    <h4>Заголовок: {title}</h4>
                    <div className="workspace-note-content">Текст: {content}</div>
                    <div className="btns">
                        <Button onClick={() => onEditClick()}>Изменить</Button>
                        <Button onClick={onDeleteClick}>Удалить</Button>
                    </div>
                    <NoteFormPopup
                        initialState={initialState}
                        isEditMode={isEditMode}
                        callback={() => setEditMode(false)}
                    />
                    <Snackbar
                        open={!!snackbarText}
                        autoHideDuration={5000}
                        onClose={() => setSnackbarText('')}
                        message={snackbarText}
                    />
                </>
            )}
        </div>
    )
}

export {
    Workspace
}