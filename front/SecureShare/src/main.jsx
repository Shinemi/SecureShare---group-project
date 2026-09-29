import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './styles/tailwind.scss'
import './styles/global.scss'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

ReactDom.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)