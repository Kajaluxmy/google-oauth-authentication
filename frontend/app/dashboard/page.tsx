'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          clearSession();
          router.replace('/login');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        clearSession();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    document.cookie = 'accessToken=; path=/; max-age=0';
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#071A3D',
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '500' }}>
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const initial = (user.name?.trim().charAt(0) || user.email?.trim().charAt(0) || 'U').toUpperCase();

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#071A3D',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: '#071A3D',
            color: '#FFFFFF',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          User Dashboard
        </div>

        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 20px auto',
            backgroundColor: '#071A3D',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: '700',
            border: '4px solid #071A3D',
            boxShadow: '0 8px 24px rgba(7, 26, 61, 0.25)',
          }}
        >
          {initial}
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name || 'User Avatar'}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#071A3D',
            marginBottom: '8px',
          }}
        >
          {user.name || 'User'}
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#0B2A6F',
            marginBottom: '24px',
            fontWeight: '500',
          }}
        >
          {user.email}
        </p>

        <div
          style={{
            backgroundColor: '#F0F4FA',
            border: '1px solid #D0DCEE',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '30px',
            fontSize: '14px',
            color: '#071A3D',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: '600' }}>User ID:</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              backgroundColor: '#FFFFFF',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #D0DCEE',
              color: '#071A3D',
            }}
          >
            {user.id}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#071A3D',
            color: '#FFFFFF',
            border: '2px solid #071A3D',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 12px rgba(7, 26, 61, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0B2A6F';
            e.currentTarget.style.borderColor = '#0B2A6F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#071A3D';
            e.currentTarget.style.borderColor = '#071A3D';
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}