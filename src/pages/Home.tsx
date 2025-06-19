import { useActionState, useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { Button, TextInput } from '../ui'
import { db } from '../model/db'
import { useLiveQuery } from 'dexie-react-hooks'

const Home = () => {
    const auth = useAuth()

    const initialState = {
        error: '',
        title: '',
        content: ''
    }

    const notes = useLiveQuery(
        async () => {
        const notes = await db.note.toArray()
        return notes
        }, []
    )
    const [isCreateMode, setCreateMode] = useState(false)
    const [state, actionFn, isPending] = useActionState(submitAction, initialState)

    async function submitAction (prevState, formData) {
        const noteTitle = formData.get('title')
        const noteContent = formData.get('content')
        if (!(auth && auth.userId)) {
            return { ...prevState, error: 'Произошла ошибка'}
        } else if (!noteTitle && !noteContent) {
            return { ...prevState, error: 'Напишите заметку'}
        }

        try {
            await db.note.add({
                title: noteTitle,
                content:noteContent,
                userId: Number(auth.userId)
            })
            setCreateMode(false)
            return initialState
        } catch (e) {
            return { title: noteTitle, content: noteContent, error: 'Не удалось сохранить заметку. Попробуйте позже.'}
        }
    }

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
                    {notes?.map(note => (
                        <div key={note.id} className="note-item">
                            <h4>{note.title}</h4>
                            <p>{note.content}</p>
                            <div className="btns">
                                <Button>Изменить</Button>
                                <Button>Удалить</Button>
                            </div>
                        </div>
                    ))}
                </div>
                {isCreateMode ? (
                    <form action={actionFn} className="note-form">
                        <TextInput
                            name='title'
                            type='text'
                            label='Название заметки'
                            defaultValue={state.title}
                            isError={state.error}
                        />
                        <TextInput
                            name='content'
                            type='text'
                            label='Содержание'
                            defaultValue={state.content}
                            isError={state.error}
                            multiline
                            rows={10}
                        />
                        {state.error && <p className="note-error">{state.error}</p>}
                        <Button type="submit" disabled={isPending}>Сохранить заметку</Button>
                    </form>
                ) : (
                    <Button onClick={onAddNoteClick}>Добавить заметку</Button>
                )}
            </div>
        </>
    )
}

export { Home }