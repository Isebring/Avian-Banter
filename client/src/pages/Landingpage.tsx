import {
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Input,
  MediaQuery,
  Stack,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { IconCircleCheck, IconUser } from '@tabler/icons-react';

function LandingPage() {
  return (
    <Flex align="center" justify="space-between">
      <Box  sx={{ flex: 1, marginLeft: 'auto' }}>
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
            rightSection={
              <Tooltip label="Username available" position="top-end" withArrow>
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
        <Group spacing="sm" position='center' mt="xl">
          <Button variant="filled">Create a room</Button>
          <Button variant="outline">Join a room</Button>
        </Group>
      </Box>
       <MediaQuery
      query="(max-width: 700px)"
      styles={{ display: 'none' }}
    >
      <Box sx={{ flex: 1, marginLeft: 'auto' }}>
        <img
          src="/avian-phone.png"
          alt="Bird browsing a smartphone"
          style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
        />
      </Box>
      </MediaQuery> 
    </Flex>
  );
}

export default LandingPage;
