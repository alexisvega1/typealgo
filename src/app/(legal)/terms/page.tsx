import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using TypeAlgo.",
};

const LAST_UPDATED = "May 28, 2026";
const CONTACT_EMAIL = "contact@typealgo.com";

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of TypeAlgo (the &ldquo;Service&rdquo;).
        By using the Service, you agree to these Terms. If you do not agree, please do not use the Service.
      </p>

      <h2>1. The service</h2>
      <p>
        TypeAlgo is a typing-practice tool for building algorithmic and code fluency. It is provided for
        educational and personal use. We may add, change, or remove features at any time.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You can use TypeAlgo without an account. Creating an account is optional and is done through a
        third-party sign-in provider (GitHub, Google, or Apple) solely to sync your progress. You are
        responsible for activity that occurs through your account and for keeping access to your sign-in
        provider secure.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
        <li>Attempt to disrupt, overload, or gain unauthorized access to the Service or its systems.</li>
        <li>Scrape, resell, or redistribute the Service or its content except as expressly permitted.</li>
        <li>Interfere with other users&rsquo; use of the Service.</li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        The Service, including its software, design, and original content, is owned by TypeAlgo and protected
        by applicable laws. You retain ownership of the practice data you generate. Curriculum implementations
        are independently authored.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        The Service relies on third parties such as your chosen sign-in provider, Supabase, and Vercel. Your
        use of those services may be subject to their own terms and policies, and we are not responsible for
        them.
      </p>

      <h2>6. Disclaimer of warranties</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any
        kind, whether express or implied, including fitness for a particular purpose and non-infringement. We
        do not warrant that the Service will be uninterrupted, error-free, or that data will never be lost.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, TypeAlgo will not be liable for any indirect, incidental,
        special, consequential, or punitive damages, or for any loss of data, arising out of or related to
        your use of the Service.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate access if you violate these
        Terms or to protect the Service. You can request deletion of your account and synced data by emailing{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will revise the &ldquo;Last updated&rdquo;
        date above. Continued use of the Service after changes take effect constitutes acceptance of the
        updated Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  );
}
