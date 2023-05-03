import { Box, Flex, Text, Title } from '@mantine/core';

function LandingPage() {
  return (
    <Flex align="center" justify="space-between">
      <Box sx={{ flex: 1 }}>
        <Title pl="lg">
          AvianBanter is a Chat Application built for everyone with a beak
        </Title>
        <Text pl="lg" size="lg" color="gray">
          Here you can create or join chat rooms. You can also send private
          messages.
        </Text>
      </Box>
      <Box sx={{ flex: 1, marginLeft: 'auto' }}>
        <img
          src="/avian-landingpage.png"
          alt="Birds chatting with each other"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Flex>
  );
}

export default LandingPage;
