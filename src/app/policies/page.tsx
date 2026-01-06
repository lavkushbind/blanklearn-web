// src/app/policies/page.tsx

import React from 'react';

export default function Policies() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Company Policies</h1>

      <section className="mb-8 p-6 bg-slate-50 rounded-xl border">
        <h2 className="text-2xl font-bold mb-4">1. Contact Us</h2>
        <p><strong>Business Name:</strong> Blanklearn</p>
        <p><strong>Email:</strong> blanklearn.com@gmail.com</p> {/* Apna Email dalein */}
        <p><strong>Phone:</strong> +91-9235044520</p>
        <p><strong>Address:</strong> Kahadev , Kanpur , India</p> {/* Apna Real Address dalein (Zaroori hai) */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Privacy Policy</h2>
        <p className="text-slate-600 mb-2">
          At Blanklearn, we take your privacy seriously. We only collect information (Name, Phone Number) necessary to conduct our classes.
        </p>
        <p className="text-slate-600">
          We do not sell or share your personal data with any third parties. Your data is secured and used only for communication regarding your classes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Terms & Conditions</h2>
        <p className="text-slate-600 mb-2">
          By booking a class with Blanklearn, you agree to the following:
        </p>
        <ul className="list-disc pl-5 text-slate-600">
            <li>The ₹10 fee is for a single demo session reservation.</li>
            <li>Classes are conducted online via our app/platform.</li>
            <li>Users must maintain decorum during live classes.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Refund & Cancellation Policy</h2>
        <p className="text-slate-600 mb-2">
          <strong>Demo Class:</strong> The ₹10 fee is a nominal booking charge and is generally non-refundable.
        </p>
        <p className="text-slate-600">
          <strong>Full Subscription:</strong> For our monthly plans (₹2000/₹4000), we offer a 7-day money-back guarantee. If you are not satisfied within the first 7 days, you may request a full refund by contacting us at the details provided above. Refunds are processed within 5-7 working days.
        </p>
      </section>

    </div>
  );
}