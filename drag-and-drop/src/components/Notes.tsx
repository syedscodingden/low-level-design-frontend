import * as React from "react";
import { NoteType } from "../types/noteTypes.js";
import Note from "./Note.js";

export interface NotesProps {
  notes: NoteType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
}

const Notes: React.FC<NotesProps> = ({ notes, setNotes }) => {
  const determineNewPosition = () => {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  React.useEffect(() => {
    const jsonData = localStorage.getItem("notes");
    const savedNotes: NoteType[] =
      jsonData !== null ? JSON.parse(jsonData) : [];

    const updatedNotes = notes.map((note: NoteType) => {
      const savedNote = savedNotes.find((n) => n.id === note.id);
      if (savedNote) {
        return { ...note, position: savedNote.position };
      } else {
        const position = determineNewPosition();
        return { ...(note as NoteType), position };
      }
    });

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    console.log(updatedNotes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes.length]);

  // const noteRefs = React.useRef<React.RefObject<NoteType>[]>([]);
  const noteRefs = React.useRef<Array<React.RefObject<HTMLDivElement>>>([]);

  const handleDragStart = (
    note: NoteType,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const { id } = note;
    const noteRef = noteRefs.current[id];
    // Check if noteRef is not null and noteRef.current is not null
    if (noteRef && noteRef.current) {
      // Access the getBoundingClientRect() method on the current DOM element
      const rect = noteRef.current.getBoundingClientRect();

      //event.clientX (also known as e.clientX) is a property of a MouseEvent that returns the horizontal coordinate of the mouse cursor relative to the viewport
      //(the browser window). This property is useful when you want to determine the x-coordinate of where a mouse event (such as a click, drag, or move) occurred in the viewport.

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      console.log("Mouse down event at offsetX:", offsetX);
      console.log("Mouse down event at offsetY:", offsetY);
      console.log("Bounding Client Rect:", rect);
      console.log("MousePos", event.clientX);

      const startPos = note;

      const handleMouseMove = (e: MouseEvent) => {
        if (noteRef.current !== null) {
          const newX = e.clientX - offsetX;
          const newY = e.clientY - offsetY;

          noteRef.current.style.left = `${newX}px`;
          noteRef.current.style.top = `${newY}px`;
        }
      };
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (noteRef.current !== null) {
          const finalRect = noteRef.current.getBoundingClientRect();
          const newPosition = { x: finalRect.left, y: finalRect.top };

          // eslint-disable-next-line no-constant-condition
          if (checkForOverlap(note.id)) {
            // check for overlap
            noteRef.current.style.left = `${startPos.position.x}px`;
            noteRef.current.style.top = `${startPos.position.y}px`;
          } else {
            updateNotePosition(id, newPosition);
          }
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      console.log("Ref is not attached to a DOM element");
    }
  };

  const checkForOverlap = (id: number) => {
    const currentRef = noteRefs.current[id].current;
    const currentRect = currentRef?.getBoundingClientRect();

    return notes.some((note) => {
      if (note.id === id) return false;

      const otherRef = noteRefs.current[note.id].current;
      const otherRect = otherRef?.getBoundingClientRect();

      let overlap = false;

      if (currentRect && otherRect) {
        overlap = !(
          currentRect?.left > otherRect?.right ||
          currentRect?.right < otherRect?.left ||
          currentRect?.bottom < otherRect?.top ||
          currentRect?.top > otherRect.bottom
        );
      }
      return overlap;
    });
  };

  const updateNotePosition = (
    id: number,
    newPosition: { x: number; y: number }
  ) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, position: newPosition } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div>
      {notes.map((note: NoteType) => {
        if (!noteRefs.current[note.id]) {
          noteRefs.current[note.id] = React.createRef<HTMLDivElement>();
        }

        return (
          <Note
            key={note.id}
            ref={noteRefs.current[note.id]}
            id={note.id}
            position={note.position}
            content={note.text}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
              handleDragStart(note, event);
            }}
          />
        );
      })}
    </div>
  );
};

export default Notes;
