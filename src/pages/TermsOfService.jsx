import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 1, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using the services provided by The Dyson and Dyson Companies, Inc. ("Dyson & Dyson"), including DysonRelo.com and any related platforms or communications, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Services Provided</h2>
            <p>Dyson & Dyson provides real estate relocation management services, including agent vetting, referral coordination, escrow monitoring, and related concierge services. We are a licensed California real estate brokerage.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. SMS Messaging Terms</h2>
            <p>By submitting your phone number through any Dyson & Dyson form or platform, you expressly consent to receive recurring automated SMS text messages from Dyson & Dyson at the number provided. These messages may include:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Relocation updates and milestone notifications</li>
              <li>Agent referral coordination messages</li>
              <li>Outreach regarding real estate services</li>
              <li>Follow-up communications</li>
            </ul>
            <p className="mt-2">Message frequency varies. Message and data rates may apply. Consent is not a condition of purchase.</p>
            <p className="mt-2"><strong>To opt out:</strong> Reply STOP to any SMS message at any time. You will receive a confirmation and no further messages will be sent.</p>
            <p className="mt-2"><strong>For help:</strong> Reply HELP to any message or contact us at info@dysonrelo.com.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Referral Fee Disclosure</h2>
            <p>Dyson & Dyson earns referral and management fees as part of real estate transactions coordinated through our network. All fee arrangements are disclosed in writing and governed by applicable California DRE regulations. Referral fees are paid broker-to-broker only.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. No Guarantee of Outcome</h2>
            <p>While we strive to provide the highest quality service, Dyson & Dyson does not guarantee any specific real estate outcome, timeline, or transaction result. Real estate transactions are subject to market conditions, lender requirements, and other factors outside our control.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Dyson & Dyson shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or reliance on information provided through our platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of San Diego County, California.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">9. Contact</h2>
            <p>The Dyson and Dyson Companies, Inc.<br />
            Email: info@dysonrelo.com<br />
            California DRE Licensed Brokerage</p>
          </section>

        </div>
      </div>
    </div>
  );
}