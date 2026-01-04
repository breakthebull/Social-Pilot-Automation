
import React from 'react';
import { Post, PostStatus } from '../types';

interface HistoryProps {
  posts: Post[];
}

const History: React.FC<HistoryProps> = ({ posts }) => {
  const historyPosts = posts.filter(p => p.status === PostStatus.POSTED).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Post History</h2>
      
      {historyPosts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-slate-200">
          <p className="text-slate-400 italic">No posts in history yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Published At</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-800 line-clamp-1 max-w-xs">{post.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                      {post.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center"><svg className="w-3 h-3 mr-1 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.133a1.5 1.5 0 01-.8.2z" /></svg> 12</span>
                      <span className="flex items-center"><svg className="w-3 h-3 mr-1 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg> 3</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
