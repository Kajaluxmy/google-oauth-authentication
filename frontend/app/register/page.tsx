'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError('');

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.',
      );
      return;
    }

    localStorage.setItem(
      'isLoggedIn',
      'true',
    );

    localStorage.setItem(
      'user',
      JSON.stringify({
        name,
        email,
      }),
    );

    router.push('/dashboard');
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
          'Google ID token was not received.',
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
            'Google registration failed.',
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
          'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(
      'Google registration was unsuccessful.',
    );
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fb',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          padding: '35px',
          borderRadius: '12px',
          boxShadow:
            '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: '30px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#071A3D',
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#666666',
            marginBottom: '25px',
          }}
        >
          Register to get started
        </p>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#071A3D',
              }}
            >
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #CBD5E1',
                borderRadius: '7px',
                outline: 'none',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
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
                padding: '12px',
                border: '1px solid #CBD5E1',
                borderRadius: '7px',
                outline: 'none',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
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
                padding: '12px',
                border: '1px solid #CBD5E1',
                borderRadius: '7px',
                outline: 'none',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#071A3D',
              }}
            >
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #CBD5E1',
                borderRadius: '7px',
                outline: 'none',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: '#DC2626',
                fontSize: '14px',
                marginBottom: '15px',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#071A3D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Register
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '25px 0',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#DDDDDD',
            }}
          />

          <span
            style={{
              color: '#888888',
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#DDDDDD',
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
                color: '#475569',
              }}
            >
              Creating account...
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

        <p
          style={{
            textAlign: 'center',
            marginTop: '25px',
            color: '#666666',
          }}
        >
          Already have an account?{' '}

          <button
            type="button"
            onClick={() =>
              router.push('/login')
            }
            style={{
              border: 'none',
              background: 'none',
              color: '#2563EB',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}