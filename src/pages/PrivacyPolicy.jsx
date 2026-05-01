import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 1, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Who We Are</h2>
            <p>The Dyson and Dyson Companies, Inc. ("Dyson & Dyson," "we," "our," or "us") operates DysonRelo.com and related platforms. We provide real estate relocation management services, agent referral coordination, and related communications.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Property address and relocation details</li>
              <li>Communications preferences</li>
              <li>Messages and inquiries submitted through our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and manage relocation services</li>
              <li>Connect you with vetted real estate agents and lenders</li>
              <li>Send SMS and email communications related to your relocation or referral</li>
              <li>Respond to inquiries and support requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. SMS Communications</h2>
            <p>By providing your phone number, you consent to receive text messages (SMS) from Dyson & Dyson regarding real estate services, relocation updates, and referral coordination. Message frequency varies. Message and data rates may apply.</p>
            <p className="mt-2">To opt out at any time, reply <strong>STOP</strong> to any message. To request help, reply <strong>HELP</strong>. You may also contact us directly at the information below.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Sharing of Information</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Vetted partner agents and lenders as part of the referral process</li>
              <li>Service providers who assist in operating our platform (e.g., Twilio for SMS delivery)</li>
              <li>Legal or regulatory authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Data Retention</h2>
            <p>We retain your information for as long as necessary to provide services and comply with legal obligations. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at the information below.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Contact Us</h2>
            <p>The Dyson and Dyson Companies, Inc.<br />
            Email: info@dysonrelo.com<br />
            Phone: (619) 500-0000<br />
            California DRE Licensed Brokerage</p>
          </section>

        </div>
      </div>
    </div>
  );
}