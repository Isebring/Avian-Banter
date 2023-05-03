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
import './index.css';
import Createroom from './pages/Createroom';
import Joinroom from './pages/Joinroom';
import Landingpage from './pages/Landingpage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Landingpage />} />
      <Route path="/joinroom" element={<Joinroom />} />
      <Route path="/createroom" element={<Createroom />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
