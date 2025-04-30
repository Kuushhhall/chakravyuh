
import { useState } from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Progress } from "@/components/ui-custom/Progress";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  conceptNode: string;
}

interface QuizProps {
  subject: string;
  onComplete: (results: {
    score: number;
    knowledgeNodes: {
      nodeId: string;
      mastery: number;
    }[];
  }) => void;
}

// Sample physics questions for the prerequisite assessment
const physicsQuestions: Question[] = [
  {
    id: 1,
    question: "Which of the following is the correct formula for calculating kinetic energy?",
    options: ["KE = mgh", "KE = 1/2 * mv²", "KE = 1/2 * kx²", "KE = P/V"],
    correctAnswer: 1,
    topic: "Mechanics",
    difficulty: "easy",
    conceptNode: "kinetic-energy",
  },
  {
    id: 2,
    question: "A body of mass m is projected with velocity v at an angle θ with the horizontal. The time of flight is:",
    options: ["2v sin θ / g", "v sin θ / g", "2v cos θ / g", "v cos θ / g"],
    correctAnswer: 0,
    topic: "Mechanics",
    difficulty: "medium",
    conceptNode: "projectile-motion",
  },
  {
    id: 3,
    question: "The dimensional formula for angular momentum is:",
    options: ["[MLT−1]", "[ML²T−1]", "[ML²T−2]", "[ML²T−3]"],
    correctAnswer: 1,
    topic: "Units and Dimensions",
    difficulty: "medium",
    conceptNode: "angular-momentum",
  },
  {
    id: 4,
    question: "The electric field inside a charged conducting sphere is:",
    options: ["Zero", "Proportional to radius", "Inversely proportional to radius", "Constant"],
    correctAnswer: 0,
    topic: "Electrostatics",
    difficulty: "medium",
    conceptNode: "electric-field",
  },
  {
    id: 5,
    question: "Which of the following is NOT a conservative force?",
    options: ["Gravitational force", "Electrostatic force", "Magnetic force on a moving charge", "Elastic spring force"],
    correctAnswer: 2,
    topic: "Work, Energy and Power",
    difficulty: "hard",
    conceptNode: "conservative-forces",
  },
];

export function PrerequisiteQuiz({ subject, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(physicsQuestions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion] === -1) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < physicsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Calculate the score
    const score = answers.reduce((total, answer, index) => {
      return answer === physicsQuestions[index].correctAnswer ? total + 1 : total;
    }, 0);

    // Calculate mastery level for each concept node
    const knowledgeNodes = physicsQuestions.map((question, index) => {
      const correct = answers[index] === question.correctAnswer;
      return {
        nodeId: question.conceptNode,
        mastery: correct ? (question.difficulty === "easy" ? 70 : question.difficulty === "medium" ? 80 : 90) : 30,
      };
    });

    setShowResult(true);
    onComplete({ score, knowledgeNodes });
  };

  const currentQuestionData = physicsQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / physicsQuestions.length) * 100;

  if (showResult) {
    const score = answers.reduce((total, answer, index) => {
      return answer === physicsQuestions[index].correctAnswer ? total + 1 : total;
    }, 0);
    
    const percentage = Math.round((score / physicsQuestions.length) * 100);

    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <span className="text-2xl font-bold">{percentage}%</span>
            </div>
            <p className="mb-6">
              You scored {score} out of {physicsQuestions.length} questions correctly.
            </p>
            <p className="text-muted-foreground mb-4">
              Based on your assessment, we'll create a personalized learning path for you.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Prerequisite Assessment: {subject}</h2>
          <p className="text-muted-foreground mb-4">
            Answer these questions to help us understand your current knowledge level.
          </p>
          <div className="mb-2 flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {physicsQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{currentQuestionData.question}</h3>
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  answers[currentQuestion] === index
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectAnswer(index)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      answers[currentQuestion] === index
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNextQuestion}>
            {currentQuestion < physicsQuestions.length - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
