import Dexie, { type EntityTable } from 'dexie'

interface Note {
  id: number
  title: string
  content: string
  userId: number
}

interface User {
    id: number
    name: string
    email: string
    password: string
}

const db = new Dexie('NotesDatabase') as Dexie & {
  note: EntityTable<Note,'id'> // primary key "id" (for the typings only)
  user: EntityTable<User,'id'>
}

// Schema declaration:
db.version(1).stores({
  note: '++id, userId, title, content', // primary key "id" (for the runtime!)
  user: '++id, name, email, password'
})

export type { Note, User }
export { db }