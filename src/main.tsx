import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { POSProvider } from './context/POSContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <POSProvider>
      <App />
    </POSProvider>
  </React.StrictMode>,
)
