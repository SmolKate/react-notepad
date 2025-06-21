import classNames from 'classnames'
import removeMd from 'remove-markdown'
import { type Note } from '../../model/db'
import { useCurrentNote } from '../../context/CurrentNoteProvider'
import './style.css'
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
    const plainText = removeMd(content)
    
    return (
    <div key={id} className={classNames('note-item', { 'note-item-active': isActive})} onClick={handleClick}>
        <div className="item-title"><strong>{title}</strong></div>
        <div className="item-content">{plainText}</div>
    </div>
)}

export {
    NoteItem
}