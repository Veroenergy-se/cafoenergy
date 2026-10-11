import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { CartProvider } from './providers/CartProvider'
import ScrollToTop from './components/shared/ScrollToTop'
import './i18n'
// Fonts are self-hosted (no requests to Google): Archivo with its width axis as the
// Monument Extended stand-in, and DM Sans for text.
import '@fontsource-variable/archivo/wdth.css'
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
