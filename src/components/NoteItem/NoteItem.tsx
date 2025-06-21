import { useState } from 'react'
import { NoteFormPopup } from '../NoteFormPopup'
import { Button } from '../../ui'
import { db, type Note } from '../../model/db'

interface NoteItem {
    note: Note
    setSnackbarText: (text: string) => void
}

const NoteItem = ({ note, setSnackbarText }: NoteItem) => {
    const [isEditMode, setEditMode] = useState(false)

    const { id, title, content } = note
    const initialState = {
        title: title,
        content: content,
    }

    const onEditClick = () => {
        setEditMode(true)
    }

    const onDeleteClick = async (noteId: number) => {
        try {
            await db.note.delete(noteId)
        } catch (e) {
            setSnackbarText('Не удалось выполнить операцию. Попробуйте позже.')
        }
    }
    
    return (
    <div key={id} className="note-item">
        <h4>{title}</h4>
        <p>{content}</p>
        <div className="btns">
            <Button onClick={() => onEditClick()}>Изменить</Button>
            <Button onClick={() => onDeleteClick(id)}>Удалить</Button>
        </div>
        <NoteFormPopup
            initialState={initialState}
            noteId={id}
            isEditMode={isEditMode}
            callback={() => setEditMode(false)}
        />
    </div>
)}

export {
    NoteItem
}