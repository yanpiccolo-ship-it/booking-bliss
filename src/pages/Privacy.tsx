import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">1. Data We Collect</h2>
            <p>We collect data required to operate the service: name, email, phone, business information, reservation history, and conversations with AI agents.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">2. Use of Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reservation management and automated communications</li>
              <li>Service improvement and AI model training</li>
              <li>Analytical reports for the business</li>
              <li>Operational notifications (confirmations, reminders)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">3. AI Conversation Storage</h2>
            <p>Conversations handled by AI agents may be stored to improve service quality. Users can request deletion of their conversations at any time.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">4. Subscription and Payment Data</h2>
            <p>Subscriptions renew automatically at the start of each billing period (monthly or annually) until cancelled by the User. Payments are processed through Stripe using the registered payment method.</p>
            <p>In case of non-payment, access to the Service will be automatically suspended 7 days after the due date. User data will be retained for 30 additional days to facilitate reactivation.</p>
          </section>

          <section id="cookies">
            <h2 className="font-display text-lg font-bold text-foreground">5. Cookies</h2>
            <p>We use cookies to improve your experience, analyze traffic and personalize content. You can manage your preferences from the cookie banner when accessing the site.</p>
          </section>

          <section id="gdpr">
            <h2 className="font-display text-lg font-bold text-foreground">6. User Rights</h2>
            <p>Under GDPR, you have the right to access, rectify, delete and port your data. To exercise these rights, contact: <a href="mailto:privacy@flowbooking.com" className="text-primary underline">privacy@flowbooking.com</a></p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">7. Security</h2>
            <p>Your data is stored on secure servers with encryption in transit and at rest. We implement technical and organizational measures to protect your information.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
