import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import PluginResolver from './components/PluginResolver'
import AuthToken from './components/AuthToken'
import LoginPage from './components/LoginPage'
import BrowseFLPs from './components/BrowseFLPs'
import MyPage from './components/MyPage'
import { authService } from './services/authService'
import { isStandalone } from './services/config'

// Layout wrapper for consistent styling
const Layout: React.FC<{ children: React.ReactNode, isLoggedIn: boolean, onSignOut: () => void }> = ({ children, isLoggedIn, onSignOut }) => {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    if (isStandalone) {
      navigate('/login');
    } else {
      authService.login(''); // This will redirect to Cognito
    }
  };

  return (
    <div className="min-h-screen">
      {/* ... blobs ... */}
      <header className="glass" style={{
        margin: '1.5rem',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '1.5rem',
        zIndex: 100
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--accent-color)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: 'white'
          }}>F</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>OpenFLP</span>
        </Link>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {isLoggedIn && (
            <>
              <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Explore</Link>
              <Link to="/my-page" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>My Page</Link>
            </>
          )}
        </nav>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Online</span>
            </div>
            <button className="btn btn-outline" onClick={onSignOut} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign Out</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleSignIn} style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>Sign In</button>
        )}
      </header>

      <main className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        {children}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '4rem 2rem', marginTop: '4rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            © 2026 OpenFLP Foundation. Open source under MIT.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Github</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Twitter</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProjectDetailsPage = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { id } = useParams();
  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Project Details</h2>
      <PluginResolver projectId={id} isLoggedIn={isLoggedIn} />
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!authService.getCurrentUser());
  }, []);

  const handleSignOut = () => {
    authService.signOut();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth-token" element={<AuthToken />} />
        <Route path="/" element={
          <Layout isLoggedIn={isLoggedIn} onSignOut={handleSignOut}>
            <section className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                Explore the Soundscape
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                Discover community-shared FLP projects and analyze their technical DNA.
              </p>
            </section>
            <BrowseFLPs onSelectProject={(id) => window.location.href = `/project/${id}`} />
          </Layout>
        } />
        <Route path="/project/:id" element={
          <Layout isLoggedIn={isLoggedIn} onSignOut={handleSignOut}>
            <ProjectDetailsPage isLoggedIn={isLoggedIn} />
          </Layout>
        } />
        <Route path="/upload" element={
          <Layout isLoggedIn={isLoggedIn} onSignOut={handleSignOut}>
            <section className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                Share Your Creation
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                Analyze your plugin dependencies and help the community reconstruct missing assets.
              </p>
            </section>
            <PluginResolver isLoggedIn={isLoggedIn} />
          </Layout>
        } />
        <Route path="/my-page" element={
          <Layout isLoggedIn={isLoggedIn} onSignOut={handleSignOut}>
            <MyPage />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

