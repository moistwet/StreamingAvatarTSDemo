import React, { useState } from 'react';
import Recorder from './recording_component_api';
import ChatHistory from './chat_history';
import AvatarSpeak from './Avatar_speak';
import Popup from './Popup';
import './App.css';

function App() {
  const [chatGPTText, setChatGPTText] = useState<string>("");
  const [recording, setRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ transcription: string, response: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [popupData, setPopupData] = useState<{ isVisible: boolean, payload: any }>({
    isVisible: false,
    payload: null
  });

  const handleApiResponse = (responseData: any, transcription: string) => {
    setChatGPTText(responseData.output);
    setTranscribedText(transcription);
    setRecording(false);
    setStatus('processing');
  
    setChatHistory(prevHistory => [
      ...prevHistory,
      { transcription, response: responseData.output }
    ]);

    if (responseData.additional_data) {
      console.log('Setting popup data:', responseData); // Add this line for debugging
      setPopupData({ isVisible: true, payload: responseData });
    } else {
      setPopupData({ isVisible: false, payload: null });
    }
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
      <Popup 
        isVisible={popupData.isVisible}
        payload={popupData.payload}
      />
      <header className="App-header">
        <div className="Actions">
          <Recorder 
            onResponse={handleApiResponse} 
            startRecording={recording} 
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
      
    </div>
  );
}

export default App;