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
import CreateRoom from './pages/Createroom';
import JoinRoom from './pages/Joinroom';
import LandingPage from './pages/Landingpage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LandingPage />} />
      <Route path="/joinroom" element={<JoinRoom />} />
      <Route path="/createroom" element={<CreateRoom />} />
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
