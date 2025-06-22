import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Markdown from 'marked-react';
import { useNote } from '../../context/NoteProvider'
import { Button } from '../../ui'
import { NoteFormPopup } from '../NoteFormPopup'
import { ItemDeletePopup } from '../ItemDeletePopup'
import './style.css'
import { NoteItem } from '../NoteItem'

const Workspace = () => {
    const [isEditMode, setEditMode] = useState(false)
    const [openDeletePopup, setOpenDeletePopup] = useState(false)
    const [snackbarText, setSnackbarText] = useState('')
    const noteState = useNote()

    const { title, content } = noteState?.currentNote ?? {}

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

    const filterredNotes = noteState?.filterredNotes
    const isFilterredMode = filterredNotes && filterredNotes.length > 0
    
    return (
        <div className="workspace">
            {noteState?.currentNote && !isFilterredMode && (
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
            {isFilterredMode && filterredNotes?.map(note => <NoteItem note={note} key={note.id} isWorkspace/>)}
        </div>
    )
}

export {
    Workspace
}