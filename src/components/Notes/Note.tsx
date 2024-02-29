interface Props {
  title: string;
  noteClicked: () => void;
  active: boolean;
}

const Note = ({ title, noteClicked, active }: Props) => {
  const classes = ['note-item'];
  if (active) {
    classes.push('active');
  }
  return (
    <li
      className={classes.join(' ')}
      onClick={noteClicked}
    >
      {title}
    </li>
  );
};

export default Note;
