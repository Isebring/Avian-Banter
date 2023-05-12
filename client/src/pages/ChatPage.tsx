import {
  Box,
  Button,
  Container,
  Group,
  Input,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { IconMoodHappy } from '@tabler/icons-react';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../../server/communication';
import Message from '../components/Message';
import { socket, useSocket } from '../context/SocketContext';
import { useUsername } from '../context/UsernameContext';

function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { sendMessage, messages, fetchMessageHistory, leave } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const { username } = useUsername();
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (room) {
      fetchMessageHistory(room);
    }
  }, [room, fetchMessageHistory]);

  useEffect(() => {
    const handleTyping = (isTyping: boolean, user: User) => {
      console.log('HElllooooo');
      if (isTyping) {
        setTypingUsers((users) => [...users, user]);
      } else {
        setTypingUsers((users) =>
          users.filter((u) => u.userID !== user.userID)
        );
      }
    };
    console.log('Setup typing..');
    socket.on('typing', handleTyping);
    return () => {
      socket.off('typing', handleTyping);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && room) {
      sendMessage({ username: username, text: inputMessage }, room);
      setInputMessage('');
    }
  };

  const handleLeaveRoom = () => {
    if (room) {
      leave(room);
      navigate('/joinroom');
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
      socket.emit('typing', true, room!);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (userIsTyping) {
        setUserIsTyping(false);
        socket.emit('typing', false, room!);
      }
    }, 2000);
  };

  const onEmojiClick = (emojiObject: any) => {
    setInputMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const roomDigits = room!.replace(/\D/g, '');
  const hasMoreThanSixDigits = roomDigits.length > 6;

  return (
    <Container size="sm">
      <Title order={2} align="center" mt="lg" mb="xl">
        {hasMoreThanSixDigits
          ? 'Welcome to the direct message room'
          : 'Welcome to room' + ' ' + room}
      </Title>
      <Box
        sx={{
          maxHeight: '500px',
          overflowY: 'scroll',
          pb: '90px', // Height of the form
        }}
      >
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ height: '0.5rem' }}>
        {typingUsers.length > 0 && (
          <Text size="sm">
            {typingUsers.length > 1
              ? typingUsers.map((user) => user.username).join(', ') +
                ' are typing...'
              : typingUsers[0].username + ' is typing...'}
          </Text>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <form style={{ width: '20rem' }} onSubmit={handleSubmit}>
          <Paper mt="xl" mb="lg" shadow="md">
            <Text size="xs" ml="lg" pt="xs" pb="xs">
              {username}
            </Text>

            <Input
              ml="lg"
              mr="lg"
              value={inputMessage}
              onChange={onInputChange}
              placeholder="Type a message..."
            />
            <Group
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant="hidden"
                onClick={() => setShowPicker(!showPicker)}
              >
                <IconMoodHappy stroke={0.7} />
              </Button>
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
      </Box>
      <Button
        mt="xs"
        mb="xs"
        size="xs"
        type="submit"
        style={{ marginRight: '1.2rem' }}
        onClick={handleLeaveRoom}
      >
        Leave Room
      </Button>
    </Container>
  );
}

export default ChatPage;
