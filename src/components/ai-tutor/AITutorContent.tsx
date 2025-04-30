
import { teachers } from "@/data/teacherProfiles";
import TeacherSelection from "@/components/ai-tutor/TeacherSelection";
import PrerequisiteQuiz from "@/components/ai-tutor/PrerequisiteQuiz";
import ChatInterface from "@/components/ai-tutor/ChatInterface";
import { useLearning } from "@/contexts/LearningContext";
import { toast } from "sonner";

export function AITutorContent() {
  const { 
    stage, 
    selectedTeacher, 
    quizResults,
    handleTeacherSelect, 
    handleQuizComplete, 
    handleBackToSelection 
  } = useLearning();

  // Handlers
  const onQuizComplete = (results: {score: number, knowledgeAreas: string[]}) => {
    handleQuizComplete(results);
    
    toast.success(`Quiz completed with score: ${results.score}/5`, {
      description: "Your personalized learning path is ready",
    });
  };

  // Render appropriate component based on stage
  return (
    <>
      {stage === "selection" && (
        <TeacherSelection 
          teachers={teachers} 
          onTeacherSelect={handleTeacherSelect} 
        />
      )}

      {stage === "quiz" && selectedTeacher && (
        <PrerequisiteQuiz 
          teacher={teachers.find(t => t.id === selectedTeacher)!}
          onComplete={onQuizComplete}
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
    </>
  );
}
