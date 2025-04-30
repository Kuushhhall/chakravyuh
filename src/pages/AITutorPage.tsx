
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import TeacherSelection from "@/components/ai-tutor/TeacherSelection";
import ChatInterface from "@/components/ai-tutor/ChatInterface";
import PrerequisiteQuiz from "@/components/ai-tutor/PrerequisiteQuiz";
import { toast } from "sonner";

// Teacher profiles with centered face image
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
];

// Quiz completion states
type LearningStage = "selection" | "quiz" | "learning";

export default function AITutorPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [stage, setStage] = useState<LearningStage>("selection");
  const [quizResults, setQuizResults] = useState<{score: number, knowledgeAreas: string[]}>({ score: 0, knowledgeAreas: [] });
  const { user, loading } = useAuth();
  
  // Check authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/30 mb-4"></div>
          <div className="h-4 w-32 bg-primary/30 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    toast.error("Please sign in to access the AI Tutor");
    return <Navigate to="/signin" replace />;
  }

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacher(teacherId);
    setStage("quiz");
  };

  const handleQuizComplete = (results: {score: number, knowledgeAreas: string[]}) => {
    setQuizResults(results);
    setStage("learning");
    
    toast.success(`Quiz completed with score: ${results.score}/5`, {
      description: "Your personalized learning path is ready",
    });
  };

  const handleBackToSelection = () => {
    setSelectedTeacher(null);
    setStage("selection");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-4">
        <Container>
          {stage === "selection" && (
            <TeacherSelection 
              teachers={teachers} 
              onTeacherSelect={handleTeacherSelect} 
            />
          )}

          {stage === "quiz" && selectedTeacher && (
            <PrerequisiteQuiz 
              teacher={teachers.find(t => t.id === selectedTeacher)!}
              onComplete={handleQuizComplete}
              onBack={handleBackToSelection}
            />
          )}

          {stage === "learning" && selectedTeacher && (
            <ChatInterface 
              teacher={teachers.find(t => t.id === selectedTeacher)!}
              knowledgeAreas={quizResults.knowledgeAreas}
              initialScore={quizResults.score}
              onBack={handleBackToSelection}
            />
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
