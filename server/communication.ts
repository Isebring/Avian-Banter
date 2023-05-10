export interface ServerToClientEvents {
  message: (message: Message[]) => void;
  systemMessage: (message: string) => void;
  rooms: (rooms: string[]) => void;
  messageHistory: (messages: Message[]) => void;
  session: (user: SocketData) => void;
  typing: (room: string, username: string) => void;
  users: (users: SocketData[]) => void;
}

export interface ClientToServerEvents {
  message: (message: Message, room: string) => void;
  storeUsername: (username: string) => void;
  createRoom: (room: string) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
  fetchMessageHistory: (room: string) => void;
  typing: (room: string) => void;
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
}
