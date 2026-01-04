
import React from 'react';
import { Settings } from '../types';

interface HeaderProps {
  settings: Settings;
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center text-slate-400">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm font-medium">Search across posts...</span>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-slate-500 hover:text-indigo-600 relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{settings.displayName}</p>
            <p className="text-xs text-slate-500">Account Owner</p>
          </div>
          <img className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" src={settings.profilePicture} alt="Avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
