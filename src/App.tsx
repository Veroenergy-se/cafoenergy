import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Community from './pages/Community'
import About from './pages/About'
import Contact from './pages/Contact'
import HowItWorks from './pages/HowItWorks'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Checkout from './pages/Checkout'
import FAQ from './pages/FAQ'
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>
    </Routes>
  )
}
