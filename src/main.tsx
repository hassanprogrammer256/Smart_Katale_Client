import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssVarsProvider } from '@mui/joy/styles';
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import './index.css'
import App from './App.tsx'
import ToastContainer from './utils/toast-container.tsx';
import { ToastProvider } from './utils/toast-context.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store.ts';


createRoot(document.getElementById('root')!).render(
<StrictMode>
 <Provider store={store}>
  <BrowserRouter>
    <ToastProvider>
      <Theme>
        <CssVarsProvider>
              <App />
              <ToastContainer />
        </CssVarsProvider>
      </Theme>
    </ToastProvider>
    </BrowserRouter>
 </Provider>
</StrictMode>,
)
