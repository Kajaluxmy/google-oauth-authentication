import type { Metadata } from 'next';
import './globals.css';

import GoogleProvider from '../components/GoogleProvider';

export const metadata: Metadata = {
  title: 'Google OAuth App',
  description: 'Google OAuth with Next.js and NestJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleProvider>
          {children}
        </GoogleProvider>
      </body>
    </html>
  );
}