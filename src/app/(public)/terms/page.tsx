import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Purtivon Terms of Service — the rules and conditions governing your use of our platform and services.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using Purtivon\'s platform, website, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services. These Terms apply to all visitors, users, and others who access the Services.',
  },
  {
    title: '2. Description of Services',
    body: 'Purtivon provides award programmes, media and public relations services, FDI intelligence research, and related communications services for organisations operating in the financial services and foreign direct investment sectors. The specific scope of services is defined in individual service agreements or, for platform users, through the features made available at the time of registration.',
  },
  {
    title: '3. User Accounts',
    body: 'To access certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account.',
  },
  {
    title: '4. Award Nominations and Submissions',
    body: 'By submitting a nomination, you warrant that the information provided is accurate, complete, and not misleading. Purtivon reserves the right to disqualify any nomination that is found to contain false or misleading information. All judging decisions are final. The submission of a nomination does not guarantee an award, shortlisting, or any form of recognition. Submission fees, where applicable, are non-refundable.',
  },
  {
    title: '5. Intellectual Property',
    body: 'All content on the Purtivon platform, including text, graphics, logos, award designations, and research reports, is the property of Purtivon or its content providers and is protected by applicable intellectual property laws. Award winners are granted a limited, non-exclusive licence to use Purtivon award badges and designations for marketing purposes, subject to brand guidelines provided at the time of the award.',
  },
  {
    title: '6. Prohibited Conduct',
    body: 'You agree not to: (a) use the Services for any unlawful purpose; (b) submit false or misleading information in connection with award nominations; (c) attempt to gain unauthorised access to any part of the Services; (d) use automated means to access the Services without our prior written consent; (e) reproduce, distribute, or create derivative works from our content without authorisation; or (f) engage in any conduct that disrupts or interferes with the Services.',
  },
  {
    title: '7. Disclaimer of Warranties',
    body: 'The Services are provided on an "as is" and "as available" basis. Purtivon makes no warranties, express or implied, regarding the Services, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'To the fullest extent permitted by applicable law, Purtivon shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Services. Our total liability to you for any claims arising from or related to these Terms or the Services shall not exceed the amount paid by you to Purtivon in the twelve months preceding the claim.',
  },
  {
    title: '9. Changes to Terms',
    body: 'We may modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date at the top of this page. Your continued use of the Services after such changes constitutes your acceptance of the revised Terms.',
  },
  {
    title: '10. Governing Law',
    body: 'These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
  },
  {
    title: '11. Contact',
    body: 'If you have any questions about these Terms, please contact us at legal@purtivon.com or write to us at our registered office address.',
  },
]

export default function TermsPage() {
  return (
    <div className="flex-1 pt-24">
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '5rem 2.5rem 8rem' }}>
        <div className="eyebrow" style={{ marginBottom: '1.25rem' }}>Legal</div>
        <h1 className="display-lg" style={{ marginBottom: '1rem' }}>Terms of Service</h1>
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
          <Link href="/privacy" className="btn btn-ghost btn-sm">Privacy Policy →</Link>
          <Link href="/contact" className="btn btn-ghost btn-sm">Contact Us →</Link>
        </div>
      </div>
    </div>
  )
}
