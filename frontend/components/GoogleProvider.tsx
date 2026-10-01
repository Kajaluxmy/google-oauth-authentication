'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleProviderProps {
  children: React.ReactNode;
}

export default function GoogleProvider({
  children,
}: GoogleProviderProps) {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div>
        Google Client ID is not configured.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}