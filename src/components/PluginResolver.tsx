import React, { useState, useEffect } from 'react';
import { FileAudio, AlertCircle, Info, Save, X, ChevronDown, Search, Loader2, Calendar, User, Database, Hash, Download, Folder } from 'lucide-react';
import { pluginService } from '../services/pluginService';

interface PluginResolverProps {
  projectId?: string | null;
  isLoggedIn: boolean;
}

const GENRES = ['Electronic', 'Hip Hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'Ambient', 'Techno', 'House', 'Future Bass', 'Other'];

interface Plugin {
  name: string;
  plugin_name: string;
  type: string;
  is_missing?: boolean;
}

const PluginResolver: React.FC<PluginResolverProps> = ({ projectId, isLoggedIn }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Metadata state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState(GENRES[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Track which tags were manually added and might need creation
  const [newTagsToCreate, setNewTagsToCreate] = useState<Set<string>>(new Set());
  const [systemTags, setSystemTags] = useState<Set<string>>(new Set());

  const isViewMode = !!projectId;

  // Group and merge plugins for display as per original design
  const { displayInstruments, displayEffects } = React.useMemo(() => {
    const instMap = new Map<string, string[]>();
    const fxMap = new Map<string, number>();
    
    plugins.forEach(p => {
      if (p.type === 'Channel') {
        const channels = instMap.get(p.plugin_name) || [];
        if (!channels.includes(p.name)) {
          channels.push(p.name);
        }
        instMap.set(p.plugin_name, channels);
      } else if (p.type === 'Effect') {
        fxMap.set(p.plugin_name, (fxMap.get(p.plugin_name) || 0) + 1);
      }
    });
    
    return {
      displayInstruments: Array.from(instMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      displayEffects: Array.from(fxMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    };
  }, [plugins]);

  useEffect(() => {
    if (projectId) {
      const loadDetails = async () => {
        setLoading(true);
        try {
          const result = await pluginService.getFLPDetails(projectId);
          setPlugins(result.plugins);
          setError(result.error);
          
          setTitle(result.name || 'Project ' + projectId);
          setDescription(result.description || 'No description available.');
          setGenre(result.genre || GENRES[0]);
          setTags(result.tags || []);
        } catch (err) {
          setError('Failed to load project details');
        } finally {
          setLoading(false);
        }
      };
      loadDetails();
    }
  }, [projectId]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const isZip = selectedFile.name.toLowerCase().endsWith('.zip');
      const isFLP = selectedFile.name.toLowerCase().endsWith('.flp');
      
      if (!isZip && !isFLP) {
        setError('Please select a valid .zip project bundle or .flp file');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      setLoading(true);
      try {
        const result = await pluginService.uploadProjectBundle(selectedFile);
        setPlugins(result.plugins);
        setError(result.error);
        
        setTitle(result.name || selectedFile.name.replace(/\.(flp|zip)$/i, ''));
        setDescription(result.description || '');
        setGenre(result.genre || GENRES[0]);
        setTags(result.tags || []);
      } catch (err) {
        setError('An error occurred during resolution');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveMetadata = async () => {
    if (!isLoggedIn) return;
    setIsSaving(true);
    try {
      const creationPromises = Array.from(newTagsToCreate)
        .filter(tag => tags.includes(tag))
        .map(tag => pluginService.createTag(tag));
      
      if (creationPromises.length > 0) await Promise.all(creationPromises);

      await pluginService.saveProjectMetadata(projectId || 'temp-id', {
        title,
        description,
        genre,
        tags
      });
      
      setSystemTags(prev => new Set([...prev, ...newTagsToCreate]));
      setNewTagsToCreate(new Set());
      alert('Metadata saved successfully!');
    } catch (err) {
      alert('Failed to save metadata');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!projectId && plugins.length === 0) return;
    setIsDownloading(true);
    try {
      await pluginService.downloadProjectBundle(projectId || 'temp-id');
    } catch (err) {
      alert('Failed to download project bundle');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTagSearch = async (val: string) => {
    setTagInput(val);
    if (val.trim()) {
      try {
        const results = await pluginService.searchTags(val);
        setSystemTags(prev => new Set([...prev, ...results]));
        setTagSuggestions(results.filter(t => !tags.includes(t)));
      } catch (err) {
        setTagSuggestions([]);
      }
    } else {
      setTagSuggestions([]);
    }
  };

  const addTag = (tag: string, isFromSuggestion = false) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      if (!isFromSuggestion && !systemTags.has(trimmed)) {
        setNewTagsToCreate(prev => new Set(prev).add(trimmed));
      }
      setTagInput('');
      setTagSuggestions([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
    if (newTagsToCreate.has(tagToRemove)) {
      const next = new Set(newTagsToCreate);
      next.delete(tagToRemove);
      setNewTagsToCreate(next);
    }
  };

  return (
    <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
      {!projectId && plugins.length === 0 && !loading && (
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="flp-upload"
            className="glass"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '4rem 2rem',
              border: '2px dashed var(--border-color)',
              borderRadius: '20px',
              cursor: isLoggedIn ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              background: isLoggedIn ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
              opacity: isLoggedIn ? 1 : 0.6
            }}
          >
            <input id="flp-upload" type="file" accept=".zip,.flp" onChange={handleFileChange} style={{ display: 'none' }} disabled={!isLoggedIn}/>
            <div style={{ width: '64px', height: '64px', background: 'var(--accent-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
              <Folder size={32} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Upload Project Bundle</h3>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
              {isLoggedIn ? 'Drop your zipped project folder (.zip) or FLP here' : 'Please sign in to upload and analyze project bundles'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', opacity: 0.7 }}>
              Supports recursive FLP discovery within ZIP archives
            </p>
          </label>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="var(--accent-color)" />
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Extracting & Analyzing bundle content...</p>
        </div>
      )}

      {(plugins.length > 0 || projectId) && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
          {/* Left: Plugin List */}
          <div>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
              <FileAudio size={28} color="var(--accent-color)" />
              Bundle DNA
            </h3>
            {file && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={14} /> Source Bundle: {file.name}
              </p>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {displayInstruments.length > 0 && (
                <section>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>Instruments</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {displayInstruments.map(([vstName, channels], index) => (
                      <div key={index} className="glass" style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <Database size={18} color="var(--accent-color)" />
                          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vstName}</span>
                        </div>
                        <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', margin: 0, borderLeft: '1px solid var(--border-color)' }}>
                          {channels.map((chan, cIdx) => (
                            <li key={cIdx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', position: 'relative' }}>
                              <span style={{ position: 'absolute', left: '-1.5rem', top: '50%', width: '0.5rem', height: '1px', background: 'var(--border-color)' }}></span>
                              {chan}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {displayEffects.length > 0 && (
                <section>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>Effects</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {displayEffects.map(([vstName, count], index) => (
                      <div key={index} className="glass" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Hash size={16} color="var(--text-secondary)" />
                          <span style={{ fontWeight: 500 }}>{vstName}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600, background: 'var(--accent-glow)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>
                          Used {count}x
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right: Metadata (View or Edit) */}
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '4rem' }}>
            {isViewMode ? (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '2.5rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-color)', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>
                    Bundle Information
                  </span>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.1 }}>{title}</h2>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <User size={16} /> Virtual_Ripper
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Calendar size={16} /> May 8, 2026
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <Hash size={16} /> {genre}
                    </div>
                  </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', marginBottom: '2rem' }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                    {description}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>Project Tags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{ width: '100%', padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                  >
                    {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    Download Project Bundle (.zip)
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
                  <Info size={28} color="var(--accent-color)" />
                  Bundle Metadata
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Title</label>
                    <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Genre</label>
                    <div style={{ position: 'relative' }}>
                      <select className="input" value={genre} onChange={(e) => setGenre(e.target.value)} style={{ appearance: 'none', cursor: 'pointer', width: '100%' }}>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Tags {newTagsToCreate.size > 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--warning-color)' }}>({newTagsToCreate.size} pending)</span>}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {tags.map(tag => (
                        <span key={tag} style={{ background: newTagsToCreate.has(tag) ? 'rgba(245, 158, 11, 0.1)' : 'var(--accent-glow)', color: newTagsToCreate.has(tag) ? '#f59e0b' : 'var(--accent-color)', border: newTagsToCreate.has(tag) ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {tag} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
                        </span>
                      ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input type="text" className="input" value={tagInput} onChange={(e) => handleTagSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag(tagInput)} placeholder="Search or add tags..." style={{ paddingLeft: '2.5rem', width: '100%' }}/>
                      <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      {tagSuggestions.length > 0 && (
                        <div className="glass" style={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 10, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'rgba(23, 23, 23, 0.95)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          {tagSuggestions.map(tag => (
                            <div key={tag} onClick={() => addTag(tag, true)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                              {tag}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</label>
                    <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project..." rows={4} style={{ resize: 'none', width: '100%' }}/>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleSaveMetadata} disabled={isSaving || !isLoggedIn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}>
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save Info & Tags
                    </button>
                    <button className="btn btn-outline" onClick={handleDownload} disabled={isDownloading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}>
                      {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                      Download Bundle
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}
    </div>
  );
};

export default PluginResolver;
