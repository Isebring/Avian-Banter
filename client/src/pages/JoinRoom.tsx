import { Button, Container, SimpleGrid, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { useSocket } from '../context/SocketContext';

function JoinRoom() {
  const { rooms } = useSocket();
  const navigate = useNavigate();

  if (rooms.length === 0) {
    return (
      <Container>
        <Title align="center" mb="xl" order={2}>
          No Active Rooms
        </Title>
        <SimpleGrid>
          <p>
            There are currently no active rooms. Would you like to create one?
          </p>
          <Button onClick={() => navigate('/createroom')}>Create Room</Button>
        </SimpleGrid>
      </Container>
    );
  }

  return (
    <Container>
      <Title align="center" mb="xl" order={2}>
        Current Active Rooms
      </Title>
      <SimpleGrid
        cols={2}
        spacing="lg"
        verticalSpacing="xl"
        breakpoints={[
          { maxWidth: '90rem', cols: 2 },
          { maxWidth: '50rem', cols: 1 },
        ]}
      >
        {rooms.map((room) => (
          <RoomCard key={room} roomName={room} />
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default JoinRoom;
