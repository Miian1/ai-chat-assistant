import React from 'react';
import { WandIcon, ChatBubbleIcon } from './IconComponents';
import { AppMode } from '../App';

interface ModeButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ isActive, onClick, children, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
            isActive
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {children}
    </button>
);


interface HeaderProps {
    mode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onModeChange }) => {
  return (
    <header className="text-center w-full flex-shrink-0 flex flex-col items-center">
      <div className="inline-flex items-center justify-center gap-3 mb-2">
        <WandIcon className="w-8 h-8 text-purple-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          AI Assistant
        </h1>
      </div>
      <p className="text-gray-400 text-lg mb-4">
        Your creative partner for conversation and imagery.
      </p>
      <div className="p-1 bg-gray-800 rounded-full inline-flex items-center gap-2 border border-gray-700">
         <ModeButton isActive={mode === 'chat'} onClick={() => onModeChange('chat')} ariaLabel="Switch to Chat mode">
            <ChatBubbleIcon className="w-5 h-5" />
            <span>Chat</span>
         </ModeButton>
         <ModeButton isActive={mode === 'image'} onClick={() => onModeChange('image')} ariaLabel="Switch to Image Generation mode">
            <WandIcon className="w-5 h-5" />
            <span>Image</span>
         </ModeButton>
      </div>
    </header>
  );
};

export default Header;