export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Purtivon Privacy Policy — how we collect, use, and protect your personal data.',
}

const SECTIONS = [
  {
    title: '1. Who We Are',
    body: 'Purtivon ("we", "us", "our") is a media and PR consultancy specialising in FDI and financial services recognition. This Privacy Policy explains how we collect, use, disclose, and protect information about you when you use our platform, submit award nominations, or engage with our services.',
  },
  {
    title: '2. Information We Collect',
    body: 'We collect the following categories of personal data: (a) Account information — name, email address, and password when you register; (b) Nomination data — company name, contact details, and submission content provided when you enter an award; (c) Communications data — messages you send us via our contact form or email; (d) Usage data — information about how you interact with our platform, including IP address, browser type, and pages visited.',
  },
  {
    title: '3. How We Use Your Information',
    body: 'We use your personal data to: (a) provide, operate, and maintain our Services; (b) process and evaluate award nominations; (c) respond to enquiries and provide customer support; (d) improve and personalise your experience on our platform; (e) comply with legal obligations; and (f) send service-related communications such as account notifications and status updates.',
  },
  {
    title: '4. Legal Basis for Processing',
    body: 'We process your personal data on the following legal bases: (a) Contract — processing necessary to perform our contract with you, including managing your account and processing award nominations; (b) Legitimate Interests — for purposes such as improving our services and preventing fraud; (c) Legal Obligation — where required by applicable law.',
  },
  {
    title: '5. Data Sharing and Disclosure',
    body: 'We do not sell your personal data. We may share your information with: (a) service providers who assist us in operating our platform and delivering our services, under appropriate data processing agreements; (b) award judges, on a confidential basis, to the extent necessary to evaluate nominations; (c) law enforcement or regulatory authorities where required by law; and (d) successors in the event of a merger, acquisition, or sale of assets.',
  },
  {
    title: '6. Data Retention',
    body: 'We retain personal data for as long as necessary to fulfil the purposes for which it was collected, including satisfying legal, accounting, or reporting requirements. Award nomination data is retained for seven years to maintain a historical record of our programmes.',
  },
  {
    title: '7. Your Rights',
    body: 'Subject to applicable law, you have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate data; (c) request deletion of your data; (d) object to or restrict our processing of your data; (e) data portability; and (f) withdraw consent where processing is based on consent. To exercise any of these rights, please contact privacy@purtivon.com.',
  },
  {
    title: '8. Security',
    body: 'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Passwords are hashed using industry-standard algorithms and are never stored in plaintext. Despite these measures, no transmission over the internet is completely secure, and we cannot guarantee the absolute security of your data.',
  },
  {
    title: '9. Cookies',
    body: 'We use essential cookies to operate the platform, including session cookies for authentication. We do not currently use tracking or advertising cookies. If this changes, we will update this policy and seek your consent where required.',
  },
  {
    title: '10. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last Updated" date. We encourage you to review this Policy periodically.',
  },
  {
    title: '11. Contact Us',
    body: 'For privacy-related enquiries, please contact our data protection contact at privacy@purtivon.com. You also have the right to lodge a complaint with the Information Commissioner\'s Office (ICO) in the UK if you believe your data has been processed unlawfully.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex-1 pt-24">
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '5rem 2.5rem 8rem' }}>
        <div className="eyebrow" style={{ marginBottom: '1.25rem' }}>Legal</div>
        <h1 className="display-lg" style={{ marginBottom: '1rem' }}>Privacy Policy</h1>
        <p className="body-sm" style={{ marginBottom: '3rem', color: 'var(--text-muted)' }}>
          Last updated: 1 January 2026
        </p>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: '3rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {SECTIONS.map(({ title, body }) => (
            <section key={title}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{title}</h2>
              <p className="body-sm" style={{ lineHeight: 1.8 }}>{body}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/terms" className="btn btn-ghost btn-sm">Terms of Service →</Link>
          <Link href="/contact" className="btn btn-ghost btn-sm">Contact Us →</Link>
        </div>
      </div>
    </div>
  )
}
