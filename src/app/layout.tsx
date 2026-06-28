import './globals.css';

export const metadata = {
  title: 'IR Transcripts // Money Machine Control Cockpit',
  description: 'Real-time transactional guardrails and operational control panel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
