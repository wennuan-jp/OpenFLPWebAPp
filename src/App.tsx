import PluginResolver from './components/PluginResolver'

function App() {
  return (
    <div className="min-h-screen">
      {/* Background blobs */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-10%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--accent-color)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>F</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>OpenFLP</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Platform</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Solutions</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Developers</a>
        </nav>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign In</button>
      </header>

      <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <section className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Reconstruct Your Sound
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            Upload your FLP project files to analyze plugin dependencies and reconstruct missing assets with ease.
          </p>
        </section>

        <PluginResolver />

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '8rem' }}>
          <div className="glass" style={{ padding: '2.5rem' }}>
            <div style={{ color: 'var(--accent-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>⚡️</div>
            <h3 style={{ marginBottom: '1rem' }}>High Performance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Optimized for low-latency resolution and high-throughput transaction processing.
            </p>
          </div>
          <div className="glass" style={{ padding: '2.5rem' }}>
            <div style={{ color: 'var(--success-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🛡️</div>
            <h3 style={{ marginBottom: '1rem' }}>Rock-Solid Security</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Advanced cryptographic proofs ensure the integrity and liveness of every resolution.
            </p>
          </div>
          <div className="glass" style={{ padding: '2.5rem' }}>
            <div style={{ color: 'var(--warning-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🌐</div>
            <h3 style={{ marginBottom: '1rem' }}>Global Scalability</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Distributed by design. Scale horizontally across regions with zero single points of failure.
            </p>
          </div>
        </section>
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
  )
}


export default App
