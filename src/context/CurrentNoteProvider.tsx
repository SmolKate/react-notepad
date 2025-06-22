import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'
import { db, type Note } from '../model/db'

interface CurrentNote  {
    currentNote: Note | null
    setCurrentNote: Dispatch<SetStateAction<Note | null>>
    deleteNote: (errorCallback: VoidFunction) => void
}

const CurrentNoteContext = createContext<CurrentNote | null>(null)

const useCurrentNote = () => {
    return useContext(CurrentNoteContext)
}

const CurrentNoteProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentNote, setCurrentNote] = useState<Note | null>(null)

    const deleteNote = async (errorCallback: (e?: unknown) => void) => {
        try {
            if (currentNote) await db.note.delete(currentNote.id)
            setCurrentNote(null)
        } catch (e) {
            errorCallback?.(e)
        }
    }
    
    const value = {
        currentNote,
        setCurrentNote,
        deleteNote,
    }

    return (
        <CurrentNoteContext.Provider value={value}>
            {children}
        </CurrentNoteContext.Provider>
    )
}

export {
    CurrentNoteProvider,
    useCurrentNote,
}