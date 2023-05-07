import { Box, Button, Input } from '@mantine/core';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { sendMessage, messages } = useSocket();
  const [inputMessage, setInputMessage] = useState('');

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && room) {
      sendMessage(room, inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div>
      <h1>Welcome to room {room}</h1>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      <form onSubmit={handleInput}>
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
