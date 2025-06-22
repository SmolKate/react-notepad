import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { Button } from '../../ui'
import { useCurrentNote } from '../../context/CurrentNoteProvider'
import './style.css'

interface ItemDeletePopup {
    errorCallback: VoidFunction
    openDeletePopup: boolean
    setOpenDeletePopup: (value: boolean) => void
}

const ItemDeletePopup = ({ errorCallback, openDeletePopup, setOpenDeletePopup }: ItemDeletePopup) => {
    const contextCurrentNote = useCurrentNote()

    const handleItemDelete = async () => {
        contextCurrentNote?.deleteNote(errorCallback)
        setOpenDeletePopup(false)
    }
    

    return (
        <Dialog onClose={() => setOpenDeletePopup(false)} open={openDeletePopup}>
            <DialogTitle>{'Удалить заметку?'}</DialogTitle>
            <div className="delete-popup-btns">
                <Button onClick={handleItemDelete}>Да</Button>
                <Button onClick={() => setOpenDeletePopup(false)}>Нет</Button>
            </div>
        </Dialog>
    )
}

export {
    ItemDeletePopup,
}