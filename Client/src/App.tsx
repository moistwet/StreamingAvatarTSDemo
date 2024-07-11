import React, { useState } from 'react';
import Recorder from './recording_component_api';
import ChatHistory from './chat_history';
import AvatarSpeak from './Avatar_speak';
import Popup from './Popup';
import LogoutButton from './components/LogoutButton';
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
      setPopupData({ isVisible: true, payload: responseData });
    } else {
      setPopupData({ isVisible: false, payload: null });
    }
  };

  const handleAvatarStop = () => {
    console.log('Avatar stopped speaking');
    setRecording(true);
    setStatus('listening');
  };
  
  const handleAvatarStart = () => {
    setStatus('speaking');
  };

  const closePopup = () => {
    setPopupData({ isVisible: false, payload: null });
  };

  return (
    <div className="HeyGenStreamingAvatar">
      <div className="inner">
      <Popup 
        isVisible={popupData.isVisible}
        payload={popupData.payload}
        onClose={closePopup}
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
        
        <div className="logout-container">
          <LogoutButton />
        </div>
      </header>
      <div>
        <ChatHistory chats={chatHistory} />
      </div>
      </div>
    </div>
  );
}

export default App;