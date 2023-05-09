import { Card, Text } from '@mantine/core';

interface MessageProps {
  message: { text: string; sender: string };
  sender: string;
}

function Message({ message, sender }: MessageProps) {
  const isSentByCurrentUser = message.sender === sender;
  //  console.log(`isSentByCurrentUser: ${isSentByCurrentUser}`);
  const backgroundColor = isSentByCurrentUser ? '#F3F3F3' : '#00AEEF';
  const color = isSentByCurrentUser ? '#000' : '#FFF';
  const alignSelf = isSentByCurrentUser ? 'flex-end' : 'flex-start';

  return (
    <Card
      shadow="sm"
      withBorder
      style={{
        display: 'flex',
        alignSelf,
        backgroundColor,
        color,
        borderRadius: '1rem',
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        maxWidth: '16rem',
      }}
    >
      <Text>{message.text}</Text>
    </Card>
  );
}


export default Message;
