import { Helmet } from 'react-helmet-async'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — CAFO Energy</title>
      </Helmet>

      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">PRIVACY POLICY</h1>
        </AnimatedSection>
      </section>

      <section className="py-24 bg-warm-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto prose prose-lg">
          <AnimatedSection>
            <div className="space-y-8 text-near-black/70 leading-relaxed">
              <div>
                <h2 className="text-2xl font-heading text-near-black mb-4">1. Introduction</h2>
                <p>CAFO Energy ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit cafoenergy.se.</p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-near-black mb-4">2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Contact information you provide through our contact form (name, email)</li>
                  <li>Usage data through cookies and analytics (page views, device information)</li>
                  <li>Shopping preferences stored locally in your browser</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-near-black mb-4">3. Cookies</h2>
                <p>We use cookies to improve your experience and analyze site traffic. You can manage your cookie preferences through the cookie consent banner. We use Google Analytics to understand how visitors interact with our site.</p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-near-black mb-4">4. How We Use Your Data</h2>
                <p>We use your data to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Respond to your inquiries</li>
                  <li>Improve our website and user experience</li>
                  <li>Analyze site traffic and usage patterns</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-near-black mb-4">5. Your Rights</h2>
                <p>Under GDPR, you have the right to access, rectify, erase, or restrict the processing of your personal data. Contact us at privacy@cafoenergy.se to exercise these rights.</p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-near-black mb-4">6. Contact</h2>
                <p>For privacy-related questions, contact us at <a href="mailto:privacy@cafoenergy.se" className="text-gold hover:text-gold-light transition-colors">privacy@cafoenergy.se</a>.</p>
              </div>

              <p className="text-sm text-near-black/40 mt-12">Last updated: March 2026</p>
            </div>
          </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
