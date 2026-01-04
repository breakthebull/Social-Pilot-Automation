
import React, { useState } from 'react';
import { Post, PostStatus, Settings } from '../types';
import FacebookPreview from '../components/FacebookPreview';

interface QueueProps {
  posts: Post[];
  brandName: string;
  onUpdateStatus: (id: string, status: PostStatus) => void;
  onUpdateSchedule: (id: string, timestamp: number) => void;
  onDelete: (id: string) => void;
  onReorder: (reorderedPosts: Post[]) => void;
  settings?: Settings;
}

const Queue: React.FC<QueueProps> = ({ posts, brandName, onUpdateStatus, onUpdateSchedule, onDelete, onReorder, settings }) => {
  const queuePosts = posts.filter(p => p.status === PostStatus.DRAFT || p.status === PostStatus.APPROVED);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handlePostNow = (id: string) => {
    alert("Triggering Facebook API publish simulation...");
    onUpdateStatus(id, PostStatus.POSTED);
  };

  const handleApprove = (id: string) => {
    onUpdateStatus(id, PostStatus.APPROVED);
  };

  const handleDateChange = (id: string, dateStr: string) => {
    if (!dateStr) return;
    const date = new Date(dateStr);
    onUpdateSchedule(id, date.getTime());
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.4';
    }, 0);
  };

  const onDragEnd = (e: React.DragEvent) => {
    setDraggedIdx(null);
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newQueue = [...queuePosts];
    const item = newQueue[draggedIdx];
    newQueue.splice(draggedIdx, 1);
    newQueue.splice(index, 0, item);
    
    setDraggedIdx(index);
    onReorder(newQueue);
  };

  // Convert timestamp to datetime-local string
  const toLocalISOString = (timestamp: number) => {
    const date = new Date(timestamp);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Automation Queue</h2>
          <p className="text-slate-500">Scheduled for 12:00 PM daily by default. Adjust manually below.</p>
        </div>
      </div>

      {queuePosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          </div>
          <p className="text-slate-500 font-bold text-lg">Your queue is empty.</p>
          <p className="text-slate-400 text-sm mt-2">Generate some content to populate your feed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {queuePosts.map((post, index) => (
            <div 
              key={post.id}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => onDragOver(e, index)}
              className="cursor-move transition-transform duration-200 active:scale-95 group"
            >
              <div className="relative">
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
                  Drag to Reorder
                </div>
                <FacebookPreview 
                  content={post.content}
                  brandName={brandName}
                  profilePicture={settings?.personas.find(p => p.id === post.personaId)?.profilePicture}
                  topic={post.topic}
                  mediaType={post.mediaType}
                  mediaUrl={post.mediaUrl}
                  actions={
                    <div className="flex flex-col w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          post.status === PostStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {post.status}
                        </span>
                        <div className="flex space-x-2">
                          {post.status === PostStatus.DRAFT && (
                            <button 
                              onClick={() => handleApprove(post.id)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                              title="Approve Draft"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          {post.status === PostStatus.APPROVED && (
                            <button 
                              onClick={() => handlePostNow(post.id)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md transition-colors"
                            >
                              Post Now
                            </button>
                          )}
                          <button 
                            onClick={() => onDelete(post.id)}
                            className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</label>
                        <input 
                          type="datetime-local"
                          value={toLocalISOString(post.scheduledFor)}
                          onChange={(e) => handleDateChange(post.id, e.target.value)}
                          className="w-full text-[11px] px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queue;
