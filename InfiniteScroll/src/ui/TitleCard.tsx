// import { ForwardedRef } from "react";
// import classes from "./TitleCard.module.css";

// interface TitleCardProps {
//   bookName: string;
//   ref: ForwardedRef<HTMLDivElement>;
// }
// const TitleCard = ({ bookName, ref }: TitleCardProps) => {
//   return (
//     <div className={classes.bookNameCard} ref={ref}>
//       {bookName}
//     </div>
//   );
// };

// export default TitleCard;

import { ForwardedRef, forwardRef } from "react";
import classes from "./TitleCard.module.css";

interface TitleCardProps {
  bookName: string;
  forwardedRef: ForwardedRef<HTMLDivElement> | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TitleCard = forwardRef<HTMLDivElement, TitleCardProps>((props, _ref) => {
  return (
    <div className={classes.bookNameCard} ref={props.forwardedRef}>
      {props.bookName}
    </div>
  );
});

export default TitleCard;
