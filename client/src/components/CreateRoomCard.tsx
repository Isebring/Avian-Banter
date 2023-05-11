import { Box, Button, Input } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function CreateRoomCard() {
  const { createRoom } = useSocket();
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (title) {
      createRoom(title);
      navigate(`/room/${title}`);
    }
  };

  return (
    <Box
      m="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'spaceBetween',
      }}
    >
      <Input
        miw="18rem"
        mb="sm"
        placeholder="Enter title of your room..."
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      ></Input>
      <Button
        miw="18rem"
        leftIcon={<IconMessageChatbot />}
        onClick={handleCreateRoom}
      >
        Create Room
      </Button>
    </Box>
  );
}

export default CreateRoomCard;
