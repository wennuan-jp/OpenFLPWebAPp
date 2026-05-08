import React, { useEffect, useState } from 'react';
import { LayoutGrid, Plus, Music, History, Settings, Loader2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pluginService } from '../services/pluginService';
import type { FLPProject } from '../services/pluginService';

const MyPage: React.FC = () => {
  const [projects, setProjects] = useState<FLPProject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const data = await pluginService.listMyFLPs();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load your projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header section with Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Workspace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your projects and reconstruction progress</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/upload')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
        >
          <Plus size={20} /> Upload FLP
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--accent-color)',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <LayoutGrid size={18} /> Projects
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '12px', 
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <History size={18} /> Recent Activity
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '12px', 
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <Settings size={18} /> Settings
          </div>
        </aside>

        {/* Content Area */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            All Projects 
            <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              ({projects.length})
            </span>
          </h3>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--accent-color)" />
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Music size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't uploaded any projects yet.</p>
              <button className="btn btn-outline" onClick={() => navigate('/upload')}>Start your first upload</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map(project => (
                <div 
                  key={project.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => navigate(`/project/${project.id}`)}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--success-color)'
                    }}>
                      <Music size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{project.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {project.uploadDate} • {project.pluginsCount} plugins detected
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
