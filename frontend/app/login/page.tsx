'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleManualLogin = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError('');

    const correctEmail = 'admin@gmail.com';
    const correctPassword = '123456';

    if (
      email === correctEmail &&
      password === correctPassword
    ) {
      localStorage.setItem(
        'isLoggedIn',
        'true',
      );

      localStorage.setItem(
        'user',
        JSON.stringify({
          name: 'Admin',
          email: email,
        }),
      );

      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: any,
  ) => {
    setError('');
    setLoading(true);

    try {
      const idToken =
        credentialResponse.credential;

      if (!idToken) {
        throw new Error(
          'Google ID token was not received',
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Google login failed',
        );
      }

      localStorage.setItem(
        'accessToken',
        data.accessToken,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      localStorage.setItem(
        'isLoggedIn',
        'true',
      );

      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600; SameSite=Lax`;

      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(
      'Google login was unsuccessful',
    );
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#071A3D',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '400px',
          maxWidth: '100%',
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <h1
            style={{
              fontSize: '30px',
              fontWeight: '700',
              color: '#071A3D',
              marginBottom: '8px',
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              color: '#64748B',
              margin: 0,
            }}
          >
            Sign in to your account
          </p>
        </div>

        {error && (
          <div
            style={{
              color: '#B91C1C',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleManualLogin}>
          <div
            style={{
              marginBottom: '18px',
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontWeight: '600',
                color: '#071A3D',
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={{
                width: '100%',
                padding: '13px 14px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              marginBottom: '22px',
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontWeight: '600',
                color: '#071A3D',
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                width: '100%',
                padding: '13px 14px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: '#0B2A6F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '25px 0',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#E2E8F0',
            }}
          />

          <span
            style={{
              color: '#64748B',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#E2E8F0',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <p
              style={{
                color: '#64748B',
              }}
            >
              Signing in...
            </p>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="320"
            />
          )}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '28px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#64748B',
            }}
          >
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() =>
                router.push('/register')
              }
              style={{
                border: 'none',
                background: 'none',
                color: '#2563EB',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                padding: 0,
              }}
            >
              Register
            </button>
          </p>

          <p
            style={{
              marginTop: '10px',
              marginBottom: 0,
              fontSize: '12px',
              color: '#94A3B8',
            }}
          >
            Secure login with email or Google
          </p>
        </div>
      </div>
    </main>
  );
}