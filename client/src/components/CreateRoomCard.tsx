import { Box, Button, Input, Text, Textarea } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function CreateRoomCard() {
  const { socket } = useSocket();
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const CreateRoom = () => {
    if (title) {
      socket.emit('createRoom', title);
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
      <Text my="md">Title</Text>
      <Input
        miw="18rem"
        placeholder="Enter title of your room..."
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      ></Input>
      <Text my="md">Invite others</Text>
      <Textarea
        miw="18rem"
        my="md"
        placeholder="Invite a fellow bird to a private room"
      ></Textarea>
      <Button
        miw="18rem"
        leftIcon={<IconMessageChatbot />}
        onClick={CreateRoom}
      >
        Create Room
      </Button>
    </Box>
  );
}

export default CreateRoomCard;
