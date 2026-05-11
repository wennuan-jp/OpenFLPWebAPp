import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COGNITO_CONFIG } from '../services/authConfig';
import { AlertCircle, Loader2 } from 'lucide-react';

const AuthToken = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasExchanged = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasExchanged.current) return;

    const hash = location.hash;
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    
    // 1. Handle Implicit Grant (tokens in hash)
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');

      if (accessToken || idToken) {
        localStorage.setItem('openflp_token', accessToken || idToken || '');
        navigate('/', { replace: true });
        window.location.reload();
        return;
      }
    } 

    // 2. Handle Authorization Code Grant (code in query)
    if (code) {
      hasExchanged.current = true;
      
      const exchangeCode = async () => {
        const { domain, clientId, redirectUri } = COGNITO_CONFIG;
        const tokenEndpoint = `https://${domain}/oauth2/token`;
        
        console.log('Exchanging code for tokens at:', tokenEndpoint);
        console.log('Using Redirect URI:', redirectUri);

        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri
        });

        try {
          const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Cognito Token Error:', errorData);
            throw new Error(errorData.error || `Server responded with ${response.status}`);
          }

          const data = await response.json();
          // We prefer the id_token for user info, but access_token is needed for API calls
          localStorage.setItem('openflp_token', data.id_token || data.access_token);
          
          if (data.id_token) {
            // Simple extraction of email from JWT (mocking decode for now)
            localStorage.setItem('user_email', 'authenticated_user');
          }
          
          console.log('Authentication Successful');
          navigate('/', { replace: true });
          window.location.reload();
        } catch (err: any) {
          console.error('Token Exchange Failed:', err);
          setError(err.message || 'An unexpected error occurred during authentication.');
        }
      };

      exchangeCode();
    } else if (!hash) {
      // If no code and no hash, something is wrong
      setError('No authentication data found in the URL.');
    }
  }, [location, navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-color)',
      color: 'var(--text-primary)',
      padding: '2rem'
    }}>
      <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '450px', width: '100%' }}>
        {!error ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
            </div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Completing Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Exchanging your secure credentials with Cognito. This will only take a moment...
            </p>
          </>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--error-color)' }}>
              <AlertCircle size={48} />
            </div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--error-color)' }}>Authentication Failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              {error}
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/login')}
              style={{ width: '100%' }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthToken;
