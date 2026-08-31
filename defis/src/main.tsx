import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Relative path so it resolves under whatever subpath the app is served
    // from, matching the manifest scope.
    navigator.serviceWorker.register('sw.js').catch(() => {})
  })
}
