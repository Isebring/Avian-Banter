import { createContext, useContext, useState } from 'react';

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

export const UsernameProvider: React.FC<UsernameProviderProps> = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};