import * as React from "react";
import classes from "./Note.module.css";

export interface NoteProps {
  id: number;
  position: {
    x: number;
    y: number;
  };
  content: string;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

// Wrap the Note component with React.forwardRef to handle the ref parameter
const Note = React.forwardRef<HTMLDivElement, NoteProps>(
  (props: NoteProps, ref: React.Ref<HTMLDivElement>) => {
    const { position, content, onMouseDown } = props;

    return (
      <div
        ref={ref} // Pass the ref to the div element
        className={classes.note}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={onMouseDown}
      >
        📌 {content}
      </div>
    );
  }
);

export default Note;
