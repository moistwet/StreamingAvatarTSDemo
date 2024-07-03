import React, { useState } from 'react';
import Recorder from './recording_component_api';
import ChatHistory from './chat_history';
import AvatarSpeak from './Avatar_speak';
import Popup from './Popup';
import './App.css';

function App() {
  const [chatGPTText, setChatGPTText] = useState<string>("");
  const [recording, setRecording] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ transcription: string, response: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [popupData, setPopupData] = useState<{ isVisible: boolean, key: string, value: string }>({
    isVisible: false,
    key: '',
    value: ''
  });

  const handleApiResponse = (response: string, transcription: string) => {
    setApiResponse(response);
    setChatGPTText(response);
    setTranscribedText(transcription);
    setRecording(false);
    setStatus('processing');
  
    setChatHistory(prevHistory => [
      ...prevHistory,
      { transcription, response }
    ]);
  };

  const handleAdditionalData = (key: string, value: string) => {
    setPopupData({ isVisible: true, key, value });
  };

  const handleAvatarStop = () => {
    console.log('Avatar stopped speaking');
    setRecording(true);
    setStatus('listening');
    setPopupData(prev => ({ ...prev, isVisible: false }));
  };
  
  const handleAvatarStart = () => {
    setStatus('speaking');
  };

  return (
    <div className="HeyGenStreamingAvatar">
      <header className="App-header">
        <div className="Actions">
          <Recorder 
            onResponse={handleApiResponse} 
            startRecording={recording} 
            onAdditionalData={handleAdditionalData}
          />
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
      <Popup 
        isVisible={popupData.isVisible}
        dataKey={popupData.key}
        dataValue={popupData.value}
      />
    </div>
  );
}

export default App;