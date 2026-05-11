export const COGNITO_CONFIG = {
  region: import.meta.env.VITE_COGNITO_REGION || '',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
  redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || 'http://localhost:5173/callback',
  responseType: 'code',
  scope: 'email openid phone',
};

export const getCognitoLoginUrl = () => {
  const { domain, clientId, redirectUri, responseType, scope } = COGNITO_CONFIG;
  const encodedScope = scope.split(' ').join('+');
  return `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${encodedScope}&redirect_uri=${encodeURIComponent(redirectUri)}`;
};
