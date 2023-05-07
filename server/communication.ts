export interface ServerToClientEvents {
  message: (message: string) => void;
}

export interface ClientToServerEvents {
  message: (message: string) => void;
  storeUsername: (
    username: string,
    callback: (success: boolean) => void
  ) => void;
  createRoom: (room: string) => void;
  sendMessage: (message: string, room: string) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
