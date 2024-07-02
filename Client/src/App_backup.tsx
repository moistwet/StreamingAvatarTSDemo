import { useEffect, useRef, useState } from 'react';
import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar';
import './App.css';
import OpenAI, {toFile} from 'openai';
import Recorder from './recording_component_api';
// import VoiceRecorder from './recording_component';
// import TextInput from './chat_component';
//Enter your OpenAI key here
const openaiApiKey = "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"

const avatarId = "josh_lite3_20230714";
const voiceId = "fd26a72bd7724dbea95e4ad5db3a78bc";

// Set up OpenAI w/ API Key
const openai = new OpenAI({
  apiKey: openaiApiKey, 
  dangerouslyAllowBrowser: true 
});

function App() {
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [text, setText] = useState<string>("");
  const [chatGPTText, setChatGPTText] = useState<string>("");
  const [data, setData] = useState<NewSessionData>();
  const [initialized, setInitialized] = useState(false); // Track initialization
  const [recording, setRecording] = useState(false); // Track recording state
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Stor e recorded audio
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatarApi | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);



  async function fetchAccessToken() {
    try {
      const response = await fetch('http://localhost:3001/get-access-token', {
        method: 'POST'
      });
      const result = await response.json();
      const token = result.token; // Access the token correctly
      console.log('Access Token:', token); // Log the token to verify
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
    } catch (error) {
      console.error('Error starting avatar session:', error);
    }
  };

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log('Updating Access Token:', newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken })
    );

    const startTalkCallback = (e: any) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e: any) => {
      console.log("Avatar stopped talking", e);
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
  }

  async function handleSpeak() {
    if (!initialized || !avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    await avatar.current.speak({ taskRequest: { text: text, sessionId: data?.sessionId } }).catch((e) => {
      setDebug(e.message);
    });
  }



  useEffect(() => {
    async function init() {
      const newToken = await fetchAccessToken();
      console.log('Initializing with Access Token:', newToken); // Log token for debugging
      avatar.current = new StreamingAvatarApi(
        new Configuration({ accessToken: newToken })
      );
      setInitialized(true); // Set initialized to true
    };
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

  


  return (
    <div className="HeyGenStreamingAvatar">
      <header className="App-header">
        {/* <div className='Actions'>
          <TextInput />
        </div> */}
        <div className="Actions">
          {/* <Recorder/> */}
        </div>
        <div className="Actions">
          <input
            className="InputField"
            placeholder="Type something for the avatar to say"
            value={text}
            onChange={(v) => setText(v.target.value)}
          />
          <button onClick={handleSpeak}>Speak</button>
          <button onClick={grab}>Start</button>
          <button onClick={stop}>Stop</button>
        </div>
        <div className="MediaPlayer">
          <video playsInline autoPlay width={500} ref={mediaStream}></video>
        </div>
      </header>
    </div>
  );
};



export default App;
