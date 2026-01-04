
import React from 'react';
import { Post, PostStatus, View } from '../types';

interface DashboardProps {
  posts: Post[];
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, onNavigate }) => {
  const stats = {
    drafts: posts.filter(p => p.status === PostStatus.DRAFT).length,
    approved: posts.filter(p => p.status === PostStatus.APPROVED).length,
    posted: posts.filter(p => p.status === PostStatus.POSTED).length,
  };

  const upcomingPosts = posts
    .filter(p => p.status === PostStatus.APPROVED)
    .sort((a, b) => a.scheduledFor - b.scheduledFor)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, here's what's happening with your content.</p>
        </div>
        <button 
          onClick={() => onNavigate('generator')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate New Posts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-slate-400">Needs Review</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{stats.drafts}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Pending Drafts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-slate-400">Ready to Post</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{stats.approved}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Scheduled in Queue</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-slate-400">Successfully Sent</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{stats.posted}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Lifetime Published</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Upcoming in Queue</h2>
            <button onClick={() => onNavigate('queue')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          {upcomingPosts.length > 0 ? (
            <div className="space-y-4">
              {upcomingPosts.map(post => (
                <div key={post.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                    <div className="flex items-center mt-3 text-xs text-slate-500 space-x-3">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-bold text-[10px] tracking-wide">{post.topic}</span>
                      <span>Scheduled: {new Date(post.scheduledFor).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mt-1.5 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm italic">Nothing scheduled yet.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Automation Status</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-xs">
            Your current settings generate 3 posts per week across Productivity Hacks, Marketing Trends.
          </p>
          <div className="flex space-x-3">
             <button onClick={() => onNavigate('settings')} className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
              Adjust Settings
             </button>
             <button onClick={() => onNavigate('generator')} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Run Now
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
