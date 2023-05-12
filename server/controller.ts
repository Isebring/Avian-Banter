export const storeUsername = (socket: any) => async (username: string) => {
  socket.data.username = username;

  console.log(`Username stored: ${username}`);
};
