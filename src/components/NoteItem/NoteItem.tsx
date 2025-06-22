import classNames from 'classnames'
import removeMd from 'remove-markdown'
import { type Note } from '../../model/db'
import { useNote } from '../../context/NoteProvider'
import './style.css'
interface NoteItem {
    note: Note
    isWorkspace?: boolean
}

const NoteItem = ({ note, isWorkspace }: NoteItem) => {
    const noteState = useNote()
    const { id, title, content } = note

    const handleClick = () => {
        if (noteState) {
            noteState.setCurrentNote(note)
            noteState.resetFilter()
        }
    }

    const isActive = id === noteState?.currentNote?.id
    const plainText = removeMd(content)
    
    return (
    <div className={classNames('note-item', { 'note-item-active': isActive}, { 'note-item-workspace': isWorkspace })} onClick={handleClick}>
        <div className="item-title"><strong>{title}</strong></div>
        <div className="item-content">{plainText}</div>
    </div>
)}

export {
    NoteItem
}