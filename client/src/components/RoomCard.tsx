import { Button, Card, Text, Title } from '@mantine/core';

function RoomCard() {
  return (
    <Card
      shadow="sm"
      radius="md"
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
      <Title align="center">RoomName</Title>
      <Text m="md">Users</Text>
      <Button>Join</Button>
    </Card>
  );
}

export default RoomCard;
