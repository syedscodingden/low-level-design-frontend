import { useState } from 'react'
import './App.css'
import Notes from './components/Notes.js';
import { NoteType } from './types/noteTypes.js'

function App() {

  const [notes, setNotes] = useState<NoteType[]>([
    {
      id: 0,
      position: {
        x: 0,
        y: 0
      },
      text: "Test note 1",
    },
    {
      id: 1,
      position: {
        x: 0,
        y: 0
      },
      text: "Do problem solving",
    }
  ]);

  return (
    <>
      <Notes notes={notes} setNotes={setNotes} />
    </>
  )
}

export default App
