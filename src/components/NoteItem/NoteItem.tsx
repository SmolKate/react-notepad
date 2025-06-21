import { type Note } from '../../model/db'
import './style.css'
import classNames from 'classnames'
import { useCurrentNote } from '../../context/CurrentNoteProvider'

interface NoteItem {
    note: Note
}

const NoteItem = ({ note }: NoteItem) => {
    const currentNote = useCurrentNote()
    const { id, title, content } = note

    const handleClick = () => {
        if (currentNote) currentNote.setCurrentNote(note)
    }

    const isActive = id === currentNote?.currentNote?.id
    
    return (
    <div key={id} className={classNames('note-item', { 'note-item-active': isActive})} onClick={handleClick}>
        <div className="item-title"><strong>{title}</strong></div>
        <div className="item-content">{content}</div>
    </div>
)}

export {
    NoteItem
}