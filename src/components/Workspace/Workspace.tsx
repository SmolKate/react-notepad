import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Markdown from 'marked-react';
import { useCurrentNote } from '../../context/CurrentNoteProvider'
import { Button } from '../../ui'
import { NoteFormPopup } from '../NoteFormPopup'
import { ItemDeletePopup } from '../ItemDeletePopup'
import './style.css'

const Workspace = () => {
    const [isEditMode, setEditMode] = useState(false)
    const [openDeletePopup, setOpenDeletePopup] = useState(false)
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

    const errorCallback = () => {
        setSnackbarText('Не удалось выполнить операцию. Попробуйте позже.')
    }
    
    return (
        <div className="workspace">
            Workspace
            {contextCurrentNote?.currentNote && (
                <>
                    <h4>Заголовок: {title}</h4>
                    <div>Текст:</div>
                    <div className="workspace-note-content"><Markdown>{content}</Markdown></div>
                    <div className="btns">
                        <Button onClick={() => onEditClick()}>Изменить</Button>
                        <Button onClick={() => setOpenDeletePopup(true)}>Удалить</Button>
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
                    <ItemDeletePopup
                        errorCallback={errorCallback}
                        openDeletePopup={openDeletePopup}
                        setOpenDeletePopup={setOpenDeletePopup}
                    />
                </>
            )}
        </div>
    )
}

export {
    Workspace
}