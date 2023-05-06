import { Box, Button, Input, Text, Textarea } from '@mantine/core';
import { IconMessageChatbot } from '@tabler/icons-react';

function CreateRoomCard() {
  return (
    <Box
      m="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'spaceBetween',
      }}
    >
      <Text my="md">Title</Text>
      <Input miw="18rem" placeholder="Enter title of your room..."></Input>
      <Text my="md">Invite others</Text>
      <Textarea
        miw="18rem"
        my="md"
        placeholder="Invite a fellow bird to a private room"
      ></Textarea>
      <Button miw="18rem" leftIcon={<IconMessageChatbot />}>
        Create Room
      </Button>
    </Box>
  );
}

export default CreateRoomCard;
