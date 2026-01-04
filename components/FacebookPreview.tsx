
import React from 'react';

interface FacebookPreviewProps {
  content: string;
  brandName: string;
  topic?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  actions?: React.ReactNode;
  profilePicture?: string;
}

const FacebookPreview: React.FC<FacebookPreviewProps> = ({ 
  content, 
  brandName, 
  topic, 
  mediaType, 
  mediaUrl, 
  actions,
  profilePicture = 'https://picsum.photos/id/64/100/100'
}) => {
  return (
    <div className="bg-white border border-[#CED0D4] rounded-2xl shadow-sm max-w-[500px] w-full overflow-hidden font-sans mx-auto h-full flex flex-col transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-3 flex items-start justify-between">
        <div className="flex space-x-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-1 ring-black/5">
            <img src={profilePicture} alt="Page Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#050505] leading-tight hover:underline cursor-pointer">
              {brandName}
            </h4>
            <div className="flex items-center text-[13px] text-[#65676B] font-normal">
              <span>Just now</span>
              <span className="mx-1">·</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zM8 4a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 4zM8 7.5a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 8 7.5z" />
              </svg>
            </div>
          </div>
        </div>
        {topic && (
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
            {topic}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-3 pb-3 text-[15px] text-[#050505] leading-normal whitespace-pre-wrap">
        {content}
      </div>

      {/* Media Placeholder */}
      {mediaType && (
        <div className="relative w-full bg-slate-100 border-y border-slate-200 flex items-center justify-center aspect-video overflow-hidden">
          {mediaUrl ? (
            mediaType === 'video' ? (
              <div className="w-full h-full bg-black flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <img src={mediaUrl} alt="Video Poster" className="w-full h-full object-cover opacity-80" />
                <div className="z-20 w-16 h-16 bg-white/30 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center shadow-2xl">
                   <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M8 5v14l11-7z" />
                   </svg>
                </div>
              </div>
            ) : (
              <img src={mediaUrl} alt="Post Attachment" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mediaType === 'video' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                )}
              </svg>
              <span className="text-sm font-bold uppercase tracking-widest">{mediaType} placeholder</span>
            </div>
          )}
        </div>
      )}

      {/* Engagement bar (Visual only) */}
      <div className="px-3 py-2.5 border-y border-[#EBEDF0] mx-3 flex justify-between text-[#65676B] text-[13px] font-semibold mt-auto">
        <div className="flex items-center space-x-1.5 cursor-pointer hover:bg-slate-50 flex-1 justify-center py-1.5 rounded-md transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M16.75 2a.75.75 0 0 1 .67.42l.016.034C18.345 4.39 19 6.635 19 9c0 1.285-.183 2.528-.526 3.703l-.031.107c-.42 1.455-1.076 2.812-1.936 4.022l-.1.139c-.83 1.144-1.802 2.15-2.887 3.003l-.112.087a.75.75 0 0 1-.92 0l-.112-.087c-1.085-.852-2.057-1.859-2.887-3.003l-.1-.139c-.86-1.21-1.516-2.567-1.936-4.022l-.031-.107C7.183 11.528 7 10.285 7 9c0-2.365.655-4.61 1.564-6.546l.016-.034a.75.75 0 0 1 .67-.42h7.5zM12 18.232c.74-.633 1.41-1.34 2-2.112.753-1.055 1.33-2.235 1.706-3.51a14.24 14.24 0 0 0 .544-3.61c0-2.002-.533-3.923-1.288-5.5H9.038c-.755 1.577-1.288 3.498-1.288 5.5 0 1.25.18 2.46.544 3.61.376 1.275.953 2.455 1.706 3.51.59.808 1.26 1.52 2 2.152z" /></svg>
          <span>Like</span>
        </div>
        <div className="flex items-center space-x-1.5 cursor-pointer hover:bg-slate-50 flex-1 justify-center py-1.5 rounded-md transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.5c-5.523 0-10 3.582-10 8 0 1.763.71 3.385 1.884 4.706L2.25 19.5l4.364-1.745C7.942 18.288 9.904 18.5 12 18.5c5.523 0 10-3.582 10-8s-4.477-8-10-8z" /></svg>
          <span>Comment</span>
        </div>
        <div className="flex items-center space-x-1.5 cursor-pointer hover:bg-slate-50 flex-1 justify-center py-1.5 rounded-md transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" /></svg>
          <span>Share</span>
        </div>
      </div>

      {/* Action Overlay/Footer */}
      {actions && (
        <div className="p-3 bg-slate-50 border-t border-[#CED0D4] flex items-center justify-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default FacebookPreview;
