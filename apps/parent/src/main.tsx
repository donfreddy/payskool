import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ActiveStudentProvider } from './contexts/ActiveStudentContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ActiveStudentProvider>
      <App />
    </ActiveStudentProvider>
  </StrictMode>,
)
