interface Props {
  messages: string[];
}

export default function Alert({ messages }: Props) {
  return (
    <div className='alert-container'>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
