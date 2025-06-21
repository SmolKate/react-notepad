import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import { Button, TextInput } from "../../ui"
import Snackbar from "@mui/material/Snackbar"
import { db } from "../../model/db"
import { useActionState, useState } from "react"
import { useAuth } from "../../context/AuthProvider"

type NoteFormPopup = NoteFormPopupForEdit | NoteFormPopupForCreate

interface InitialFormState {
        error?: string
        title: string
        content: string
    }

interface NoteFormPopupForEdit {
    isEditMode: boolean
    noteId: number
    callback?: () => void
    initialState: InitialFormState
}

interface NoteFormPopupForCreate {
    isCreateMode: boolean
    callback?: () => void
    initialState: InitialFormState
}

const NoteFormPopup = (props: NoteFormPopup) => {
    const { isEditMode, isCreateMode, noteId, callback, initialState} = props

    const auth = useAuth()
    const [snackbarText, setSnackbarText] = useState('')

    const submitAction = async (prevState: InitialFormState, formData: FormData) => {
        const noteTitle = formData.get('title') as string
        const noteContent = formData.get('content') as string
        if (!(auth && auth.userId)) {
            return { ...prevState, error: 'Произошла ошибка'}
        } else if (!noteTitle && !noteContent) {
            return { ...prevState, error: 'Напишите заметку'}
        }

        try {
            if (isEditMode) {
                await db.note.update(noteId, {
                    title: noteTitle,
                    content: noteContent,
                })
            } else {
                await db.note.add({
                    title: noteTitle,
                    content: noteContent,
                    userId: Number(auth.userId),
                })
            }
            callback?.()
            return initialState
        } catch (e) {
            return { title: noteTitle, content: noteContent, error: 'Не удалось сохранить заметку. Попробуйте позже.'}
        }
    }

    const [state, actionFn, isPending] = useActionState(submitAction, initialState)


    const handleClose = () => {
        console.log('handleClose')
    }

    return (
        <Dialog onClose={handleClose} open={isCreateMode || isEditMode}>
            <DialogTitle>{isEditMode ? 'Изменить заметку' : 'Создать заметку'}</DialogTitle>
            <form action={actionFn} className="note-form">
                <TextInput
                    name='title'
                    type='text'
                    label='Название заметки'
                    defaultValue={state.title}
                    isError={Boolean(state.error)}
                />
                <TextInput
                    name='content'
                    type='text'
                    label='Содержание'
                    defaultValue={state.content}
                    isError={Boolean(state.error)}
                    multiline
                    rows={10}
                />
                {state.error && <p className="note-error">{state.error}</p>}
                <Button type="submit" disabled={isPending}>Сохранить заметку</Button>
            </form>
            <Snackbar
                open={!!snackbarText}
                autoHideDuration={5000}
                onClose={() => setSnackbarText('')}
                message={snackbarText}
            />
        </Dialog>
    )
}

export {
    NoteFormPopup,
}