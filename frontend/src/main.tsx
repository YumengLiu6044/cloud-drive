import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { Loader2 } from 'lucide-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster richColors icons={{
      loading: <Loader2 size={20} className='animate-spin'></Loader2>
    }}></Toaster>
  </StrictMode>,
)
