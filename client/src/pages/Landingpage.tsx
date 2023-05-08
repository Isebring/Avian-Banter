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
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function LandingPage() {
  const { storeUsername } = useSocket();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  function handleUsernameChange(event: any) {
    setUsername(event.currentTarget.value);
    localStorage.setItem('username', event.currentTarget.value);
  }

  return (
    <Container fluid>
      <Flex align="center" justify="space-between">
        <Box sx={{ flex: 1 }}>
          <Title pl="lg">
            Avian Banter is a Chat Application built for everyone with a beak
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
              onChange={handleUsernameChange}
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
            <Link to={`/createroom?username=${username}`}>
              <Button variant="filled" onClick={() => storeUsername(username)}>
                Create a room
              </Button>
            </Link>
            <Link to={`/joinroom?username=${username}`}>
              <Button variant="outline" onClick={() => storeUsername(username)}>
                Join a room
              </Button>
            </Link>
          </Group>
        </Box>
        <MediaQuery query="(max-width: 800px)" styles={{ display: 'none' }}>
          <Box sx={{ flex: 1 }}>
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
