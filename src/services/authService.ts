import { isStandalone, simulateDelay } from './config';

export interface User {
  id: string;
  email: string;
  name: string;
}

// Mock data for auth
const MOCK_USER: User = {
  id: 'user_123',
  email: 'dev@openflp.com',
  name: 'Dev User'
};

export const authService = {
  async login(email: string, _password?: string): Promise<void> {
    if (isStandalone) {
      console.log('[Standalone Mode] Simulating Login for:', email);
      await simulateDelay(800);
      const mockToken = 'mock_token_' + btoa(email).substring(0, 10);
      localStorage.setItem('openflp_token', mockToken);
      window.location.href = '/';
      return;
    }
    // Real logic would be a fetch to your auth endpoint
    alert('Real Auth logic not implemented yet.');
  },

  async signIn(): Promise<void> {
    if (isStandalone) {
      console.log('[Standalone Mode] Simulating Cognito Sign In redirect...');
      await simulateDelay(500);
      // In standalone, we can just "fake" the redirect back with a mock token
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(7);
      window.location.href = `/#access_token=${mockToken}`;
      return;
    }

    // Real Cognito redirect
    // const cognitoUrl = `https://${DOMAIN}.auth.${REGION}.amazoncognito.com/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid&redirect_uri=${REDIRECT_URI}`;
    // window.location.href = cognitoUrl;
    alert('Redirecting to Cognito... (In a real setup, this would open the Hosted UI)');
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('openflp_token');
    window.location.reload();
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem('openflp_token');
    if (!token) return null;
    
    if (isStandalone) return MOCK_USER;
    
    // In real mode, you might decode the JWT or call a /me endpoint
    return { id: 'real_id', email: 'real@email.com', name: 'Real User' };
  }
};
