import React, { useState } from 'react';
import OpenAI from 'openai';
import Recorder from './recording_component_api';
import ChatHistory from './chat_history';
import AvatarSpeak from './Avatar_speak';
import './App.css';

// const openaiApiKey = "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";


function App() {
  const [chatGPTText, setChatGPTText] = useState<string>("");
  const [recording, setRecording] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ transcription: string, response: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  const handleApiResponse = (response: string, transcription: string) => {
    setApiResponse(response);
    setChatGPTText(response);
    setTranscribedText(transcription);
    setRecording(false);
    setStatus('processing'); // Set to processing when we get a response
  
    setChatHistory(prevHistory => [
      ...prevHistory,
      { transcription, response }
    ]);
  };

  const handleAvatarStop = () => {
    console.log('Avatar stopped speaking');
    setRecording(true);
    setStatus('listening'); // Set to listening when avatar stops
  };
  
  const handleAvatarStart = () => {
    setStatus('speaking');
  };

  return (
    <div className="HeyGenStreamingAvatar">
      <header className="App-header">
        <div className="Actions">
          <Recorder onResponse={handleApiResponse} startRecording={recording} />
        </div>
        
        <div className={`avatar-container ${status}`}>
  <AvatarSpeak
    textToSpeak={chatGPTText}
    onAvatarStop={handleAvatarStop}
    onAvatarStart={handleAvatarStart}
  />
      </div>
        
      </header>
      <div>
        <ChatHistory chats={chatHistory} />
      </div>
    </div>
  );
}

export default App;