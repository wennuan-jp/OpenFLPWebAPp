import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthToken = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cognito Hosted UI redirects with tokens in the URL hash (fragment)
    // Example: #id_token=xxx&access_token=yyy&expires_in=3600&token_type=Bearer
    const hash = location.hash;
    
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove the #
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');

      if (accessToken || idToken) {
        // Store the token
        localStorage.setItem('openflp_token', accessToken || idToken || '');
        
        console.log('Login successful, token stored.');
        
        // Redirect to home or previous page
        navigate('/', { replace: true });
      } else {
        console.error('No token found in redirect URL');
        navigate('/', { replace: true });
      }
    } else {
      // Handle query params if using Authorization Code Grant (with a backend exchange)
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      
      if (code) {
        console.log('Authorization code received:', code);
        // navigate('/exchange-code?code=' + code);
      } else {
        navigate('/');
      }
    }
  }, [location, navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-primary)'
    }}>
      <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid var(--accent-glow)',
          borderTop: '3px solid var(--accent-color)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem auto'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h2 style={{ marginBottom: '1rem' }}>Completing Sign In</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Securely authenticating your session...</p>
      </div>
    </div>
  );
};

export default AuthToken;
