interface Props {
  children: React.ReactNode;
}
export default function NotesList({ children }: Props) {
  return <ul className='notes-list'>{children}</ul>;
}
