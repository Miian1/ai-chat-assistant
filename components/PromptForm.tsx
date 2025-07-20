import React, { useState } from 'react';
import { SendIcon } from './IconComponents';
import { AppMode } from '../App';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  mode: AppMode;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, mode }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  }
  
  const placeholder = mode === 'chat'
    ? 'Type a message…'
    : 'Describe an image to create, e.g., "a cat in a spaceship"';

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none text-gray-200 placeholder-gray-500"
        rows={1}
        disabled={isLoading}
        style={{maxHeight: '120px'}}
        aria-label="Chat input"
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default MessageInput;