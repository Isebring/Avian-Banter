import { Container, SimpleGrid, Title } from '@mantine/core';
import RoomCard from '../components/RoomCard';

function JoinRoom() {
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
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
      </SimpleGrid>
    </Container>
  );
}

export default JoinRoom;
