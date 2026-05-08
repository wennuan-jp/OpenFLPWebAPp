import React, { useEffect, useState } from 'react';
import { Search, FolderOpen, User, Calendar, Database, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pluginService } from '../services/pluginService';
import type { FLPProject } from '../services/pluginService';

interface BrowseFLPsProps {
  onSelectProject?: (id: string) => void;
}

const BrowseFLPs: React.FC<BrowseFLPsProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<FLPProject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProjectSelect = (id: string) => {
    if (onSelectProject) {
      onSelectProject(id);
    } else {
      navigate(`/project/${id}`);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await pluginService.listFLPs();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-color)" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FolderOpen size={24} color="var(--accent-color)" />
          Explore Projects
        </h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search projects or authors..." 
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.8rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              color: 'white',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <div 
            key={project.id} 
            className="glass" 
            style={{ 
              padding: '1.5rem', 
              cursor: 'pointer', 
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              border: '1px solid var(--border-color)'
            }}
            onClick={() => handleProjectSelect(project.id)}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-color)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{project.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <User size={14} /> {project.author}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Calendar size={14} /> {project.uploadDate}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Database size={14} /> {project.size} • {project.pluginsCount} plugins
              </div>
            </div>

            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'var(--accent-color)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              View Details <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseFLPs;
