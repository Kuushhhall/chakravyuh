
import { useState, useEffect, useRef } from "react";
import { useVapiConversation } from "@/hooks/useVapiConversation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui-custom/Button";
import { Mic, MicOff, VolumeX, Volume2 } from "lucide-react";
import TeacherAvatar from "./TeacherAvatar";
import WhiteboardCanvas, { TimelineCommand } from "./WhiteboardCanvas";
import VoiceWaveform from "./VoiceWaveform";
import { Teacher } from "@/data/teacherProfiles";

interface ImmersiveClassroomProps {
  apiKey: string;
  assistantId: string;
  teacher: Teacher;
}

type Message = {
  text: string;
  isUser: boolean;
};

const ImmersiveClassroom: React.FC<ImmersiveClassroomProps> = ({ 
  apiKey, 
  assistantId, 
  teacher 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const whiteboardContainerRef = useRef<HTMLDivElement>(null);
  const [whiteboardSize, setWhiteboardSize] = useState({ width: 800, height: 600 });
  const [timelineCommands, setTimelineCommands] = useState<TimelineCommand[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Track whiteboard container size
  useEffect(() => {
    const updateWhiteboardSize = () => {
      if (whiteboardContainerRef.current) {
        const { width, height } = whiteboardContainerRef.current.getBoundingClientRect();
        setWhiteboardSize({ width, height });
      }
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWhiteboardSize();
    window.addEventListener('resize', updateWhiteboardSize);
    return () => window.removeEventListener('resize', updateWhiteboardSize);
  }, []);

  // Use our custom Vapi hook
  const vapiConversation = useVapiConversation({
    onConnect: () => {
      console.log("Connected to Vapi AI");
      toast({
        title: "Connected",
        description: "Voice conversation started with your AI tutor",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from Vapi AI");
      setIsSessionActive(false);
    },
    onError: (error) => {
      console.error("Vapi AI error:", error);
      toast({
        title: "Connection Error",
        description: "We couldn't connect to your AI tutor. Please try again.",
        variant: "destructive",
      });
      setIsSessionActive(false);
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      setMessages(prev => [...prev, message]);
      
      if (!message.isUser) {
        // Extract text for whiteboard animation
        setCurrentText(message.text);
        
        // Generate timeline commands from AI text
        const newTimelineCommand: TimelineCommand = {
          type: 'text',
          time: Date.now(),
          content: message.text,
          position: { x: 50, y: 100 + (timelineCommands.length * 50) % 400 }, // Position text in different Y positions
          fontSize: 24,
          color: '#333',
          id: `text-${Date.now()}`,
        };
        
        setTimelineCommands(prev => [...prev, newTimelineCommand]);
      }
    },
    onSpeakingStart: () => {
      console.log("AI started speaking");
    },
    onSpeakingEnd: () => {
      console.log("AI stopped speaking");
      setCurrentText("");
    }
  });

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartConversation = async () => {
    if (isSessionActive) return;
    
    try {
      setIsSessionActive(true);
      
      // Initial message for the AI tutor
      const initialMessage = `You are ${teacher.name}, a ${teacher.title}. Greet the student warmly and ask what specific topic they'd like to learn about today. You should explain concepts step by step as if writing on a whiteboard, mentioning when you would draw diagrams or write key points.`;
      
      // Start the Vapi session
      await vapiConversation.startSession({
        apiKey,
        assistantId,
        initialMessage
      });
      
      // Add welcome message while waiting for AI response
      setMessages([{
        text: `Hello! I'm ${teacher.name}, your ${teacher.title}. What would you like to learn today?`,
        isUser: false
      }]);
      
      setCurrentText(`Hello! I'm ${teacher.name}, your ${teacher.title}. What would you like to learn today?`);
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsSessionActive(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to your AI tutor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndConversation = async () => {
    try {
      await vapiConversation.endSession();
      setIsSessionActive(false);
      toast({
        title: "Session Ended",
        description: "Your AI tutoring session has ended",
      });
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    vapiConversation.adjustVolume(isMuted ? 1 : 0);
  };

  const isListening = vapiConversation.status === "connected" && !vapiConversation.isSpeaking;

  return (
    <div className="immersive-classroom h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Classroom header */}
      <div className="classroom-controls flex items-center justify-between px-4 py-2 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{teacher.name} - {teacher.title}</h1>
          {isSessionActive && (
            <div className="flex-1 ml-4">
              <VoiceWaveform 
                isActive={vapiConversation.isSpeaking} 
                color="#7c3aed"
                type="ai"
                height={24}
              />
            </div>
          )}
        </div>
        
        {isSessionActive ? (
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
        ) : (
          <Button 
            onClick={handleStartConversation}
            size="sm"
            className="rounded-full px-4"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Teacher avatar panel */}
        <div className="teacher-panel flex flex-col items-center p-4 border-r w-40 bg-white dark:bg-gray-800">
          <TeacherAvatar
            teacher={teacher}
            isSpeaking={vapiConversation.isSpeaking}
            isListening={isListening}
            size="md"
          />
          
          {isSessionActive && isListening && (
            <div className="mt-4 w-full">
              <div className="text-xs text-center mb-1">Listening...</div>
              <VoiceWaveform 
                isActive={isListening} 
                color="#22c55e" 
                type="user"
                height={24} 
              />
            </div>
          )}
        </div>
        
        {/* Whiteboard area */}
        <div 
          ref={whiteboardContainerRef} 
          className="whiteboard-area flex-1 overflow-hidden bg-white dark:bg-gray-800 relative"
        >
          {isSessionActive ? (
            <WhiteboardCanvas
              width={whiteboardSize.width}
              height={whiteboardSize.height}
              timelineCommands={timelineCommands}
              isAISpeaking={vapiConversation.isSpeaking}
              currentTextContent={currentText}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-3xl font-bold mb-4">Interactive Learning Whiteboard</h1>
              <p className="text-muted-foreground mb-8 max-w-lg">
                Start a session with your AI tutor to begin an interactive learning experience.
                The AI will explain concepts while visually illustrating them on this whiteboard.
              </p>
              <Button 
                onClick={handleStartConversation}
                size="lg"
                className="rounded-full px-8"
              >
                <Mic className="h-5 w-5 mr-2" />
                Begin Learning Session
              </Button>
            </div>
          )}
          
          {/* Optional: Chat message history overlay, hidden by default */}
          <div className="chat-overlay absolute bottom-4 right-4 w-80 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg border overflow-hidden backdrop-blur-sm hidden">
            <div className="p-3 border-b">
              <h3 className="font-medium">Chat History</h3>
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`px-3 py-2 rounded-lg my-1 text-sm ${
                    msg.isUser ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveClassroom;
