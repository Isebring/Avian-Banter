import { Box, Button, Input } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      socket.emit('sendMessage', inputMessage, room);
      setInputMessage('');
    }
  };

  return (
    <div>
      <h1>Welcome to room {room}</h1>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      <form onSubmit={sendMessage}>
        <Box display="flex">
          <Input
            value={inputMessage}
            onChange={(event) => setInputMessage(event.currentTarget.value)}
            placeholder="Type a message..."
          />
          <Button type="submit">Send</Button>
        </Box>
      </form>
    </div>
  );
}

export default ChatPage;
