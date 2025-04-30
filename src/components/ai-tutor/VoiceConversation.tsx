
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Mic, MicOff, VolumeX, Volume2 } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_VOICE_ID, DEFAULT_AGENT_ID } from "@/config/env";

// Define more specific type for messages from Eleven Labs
interface ElevenLabsMessage {
  message?: string;
  source?: string;
  text?: string;
  is_final?: boolean;
  [key: string]: unknown;
}

interface Message {
  text: string;
  isUser: boolean;
}

export default function VoiceConversation({ apiKey }: { apiKey: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration for the ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Eleven Labs");
      toast({
        title: "Connected",
        description: "Voice conversation started",
      });
      // Add initial welcome message
      setMessages(prev => [...prev, {
        text: "Hello! I'm your AI tutor. What would you like to learn about today?",
        isUser: false
      }]);
    },
    onDisconnect: () => {
      console.log("Disconnected from Eleven Labs");
      setIsSessionActive(false);
    },
    onError: (error) => {
      console.error("Eleven Labs error:", error);
      toast({
        title: "Connection Error",
        description: "We couldn't connect to the voice service. Please try again.",
        variant: "destructive",
      });
      setIsSessionActive(false);
    },
    onMessage: (message: ElevenLabsMessage) => {
      // Handle incoming message from AI
      if (message && typeof message === 'object') {
        if ("message" in message && typeof message.message === 'string') {
          setMessages(prev => [...prev, {
            text: message.message as string,
            isUser: false
          }]);
        } else if ("text" in message && message.text) {
          // Check if it's a final transcript and contains text
          if (message.is_final === true && typeof message.text === 'string') {
            setMessages(prev => [...prev, {
              text: message.text,
              isUser: true
            }]);
          }
        }
      }
    }
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartConversation = async () => {
    if (isSessionActive) return;
    
    try {
      setIsSessionActive(true);
      
      // The apiKey is now passed directly in the authorization field according to the library's requirements
      await conversation.startSession({
        agentId: DEFAULT_AGENT_ID,
        authorization: apiKey, // Pass API key as authorization
        overrides: {
          tts: {
            voiceId: DEFAULT_VOICE_ID,
          }
        }
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsSessionActive(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to voice service. Please check your API key and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsSessionActive(false);
      toast({
        title: "Session Ended",
        description: "Voice conversation has ended",
      });
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // Update the volume in the conversation
    conversation.setVolume({ volume: isMuted ? 1 : 0 });
  };

  // Render animated waveform when speaking
  const renderWaveform = () => {
    return (
      <div className="flex items-center gap-[2px] h-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className={`w-[3px] bg-primary rounded-full animate-pulse`}
            style={{ 
              height: `${Math.max(15, Math.min(24, 15 + Math.sin(i * 0.8) * 10))}px`,
              animationDelay: `${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>
    );
  };

  const isListening = conversation.status === "connected" && !conversation.isSpeaking;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="font-medium">AI Voice Tutor</h2>
          {isSessionActive && conversation.isSpeaking && (
            <div className="ml-2">
              {renderWaveform()}
            </div>
          )}
        </div>
        
        {isSessionActive && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute" : "Mute"}
              className="rounded-full h-8 w-8"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEndConversation}
              className="rounded-full"
            >
              End Session
            </Button>
          </div>
        )}
      </div>
      
      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !isSessionActive ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold mb-4">Voice-Powered Learning</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Click the button below to start a voice conversation with your AI tutor.
              Speak naturally and ask any questions about topics you want to learn.
            </p>
            <Button 
              onClick={handleStartConversation}
              size="lg"
              className="rounded-full px-8"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Voice Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.isUser 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Voice Controls */}
      {isSessionActive && !conversation.isSpeaking && (
        <div className="p-4 border-t flex justify-center">
          <div className="relative">
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-secondary rounded-full text-xs ${isListening ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
              Listening...
            </div>
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isListening ? 'bg-primary/10 animate-pulse' : 'bg-muted'}`}>
              <Mic className={`h-8 w-8 ${isListening ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </div>
      )}
      
      {/* Start Button for Not Started State */}
      {!isSessionActive && messages.length > 0 && (
        <div className="p-4 border-t flex justify-center">
          <Button 
            onClick={handleStartConversation}
            size="lg"
            className="rounded-full px-8"
          >
            <Mic className="h-5 w-5 mr-2" />
            Resume Voice Session
          </Button>
        </div>
      )}
    </div>
  );
}
