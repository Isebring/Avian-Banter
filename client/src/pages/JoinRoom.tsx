import { Container, SimpleGrid, Title } from '@mantine/core';
import RoomCard from '../components/RoomCard';
import { useSocket } from '../context/SocketContext';

function JoinRoom() {
  const { rooms } = useSocket();

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
