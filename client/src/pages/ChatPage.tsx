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
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';
import { socket, useSocket } from '../context/SocketContext';
import { useUsername } from '../context/UsernameContext';

function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { sendMessage, messages, fetchMessageHistory } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const { username } = useUsername();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (room) {
      fetchMessageHistory(room);
    }
  }, [room, fetchMessageHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && room) {
      sendMessage({ username: username, text: inputMessage }, room);
      setInputMessage('');
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
    if (event.target.value.trim() !== '') {
      socket.emit('typing', true, room);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        console.log(typingUsers);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', false, room);
      }, 2000);
      // Add the current user to typingUsers
      if (!typingUsers.includes(username)) {
        setTypingUsers((users) => [...users, username]);
      }
    } else {
      // Remove the current user from typingUsers
      setTypingUsers((users) => users.filter((user) => user !== username));
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
          <Message key={index} message={message} />
        ))}
        {typingUsers.length > 0 && (
          <Text>
            {typingUsers.length > 1
              ? typingUsers.join(', ') + ' are typing...'
              : typingUsers[0] + ' is typing...'}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <Paper mt="xl" mb="lg" shadow="md">
            <Text size="xs" ml="lg" pt="xs" pb="xs">
              {username}
            </Text>
            <Box sx={{ position: 'relative' }}>
              <Input
                ml="lg"
                mr="lg"
                value={inputMessage}
                onChange={onInputChange}
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
