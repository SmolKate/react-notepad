import { useActionState, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Snackbar from '@mui/material/Snackbar'
import { Button, TextInput } from '../../ui'
import { db, type Note } from '../../model/db'
import { useAuth } from '../../context/AuthProvider'
import { useNote } from '../../context/NoteProvider'
import { useDebounce } from '../../hooks/useDebounce'
import { useHandleChange } from '../../hooks/useHandleChange'

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

    const noteState = useNote()
    const { title, content, id } = noteState?.currentNote ?? {}

    const {values, handleChange} = useHandleChange<{title?: string, content?: string}>({ title, content })

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
                noteState?.setCurrentNote?.((prev) => ({
                    ...prev,
                    title: noteTitle,
                    content: noteContent
                } as Note))
            } else if (isCreateMode) {
                await db.note.add({
                    title: noteTitle,
                    content: noteContent,
                    userId: Number(auth.userId),
                })
                const newNote = await db.note.where({ userId: Number(auth.userId) }).toArray()
                noteState?.setCurrentNote?.(newNote[newNote.length - 1])
            }
            callback?.()
            return initialState
        } catch (e) {
            return { title: noteTitle, content: noteContent, error: 'Не удалось сохранить заметку. Попробуйте позже.'}
        }
    }

    const [state, actionFn, isPending] = useActionState<InitialFormState, FormData>(submitAction, initialState)
    const debouncedTitle = useDebounce<string | undefined>(values.title, 1000)
    const debouncedContent = useDebounce<string | undefined>(values.content, 1000)

    useEffect( () => {
        const updateNote = async () => {
            if (isEditMode && id && (debouncedTitle || debouncedContent)) {
                try {
                    await db.note.update(id, {
                        title: debouncedTitle,
                        content: debouncedContent,
                    })
                } catch (e) {
                    console.error(e)
                } 
            }
        }

        updateNote()
        
    }, [debouncedTitle, debouncedContent])

    const handleClose = () => {
        callback?.()
        if (isEditMode) {
            noteState?.setCurrentNote?.((prev) => ({
                ...prev,
                title: values.title,
                content: values.content
            } as Note))
        }
    }

    return (
        <Dialog onClose={handleClose} open={isCreateMode || isEditMode || false}>
            <DialogTitle>{isEditMode ? 'Изменить заметку' : 'Создать заметку'}</DialogTitle>
            <form action={actionFn} className="note-form">
                <TextInput
                    name='title'
                    type='text'
                    label='Название заметки'
                    onChange={handleChange}
                    defaultValue={isEditMode ? initialState.title : ''}
                    isError={Boolean(state.error)}
                />
                <TextInput
                    name='content'
                    type='text'
                    label='Содержание'
                    onChange={handleChange}
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