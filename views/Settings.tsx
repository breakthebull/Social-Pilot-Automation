
import React, { useState } from 'react';
import { Settings, ContentPillar, Persona } from '../types';

interface SettingsProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

const OPENROUTER_MODELS = [
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
];

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const TONES = [
  'Professional yet Friendly',
  'Witty and Sarcastic',
  'Educational and Serious',
  'Bold and Energetic',
  'Luxury and Exclusive'
];

const SettingsView: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  
  // Topic/Pillar inputs
  const [topicInput, setTopicInput] = useState('');
  const [pillarNameInput, setPillarNameInput] = useState('');
  const [pillarDescInput, setPillarDescInput] = useState('');

  const handleSave = () => {
    onUpdateSettings(localSettings);
    alert("Configuration updated successfully!");
  };

  const handleAddTopic = () => {
    if (topicInput && !localSettings.topics.includes(topicInput)) {
      setLocalSettings(prev => ({ ...prev, topics: [...prev.topics, topicInput] }));
      setTopicInput('');
    }
  };

  const handleAddPillar = () => {
    if (pillarNameInput && !localSettings.contentPillars.some(p => p.name === pillarNameInput)) {
      setLocalSettings(prev => ({
        ...prev,
        contentPillars: [...prev.contentPillars, { name: pillarNameInput, description: pillarDescInput }]
      }));
      setPillarNameInput('');
      setPillarDescInput('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setLocalSettings(prev => ({ ...prev, topics: prev.topics.filter(t => t !== topic) }));
  };

  const handleRemovePillar = (pillarName: string) => {
    setLocalSettings(prev => ({ ...prev, contentPillars: prev.contentPillars.filter(p => p.name !== pillarName) }));
  };

  const handleAddPersona = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newPersona: Persona = {
      id: newId,
      displayName: 'New Persona',
      profilePicture: `https://picsum.photos/seed/${newId}/200/200`,
      tone: TONES[0]
    };
    setLocalSettings(prev => ({ ...prev, personas: [...prev.personas, newPersona] }));
    setEditingPersonaId(newId);
  };

  const handleRemovePersona = (id: string) => {
    if (localSettings.personas.length <= 1) return;
    setLocalSettings(prev => ({ ...prev, personas: prev.personas.filter(p => p.id !== id) }));
  };

  const updatePersona = (id: string, updates: Partial<Persona>) => {
    setLocalSettings(prev => ({
      ...prev,
      personas: prev.personas.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const postsPerDay = (localSettings.postFrequency / 7).toFixed(1);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Configuration</h2>
          <p className="text-slate-500">Manage multiple personas and AI engines for diverse campaigns.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personas Management Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Active Personas
              </h3>
              <button 
                onClick={handleAddPersona}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Persona
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localSettings.personas.map(persona => (
                <div 
                  key={persona.id} 
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${editingPersonaId === persona.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                  onClick={() => setEditingPersonaId(persona.id)}
                >
                  <div className="flex items-center space-x-3">
                    <img src={persona.profilePicture} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{persona.displayName}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{persona.tone}</p>
                    </div>
                    {localSettings.personas.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemovePersona(persona.id); }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editingPersonaId && (
              <div className="p-6 bg-white border border-indigo-100 rounded-2xl space-y-4 animate-scaleIn">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-indigo-900 text-sm">Editing: {localSettings.personas.find(p => p.id === editingPersonaId)?.displayName}</h4>
                  <button onClick={() => setEditingPersonaId(null)} className="text-xs text-slate-400 hover:text-slate-600">Close Editor</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
                    <input 
                      type="text" 
                      value={localSettings.personas.find(p => p.id === editingPersonaId)?.displayName || ''}
                      onChange={(e) => updatePersona(editingPersonaId, { displayName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Picture URL</label>
                    <input 
                      type="text" 
                      value={localSettings.personas.find(p => p.id === editingPersonaId)?.profilePicture || ''}
                      onChange={(e) => updatePersona(editingPersonaId, { profilePicture: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MBTI</label>
                    <select 
                      value={localSettings.personas.find(p => p.id === editingPersonaId)?.mbti || ''}
                      onChange={(e) => updatePersona(editingPersonaId, { mbti: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs outline-none"
                    >
                      <option value="">Select MBTI</option>
                      {MBTI_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zodiac</label>
                    <select 
                      value={localSettings.personas.find(p => p.id === editingPersonaId)?.zodiac || ''}
                      onChange={(e) => updatePersona(editingPersonaId, { zodiac: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs outline-none"
                    >
                      <option value="">Select Sign</option>
                      {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Birthday</label>
                    <input 
                      type="date" 
                      value={localSettings.personas.find(p => p.id === editingPersonaId)?.birthday || ''}
                      onChange={(e) => updatePersona(editingPersonaId, { birthday: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Voice Tone</label>
                  <select 
                    value={localSettings.personas.find(p => p.id === editingPersonaId)?.tone || ''}
                    onChange={(e) => updatePersona(editingPersonaId, { tone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* AI Engine Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Engine (BYOK)
            </h3>
            
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
              {['native', 'openrouter'].map(engine => (
                <button 
                  key={engine}
                  onClick={() => setLocalSettings(prev => ({ ...prev, aiEngine: engine as any }))}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${localSettings.aiEngine === engine ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {engine === 'native' ? 'Native Gemini' : 'OpenRouter'}
                </button>
              ))}
            </div>

            {localSettings.aiEngine === 'openrouter' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">OpenRouter API Key</label>
                  <input 
                    type="password" 
                    placeholder="sk-or-v1-..."
                    value={localSettings.openRouterKey || ''}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, openRouterKey: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Preferred LLM Agent</label>
                  <select 
                    value={localSettings.openRouterModel}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, openRouterModel: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    {OPENROUTER_MODELS.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Brand Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Brand Name</label>
                <input 
                  type="text" 
                  value={localSettings.brandName}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Industry</label>
                <input 
                  type="text" 
                  value={localSettings.industry}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>
            <textarea 
              rows={3}
              placeholder="Brand Mission..."
              value={localSettings.brandMission}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, brandMission: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
             <div className="flex justify-between items-center mb-6">
               <h4 className="font-bold flex items-center">
                 <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Frequency
               </h4>
               <span className="text-indigo-300 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-indigo-500/50">~{postsPerDay}/day</span>
             </div>
             <input 
               type="range" min="7" max="35" 
               value={localSettings.postFrequency}
               onChange={(e) => setLocalSettings(prev => ({ ...prev, postFrequency: parseInt(e.target.value) }))}
               className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer accent-indigo-400"
             />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Pillars</h3>
            {localSettings.contentPillars.map(pillar => (
              <div key={pillar.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[11px] font-extrabold text-indigo-600 uppercase">{pillar.name}</span>
                  <button onClick={() => handleRemovePillar(pillar.name)} className="text-slate-300 hover:text-red-500 transition-opacity">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">{pillar.description}</p>
              </div>
            ))}
            <div className="pt-2 space-y-2">
              <input 
                type="text" placeholder="Pillar Name" value={pillarNameInput} onChange={(e) => setPillarNameInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
              />
              <textarea 
                placeholder="Description..." value={pillarDescInput} onChange={(e) => setPillarDescInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs resize-none" rows={2}
              />
              <button onClick={handleAddPillar} className="w-full py-2 bg-slate-900 text-white font-bold rounded text-xs">Add Pillar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
