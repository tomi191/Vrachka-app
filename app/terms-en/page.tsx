import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Vrachka",
  description: "Read the terms and conditions for using the Vrachka platform.",
};

export default function TermsENPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Terms of Service
            </GradientText>
          </h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString("en-US")}</p>
          <div className="pt-2">
            <Link href="/terms" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Прочети на български →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. Acceptance of Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                By accessing and using the Vrachka platform, you agree to comply with these Terms of Service.
                If you do not agree with any part of the terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. Service Description</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka provides online astrology services, including daily horoscopes, tarot readings,
                AI oracle, and other spiritual tools. Services are accessible via web platform and mobile application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Account Registration</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                To use the full functionality of the platform, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Providing accurate and complete information during registration</li>
                <li>Maintaining the security of your password</li>
                <li>All activities conducted through your account</li>
                <li>Immediately notifying us of unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Subscriptions and Payments</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Vrachka offers free and paid subscriptions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Subscriptions are billed monthly or annually</li>
                <li>Payments are automatically processed through Stripe</li>
                <li>You can cancel your subscription at any time</li>
                <li>No refunds for partially used periods (see our <Link href="/refund-policy-en" className="text-accent-400 hover:text-accent-300 underline">Refund Policy</Link>)</li>
                <li>Prices may change with 30 days&apos; notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Acceptable Use</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                When using Vrachka, you agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Violate laws or the rights of others</li>
                <li>Share your account with others</li>
                <li>Abuse or overload the system</li>
                <li>Extract data through automated methods</li>
                <li>Copy or resell our content</li>
                <li>Create fake accounts or profiles</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. Intellectual Property</h2>
              <p className="text-zinc-300 leading-relaxed">
                All content on the Vrachka platform, including text, graphics, logos, icons, and software,
                is the property of Vrachka or its licensors and is protected by copyright laws and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Disclaimer</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka provides astrology and spiritual services for entertainment and informational purposes.
                Our services do NOT replace professional medical, legal, financial, or psychological advice.
                All decisions based on our predictions are your personal responsibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Limitation of Liability</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka is not liable for direct, indirect, incidental, or consequential damages arising from
                the use or inability to use our service, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Termination</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to terminate or suspend your access to services at any time, without notice,
                for behavior that violates these terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">10. Changes to Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                We may update these terms periodically. We will notify you of significant changes via email or
                platform notification. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">11. Governing Law</h2>
              <p className="text-zinc-300 leading-relaxed">
                These terms are governed by and construed in accordance with the laws of the Republic of Bulgaria.
                Any disputes will be resolved in the competent courts of Bulgaria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">12. Contact</h2>
              <p className="text-zinc-300 leading-relaxed">
                For questions about these terms, please contact us at:{" "}
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
