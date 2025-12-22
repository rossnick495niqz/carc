import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { PwaManager } from './pwa/PwaManager'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
        <PwaManager />
    </React.StrictMode>,
)
