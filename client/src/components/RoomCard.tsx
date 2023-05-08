import { Button, Card, Text, Title } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

interface RoomCardProps {
  roomName: string;
}

function RoomCard({ roomName }: RoomCardProps) {
  const navigate = useNavigate();
  const { joinRoom } = useSocket();

  const handleJoinRoom = () => {
    joinRoom(roomName);
    navigate(`/room/${roomName}`);
  };

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
      <Button leftIcon={<IconMessageChatbot />} onClick={handleJoinRoom}>
        Join Room
      </Button>
    </Card>
  );
}

export default RoomCard;
