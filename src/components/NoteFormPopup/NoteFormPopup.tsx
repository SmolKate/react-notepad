import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import { Button, TextInput } from "../../ui"
import Snackbar from "@mui/material/Snackbar"
import { db, type Note } from "../../model/db"
import { useActionState, useState } from "react"
import { useAuth } from "../../context/AuthProvider"
import { useCurrentNote } from "../../context/CurrentNoteProvider"

interface InitialFormState {
    error?: string
    title: string
    content: string
}
interface NoteFormPopup {
    isCreateMode?: boolean
    isEditMode?: boolean
    callback?: () => void
    initialState: InitialFormState
}

const NoteFormPopup = (props: NoteFormPopup) => {
    const { isEditMode, isCreateMode, callback} = props

    const auth = useAuth()
    const [snackbarText, setSnackbarText] = useState('')

    const contextCurrentNote = useCurrentNote()
    const { title, content, id } = contextCurrentNote?.currentNote ?? {}


    const initialState = {
        title: title ?? '',
        content: content ?? '',
    }


    const submitAction = async (prevState: InitialFormState, formData: FormData) => {
        const noteTitle = formData.get('title') as string
        const noteContent = formData.get('content') as string
        if (!(auth && auth.userId)) {
            return { ...prevState, error: 'Произошла ошибка'}
        } else if (!noteTitle && !noteContent) {
            return { ...prevState, error: 'Напишите заметку'}
        }

        try {
            if (isEditMode && id) {
                await db.note.update(id, {
                    title: noteTitle,
                    content: noteContent,
                })
                contextCurrentNote?.setCurrentNote?.((prev) => ({
                    ...prev,
                    title: noteTitle,
                    content: noteContent
                } as Note))
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

    const [state, actionFn, isPending] = useActionState<InitialFormState, FormData>(submitAction, initialState)

    const handleClose = () => {
        callback?.()
    }

    return (
        <Dialog onClose={handleClose} open={isCreateMode || isEditMode || false}>
            <DialogTitle>{isEditMode ? 'Изменить заметку' : 'Создать заметку'}</DialogTitle>
            <form action={actionFn} className="note-form">
                <TextInput
                    name='title'
                    type='text'
                    label='Название заметки'
                    defaultValue={isEditMode ? initialState.title : ''}
                    isError={Boolean(state.error)}
                />
                <TextInput
                    name='content'
                    type='text'
                    label='Содержание'
                    defaultValue={isEditMode ? initialState.content : ''}
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