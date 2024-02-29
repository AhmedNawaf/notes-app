interface Props {
  children: React.ReactNode;
}
export default function Notes({ children }: Props) {
  return <div className='notes-section'>{children}</div>;
}
