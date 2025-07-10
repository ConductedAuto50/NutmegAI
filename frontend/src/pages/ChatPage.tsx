import React, { useState, useEffect } from 'react';
import { PureMultimodalInput } from '../components/ui/multimodal-ai-chat-input';
import { SessionNavBar } from '../components/Sidebar';
import { cn } from '../lib/utils';
import { TextShimmer } from '../components/ui/text-shimmer';
import LineChart from '../components/ui/LineChart';
import ReactMarkdown from 'react-markdown';
import './ChatPage.css';

// Type definitions
interface Attachment {
  url: string;
  name: string;
  contentType: string;
  size: number;
}

interface UIMessage {
  id: string;
  content: string;
  role: string;
  attachments?: Attachment[];
  chartData?: any;
}

const loadingMessages = [
  "Connecting to satellite...",
  "Analyzing team formations...",
  "Calculating player stats...",
  "Checking transfer rumors...",
  "Compiling match highlights...",
  "Fetching historical data..."
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [selectedVisibilityType] = useState<string>('public');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isGenerating) {
      setCurrentMessageIndex(0); 
      intervalId = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      }, 4000); 
    }
    return () => clearInterval(intervalId);
  }, [isGenerating]);

  const handleSendMessage = async ({ input, attachments }: { input: string; attachments: Attachment[] }) => {
    if (!input.trim() && attachments.length === 0) return;

    setIsGenerating(true);
    setCanSend(false);

    const userMessage: UIMessage = {
      id: `msg-${Date.now()}`,
      content: input,
      role: 'user',
      attachments,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      let content = data.response;
      let chartData = null;

      if (content.includes("*****")) {
        const parts = content.split("*****");
        content = parts[0].trim();
        try {
          chartData = JSON.parse(parts[1].trim());
        } catch(e) {
          console.error("Failed to parse chart data", e);
        }
      }
      
      const aiResponse: UIMessage = {
        id: `ai-${Date.now()}`,
        content: content,
        role: 'assistant',
        chartData: chartData
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorResponse: UIMessage = {
        id: `err-${Date.now()}`,
        content: "Sorry, I couldn't connect to the server. Please try again later.",
        role: 'assistant',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsGenerating(false);
      setCanSend(true);
    }
  };

  const handleStopGenerating = () => {
    setIsGenerating(false);
    setCanSend(true);
  };

  return (
    <div className="chat-page">
      <SessionNavBar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <div className={cn(
        "chat-interface",
        isSidebarCollapsed ? "sidebar-closed" : "sidebar-open"
      )}>
        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <h2>Welcome to NutmegAI</h2>
                <p>Ask me anything about football! I can provide stats, team information, player details, and more.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      message.content
                    )}
                    {message.chartData && (
                      <div className="chart-container">
                        <LineChart chartData={message.chartData} />
                      </div>
                    )}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="message-attachments">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="attachment">
                            {attachment.contentType.startsWith('image/') ? (
                              <img src={attachment.url} alt={attachment.name} />
                            ) : (
                              <span>{attachment.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="message ai-message">
                <div className="message-content loading-indicator">
                  <TextShimmer className='font-medium text-sm [--base-color:theme(colors.cyan.600)] [--base-gradient-color:theme(colors.cyan.200)] dark:[--base-color:theme(colors.cyan.700)] dark:[--base-gradient-color:theme(colors.cyan.400)]'>
                    {loadingMessages[currentMessageIndex]}
                  </TextShimmer>
                </div>
              </div>
            )}
          </div>

          <div className="input-container">
            <PureMultimodalInput
              chatId="main-chat"
              messages={messages}
              attachments={attachments}
              setAttachments={setAttachments}
              onSendMessage={handleSendMessage}
              onStopGenerating={handleStopGenerating}
              isGenerating={isGenerating}
              canSend={canSend}
              selectedVisibilityType={selectedVisibilityType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 