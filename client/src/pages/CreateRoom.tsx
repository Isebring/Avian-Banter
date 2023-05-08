// CreateRoom.js
import { Container, Title } from '@mantine/core';
import CreateRoomCard from '../components/CreateRoomCard';

function CreateRoom() {
  return (
    <Container
      sx={{
        display: 'flex',
        height: 'calc(100vh - 65px)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Title align="center" order={2}>
        Create a room
      </Title>
      <CreateRoomCard />
    </Container>
  );
}

export default CreateRoom;
