import { NoteItem } from '../../components/NoteItem'
import { useNote } from '../../context/NoteProvider'
import './style.css'

const Sidebar = () => {
    const noteState = useNote()

    return (
        <div className="sidebar">
            {noteState?.notes?.map(note => <NoteItem note={note} key={note.id} />)}
        </div>
    )
}

export {
    Sidebar
}