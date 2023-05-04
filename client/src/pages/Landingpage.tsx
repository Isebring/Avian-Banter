import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Input,
  MediaQuery,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconCircleCheck, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
// import socket from '../socket';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function LandingPage() {
  const { socket } = useSocket();
  const [username, setUsername] = useState('');

  function StoreUsername() {
    if (username) {
      socket.emit('storeUsername', username, (success: boolean) => {
        if (success) {
          console.log('Username stored successfully');
        } else {
          console.error('Error storing the username');
        }
      });
    }
  }

  useEffect(() => {
    socket.on('message', (msg: string) => {
      console.log(`Message from server: ${msg}`);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  return (
    <Container fluid>
      <Flex align="center" justify="space-between">
        <Box sx={{ flex: 1, marginLeft: 'auto' }}>
          <Title pl="lg">
            AvianBanter is a Chat Application built for everyone with a beak
          </Title>
          <Text pl="lg" size="lg" color="gray">
            Here you can create or join chat rooms. You can also send private
            messages.
          </Text>
          <Stack mt="md" align="center" spacing="xs">
            <Avatar size="lg" radius="xl"></Avatar>
            <Text>Choose an avatar</Text>
            <Input
              mt="md"
              icon={<IconUser size="1rem" />}
              placeholder="Your username..."
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              rightSection={
                <Tooltip
                  label="Username available"
                  position="top-end"
                  withArrow
                >
                  <div>
                    <IconCircleCheck
                      size="1rem"
                      style={{ display: 'block', opacity: 0.5 }}
                    />
                  </div>
                </Tooltip>
              }
            />
          </Stack>
          <Group spacing="sm" position="center" mt="xl">
            <Link to="/createroom">
              <Button variant="filled" onClick={StoreUsername}>
                Create a room
              </Button>
            </Link>
            <Link to="/joinroom">
              <Button variant="outline" onClick={StoreUsername}>
                Join a room
              </Button>
            </Link>
          </Group>
        </Box>
        <MediaQuery query="(max-width: 800px)" styles={{ display: 'none' }}>
          <Box sx={{ flex: 1, marginLeft: 'auto' }}>
            <img
              src="/avian-phone.png"
              alt="Bird browsing a smartphone"
              style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
            />
          </Box>
        </MediaQuery>
      </Flex>
    </Container>
  );
}

export default LandingPage;
