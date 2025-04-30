
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ExamCard } from "@/components/ExamCard";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Heart, LineChart, Building, Cog } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ExamSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleExamSelect = (examType: string) => {
    toast({
      title: `${examType.toUpperCase()} selected`,
      description: "Redirecting to personalization...",
    });
    navigate(`/onboarding?exam=${examType}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-4xl px-4 mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Choose Your Exam</h1>
            <p className="text-muted-foreground">
              Select an exam to start your personalized preparation journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <ExamCard
              title="JEE"
              description="Joint Entrance Examination"
              icon={<GraduationCap className="h-6 w-6" />}
              onClick={() => handleExamSelect("jee")}
            />
            
            <ExamCard
              title="NEET"
              description="Medical Entrance Exam"
              icon={<Heart className="h-6 w-6" />}
              onClick={() => handleExamSelect("neet")}
            />
            
            <ExamCard
              title="CAT"
              description="Common Admission Test"
              icon={<LineChart className="h-6 w-6" />}
              onClick={() => handleExamSelect("cat")}
            />
            
            <ExamCard
              title="UPSC"
              description="Civil Services Examination"
              icon={<Building className="h-6 w-6" />}
              onClick={() => handleExamSelect("upsc")}
            />
            
            <ExamCard
              title="Custom Path"
              description="Create your own learning journey"
              icon={<Cog className="h-6 w-6" />}
              onClick={() => handleExamSelect("custom")}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamSelect;
