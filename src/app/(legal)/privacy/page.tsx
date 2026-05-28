import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TypeAlgo handles your data — local-first by default, with optional cloud sync.",
};

const LAST_UPDATED = "May 28, 2026";
const CONTACT_EMAIL = "contact@typealgo.com";

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

      <p>
        TypeAlgo (&ldquo;TypeAlgo,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is a typing-practice tool for
        algorithmic and code fluency. This policy explains what we collect, why, and the choices you have.
        The short version: <strong>TypeAlgo is local-first</strong> — you can use everything without an
        account, and your practice data stays in your browser unless you choose to sign in for cloud sync.
      </p>

      <h2>1. Information we collect</h2>

      <h3>Data stored locally on your device</h3>
      <p>
        By default, your practice data is stored only in your browser (via local storage) and is never sent
        to us. This includes your typing sessions, words-per-minute and accuracy metrics, streaks, English
        baseline results, and app settings. Clearing your browser storage removes this data.
      </p>

      <h3>Account data (only if you sign in)</h3>
      <p>
        Signing in is optional and exists solely to sync your progress across devices. We offer sign-in
        through GitHub, Google, and Apple. When you sign in, we receive a basic account identifier and your
        email address from the provider you choose. We do not receive your password. If you use
        &ldquo;Sign in with Apple,&rdquo; you may choose to hide your email, in which case we only receive
        Apple&rsquo;s private relay address.
      </p>

      <h3>Synced progress</h3>
      <p>
        When you are signed in, the practice data described above is stored in our database so it can be
        synced to your other devices. We do not store payment information (TypeAlgo does not charge users),
        and we do not sell your data or use third-party advertising trackers.
      </p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To provide the core typing-practice experience.</li>
        <li>To create your account and sync your progress across devices when you sign in.</li>
        <li>To maintain, secure, and improve the service.</li>
        <li>To respond to you if you contact us for support.</li>
      </ul>

      <h2>3. Service providers</h2>
      <p>We rely on a small number of processors to run TypeAlgo:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication and the database that stores your synced progress.
        </li>
        <li>
          <strong>Vercel</strong> — application hosting and content delivery.
        </li>
        <li>
          <strong>GitHub, Google, and Apple</strong> — only when you choose one of them to sign in.
        </li>
      </ul>
      <p>
        These providers process data on our behalf and may store it on servers in the United States or other
        regions.
      </p>

      <h2>4. Cookies and local storage</h2>
      <p>
        We use your browser&rsquo;s local storage to keep your practice data and preferences on your device.
        If you sign in, we use authentication tokens/cookies to keep you signed in. We do not use advertising
        or cross-site tracking cookies.
      </p>

      <h2>5. Data retention and deletion</h2>
      <ul>
        <li>
          <strong>Local data:</strong> remains until you clear your browser storage or reset it within the
          app.
        </li>
        <li>
          <strong>Account &amp; synced data:</strong> retained while your account is active. You can request
          deletion of your account and all synced data at any time by emailing us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, export, or delete the personal
        data we hold about you, and to object to certain processing. To exercise these rights, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>7. Children</h2>
      <p>
        TypeAlgo is not directed to children under 13, and we do not knowingly collect personal data from
        them. If you believe a child has provided us data, contact us and we will delete it.
      </p>

      <h2>8. Security</h2>
      <p>
        We take reasonable measures to protect your data, including encryption in transit. No method of
        transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo;
        date above. Significant changes will be reflected on this page.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this policy or your data? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  );
}
