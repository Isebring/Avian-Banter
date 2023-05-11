import { Container, Title } from '@mantine/core';
import CreateRoomCard from '../components/CreateRoomCard';

function CreateRoom() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Title align="center" mt="lg" order={2}>
        Create a room
      </Title>
      <CreateRoomCard />
      <img
        src="/avian-createroom.png"
        alt="Bird browsing a smartphone"
        width={300}
      />
    </Container>
  );
}

export default CreateRoom;
