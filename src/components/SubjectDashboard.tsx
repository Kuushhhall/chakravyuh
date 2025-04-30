import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudyPlanItem } from "@/components/StudyPlanItem";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Progress } from "@/components/ui-custom/Progress";
import { BadgeCheck, Book, Calendar, LineChart, Clock, Filter, LucideIcon, Target } from "lucide-react";

// Mock data for subjects
const subjectsData = [
  {
    id: "physics",
    subject: "Physics",
    duration: "8 weeks",
    progress: 65,
    difficulty: "medium" as const,
    topics: [
      { name: "Mechanics", completed: true, duration: "2 weeks" },
      { name: "Thermodynamics", completed: true, duration: "1 week" },
      { name: "Electromagnetism", completed: false, duration: "2 weeks" },
      { name: "Optics", completed: false, duration: "1 week" },
      { name: "Modern Physics", completed: false, duration: "2 weeks" },
    ]
  },
  {
    id: "chemistry",
    subject: "Chemistry",
    duration: "7 weeks",
    progress: 42,
    difficulty: "hard" as const,
    topics: [
      { name: "Physical Chemistry", completed: true, duration: "2 weeks" },
      { name: "Organic Chemistry", completed: false, duration: "3 weeks" },
      { name: "Inorganic Chemistry", completed: false, duration: "2 weeks" },
    ]
  },
  {
    id: "mathematics",
    subject: "Mathematics",
    duration: "10 weeks",
    progress: 30,
    difficulty: "hard" as const,
    topics: [
      { name: "Algebra", completed: true, duration: "2 weeks" },
      { name: "Calculus", completed: false, duration: "3 weeks" },
      { name: "Coordinate Geometry", completed: false, duration: "2 weeks" },
      { name: "Trigonometry", completed: false, duration: "1 week" },
      { name: "Statistics & Probability", completed: false, duration: "2 weeks" },
    ]
  },
  {
    id: "biology",
    subject: "Biology",
    duration: "6 weeks",
    progress: 80,
    difficulty: "easy" as const,
    topics: [
      { name: "Cell Biology", completed: true, duration: "1 week" },
      { name: "Genetics", completed: true, duration: "1 week" },
      { name: "Human Physiology", completed: true, duration: "2 weeks" },
      { name: "Plant Physiology", completed: false, duration: "1 week" },
      { name: "Ecology", completed: false, duration: "1 week" },
    ]
  }
];

// Mock data for recommended subjects
const recommendedSubjects = [
  { name: "Electromagnetism", subject: "Physics", urgency: "high", reason: "Exam in 2 weeks" },
  { name: "Organic Chemistry", subject: "Chemistry", urgency: "medium", reason: "Weakness detected" },
  { name: "Calculus", subject: "Mathematics", urgency: "low", reason: "Regular practice needed" },
];

// Mock data for statistics
const studyStats = {
  streakDays: 15,
  questionsCompleted: 450,
  hoursSpent: 120,
  mastery: 42,
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  suffix?: string;
}

function StatCard({ title, value, icon: Icon, description, suffix }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}{suffix}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="p-3 rounded-full bg-secondary/40">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PriorityItemProps {
  name: string;
  subject: string;
  urgency: "low" | "medium" | "high";
  reason: string;
}

function PriorityItem({ name, subject, urgency, reason }: PriorityItemProps) {
  const navigate = useNavigate();
  
  const getUrgencyColor = () => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-xs text-muted-foreground">{subject} • {reason}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor()}`}>
          {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate(`/ai-tutor`)}
        >
          Study
        </Button>
      </div>
    </div>
  );
}

export function SubjectDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const handleStudyClick = (subjectId: string) => {
    navigate(`/ai-tutor`);
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Study Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and plan your study sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Study Planner
          </Button>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Study Streak" 
          value={studyStats.streakDays} 
          suffix=" days"
          icon={BadgeCheck} 
          description="Keep going!" 
        />
        <StatCard 
          title="Questions Completed" 
          value={studyStats.questionsCompleted} 
          icon={Target} 
          description="10 today" 
        />
        <StatCard 
          title="Hours Studied" 
          value={studyStats.hoursSpent} 
          icon={Clock} 
          description="2 hours today" 
        />
        <StatCard 
          title="Mastery Level" 
          value={studyStats.mastery} 
          suffix="%"
          icon={LineChart} 
          description="Increasing steadily" 
        />
      </div>
      
      {/* Priority Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Study Priorities</h2>
          <Button variant="link" size="sm">View All</Button>
        </div>
        <Card>
          <CardContent className="p-4">
            {recommendedSubjects.map((item, index) => (
              <PriorityItem 
                key={index} 
                name={item.name} 
                subject={item.subject} 
                urgency={item.urgency as "low" | "medium" | "high"} 
                reason={item.reason} 
              />
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Overall Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Overall Progress</h2>
          <div className="flex gap-2">
            <Button 
              variant={view === "grid" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView("grid")}
              className="flex items-center gap-1"
            >
              Grid
            </Button>
            <Button 
              variant={view === "list" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView("list")}
              className="flex items-center gap-1"
            >
              List
            </Button>
          </div>
        </div>
        
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectsData.map((subject) => (
              <StudyPlanItem 
                key={subject.id}
                subject={subject.subject}
                duration={subject.duration}
                progress={subject.progress}
                difficulty={subject.difficulty}
                topics={subject.topics}
                onClick={() => handleStudyClick(subject.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              {subjectsData.map((subject, index) => (
                <div key={subject.id} className="py-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{subject.subject}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{subject.duration}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStudyClick(subject.id)}
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      subject.difficulty === "easy" 
                        ? "bg-green-100 text-green-800" 
                        : subject.difficulty === "medium" 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-red-100 text-red-800"
                    }`}>
                      {subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Recommended Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recommended Resources</h2>
          <Button variant="link" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                <Book className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">JEE Physics Formula Sheet</h3>
                <p className="text-sm text-muted-foreground">All important formulas in one place</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-800">
                <Book className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Chemistry Reaction Guide</h3>
                <p className="text-sm text-muted-foreground">Master organic reactions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-800">
                <Book className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Calculus Problem Solving</h3>
                <p className="text-sm text-muted-foreground">Advanced techniques with examples</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
