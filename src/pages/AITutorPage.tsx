
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PrerequisiteQuiz } from "@/components/ai-tutor/PrerequisiteQuiz";
import { KnowledgeGraph } from "@/components/ai-tutor/KnowledgeGraph";
import { ChatInterface } from "@/components/ai-tutor/ChatInterface";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Teacher profiles
const teachers = [
  {
    id: "alakh-pandey",
    name: "Alakh Pandey",
    title: "Physics Expert",
    avatar: "/lovable-uploads/27be2557-ce2e-4f04-89a3-e40dea54893d.png",
    voiceId: "m5qndnI7u4OAdXhH0Mr5", // Krishna voice ID (Alakh Pandey customized)
    description: "Learn physics concepts in Alakh sir's unique teaching style.",
    subjects: ["Physics"],
  },
  // Add more teachers here for Chemistry and Mathematics
];

// Sample knowledge nodes for JEE Physics
const physicsNodes = [
  {
    id: "kinetic-energy",
    label: "Kinetic Energy",
    category: "Mechanics",
    difficulty: "basic" as const,
    mastery: 70,
    prerequisites: [],
  },
  {
    id: "projectile-motion",
    label: "Projectile Motion",
    category: "Mechanics",
    difficulty: "intermediate" as const,
    mastery: 60,
    prerequisites: ["kinetic-energy"],
  },
  {
    id: "angular-momentum",
    label: "Angular Momentum",
    category: "Mechanics",
    difficulty: "intermediate" as const,
    mastery: 50,
    prerequisites: ["kinetic-energy"],
  },
  {
    id: "electric-field",
    label: "Electric Field",
    category: "Electrostatics",
    difficulty: "intermediate" as const,
    mastery: 40,
    prerequisites: [],
  },
  {
    id: "conservative-forces",
    label: "Conservative Forces",
    category: "Work, Energy and Power",
    difficulty: "advanced" as const,
    mastery: 30,
    prerequisites: ["kinetic-energy"],
  },
];

// Sample connections for knowledge graph
const physicsConnections = [
  {
    source: "kinetic-energy",
    target: "projectile-motion",
    type: "prerequisite" as const,
  },
  {
    source: "kinetic-energy",
    target: "angular-momentum",
    type: "prerequisite" as const,
  },
  {
    source: "kinetic-energy",
    target: "conservative-forces",
    type: "prerequisite" as const,
  },
  {
    source: "projectile-motion",
    target: "angular-momentum",
    type: "related" as const,
  },
];

export default function AITutorPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("teacher-select");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [knowledgeNodes, setKnowledgeNodes] = useState<{ nodeId: string; mastery: number }[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has completed assessment before
  useEffect(() => {
    if (user) {
      // In a real app, you would fetch this from the database
      // For now, we'll just simulate it
      const hasCompletedAssessment = localStorage.getItem(`assessment-${user.id}`) === "completed";
      if (hasCompletedAssessment) {
        setQuizCompleted(true);
        const savedNodes = localStorage.getItem(`knowledge-nodes-${user.id}`);
        if (savedNodes) {
          setKnowledgeNodes(JSON.parse(savedNodes));
        }
      }
    }
  }, [user]);

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacher(teacherId);
  };

  const handleStartChat = () => {
    if (!selectedTeacher) {
      toast({
        title: "No teacher selected",
        description: "Please select a teacher to continue",
        variant: "destructive",
      });
      return;
    }

    if (!quizCompleted) {
      setActiveTab("assessment");
    } else {
      setIsChatStarted(true);
      setActiveTab("chat");
    }
  };

  const handleQuizComplete = (results: {
    score: number;
    knowledgeNodes: { nodeId: string; mastery: number }[];
  }) => {
    setQuizCompleted(true);
    setKnowledgeNodes(results.knowledgeNodes);
    
    // In a real app, save this to the database
    if (user) {
      localStorage.setItem(`assessment-${user.id}`, "completed");
      localStorage.setItem(`knowledge-nodes-${user.id}`, JSON.stringify(results.knowledgeNodes));
    }
    
    // Update mastery in physics nodes
    results.knowledgeNodes.forEach(node => {
      const index = physicsNodes.findIndex(n => n.id === node.nodeId);
      if (index !== -1) {
        physicsNodes[index].mastery = node.mastery;
      }
    });

    toast({
      title: "Assessment completed",
      description: `You scored ${results.score} out of 5. Your personalized learning path has been created.`,
    });

    // Go to knowledge graph
    setActiveTab("knowledge-graph");
  };

  const startChatFromKnowledgeGraph = () => {
    if (selectedTeacher) {
      setIsChatStarted(true);
      setActiveTab("chat");
    } else {
      setActiveTab("teacher-select");
      toast({
        title: "Please select a teacher",
        description: "Select a teacher before starting the chat",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <PageHeader
            title="AI Tutor for JEE"
            description="Learn JEE Physics, Chemistry, and Mathematics concepts with personalized AI tutors who adapt to your knowledge level."
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teacher-select">Select Teacher</TabsTrigger>
              <TabsTrigger value="assessment" disabled={!selectedTeacher}>
                Assessment
              </TabsTrigger>
              <TabsTrigger value="knowledge-graph" disabled={!quizCompleted}>
                Knowledge Graph
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teacher-select" className="mt-6">
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
                  onClick={handleStartChat}
                  disabled={!selectedTeacher}
                  className="px-8"
                >
                  Start Learning Session
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="mt-6">
              <PrerequisiteQuiz
                subject="Physics"
                onComplete={handleQuizComplete}
              />
            </TabsContent>

            <TabsContent value="knowledge-graph" className="mt-6">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold mb-2">Your Knowledge Map</h2>
                <p className="text-muted-foreground">
                  This graph shows your current mastery levels across different JEE Physics concepts.
                  Click on any node to see more details.
                </p>
              </div>
              <KnowledgeGraph
                nodes={physicsNodes}
                connections={physicsConnections}
              />
              <div className="mt-8 text-center">
                <Button size="lg" onClick={startChatFromKnowledgeGraph}>
                  Start Chat with {teachers.find((t) => t.id === selectedTeacher)?.name}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              {selectedTeacher && (
                <ChatInterface
                  teacherName={teachers.find((t) => t.id === selectedTeacher)?.name || ""}
                  teacherAvatar={teachers.find((t) => t.id === selectedTeacher)?.avatar || ""}
                  voiceId={teachers.find((t) => t.id === selectedTeacher)?.voiceId || ""}
                  agentId="8OPvpBZArqGy3fVZKjt1"
                  knowledgeNodes={knowledgeNodes}
                />
              )}
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
