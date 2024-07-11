import React, { useEffect, useRef, useState } from 'react';
import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar';
import './App.css'

const avatarId = "josh_lite3_20230714";
const voiceId = "52b62505407d4f369b9924c2afcdfe72";

interface AvatarSpeakProps {
  textToSpeak: string;
  onAvatarStop: () => void;
  onAvatarStart: () => void;  // Add this line
}

const AvatarSpeak: React.FC<AvatarSpeakProps> = ({ textToSpeak, onAvatarStop,onAvatarStart }) => {
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<NewSessionData>();
  const [initialized, setInitialized] = useState(false);
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatarApi | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  async function fetchAccessToken() {
    try {
      const response = await fetch('http://192.168.0.166:3001/get-access-token', {
        method: 'POST'
      });
      const result = await response.json();
      const token = result.token;
      console.log('Access Token:', token);
      return token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      return '';
    }
  }

  async function grab() {
    await updateToken();
  
    if (!avatar.current) {
      setDebug('Avatar API is not initialized');
      return;
    }
  
    try {
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatarId,
            voice: { voiceId: voiceId }
          }
        }, setDebug);
      setData(res);
      setStream(avatar.current.mediaStream);
      setSessionStarted(true);  // Add this line
    } catch (error) {
      console.error('Error starting avatar session:', error);
    }
  }

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log('Updating Access Token:', newToken);
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken })
    );
  
    const startTalkCallback = (e: any) => {
      console.log("Avatar started talking", e);
      onAvatarStart();  // Call the new prop function
    };
  
    const stopTalkCallback = (e: any) => {
      console.log("Avatar stopped talking", e);
      onAvatarStop();
    };
  
    console.log('Adding event handlers:', avatar.current);
    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);
  
    setInitialized(true);
  }

  async function stop() {
    if (!initialized || !avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    await avatar.current.stopAvatar({ stopSessionRequest: { sessionId: data?.sessionId } }, setDebug);
    setSessionStarted(false);  // Add this line
  }

  async function handleSpeak() {
    if (!initialized || !avatar.current || !textToSpeak) {
      setDebug('Avatar API not initialized or no text to speak');
      return;
    }
    await avatar.current.speak({ taskRequest: { text: textToSpeak, sessionId: data?.sessionId } }).catch((e) => {
      setDebug(e.message);
    });
  }

  useEffect(() => {
    async function init() {
      const newToken = await fetchAccessToken();
      console.log('Initializing with Access Token:', newToken);
      avatar.current = new StreamingAvatarApi(
        new Configuration({ accessToken: newToken })
      );
      setInitialized(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      }
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    if (textToSpeak) {
      handleSpeak();
    }
  }, [textToSpeak]);

  return (
    <div>
      <div className="Actions">
        {!sessionStarted && <button onClick={grab}>Start</button>}
        {/* <button onClick={stop}>Stop</button> */}
      </div>
      <div className='avatar-container'>
          <video playsInline autoPlay ref={mediaStream}></video>
      </div>
    </div>
  );
};

export default AvatarSpeak;