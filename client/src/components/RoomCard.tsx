import { Button, Card, Text, Title } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';

interface RoomCardProps {
  roomName: string;
}

function RoomCard({ roomName }: RoomCardProps) {
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
      <Button leftIcon={<IconMessageChatbot />}>Join Room</Button>
    </Card>
  );
}

export default RoomCard;
