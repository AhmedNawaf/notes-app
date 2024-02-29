interface Props {
  children: React.ReactNode;
}

export default function Preview({ children }: Props) {
  return <div className='preview-section'>{children}</div>;
}
