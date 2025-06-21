import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Note } from '../../model/db'
import { NoteItem } from '../../components/NoteItem'
import './style.css'

interface Sidebar {
    userId : string
}

const Sidebar = ({ userId }: Sidebar) => {
    
    const notes = useLiveQuery(
        async () => {
        let notes = [] as Note[]
        if (userId) notes = await db.note.where({ userId: Number(userId) }).toArray()
        return notes
        }, []
    )

    return (
        <div className="sidebar">
            {notes?.map(note => <NoteItem note={note} />)}
        </div>
    )
}

export {
    Sidebar
}