import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthTokenHandler from '../src/Auth/AuthTokenHandler.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthTokenHandler>
    <App />
    </AuthTokenHandler>
  </StrictMode>,
)
