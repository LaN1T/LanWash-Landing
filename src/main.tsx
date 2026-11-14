import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { readChoice, startMetrika } from './analytics'
import './styles.css'
import './theme.css'

// Метрика — только если посетитель уже разрешил её в этом браузере.
if (readChoice() === 'granted') startMetrika()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
