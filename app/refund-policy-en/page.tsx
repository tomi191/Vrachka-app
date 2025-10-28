import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy | Vrachka",
  description: "Learn about our refund policy and how to request a refund for your subscription.",
};

export default function RefundPolicyENPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Refund Policy
            </GradientText>
          </h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString("en-US")}</p>
          <div className="pt-2">
            <Link href="/refund-policy" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Прочети на български →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. General Information</h2>
              <p className="text-zinc-300 leading-relaxed">
                At Vrachka, we strive to provide high-quality AI-powered spiritual services. This policy explains the
                terms and conditions for refunds under various circumstances. Please read carefully before purchasing a subscription.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. 14-Day Withdrawal Period (EU Law)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                In accordance with the EU Consumer Rights Directive, you have the right to withdraw from your purchase
                within 14 days from the date of initial payment, WITHOUT giving any reason.
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-accent-500/20">
                <p className="text-zinc-300 mb-2"><strong className="text-zinc-50">Important:</strong> The right of withdrawal does NOT apply if:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                  <li>You have used the services before the 14-day period expires</li>
                  <li>You have expressly consented to begin using the digital content</li>
                  <li>You have acknowledged that you lose your right of withdrawal once performance begins</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Refund Policy After 14 Days</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                After the 14-day withdrawal period, our refund policy is as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Monthly Subscriptions:</strong> We do not offer refunds for partially used months. You may cancel at any time, and access will continue until the end of the paid period.</li>
                <li><strong className="text-zinc-50">Annual Subscriptions:</strong> Refunds are possible only within the first 30 days if you have used less than 10% of the services.</li>
                <li><strong className="text-zinc-50">Technical Issues:</strong> If you cannot use the services due to our technical fault for more than 7 days, you will receive a proportional refund.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. How to Request a Refund</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300 ml-4">
                <li>Send an email to <a href="mailto:refunds@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">refunds@vrachka.eu</a></li>
                <li>Include your registered email address</li>
                <li>Describe the reason for your refund request</li>
                <li>Provide order number or payment date (if available)</li>
              </ol>
              <p className="text-zinc-300 leading-relaxed mt-3">
                We will review your request within <strong className="text-zinc-50">5 business days</strong> and notify you of the decision by email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Refund Process</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                If your refund request is approved:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Funds will be refunded via the <strong className="text-zinc-50">same payment method</strong> used for purchase</li>
                <li>Processing may take <strong className="text-zinc-50">5-10 business days</strong> depending on your bank</li>
                <li>You will receive an email confirmation when the refund is processed</li>
                <li>Access to premium features will be immediately revoked</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. Exceptions (No Refunds)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                We will NOT provide refunds in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Change of mind after actively using the services</li>
                <li>Violation of our <Link href="/terms-en" className="text-accent-400 hover:text-accent-300 underline">Terms of Service</Link></li>
                <li>Account termination due to inappropriate behavior</li>
                <li>Partially used monthly or annual periods (except for technical issues)</li>
                <li>Promotional codes or special offers (unless otherwise stated)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Stripe Payment Processing</h2>
              <p className="text-zinc-300 leading-relaxed">
                All payments are processed through <strong className="text-zinc-50">Stripe</strong>, a secure and regulated payment processor.
                When issuing refunds, Stripe may withhold processing fees. In case of disputed transactions (chargebacks),
                please contact us before initiating a dispute with your bank to resolve the issue faster.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Subscription Cancellation</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                You can cancel your subscription at any time via:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Profile Settings → Subscription → "Cancel Subscription"</li>
                <li>Or through the Stripe Customer Portal (link in confirmation email)</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                <strong className="text-zinc-50">Important:</strong> Cancellation stops FUTURE payments but does NOT refund the current period.
                You will retain access to premium features until the end of the paid period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Disclaimer for Spiritual Services</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka provides astrology and spiritual services for <strong className="text-zinc-50">entertainment and self-discovery purposes</strong>.
                Our services do NOT replace professional medical, legal, financial, or psychological advice. All decisions based on our
                predictions are your personal responsibility. We bear no responsibility for outcomes or consequences of using our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">10. Changes to This Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to update this refund policy at any time. Changes take effect immediately upon posting
                on the website. Continued use of services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">11. Contact</h2>
              <p className="text-zinc-300 leading-relaxed">
                For questions about this refund policy or to request a refund, please contact us at:{" "}
                <a href="mailto:refunds@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  refunds@vrachka.eu
                </a>
              </p>
              <p className="text-zinc-300 leading-relaxed mt-2">
                General support email:{" "}
                <a href="mailto:support@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  support@vrachka.eu
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
