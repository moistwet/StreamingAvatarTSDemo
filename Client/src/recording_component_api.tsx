import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// Speech Recognition Hook
let recognition: SpeechRecognition | null = null;
if ("webkitSpeechRecognition" in window) {
  recognition = new (window as any).webkitSpeechRecognition();
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "en-US";
  }
}

const useSpeechRecognition = (onTranscriptionComplete: (transcription: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const transcription = event.results[0][0].transcript;
      recognition?.stop();
      setIsListening(false);
      onTranscriptionComplete(transcription);
    };

    const handleError = (event: any) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
    };
    if (recognition) {

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    }
    return () => {
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
    }
    };
  }, [onTranscriptionComplete]);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};



// ... (keep your existing speech recognition code) ...

const Recorder = ({ 
  onResponse, 
  startRecording 
}: { 
  onResponse: (responseData: any, transcription: string) => void, 
  startRecording: boolean
}) => {
  const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(handleSubmit);

  const username = 'test1000'; 
  const password = 'test1000'; 

  useEffect(() => {
    if (startRecording) {
      startListening();
    } else {
      stopListening();
    }
  }, [startRecording]);

  async function handleSubmit(transcription: string) {
    try {
      const result = await axios.post('http://192.168.0.166:5000/query/text', {
        username,
        password,
        input: transcription,
      });
  
      const responseData = result.data;
      
      onResponse(responseData, transcription);
      stopListening();
    } catch (error) {
      console.error('Error sending text to backend:', error);
      stopListening();
    }
  }

  return (
    <div>
      {hasRecognitionSupport ? (
        <button 
          className={`round-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <svg className="mic-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM11 5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V11C13 11.55 12.55 12 12 12C11.45 12 11 11.55 11 11V5ZM17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="white" fillOpacity="0.8"/>
            </svg>
          ) : (
            <svg className="mute-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10.8 4.9C10.8 4.24 11.34 3.7 12 3.7C12.66 3.7 13.2 4.24 13.2 4.9L13.19 8.81L15 10.6V5C15 3.34 13.66 2 12 2C10.46 2 9.21 3.16 9.04 4.65L10.8 6.41V4.9ZM19 11H17.3C17.3 11.58 17.2 12.13 17.03 12.64L18.3 13.91C18.74 13.03 19 12.04 19 11ZM4.41 2.86L3 4.27L9 10.27V11C9 12.66 10.34 14 12 14C12.23 14 12.44 13.97 12.65 13.92L14.31 15.58C13.6 15.91 12.81 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C13.91 17.59 14.77 17.27 15.55 16.82L19.75 21.02L21.16 19.61L4.41 2.86Z" fill="white" fillOpacity="0.8"/>
            </svg>
          )}
        </button>
      ) : (
        <div>Your browser does not support speech recognition.</div>
      )}
    </div>
  );
};


export default Recorder;