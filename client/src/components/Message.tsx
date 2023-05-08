import { Card, Text } from '@mantine/core';

function Message({ message }: { message: string }) {
  return (
    <Card shadow="sm" withBorder>
      <Text>{message}</Text>
    </Card>
  );
}

export default Message;
