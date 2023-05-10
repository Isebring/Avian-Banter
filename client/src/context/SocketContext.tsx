import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { Message } from '../../../server/communication';

interface ContextValues {
  storeUsername: (username: string) => void;
  sendMessage: (message: Message, room: string) => void;
  createRoom: (title: string) => void;
  messages: Message[];
  rooms: string[];
  join: (room: string) => void;
  fetchMessageHistory: (room: string) => void;
}
export const socket = io({ autoConnect: false });

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);

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

  const fetchMessageHistory = (room: string) => {
    if (room) {
      socket.emit('fetchMessageHistory', room);
    }
  };

  const sendMessage = (message: Message, room: string) => {
    if (!room) throw Error("Can't send message without a room");
    socket.emit('message', message, room);
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
    function connect() {
      console.log('Connected to server');
    }

    function disconnect() {
      console.log('Disconnected from server');
    }

    function message(message: string) {
      console.log(message);
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
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        storeUsername,
        sendMessage,
        messages,
        createRoom,
        rooms,
        join,
        fetchMessageHistory,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
