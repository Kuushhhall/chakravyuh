import { useState } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import {
  VoiceAgent as ElevenLabsVoiceAgent,
  useConversation,
} from "@11labs/react";
import { Mic, MicOff, User, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Teacher profiles
const teachers = [
  {
    id: "alakh-pandey",
    name: "Alakh Pandey",
    title: "Physics Expert",
    avatar: "https://placekitten.com/200/200", // Replace with actual image
    voiceId: "m5qndnI7u4OAdXhH0Mr5", // Krishna voice ID (Alakh Pandey customized)
    description: "Learn physics concepts in Alakh sir's unique teaching style.",
    subjects: ["Physics"],
  },
];

export default function AITutorPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Eleven Labs");
    },
    onDisconnect: () => {
      console.log("Disconnected from Eleven Labs");
      setIsChatStarted(false);
    },
    onError: (error) => {
      console.error("Eleven Labs error:", error);
      toast({
        title: "Connection Error",
        description: "We couldn't connect to the AI tutor. Please try again.",
        variant: "destructive",
      });
      setIsChatStarted(false);
    },
  });

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacher(teacherId);
  };

  const handleStartConversation = async () => {
    if (!selectedTeacher) return;
    
    try {
      const teacher = teachers.find(t => t.id === selectedTeacher);
      
      if (!teacher) {
        throw new Error("Teacher not found");
      }
      
      await conversation.startSession({
        agentId: "replace-with-your-agent-id", // You need to replace with your actual agent ID
        overrides: {
          tts: {
            voiceId: teacher.voiceId,
          },
        },
      });
      
      setIsChatStarted(true);
      
      toast({
        title: "Connecting to AI Tutor",
        description: `You are now connected to ${teacher.name}`,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to AI tutor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsChatStarted(false);
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (volume: number) => {
    conversation.setVolume({ volume });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          {isChatStarted ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {teachers.find(t => t.id === selectedTeacher)?.name || "AI Tutor"}
                  </h1>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-sm">
                    {teachers.find(t => t.id === selectedTeacher)?.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleMuteToggle}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleVolumeChange(isMuted ? 0 : 1)}
                    title="Volume Control"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleEndConversation}
                  >
                    End Session
                  </Button>
                </div>
              </div>

              <Card className="mb-6">
                <CardContent className="p-6">
                  {/* The Eleven Labs Voice Agent component */}
                  <div className="h-[600px] bg-secondary/20 rounded-lg overflow-hidden">
                    <ElevenLabsVoiceAgent
                      conversation={conversation}
                      showText={true}
                      speakerWaveSize={96}
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-center">Choose Your AI Tutor</h1>
              <p className="text-muted-foreground text-center mb-8">
                Select an AI tutor to start your personalized learning experience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <Card 
                    key={teacher.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTeacher === teacher.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleTeacherSelect(teacher.id)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold">{teacher.name}</h3>
                      <p className="text-primary font-medium">{teacher.title}</p>
                      <p className="text-muted-foreground mt-2">{teacher.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {teacher.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="bg-secondary/40 px-2 py-1 rounded-full text-xs"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={handleStartConversation}
                  disabled={!selectedTeacher}
                  className="px-8"
                >
                  Start Learning Session
                </Button>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
