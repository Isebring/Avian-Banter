export interface ServerToClientEvents {
  systemMessage: (message: string) => void;
  message: (message: Message) => void;
  rooms: (rooms: string[]) => void;
  messageHistory: (messages: Message[]) => void;
  session: (user: SocketData) => void;
  typing: (isTyping: boolean, user: User) => void;
  users: (users: SocketData[]) => void;
  roomCreated: (room: string) => void;
}

export interface ClientToServerEvents {
  message: (message: Message, room: string) => void;
  storeUsername: (username: string) => void;
  createRoom: (room: string) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
  fetchMessageHistory: (room: string) => void;
  typing: (isTyping: boolean, room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface Message {
  text: string;
  username: string;
}

export interface SocketData {
  username: string;
  sessionID: string;
  userID: string;
  room: string;
}

export interface User {
  userID: string;
  username: string;
}

// interface DM {
//   roomID: string; // generate random string
//   userID1: string;
//   userID2: string;
// }
