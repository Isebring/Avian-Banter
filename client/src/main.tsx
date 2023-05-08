import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import SocketProvider from './context/SocketContext';
import ChatPage from './pages/ChatPage';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import LandingPage from './pages/Landingpage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LandingPage />} />
      <Route path="/joinroom" element={<JoinRoom />} />
      <Route path="/createroom" element={<CreateRoom />} />
      <Route path="/room/:room" element={<ChatPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </MantineProvider>
  </React.StrictMode>
);
