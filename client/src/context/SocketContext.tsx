import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io } from 'socket.io-client';

interface ContextValues {
  storeUsername: (username: string) => void;
  sendMessage: (room: string, message: string) => void;
  createRoom: (title: string) => void;
  messages: string[];
}
const socket = io();

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<string[]>([]);

  const storeUsername = (username: string) => {
    if (username) {
      socket.emit('storeUsername', username);
    }
  };

  const createRoom = (title: string) => {
    if (title) {
      socket.emit('createRoom', title);
    }
  };

  const sendMessage = (room: string, message: string) => {
    if (!room) throw Error("Can't send message without a room");
    socket.emit('message', message, room);
  };

  useEffect(() => {
    const onMessage = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, [socket]);

  useEffect(() => {
    function connect() {
      console.log('Connected to server');
    }

    function disconnect() {
      console.log('Disconnected from server');
    }

    function message(message: string) {
      console.log(message);
    }

    socket.on('connect', connect);
    socket.on('disconnect', disconnect);
    socket.on('message', message);

    return () => {
      socket.off('connect', connect);
      socket.off('disconnect', disconnect);
      socket.off('message', message);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ storeUsername, sendMessage, messages, createRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
