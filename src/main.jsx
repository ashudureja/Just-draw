import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToolProvider } from './ToolContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToolProvider> <App /></ToolProvider>
   
  </StrictMode>,
)
