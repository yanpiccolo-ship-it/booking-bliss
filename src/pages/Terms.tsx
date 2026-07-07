import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">1. Use of the Service</h2>
            <p>FlowBooking is a SaaS platform for reservation management, automation and customer service powered by artificial intelligence. By registering and using the service, you accept these terms.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">2. Use of Artificial Intelligence</h2>
            <p>The Service includes AI agents that may interact with customers on behalf of the User. The User expressly authorizes this use when activating these modules from the control panel.</p>
            <p>FlowBooking does not guarantee absolute accuracy of AI-generated responses. The User is responsible for reviewing and adjusting agent behavior according to their business needs.</p>
            <p>AI-handled conversations may be stored to improve the service, in accordance with our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">3. Subscription and Renewal</h2>
            <p>Subscriptions renew automatically at the start of each billing period (monthly or annually) until cancelled by the User. Payment is processed through the registered payment method.</p>
            <p>In case of non-payment, access will be automatically suspended 7 days after the due date. User data will be retained for 30 additional days to facilitate reactivation.</p>
            <p>The User can cancel their subscription at any time from <strong>Settings → Plan → Cancel subscription</strong>, without penalty.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">4. Automations</h2>
            <p>This system includes customer service, reservation and basic management automations enabled by default so your business runs from day one. You can pause, adjust or disable any feature at any time from your control panel.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">5. Maintenance</h2>
            <p>The monthly maintenance fee covers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hosting and system stability (guaranteed uptime)</li>
              <li>Security updates and technical patches</li>
              <li>Continuous optimization of automations and AI agents</li>
              <li>Minor content adjustments (texts, images, prices)</li>
              <li>Email technical support with 24–48h business response</li>
              <li>Monitoring of active flows and failure alerts</li>
              <li>1 hour of improvements or new configurations included per month</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Does not include: development of new features, integrations with third parties not contracted, or support for external tools.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">6. Limitation of Liability</h2>
            <p>FlowBooking is not liable for losses arising from service interruptions, errors in AI responses or business decisions made based on system data.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">7. Contact</h2>
            <p>For any legal inquiries, contact: <a href="mailto:legal@flowbooking.com" className="text-primary underline">legal@flowbooking.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
