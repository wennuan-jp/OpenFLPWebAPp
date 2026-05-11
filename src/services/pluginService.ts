import { isStandalone, API_BASE_URL, getAuthHeader, simulateDelay } from './config';

export interface Plugin {
  name: string;
  plugin_name: string;
  type: 'Channel' | 'Effect';
  is_missing?: boolean;
}

export interface ResolutionResult {
  id: string;
  name: string;
  description: string;
  genre: string;
  tags: string[];
  plugins: Plugin[];
  error: string | null;
}

export interface FLPProject {
  id: string;
  name: string;
  author: string;
  uploadDate: string;
  size: string;
  pluginsCount: number;
}

// Realistic Mock Projects for browsing
const MOCK_PROJECTS: FLPProject[] = [
  { id: '1', name: 'Future Bass Masterclass.flp', author: 'Virtual_Ripper', uploadDate: '2026-05-01', size: '2.4 MB', pluginsCount: 12 },
  { id: '2', name: 'Techno_Rumble_Template.flp', author: 'Dark_Oscillator', uploadDate: '2026-05-03', size: '1.8 MB', pluginsCount: 8 },
  { id: '3', name: 'LoFi_HipHop_Vibes.flp', author: 'Chill_Path', uploadDate: '2026-05-05', size: '4.1 MB', pluginsCount: 15 },
  { id: '4', name: 'Cinematic_Impact_FX.flp', author: 'Hans_Synth', uploadDate: '2026-05-07', size: '12.5 MB', pluginsCount: 22 },
];

// Detailed mock results for specific projects
const MOCK_DETAILS: Record<string, ResolutionResult> = {
  '1': {
    id: '1',
    name: 'Future Bass Masterclass.flp',
    description: 'A high-energy project featuring multi-layered synthesis and complex rhythmic patterns.',
    genre: 'Future Bass',
    tags: ['Electronic', 'Serum', 'Mastering'],
    plugins: [
      { name: 'Main Synth', plugin_name: 'Serum', type: 'Channel', is_missing: false },
      { name: 'Sub Power', plugin_name: 'Vital', type: 'Channel', is_missing: false },
      { name: 'Master Comp', plugin_name: 'OTT', type: 'Effect', is_missing: false },
      { name: 'Reverb Room', plugin_name: 'ValhallaRoom', type: 'Effect', is_missing: true }
    ],
    error: null
  },
  '2': {
    id: '2',
    name: 'Techno_Rumble_Template.flp',
    description: 'Dark and driving techno template with a heavy focus on industrial textures.',
    genre: 'Techno',
    tags: ['Techno', 'Industrial', 'Drums'],
    plugins: [
      { name: 'Kick Drum', plugin_name: 'Fruity Sampler', type: 'Channel', is_missing: false },
      { name: 'Rumble Bass', plugin_name: '3x Osc', type: 'Channel', is_missing: false },
      { name: 'Distortion', plugin_name: 'FabFilter Saturn 2', type: 'Effect', is_missing: true }
    ],
    error: null
  }
};

const DEFAULT_UPLOAD_RESULT: ResolutionResult = {
  id: 'temp-id',
  name: 'New Project',
  description: '',
  genre: 'Other',
  tags: [],
  plugins: [
    { name: 'Lead Synth', plugin_name: 'Serum', type: 'Channel', is_missing: false },
    { name: 'Sub Bass', plugin_name: 'Vital', type: 'Channel', is_missing: false },
    { name: 'Kick', plugin_name: 'Fruity Sampler', type: 'Channel', is_missing: false },
    { name: 'Snare', plugin_name: 'Fruity Sampler', type: 'Channel', is_missing: true },
    { name: 'Master Chain', plugin_name: 'Ozone 10', type: 'Effect', is_missing: false },
    { name: 'Reverb Bus', plugin_name: 'ValhallaVintageVerb', type: 'Effect', is_missing: false },
    { name: 'Vocals', plugin_name: 'Auto-Tune Pro', type: 'Effect', is_missing: true }
  ],
  error: null
};

// Projects owned by the current user
const MOCK_MY_PROJECTS: FLPProject[] = [
  { id: 'my-1', name: 'My Awesome Track.flp', author: 'Dev User', uploadDate: '2026-05-08', size: '3.2 MB', pluginsCount: 18 },
  { id: 'my-2', name: 'WIP_Melodic_Techno.flp', author: 'Dev User', uploadDate: '2026-05-07', size: '1.5 MB', pluginsCount: 5 },
];

export const pluginService = {
  async listFLPs(): Promise<FLPProject[]> {
    if (isStandalone) {
      await simulateDelay(800);
      return MOCK_PROJECTS;
    }
    const response = await fetch(`${API_BASE_URL}/v1/list`);
    if (!response.ok) throw new Error('Failed to fetch project list');
    return await response.json();
  },

  async listMyFLPs(): Promise<FLPProject[]> {
    if (isStandalone) {
      await simulateDelay(600);
      return MOCK_MY_PROJECTS;
    }
    const response = await fetch(`${API_BASE_URL}/v1/my-list`, {
      headers: { 'Authorization': getAuthHeader() }
    });
    if (!response.ok) throw new Error('Failed to fetch your projects');
    return await response.json();
  },

  async searchTags(query: string): Promise<string[]> {
    if (isStandalone) {
      const allTags = ['Electronic', 'Bass', 'Vocal', 'Mastering', 'Template', 'Serum', 'Sylenth1', 'Drums', 'Cinematic'];
      await simulateDelay(300);
      return allTags.filter(t => t.toLowerCase().includes(query.toLowerCase()));
    }
    const response = await fetch(`${API_BASE_URL}/v1/tags/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    return await response.json();
  },

  async createTag(name: string): Promise<void> {
    if (isStandalone) {
      console.log('[Standalone Mode] Creating New Tag:', name);
      await simulateDelay(400);
      return;
    }
    const response = await fetch(`${API_BASE_URL}/v1/tags`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create tag');
  },

  async saveProjectMetadata(id: string, metadata: { title: string; description: string; genre: string; tags: string[] }): Promise<void> {
    if (isStandalone) {
      console.log('[Standalone Mode] Saving Metadata for:', id, metadata);
      await simulateDelay(1000);
      return;
    }
    const response = await fetch(`${API_BASE_URL}/v1/project/${id}/metadata`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify(metadata)
    });
    if (!response.ok) throw new Error('Failed to save metadata');
  },

  async getFLPDetails(id: string): Promise<ResolutionResult> {
    if (isStandalone) {
      await simulateDelay(600);
      return MOCK_DETAILS[id] || DEFAULT_UPLOAD_RESULT;
    }
    const response = await fetch(`${API_BASE_URL}/v1/details/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project details');
    return await response.json();
  },

  async uploadProjectBundle(file: File): Promise<ResolutionResult> {
    if (isStandalone) {
      console.log('[Standalone Mode] Analyzing Project Bundle:', file.name);
      await simulateDelay(2000);
      
      // Simulate unzipping and recursive finding
      if (file.name.toLowerCase().endsWith('.zip')) {
        console.log('[Standalone Mode] Unzipping and finding .flp files recursively...');
      }
      return DEFAULT_UPLOAD_RESULT;
    }

    const formData = new FormData();
    formData.append('bundle', file);
    const response = await fetch(`${API_BASE_URL}/v1/upload-bundle`, {
      method: 'POST',
      headers: { 'Authorization': getAuthHeader() },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload project bundle');
    return await response.json();
  },

  async downloadProjectBundle(projectId: string): Promise<void> {
    if (isStandalone) {
      console.log('[Standalone Mode] Preparing Download for Project:', projectId);
      await simulateDelay(1000);
      const dummyLink = document.createElement('a');
      dummyLink.href = '#';
      dummyLink.download = `project_${projectId}_bundle.zip`;
      alert(`[Standalone] Starting download for project_${projectId}_bundle.zip (Original FLP + Assets)`);
      return;
    }
    const response = await fetch(`${API_BASE_URL}/v1/project/${projectId}/download`, {
      headers: { 'Authorization': getAuthHeader() }
    });
    if (!response.ok) throw new Error('Failed to download project bundle');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${projectId}_bundle.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
