import { Container, Title } from '@mantine/core';
import RoomCard from '../components/RoomCard';

function JoinRoom() {
  return (
    <Container>
      <Title>Active Rooms:</Title>
      <RoomCard />
    </Container>
  );
}

export default JoinRoom;
