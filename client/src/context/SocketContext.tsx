import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Socket, io } from 'socket.io-client';
import {
  ClientToServerEvents,
  Message,
  ServerToClientEvents,
  User,
} from '../../../server/communication';

interface ContextValues {
  storeUsername: (username: string) => void;
  sendMessage: (message: Message, room: string) => void;
  createRoom: (title: string) => void;
  messages: Message[];
  rooms: string[];
  join: (room: string) => void;
  leave: (room: string) => void;
  fetchMessageHistory: (room: string) => void;
  users: User[];
  createDMRoom: (recipientUserID: string) => Promise<string | null>;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

const SocketContext = createContext<ContextValues>(null as any);

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const storeUsername = (username: string) => {
    socket.auth = { username };
    socket.connect();
  };

  const createRoom = (title: string) => {
    if (title) {
      socket.emit('createRoom', title);
    }
  };

  const join = (room: string) => {
    if (room) {
      socket.emit('join', room);
    }
  };
  const leave = (room: string) => {
    if (room) {
      socket.emit('leave', room);
    }
  };

  const fetchMessageHistory = (room: string) => {
    if (room) {
      socket.emit('fetchMessageHistory', room);
    }
  };

  const sendMessage = (message: Message, room: string) => {
    if (!room) throw Error("Can't send message without a room");
    socket.emit('message', message, room);
  };

  const createDMRoom = (recipientUserID: string): Promise<string | null> => {
    const currentUserID = localStorage.getItem('userID');
    console.log(users);
    return new Promise((resolve) => {
      if (recipientUserID && currentUserID) {
        const ids = [currentUserID, recipientUserID].sort();
        let room = `dm-${ids[0]}-${ids[1]}`;
        socket.emit('createRoom', room);
        socket.once('roomCreated', (createdRoom) => {
          if (createdRoom === room) {
            resolve(room);
          }
        });
      } else {
        console.error('Recipient or current user not found');
        resolve(null);
      }
    });
  };

  useEffect(() => {
    const onMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, [socket]);

  useEffect(() => {
    const onUsersUpdate = (users: User[]) => {
      setUsers(users);
      console.log('socketContext users:', users);
    };

    socket.on('users', onUsersUpdate);

    return () => {
      socket.off('users', onUsersUpdate);
    };
  }, [socket]);

  useEffect(() => {
    function connect() {
      console.log('Connected to server');
    }

    function disconnect() {
      console.log('Disconnected from server');
    }

    function message(message: Message) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }

    function rooms(rooms: string[]) {
      setRooms(rooms);
    }

    function messageHistory(messages: Message[]) {
      setMessages(messages);
    }

    socket.on('connect', connect);
    socket.on('disconnect', disconnect);
    socket.on('message', message);
    socket.on('rooms', rooms);
    socket.on('messageHistory', messageHistory);

    return () => {
      socket.off('connect', connect);
      socket.off('disconnect', disconnect);
      socket.off('message', message);
      socket.off('rooms', rooms);
      socket.off('messageHistory', messageHistory);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        storeUsername,
        sendMessage,
        messages,
        createRoom,
        rooms,
        join,
        leave,
        fetchMessageHistory,
        users,
        createDMRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
