import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Vrachka",
  description: "Learn how Vrachka uses cookies to improve user experience and what rights you have.",
};

export default function CookiesPolicyENPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Cookie Policy
            </GradientText>
          </h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString("en-US")}</p>
          <div className="pt-2">
            <Link href="/cookies-policy" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Прочети на български →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. What Are Cookies?</h2>
              <p className="text-zinc-300 leading-relaxed">
                Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website.
                They allow the site to remember your actions and preferences (such as login, language, font size, and other settings)
                for a certain period of time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. How We Use Cookies</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Vrachka uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Authentication:</strong> To remember that you are logged into your account</li>
                <li><strong className="text-zinc-50">Preferences:</strong> To save your settings (theme, language)</li>
                <li><strong className="text-zinc-50">Security:</strong> To protect against fake requests and malicious attacks</li>
                <li><strong className="text-zinc-50">Analytics:</strong> To understand how you use our platform</li>
                <li><strong className="text-zinc-50">Functionality:</strong> To improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Types of Cookies We Use</h2>

              <div className="space-y-4">
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-accent-500/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">A) Strictly Necessary Cookies</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    These cookies are essential for the website to function and cannot be disabled in our systems.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>auth-token:</strong> Authenticates your session (Supabase Authentication)</li>
                    <li><strong>csrf-token:</strong> Protection against Cross-Site Request Forgery attacks</li>
                    <li><strong>session-id:</strong> User session management</li>
                  </ul>
                  <p className="text-zinc-400 text-xs mt-2">Validity: Session or up to 30 days</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">B) Functional Cookies</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    Allow the website to provide enhanced functionality and personalization.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>user-preferences:</strong> Store your preferences (theme, language)</li>
                    <li><strong>zodiac-sign:</strong> Save your zodiac sign for quick access</li>
                    <li><strong>onboarding-completed:</strong> Track whether you completed onboarding</li>
                  </ul>
                  <p className="text-zinc-400 text-xs mt-2">Validity: Up to 1 year | You can opt out</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">C) Analytical Cookies</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    Help us understand how visitors interact with the platform.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>Vercel Analytics:</strong> Anonymous statistics about visits and performance</li>
                    <li><strong>_ga, _gid:</strong> Google Analytics (if used) - consent required</li>
                  </ul>
                  <p className="text-zinc-400 text-xs mt-2">Validity: 13 months (GA) or 24 hours (Vercel) | You can opt out</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">D) Marketing Cookies</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    We currently do NOT use marketing or advertising cookies. If this changes in the future, we will request your explicit consent.
                  </p>
                  <p className="text-zinc-400 text-xs mt-2">Status: Inactive</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Third-Party Cookies</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Some cookies may be set by third parties that provide services to us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Stripe:</strong> Payment processing (session and security cookies)</li>
                <li><strong className="text-zinc-50">Supabase:</strong> Authentication and database (auth cookies)</li>
                <li><strong className="text-zinc-50">Vercel:</strong> Hosting and analytics (performance cookies)</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                These third parties have their own privacy and cookie policies, which you can review on their websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Managing Cookies</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                You have several ways to manage or delete cookies:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-1">A) Through Your Browser</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    You can configure your browser to block or delete cookies:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li><strong>Firefox:</strong> Settings → Privacy and security → Cookies and data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage cookies</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-1">B) Through Vrachka Settings</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    You can manage analytical and functional cookies through your profile:
                    Settings → Privacy → Manage cookies
                  </p>
                </div>
              </div>

              <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-500/30 mt-4">
                <p className="text-amber-200 text-sm">
                  <strong>⚠️ Important:</strong> If you block or delete cookies, some features of Vrachka may not work properly
                  (e.g., you won't be able to log into your account or save your preferences).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. "Do Not Track" (DNT) Signals</h2>
              <p className="text-zinc-300 leading-relaxed">
                Currently, our website does not respond to "Do Not Track" (DNT) signals from browsers, as there is no industry
                standard for how to interpret these signals. If a standard is established in the future, we will update our policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Your Rights (GDPR)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Under GDPR, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Withdraw consent for non-essential cookies at any time</li>
                <li>Delete cookies on your device</li>
                <li>Request information about what data we collect through cookies</li>
                <li>Request deletion of your data (right to be forgotten)</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                For more information, see our{" "}
                <Link href="/privacy-en" className="text-accent-400 hover:text-accent-300 underline">
                  Privacy Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Changes to This Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                We may update this cookie policy periodically to reflect changes in technology, legislation, or our practices.
                We will post the updated version on this page with a new "Last updated" date. We recommend reviewing this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Contact</h2>
              <p className="text-zinc-300 leading-relaxed">
                For questions about this cookie policy or to exercise your rights, please contact us at:{" "}
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
