import { createContext, useContext, useEffect, useState } from 'react';
import { SocketData } from '../../../server/communication';
import { socket } from './SocketContext';

interface UsernameContextType {
  username: string;
  setUsername: (username: string) => void;
}

interface UsernameProviderProps {
  children: React.ReactNode;
}

const UsernameContext = createContext<UsernameContextType>({
  username: '',
  setUsername: () => {},
});

export const useUsername = () => {
  return useContext(UsernameContext);
};

export const UsernameProvider: React.FC<UsernameProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
  );

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionID');

    if (sessionID) {
      // Navigera till rummen
      socket.auth = { sessionID };
      socket.connect();
    }
  }, []);

  useEffect(() => {
    function handleSession({ sessionID }: SocketData) {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem('sessionID', sessionID);
    }

    socket.on('session', handleSession);

    return () => {
      socket.off('session', handleSession);
    };
  }, []);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};
