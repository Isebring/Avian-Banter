import { Button, Card, Text, Title } from '@mantine/core';

function RoomCard() {
  return (
    <Card shadow="sm" radius="md" padding="lg" withBorder>
      <Title>RoomName</Title>
      <Text>Users</Text>
      <Button>Join</Button>
    </Card>
  );
}

export default RoomCard;
