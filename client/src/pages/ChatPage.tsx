import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Input,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { IconMoodHappy } from '@tabler/icons-react';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';
import { useSocket } from '../context/SocketContext';
import { useUsername } from '../context/UsernameContext';

function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { sendMessage, messages, fetchMessageHistory } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const { username } = useUsername();
  const sender = username || 'Anonymous';

  useEffect(() => {
    if (room) {
      fetchMessageHistory(room);
    }
  }, [room, fetchMessageHistory]);

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
      <Container>
        <Title>Welcome to room {room}</Title>
        {messages.map((message, index) => (
          <Message
            key={index}
            message={{ text: message, sender: message }}
            sender={sender}
          />
        ))}
        <form onSubmit={handleInput}>
          <Paper mt="xl" mb="lg" shadow="md">
            <Text size="xs" ml="lg" pt="xs" pb="xs">
              {username}
            </Text>
            <Box sx={{ position: 'relative' }}>
              <Input
                ml="lg"
                mr="lg"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.currentTarget.value)}
                placeholder="Type a message..."
              />
              <Button
                variant="hidden"
                onClick={() => setShowPicker(!showPicker)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 5,
                  width: 'auto',
                }}
              >
                <IconMoodHappy stroke={0.7} />
              </Button>
            </Box>
            <Group
              sx={{
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              {showPicker ? (
                <EmojiPicker emojiStyle="native" onEmojiClick={onEmojiClick} />
              ) : null}
              <Button
                mt="xs"
                mb="xs"
                size="xs"
                type="submit"
                style={{ marginRight: '1.2rem' }}
              >
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
