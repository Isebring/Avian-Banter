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
  rooms: string[];
  join: (room: string) => void;
  fetchMessageHistory: (room: string) => void;
  userTyping: (room: string, username: string) => void;
  userStoppedTyping: (room: string, username: string) => void;
  typingUsers: string[];
}
export const socket = io({ autoConnect: false });

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<string[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

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

  const sendMessage = (room: string, message: string) => {
    if (!room) throw Error("Can't send message without a room");
    socket.emit('message', message, room);
  };

  const userTyping = (room: string, username: string) => {
    socket.emit('userTyping', room, username);
  };

  const userStoppedTyping = (room: string, username: string) => {
    socket.emit('userStoppedTyping', room, username);
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

    function rooms(rooms: string[]) {
      setRooms(rooms);
    }

    function messageHistory(messages: string[]) {
      setMessages(messages);
    }

    function userTyping(room: string, username: string) {
      setTypingUsers((prevUsers) => [...prevUsers, username]);
    }

    function userStoppedTyping(room: string, username: string) {
      setTypingUsers((prevUsers) =>
        prevUsers.filter((user) => user !== username)
      );
    }

    socket.on('connect', connect);
    socket.on('disconnect', disconnect);
    socket.on('message', message);
    socket.on('rooms', rooms);
    socket.on('messageHistory', messageHistory);
    socket.on('userTyping', userTyping);
    socket.on('userStoppedTyping', userStoppedTyping);

    return () => {
      socket.off('connect', connect);
      socket.off('disconnect', disconnect);
      socket.off('message', message);
      socket.off('rooms', rooms);
      socket.off('messageHistory', messageHistory);
      socket.off('userTyping', userTyping);
      socket.off('userStoppedTyping', userStoppedTyping);
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
        userTyping,
        userStoppedTyping,
        typingUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
