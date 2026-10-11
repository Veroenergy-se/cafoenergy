import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { CartProvider } from './providers/CartProvider'
import ScrollToTop from './components/shared/ScrollToTop'
import './i18n'
// Fonts are self-hosted (no requests to Google).
import '@fontsource/big-shoulders-display/900'
import '@fontsource/montserrat/800'
import '@fontsource/montserrat/900'
import '@fontsource-variable/dm-sans/opsz.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <ScrollToTop />
          <App />
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
