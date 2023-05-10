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
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [userIdToUsername, setUserIdToUsername] = useState<{
    [key: string]: string;
  }>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (room) {
      fetchMessageHistory(room);
    }
  }, [room, fetchMessageHistory]);

  useEffect(() => {
    if (socket) {
      socket.on('userTyping', (userId, isTyping, username) => {
        if (userId !== socket.id) {
          if (isTyping) {
            setTypingUsers((users) => {
              const newUserList = [...users, userId];
              setUserIdToUsername((prevMapping) => ({
                ...prevMapping,
                [userId]: username,
              }));
              return newUserList;
            });
          } else {
            setTypingUsers((users) => users.filter((user) => user !== userId));
          }
        }
      });

      return () => {
        socket.off('userTyping');
      };
    }
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && room) {
      sendMessage({ username: username, text: inputMessage }, room);
      setInputMessage('');
    }
  };
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
    const isTyping = event.target.value.trim() !== '';

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping && !userIsTyping) {
      setUserIsTyping(true);
      socket.emit('typing', true, room, username);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (userIsTyping) {
        setUserIsTyping(false);
        socket.emit('typing', false, room, username);
      }
    }, 2000);
  };
  const onEmojiClick = (emojiObject: any) => {
    setInputMessage((prevInput) => prevInput + emojiObject.emoji);
  };
  useEffect(() => {
    if (socket && userIsTyping !== typingUsers.includes(socket.id)) {
      socket.emit('typing', userIsTyping, room, username); // <- Pass "username" as the third parameter
    }
  }, [socket, userIsTyping, room, typingUsers, username]); // <- Add "username" as a dependency

  useEffect(() => {
    if (socket && username) {
      setUserIdToUsername((prevMapping) => ({
        ...prevMapping,
        [socket.id]: username,
      }));
    }
  }, [socket, username]);

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
              ? typingUsers
                  .map((id) =>
                    id === socket.id ? username : userIdToUsername[id]
                  )
                  .join(', ') + ' are typing...'
              : (typingUsers[0] === socket.id
                  ? username
                  : userIdToUsername[typingUsers[0]]) + ' is typing...'}
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
