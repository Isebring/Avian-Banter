export interface ServerToClientEvents {
  message: (message: string) => void;
  rooms: (rooms: string[]) => void;
}

export interface ClientToServerEvents {
  message: (message: string, room: string) => void;
  storeUsername: (username: string) => void;
  createRoom: (room: string) => void;
  joinRoom: (room: string) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
