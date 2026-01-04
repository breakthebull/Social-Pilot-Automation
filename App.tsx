
import React, { useState, useEffect } from 'react';
import { Post, PostStatus, Settings, View, Persona } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Generator from './views/Generator';
import Queue from './views/Queue';
import History from './views/History';
import SettingsView from './views/Settings';
import { sendNotification, requestNotificationPermission } from './services/notifications';

const STORAGE_KEY_POSTS = 'social_pilot_posts';
const STORAGE_KEY_SETTINGS = 'social_pilot_settings';

const DEFAULT_PERSONA: Persona = {
  id: 'p1',
  displayName: 'Jane Cooper',
  profilePicture: 'https://picsum.photos/id/64/200/200',
  mbti: 'ENFJ',
  zodiac: 'Leo',
  birthday: '1992-08-15',
  tone: 'Professional yet Friendly'
};

const DEFAULT_SETTINGS: Settings = {
  brandName: 'Brandly',
  industry: 'Software as a Service',
  targetAudience: 'Marketing Managers & Small Business Owners',
  tone: 'Professional yet Friendly',
  topics: ['Productivity Hacks', 'Marketing Trends', 'Business Growth'],
  postFrequency: 7,
  contentPillars: [
    { name: 'Education', description: 'Share tips, tutorials, and how-to guides related to our software.' },
    { name: 'Engagement', description: 'Ask questions and run polls to get the audience talking.' },
    { name: 'Social Proof', description: 'Highlight customer testimonials and success stories.' },
    { name: 'Promotion', description: 'Talk about product features, benefits, and special offers.' },
    { name: 'Behind the Scenes', description: 'Show the people and culture behind the brand.' }
  ],
  styleGuide: 'Use short sentences. No corporate jargon. Always include 5 relevant hashtags.',
  brandMission: 'Helping entrepreneurs reclaim their time through smart automation.',
  aiEngine: 'native',
  openRouterModel: 'google/gemini-2.0-flash-001',
  personas: [DEFAULT_PERSONA]
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    requestNotificationPermission();
    const savedPosts = localStorage.getItem(STORAGE_KEY_POSTS);
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
        personas: parsedSettings.personas?.length ? parsedSettings.personas : [DEFAULT_PERSONA]
      });
    }
    
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      
      // Check for low queue reminder
      const queueCount = posts.filter(p => p.status === PostStatus.APPROVED || p.status === PostStatus.DRAFT).length;
      if (queueCount < 3 && posts.length > 0) {
        // Debounced or throttled would be better, but for this app a simple session check or count is fine
        const lastRemind = localStorage.getItem('last_remind_time');
        const now = Date.now();
        if (!lastRemind || now - parseInt(lastRemind) > 86400000) { // Max once per day
           sendNotification("Queue is Low!", "Your content queue is looking empty. Time to generate more posts?");
           localStorage.setItem('last_remind_time', now.toString());
        }
      }
    }
  }, [posts, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }
  }, [settings, isInitializing]);

  const addPosts = (newPosts: Omit<Post, 'id' | 'status' | 'createdAt' | 'scheduledFor'>[]) => {
    // Logic for "Noon everyday" scheduling
    const approvedPosts = posts.filter(p => p.status === PostStatus.APPROVED).sort((a, b) => b.scheduledFor - a.scheduledFor);
    let startTimestamp = approvedPosts.length > 0 ? approvedPosts[0].scheduledFor : Date.now();
    
    const formatted: Post[] = newPosts.map((p, idx) => {
      // Calculate next noon
      const date = new Date(startTimestamp);
      date.setDate(date.getDate() + 1);
      date.setHours(12, 0, 0, 0);
      const scheduledTime = date.getTime();
      startTimestamp = scheduledTime; // Advance cursor

      return {
        ...p,
        id: Math.random().toString(36).substr(2, 9),
        status: PostStatus.DRAFT,
        createdAt: Date.now(),
        scheduledFor: scheduledTime
      };
    });
    setPosts(prev => [...formatted, ...prev]);
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        if (status === PostStatus.POSTED) {
           sendNotification("Post Published!", `Your post about "${p.topic}" is now live on Facebook.`);
        }
        return { ...p, status };
      }
      return p;
    }));
  };

  const updatePostSchedule = (id: string, timestamp: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, scheduledFor: timestamp } : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const reorderPosts = (reorderedQueue: Post[]) => {
    const otherPosts = posts.filter(p => p.status !== PostStatus.DRAFT && p.status !== PostStatus.APPROVED);
    setPosts([...reorderedQueue, ...otherPosts]);
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-indigo-600 font-semibold text-xl">Loading SocialPilot...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentView={view} onViewChange={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header settings={settings} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {view === 'dashboard' && <Dashboard posts={posts} onNavigate={setView} />}
            {view === 'generator' && <Generator settings={settings} posts={posts} onAddPosts={addPosts} onNavigate={setView} />}
            {view === 'queue' && (
              <Queue 
                posts={posts} 
                brandName={settings.brandName}
                onUpdateStatus={updatePostStatus} 
                onUpdateSchedule={updatePostSchedule}
                onDelete={deletePost} 
                onReorder={reorderPosts}
                settings={settings}
              />
            )}
            {view === 'history' && <History posts={posts} />}
            {view === 'settings' && <SettingsView settings={settings} onUpdateSettings={updateSettings} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
