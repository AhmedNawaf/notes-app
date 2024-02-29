interface Props {
  title: string;
}

export default function Message({ title }: Props) {
  return <h2 className='center'>{title}</h2>;
}
