import React, { useState, useRef } from 'react';
import { Upload, FileAudio, XCircle, Loader2, Music } from 'lucide-react';

interface Plugin {
  name: string;
  plugin_name: string;
  type: 'Channel' | 'Effect';
  is_missing?: boolean; // We'll simulate this or add logic later
}

interface ResolutionResult {
  plugins: Plugin[];
  error: string | null;
}

const PluginResolver: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.flp')) {
        setError('Please select a valid .flp file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data: ResolutionResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Resolution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to resolution server. Is it running on port 8080?');
      
      // Fallback to mock data for demonstration if server is down
      // This helps the user see how it would look
      /*
      setResult({
        plugins: [
          { name: 'Lead Synth', plugin_name: 'Serum', type: 'Channel' },
          { name: 'Sub Bass', plugin_name: 'Vital', type: 'Channel' },
          { name: 'Kick', plugin_name: 'Fruity Sampler', type: 'Channel' },
          { name: 'Master Chain', plugin_name: 'Ozone 10', type: 'Effect' },
          { name: 'Reverb Bus', plugin_name: 'ValhallaVintageVerb', type: 'Effect' }
        ],
        error: null
      });
      */
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Music size={24} color="var(--accent-color)" />
          Plugin Explorer
        </h2>
        
        {!file ? (
          <div className="upload-area" onClick={triggerFileInput}>
            <Upload size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Upload FLP Project</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Drag and drop your project file here or click to browse</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".flp" 
              style={{ display: 'none' }} 
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <FileAudio size={64} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>{file.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-primary" 
                onClick={uploadFile} 
                disabled={loading}
                style={{ minWidth: '160px' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} style={{ marginRight: '0.5rem' }} />
                    Analyzing...
                  </>
                ) : 'Resolve Plugins'}
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => setFile(null)} 
                disabled={loading}
              >
                Change File
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error-color)', 
            borderRadius: '12px',
            color: 'var(--error-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <XCircle size={18} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="animate-fade-in">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '3rem',
            alignItems: 'flex-start'
          }}>
            {/* Instruments Section */}
            {(() => {
              const instrumentGroups = result.plugins
                .filter(p => p.type === 'Channel')
                .reduce((acc, plugin) => {
                  if (!acc[plugin.plugin_name]) {
                    acc[plugin.plugin_name] = [];
                  }
                  acc[plugin.plugin_name].push(plugin);
                  return acc;
                }, {} as Record<string, Plugin[]>);

              const instrumentEntries = Object.entries(instrumentGroups);

              return instrumentEntries.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Instruments
                    <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                      ({instrumentEntries.length} unique)
                    </span>
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {instrumentEntries.map(([pluginName, plugins], index) => (
                      <div key={index} className="plugin-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                            {pluginName}
                          </span>
                          <div className={`status-badge ${plugins.some(p => p.is_missing) ? 'status-missing' : 'status-found'}`}>
                            {plugins.some(p => p.is_missing) ? 'Missing' : 'Installed'}
                          </div>
                        </div>
                        
                        <div style={{ width: '100%', paddingLeft: '0.5rem' }}>
                          <ul style={{ 
                            listStyle: 'none', 
                            padding: 0, 
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem'
                          }}>
                            {plugins.map((p, i) => (
                              <li key={i} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.6rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: 500
                              }}>
                                <div style={{ 
                                  width: '4px', 
                                  height: '4px', 
                                  borderRadius: '50%', 
                                  background: 'var(--accent-color)',
                                  opacity: 0.6
                                }} />
                                {p.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Effects Section */}
            {result.plugins.filter(p => p.type === 'Effect').length > 0 && (
              <div>
                <h3 style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Effects
                  <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                    ({result.plugins.filter(p => p.type === 'Effect').length})
                  </span>
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {result.plugins.filter(p => p.type === 'Effect').map((plugin, index) => (
                    <div key={index} className="plugin-card">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                          {plugin.plugin_name}
                        </span>
                      </div>
                      <div className={`status-badge ${plugin.is_missing ? 'status-missing' : 'status-found'}`}>
                        {plugin.is_missing ? 'Missing' : 'Installed'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {result.plugins.length === 0 && (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No plugins or effects were detected in this project.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PluginResolver;
