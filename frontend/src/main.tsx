import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Theme } from '@radix-ui/themes';
import { Toaster } from "react-hot-toast";
import "./index.css";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
      <App />
       <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </Theme>
  </StrictMode>,
);
