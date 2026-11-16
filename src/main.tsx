import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { clearMetrikaData, readChoice, startMetrika } from './analytics'
import './styles.css'
import './theme.css'

// Метрика — только если посетитель уже разрешил её в этом браузере. После отказа подчищаем то,
// что счётчик мог оставить.
const analyticsChoice = readChoice()
if (analyticsChoice === 'granted') startMetrika()
else if (analyticsChoice === 'denied') clearMetrikaData()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
