
import { createContext, useContext, useState } from "react";

export type LearningStage = "selection" | "quiz" | "learning";

type Teacher = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  subjects: string[];
  voiceId: string;
};

interface QuizResults {
  score: number;
  knowledgeAreas: string[];
}

interface LearningContextType {
  stage: LearningStage;
  setStage: (stage: LearningStage) => void;
  selectedTeacher: string | null;
  setSelectedTeacher: (teacherId: string | null) => void;
  quizResults: QuizResults;
  setQuizResults: (results: QuizResults) => void;
  handleTeacherSelect: (teacherId: string) => void;
  handleQuizComplete: (results: QuizResults) => void;
  handleBackToSelection: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider = ({ children }: { children: React.ReactNode }) => {
  const [stage, setStage] = useState<LearningStage>("selection");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults>({ score: 0, knowledgeAreas: [] });

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacher(teacherId);
    setStage("quiz");
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setStage("learning");
  };

  const handleBackToSelection = () => {
    setSelectedTeacher(null);
    setStage("selection");
  };

  return (
    <LearningContext.Provider
      value={{
        stage,
        setStage,
        selectedTeacher,
        setSelectedTeacher,
        quizResults,
        setQuizResults,
        handleTeacherSelect,
        handleQuizComplete,
        handleBackToSelection,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};
