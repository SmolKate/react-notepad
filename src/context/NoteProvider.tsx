import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Note } from '../model/db'
import { useAuth } from './AuthProvider'

interface CurrentNote  {
    notes?: Note[]
    currentNote: Note | null
    setCurrentNote: Dispatch<SetStateAction<Note | null>>
    deleteNote: (errorCallback: VoidFunction) => void
    filterNotes: (filterCondition: (note: Note) => void) => void
    filterredNotes: Note[] | null
    resetFilter: VoidFunction
}

const NoteContext = createContext<CurrentNote | null>(null)

const useNote = () => {
    return useContext(NoteContext)
}

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentNote, setCurrentNote] = useState<Note | null>(null)
    const [filterredNotes, setFilterredNotes] = useState<Note[] | null>([])
    const auth = useAuth()
    const userId = auth?.userId as string

    const notes = useLiveQuery(
        async () => {
        let notes = [] as Note[]
        if (userId) notes = await db.note.where({ userId: Number(userId) }).toArray()
        return notes
        }, []
    )

    const deleteNote = async (errorCallback: (e?: unknown) => void) => {
        try {
            if (currentNote) await db.note.delete(currentNote.id)
            setCurrentNote(null)
        } catch (e) {
            errorCallback?.(e)
        }
    }

    const filterNotes = (filterCondition: (note: Note) => void) => {
        const result = notes?.filter((filterCondition))
        if (result) setFilterredNotes(result)
    }

    const resetFilter = () => {
        setFilterredNotes(null)
    }
    
    const value = {
        notes,
        currentNote,
        setCurrentNote,
        deleteNote,
        filterNotes,
        filterredNotes,
        resetFilter,
    }

    return (
        <NoteContext.Provider value={value}>
            {children}
        </NoteContext.Provider>
    )
}

export {
    NoteProvider,
    useNote,
}