import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ChatHistory from './components/ImageDisplay';
import MessageInput from './components/PromptForm';
import { sendMessageStream, generateImage } from './services/geminiService';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  isLoadingImage?: boolean;
  prompt?: string;
}

export type AppMode = 'chat' | 'image';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('chat');

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    if (mode === 'image') {
      const prompt = message;
       if (!prompt) {
          setError("Please provide a description for the image you want to create.");
          setIsLoading(false);
          setMessages(prev => prev.slice(0, prev.length - 1));
          return;
      }

      const modelMessageId = crypto.randomUUID();
      const placeholderMessage: Message = {
        id: modelMessageId,
        role: 'model',
        text: `Creating an image of: "${prompt}"`,
        isLoadingImage: true,
        prompt: prompt,
      };
      setMessages(prev => [...prev, placeholderMessage]);

      try {
        const imageUrl = await generateImage(prompt);
        setMessages(prev => prev.map(m =>
          m.id === modelMessageId
            ? { ...m, imageUrl, text: `Here is your image.`, isLoadingImage: false }
            : m
        ));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to generate image. Please try again.`);
        setMessages(prev => prev.map(m =>
          m.id === modelMessageId
            ? { ...m, text: `Sorry, I couldn't create that image.\nError: ${errorMessage}`, isLoadingImage: false }
            : m
        ));
      } finally {
        setIsLoading(false);
      }
    } else { // mode === 'chat'
      try {
        const stream = await sendMessageStream(message);
        const modelMessageId = crypto.randomUUID();
        let text = '';
        let firstChunk = true;

        for await (const chunk of stream) {
          text += chunk.text;
          if (firstChunk) {
            setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: text }]);
            firstChunk = false;
          } else {
            setMessages(prev => prev.map(m =>
              m.id === modelMessageId ? { ...m, text: text } : m
            ));
          }
        }
        if (firstChunk) { // Handle empty stream case
            setError("Received an empty response from the AI.");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Chat failed:', errorMessage);
        setError(`Failed to get response. ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-2xl flex flex-col gap-4" style={{height: 'calc(100vh - 2rem)'}}>
        <Header mode={mode} onModeChange={setMode} />
        <main className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl shadow-purple-900/10 p-4 flex flex-col flex-grow overflow-hidden">
            <ChatHistory messages={messages} isLoading={isLoading} />
            <div className="mt-4 flex-shrink-0">
                {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
                 <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} mode={mode} />
            </div>
        </main>
        <footer className="text-center text-gray-500 text-sm py-2 flex-shrink-0">
            <p>Powered by Gemini. AI responses may be inaccurate.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;