import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Vrachka",
  description: "Learn how Vrachka protects your personal information and respects your privacy.",
};

export default function PrivacyENPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Privacy Policy
            </GradientText>
          </h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString("en-US")}</p>
          <div className="pt-2">
            <Link href="/privacy" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Прочети на български →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. General Information</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka ("we", "us", "our") is committed to protecting the privacy of your personal information.
                This privacy policy explains how we collect, use, and protect your data in compliance with GDPR and Bulgarian law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. Information We Collect</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                We collect the following information when you use our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Name and email address (upon registration)</li>
                <li>Date and place of birth (for astrological calculations)</li>
                <li>Reading history and platform interactions</li>
                <li>Subscription and payment information</li>
                <li>Technical data (IP address, browser type, device)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. How We Use Your Information</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Provide personalized astrological forecasts</li>
                <li>Process payments and manage subscriptions via Stripe</li>
                <li>Improve our services and user experience</li>
                <li>Communicate about your account and our services</li>
                <li>Fulfill legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Data Protection</h2>
              <p className="text-zinc-300 leading-relaxed">
                We use industry-standard security measures to protect your data, including encryption, secure storage,
                and restricted access. Your information is stored on secure servers with high-level protection.
                All payment data is handled by Stripe and is NOT stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Sharing Information</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                We do not sell, rent, or share your personal information with third parties, except when necessary
                to provide our services or when required by law. Third-party processors include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                <li><strong className="text-zinc-50">Supabase:</strong> Database and authentication</li>
                <li><strong className="text-zinc-50">Vercel:</strong> Hosting and analytics</li>
                <li><strong className="text-zinc-50">OpenAI:</strong> AI-powered predictions (anonymized data only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. Your Rights (GDPR)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-zinc-50">Rectification:</strong> Correct inaccurate data</li>
                <li><strong className="text-zinc-50">Erasure:</strong> Delete your account and data ("right to be forgotten")</li>
                <li><strong className="text-zinc-50">Restriction:</strong> Limit processing of your data</li>
                <li><strong className="text-zinc-50">Objection:</strong> Object to data processing</li>
                <li><strong className="text-zinc-50">Portability:</strong> Transfer your data to another service</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  privacy@vrachka.eu
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Cookies</h2>
              <p className="text-zinc-300 leading-relaxed">
                We use cookies and similar technologies to improve user experience, analyze traffic, and personalize content.
                You can control cookie usage through your browser settings. For more details, see our{" "}
                <Link href="/cookies-policy-en" className="text-accent-400 hover:text-accent-300 underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Data Retention</h2>
              <p className="text-zinc-300 leading-relaxed">
                We retain your personal data for as long as your account is active or as needed to provide services.
                After account deletion, we may retain certain data for up to 90 days for legal and security purposes,
                then permanently delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Changes to This Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to update this privacy policy at any time. We will notify you of significant
                changes via email or platform notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">10. Contact</h2>
              <p className="text-zinc-300 leading-relaxed">
                For questions about this privacy policy, please contact us at:{" "}
                <a href="mailto:privacy@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  privacy@vrachka.eu
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
