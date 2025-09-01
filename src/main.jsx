import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToolProvider } from './ToolContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
     <ToolProvider> <App /></ToolProvider></BrowserRouter>
   
   

)
