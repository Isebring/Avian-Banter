import { Button, Card, Text, Title } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

interface RoomCardProps {
  roomName: string;
}

function RoomCard({ roomName }: RoomCardProps) {
  const navigate = useNavigate();
  const { join, leave } = useSocket();

  const handleJoin = () => {
    join(roomName);
    navigate(`/room/${roomName}`);
  };

  const handleLeave = () => {
    leave(roomName);
  };

  useEffect(() => {
    return handleLeave;
  }, [roomName]);

  return (
    <Card
      shadow="sm"
      radius="lg"
      padding="lg"
      m="md"
      withBorder
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'spaceBetween',
      }}
    >
      <Title align="center" order={3}>
        {roomName}
      </Title>
      <Text m="md">Users</Text>
      <Button leftIcon={<IconMessageChatbot />} onClick={handleJoin}>
        Join Room
      </Button>
    </Card>
  );
}

export default RoomCard;
