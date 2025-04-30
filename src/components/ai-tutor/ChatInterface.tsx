
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Mic, MicOff, Send, User, Volume2, VolumeX, RefreshCw, ChevronDown, X, Download } from "lucide-react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  teacherName: string;
  teacherAvatar: string;
  voiceId: string;
  agentId: string;
  knowledgeNodes?: {
    nodeId: string;
    mastery: number;
  }[];
}

export function ChatInterface({
  teacherName,
  teacherAvatar,
  voiceId,
  agentId,
  knowledgeNodes,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize the conversation with Eleven Labs
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Eleven Labs");
      const welcomeMessage = `Hello! I'm ${teacherName}, your AI tutor for JEE preparation. I'll help you understand concepts, solve problems, and prepare for your exams. What would you like to learn today?`;
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    },
    onDisconnect: () => {
      console.log("Disconnected from Eleven Labs");
      setIsStarted(false);
    },
    onError: (error) => {
      console.error("Eleven Labs error:", error);
      toast({
        title: "Connection Error",
        description: "We couldn't connect to the AI tutor. Please try again.",
        variant: "destructive",
      });
      setIsStarted(false);
    },
    onMessage: (message) => {
      if (message.final && message.type === "agent_response") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: message.text || "",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start the conversation with Eleven Labs
  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Initial knowledge context to send to the agent
      const initialContext = knowledgeNodes 
        ? `Based on the initial assessment, the student shows these mastery levels: ${knowledgeNodes.map(node => `${node.nodeId}: ${node.mastery}%`).join(', ')}.` 
        : "No initial assessment data available.";
      
      await conversation.startSession({
        agentId: agentId,
        overrides: {
          tts: {
            voiceId: voiceId,
          },
          agent: {
            firstMessage: initialContext,
          }
        },
      });
      
      setIsStarted(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to AI tutor. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // End the conversation
  const endConversation = async () => {
    try {
      await conversation.endSession();
      setIsStarted(false);
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  // Toggle mute
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    conversation.setVolume({ volume: isMuted ? 1 : 0 });
  };

  // Handle user input
  const handleUserInput = async () => {
    if (!userInput.trim() || !isStarted) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Reset conversation
  const resetConversation = async () => {
    if (isStarted) {
      await endConversation();
    }
    setMessages([]);
    startConversation();
  };

  // Export conversation
  const exportConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.role === "user" ? "You" : teacherName} (${formatTime(msg.timestamp)}): ${msg.content}`)
      .join("\n\n");
    
    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-with-${teacherName}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[80vh] bg-background border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={teacherAvatar} alt={teacherName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{teacherName}</h3>
            <p className="text-xs text-muted-foreground">JEE Physics Expert</p>
          </div>
          {conversation.isSpeaking && (
            <div className="flex items-center ml-2">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-primary/70 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-primary/80 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-2 bg-primary/60 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleMuteToggle} title={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={resetConversation} title="Reset conversation">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={exportConversation} title="Export conversation">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={endConversation} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
        {!isStarted && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
              <img src={teacherAvatar} alt={teacherName} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-medium mb-2">{teacherName}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Start a conversation with your AI tutor to learn JEE Physics concepts, solve problems, and prepare for your exams.
            </p>
            <Button onClick={startConversation} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Start Conversation"}
            </Button>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      {message.role === "user" ? (
                        <div className="w-full h-full flex items-center justify-center bg-white/10">
                          <User className="h-4 w-4" />
                        </div>
                      ) : (
                        <img
                          src={teacherAvatar}
                          alt={teacherName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-sm">
                      {message.role === "user" ? "You" : teacherName}
                    </span>
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-background border">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <img
                        src={teacherAvatar}
                        alt={teacherName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm">{teacherName}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      {isStarted && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <textarea
                className="w-full p-3 pr-12 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your message..."
                rows={1}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleUserInput();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="icon"
                variant="ghost"
                onClick={handleUserInput}
                disabled={!userInput.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className={`${
                conversation.isRecording ? "bg-red-500 hover:bg-red-600" : ""
              }`}
              size="icon"
              variant="outline"
            >
              {conversation.isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            The AI tutor will only answer questions related to JEE Physics, Chemistry, and Mathematics.
          </div>
        </div>
      )}
    </div>
  );
}
