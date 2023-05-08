import {
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Textarea,
  Title,
} from '@mantine/core';
import { IconMoodHappy } from '@tabler/icons-react';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';
import { useSocket } from '../context/SocketContext';

function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { sendMessage, messages } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && room) {
      sendMessage(room, inputMessage);
      setInputMessage('');
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setInputMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  return (
    <Flex justify="center" align="center">
      <Container size="xl">
        <Title>Welcome to room {room}</Title>
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <form onSubmit={handleInput}>
          <Paper shadow="md">
            <Textarea
              value={inputMessage}
              onChange={(event) => setInputMessage(event.currentTarget.value)}
              placeholder="Type a message..."
            />
            <Group sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="hidden"
                onClick={() => setShowPicker(!showPicker)}
                style={{ marginLeft: '0.1rem' }}
              >
                <IconMoodHappy stroke={0.7} />
              </Button>
              {showPicker ? (
                <EmojiPicker emojiStyle="native" onEmojiClick={onEmojiClick} />
              ) : null}
              <Button size="xs" type="submit" style={{ marginRight: '0.5rem' }}>
                Send
              </Button>
            </Group>
          </Paper>
        </form>
      </Container>
    </Flex>
  );
}

export default ChatPage;
