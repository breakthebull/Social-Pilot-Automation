
import React, { useState } from 'react';
import { generatePosts } from '../services/gemini';
import { Settings, View, Post, Campaign, Persona } from '../types';
import FacebookPreview from '../components/FacebookPreview';

interface GeneratorProps {
  settings: Settings;
  posts: Post[];
  onAddPosts: (posts: { content: string; topic: string; mediaType?: 'image' | 'video'; mediaUrl?: string; personaId?: string }[]) => void;
  onNavigate: (view: View) => void;
}

const Generator: React.FC<GeneratorProps> = ({ settings, posts, onAddPosts, onNavigate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDrafts, setGeneratedDrafts] = useState<{ content: string; topic: string; mediaType?: 'image' | 'video'; mediaUrl?: string; personaId?: string }[]>([]);
  
  const [instructionInput, setInstructionInput] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(settings.personas[0].id);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedPillarNames, setSelectedPillarNames] = useState<string[]>([]);
  const [simulateMedia, setSimulateMedia] = useState(false);

  const togglePillar = (pillarName: string) => {
    setSelectedPillarNames(prev => 
      prev.includes(pillarName) ? prev.filter(p => p !== pillarName) : [...prev, pillarName]
    );
  };

  const handleAddCampaign = () => {
    if (instructionInput.trim() && campaigns.length < 5) {
      setCampaigns([...campaigns, { text: instructionInput.trim(), personaId: selectedPersonaId }]);
      setInstructionInput('');
    }
  };

  const handleRemoveCampaign = (index: number) => {
    setCampaigns(campaigns.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Ensure we always have at least one campaign for the loop if empty
      const effectiveCampaigns = campaigns.length > 0 ? campaigns : [{ text: 'General high engagement post', personaId: settings.personas[0].id }];
      
      // If we need exactly 5 posts but have fewer campaigns, we cycle them
      const fullCampaignSet: Campaign[] = [];
      for (let i = 0; i < 5; i++) {
        fullCampaignSet.push(effectiveCampaigns[i % effectiveCampaigns.length]);
      }

      const results = await generatePosts(settings, posts, fullCampaignSet, selectedPillarNames);
      
      const resultsWithMedia = results.map((r: any, idx: number) => {
        const res = { ...r };
        if (simulateMedia) {
          res.mediaType = idx % 2 === 0 ? 'image' : 'video';
          res.mediaUrl = `https://picsum.photos/seed/${Math.random()}/800/450`;
        }
        return res;
      });
      
      setGeneratedDrafts(resultsWithMedia);
    } catch (err) {
      setError("Failed to generate content. Please check your API key and connection.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAll = () => {
    onAddPosts(generatedDrafts);
    setGeneratedDrafts([]);
    onNavigate('queue');
  };

  const handleApproveSingle = (draft: any) => {
    onAddPosts([draft]);
    setGeneratedDrafts(prev => prev.filter(p => p.content !== draft.content));
  };

  const handleRemoveDraft = (index: number) => {
    setGeneratedDrafts(prev => prev.filter((_, i) => i !== index));
  };

  const getPersona = (id?: string) => settings.personas.find(p => p.id === id) || settings.personas[0];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Social Pilot Content AI</h2>
            <p className="text-slate-500">Define up to 5 focused campaigns and assign a persona to each.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Campaigns ({campaigns.length}/5)</label>
              
              <div className="space-y-2 mb-4 max-h-[220px] overflow-y-auto pr-1">
                {campaigns.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                    <p className="text-xs text-slate-400 italic">No campaigns added. Using default rotation.</p>
                  </div>
                ) : (
                  campaigns.map((c, idx) => {
                    const p = getPersona(c.personaId);
                    return (
                      <div key={idx} className="group flex items-start justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl animate-scaleIn">
                        <div className="flex items-start space-x-3 pr-2">
                          <img src={p.profilePicture} className="w-6 h-6 rounded-full object-cover mt-1" alt="" />
                          <div className="flex-1">
                            <p className="text-xs text-indigo-900 leading-relaxed">
                              <span className="font-bold text-indigo-600 mr-1">@{p.displayName}:</span> {c.text}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveCampaign(idx)}
                          className="text-indigo-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {campaigns.length < 5 && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3 mb-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign Persona</label>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.personas.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => setSelectedPersonaId(p.id)}
                        className={`flex items-center space-x-2 px-2 py-1 rounded-lg border transition-all ${
                          selectedPersonaId === p.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <img src={p.profilePicture} className="w-5 h-5 rounded-full object-cover" alt="" />
                        <span className="text-[10px] font-bold">{p.displayName}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      value={instructionInput}
                      onChange={(e) => setInstructionInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCampaign()}
                      placeholder="Campaign goal..."
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    />
                    <button 
                      onClick={handleAddCampaign}
                      className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Override rotating pillars</label>
              <div className="flex flex-wrap gap-2">
                {settings.contentPillars.map(pillar => (
                  <button
                    key={pillar.name}
                    onClick={() => togglePillar(pillar.name)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      selectedPillarNames.includes(pillar.name)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                    title={pillar.description}
                  >
                    {pillar.name}
                  </button>
                ))}
              </div>
              
              <div className="pt-4">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={simulateMedia}
                      onChange={() => setSimulateMedia(!simulateMedia)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${simulateMedia ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${simulateMedia ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    Simulate Visual Attachments
                  </div>
                </label>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start space-x-3">
                 <div className="p-1 bg-white rounded shadow-sm text-indigo-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <p className="text-xs text-indigo-700 leading-relaxed">
                   <strong>Variety Mode:</strong> We'll cross-reference your last {posts.length} posts and rotate through your active campaigns.
                 </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {!isGenerating && generatedDrafts.length === 0 && (
              <button 
                onClick={handleGenerate}
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center group"
              >
                <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Feed Mockups
              </button>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-600 font-bold animate-pulse">Designing your visual post drafts...</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium">
              {error}
            </div>
          )}
        </div>
      </div>

      {generatedDrafts.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 bg-slate-50 py-4 px-2 -mx-2">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Review Batch Drafts</h3>
              <p className="text-slate-500 text-sm">See how they look on Facebook with their assigned personas.</p>
            </div>
            <div className="flex space-x-3 shrink-0">
              <button 
                onClick={() => setGeneratedDrafts([])}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 rounded-xl text-sm transition-all"
              >
                Discard Batch
              </button>
              <button 
                onClick={handleApproveAll}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Approve All 5 Posts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {generatedDrafts.map((draft, idx) => (
              <FacebookPreview 
                key={idx}
                content={draft.content}
                brandName={settings.brandName}
                profilePicture={getPersona(draft.personaId).profilePicture}
                topic={draft.topic}
                mediaType={draft.mediaType}
                mediaUrl={draft.mediaUrl}
                actions={
                  <div className="flex w-full space-x-2">
                    <button 
                      onClick={() => handleRemoveDraft(idx)}
                      className="flex-1 py-2 bg-rose-50 border border-rose-100 text-rose-600 font-bold hover:bg-rose-100 rounded-lg text-sm transition-all"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={() => handleApproveSingle(draft)}
                      className="flex-1 py-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 rounded-lg text-sm transition-all shadow-sm"
                    >
                      Approve
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
