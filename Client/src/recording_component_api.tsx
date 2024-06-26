import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const Recorder = ({ onResponse, startRecording }: { onResponse: (response: string, transcription: string) => void, startRecording: boolean }) => {
  const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(handleSubmit);

  const username = 'admin_function'; 
  const password = 'adminpassword_function'; 

  useEffect(() => {
    if (startRecording) {
      startListening();
    } else {
      stopListening();
    }
  }, [startRecording]);

  async function handleSubmit(transcription: string) {
    try {
      const result = await axios.post('http://localhost:5000/query/text', {
        username,
        password,
        input: transcription,
      });
  
      const response = result.data.output;
      onResponse(response, transcription);
      stopListening(); // Add this line to stop listening after sending the response
    } catch (error) {
      console.error('Error sending text to backend:', error);
      stopListening(); // Also stop listening in case of an error
    }
  }

  return (
    <div>
      {hasRecognitionSupport ? (
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </button>
      ) : (
        <div>Your browser does not support speech recognition.</div>
      )}
    </div>
  );
};

export default Recorder;