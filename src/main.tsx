import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./styles/global.css"
import 'aos/dist/aos.css'
import 'react-medium-image-zoom/dist/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)