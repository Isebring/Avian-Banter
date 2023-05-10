import { Box, Card, Text } from '@mantine/core';
import { Message } from '../../../server/communication';
import { useUsername } from '../context/UsernameContext';
interface MessageProps {
  message: Message;
}

function Message({ message }: MessageProps) {
  const { username } = useUsername();
  const isSentByCurrentUser = message.username === username;
  const backgroundColor = isSentByCurrentUser ? '#F3F3F3' : '#00AEEF';
  const color = isSentByCurrentUser ? '#000' : '#FFF';
  const justifyContent = isSentByCurrentUser ? 'flex-end' : 'flex-start';

  return (
    <Box sx={{ display: 'flex', justifyContent }}>
      <Card
        shadow="sm"
        withBorder
        style={{
          backgroundColor,
          color,
          borderRadius: '1rem',
          padding: '0.5rem 1rem',
          marginBottom: '0.5rem',
          maxWidth: '18rem',
        }}
      >
        <Text>
          {message.username}: {message.text}
        </Text>
      </Card>
    </Box>
  );
}

export default Message;
