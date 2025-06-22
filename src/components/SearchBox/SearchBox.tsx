import { useEffect } from 'react'
import { useNote } from '../../context/NoteProvider'
import { TextInput } from '../../ui'
import { useHandleChange } from '../../hooks/useHandleChange'
import { useDebounce } from '../../hooks/useDebounce'

const SearchBox = () => {
    const noteState = useNote()
    const {values, handleChange} = useHandleChange<{search: string}>({search: ''})
    const debuncedValue = useDebounce<string>(values.search, 500)

    useEffect(() => {
        if (debuncedValue) {
            noteState?.filterNotes((note) => note.title.match(debuncedValue) || note.content.match(debuncedValue))
        } else {
            noteState?.filterNotes(() => false)
        }
    }, [debuncedValue])

    const handleFocus = () => {
        if(values.search) noteState?.filterNotes((note) => note.title.match(values.search) || note.content.match(values.search))
    }


    return (
        <form>
          <TextInput
                name='search'
                label='Найти'
                onChange={handleChange}
                value={values.search}
                onFocus={handleFocus}
            />  
        </form>
    )
}

export {
    SearchBox
}