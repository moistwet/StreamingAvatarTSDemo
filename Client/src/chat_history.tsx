import React, { useEffect, useRef } from 'react';
import './chat_history.css';

interface ChatHistoryProps {
  chats: { transcription: string, response: string }[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chats }) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="ChatHistory" ref={chatHistoryRef}>
      {chats.map((chat, index) => (
        <div key={index} className="ChatPair">
          <div className="ChatMessage Transcription"><strong>You:</strong> {chat.transcription}</div>
          <div className="ChatMessage Response"><strong>Avatar:</strong> {chat.response}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;