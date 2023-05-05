import { Button, Card, Text, Title } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';

function RoomCard() {
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
        RoomName
      </Title>
      <Text m="md">Users</Text>
      <Button leftIcon={<IconMessageChatbot />}>Join Room</Button>
    </Card>
  );
}

export default RoomCard;
