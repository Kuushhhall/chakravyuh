
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudyPlanItem } from "@/components/StudyPlanItem";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Progress } from "@/components/ui-custom/Progress";
import { 
  BadgeCheck, Book, Calendar, LineChart, Clock, Filter, 
  LucideIcon, Target, Sparkles, Search, Plus 
} from "lucide-react";
import { FloatingActionButton, FloatingActionItem } from "@/components/ui-custom/FloatingActionButton";

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
  color?: string;
}

function StatCard({ title, value, icon: Icon, description, suffix, color = "bg-primary" }: StatCardProps) {
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}{suffix}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className={`p-3 rounded-full ${color}/10`}>
            <Icon className={`h-5 w-5 text-${color}`} />
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
      case "high": return "bg-red-900/20 text-red-400";
      case "medium": return "bg-amber-900/20 text-amber-400";
      case "low": return "bg-green-900/20 text-green-400";
      default: return "bg-gray-900/20 text-gray-400";
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground">{subject} • {reason}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor()}`}>
          {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate(`/ai-tutor`)}
          className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white shadow-glow-sm"
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
    <div className="container py-8 relative animate-enter">
      {/* Background aurora effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora-bg w-full h-full"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">Your Study Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and plan your study sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 glass">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">
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
          color="text-yellow-400"
        />
        <StatCard 
          title="Questions Completed" 
          value={studyStats.questionsCompleted} 
          icon={Target} 
          description="10 today" 
          color="text-green-400"
        />
        <StatCard 
          title="Hours Studied" 
          value={studyStats.hoursSpent} 
          icon={Clock} 
          description="2 hours today"
          color="text-blue-400" 
        />
        <StatCard 
          title="Mastery Level" 
          value={studyStats.mastery} 
          suffix="%"
          icon={LineChart} 
          description="Increasing steadily"
          color="text-purple-400" 
        />
      </div>
      
      {/* Priority Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-bold">Study Priorities</h2>
          </div>
          <Button variant="link" size="sm" className="text-primary">View All</Button>
        </div>
        <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-glow-sm">
          <CardContent className="p-0">
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
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Overall Progress</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={view === "grid" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-gradient-to-r from-primary to-secondary text-white" : "glass"}
            >
              Grid
            </Button>
            <Button 
              variant={view === "list" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView("list")}
              className={view === "list" ? "bg-gradient-to-r from-primary to-secondary text-white" : "glass"}
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
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              {subjectsData.map((subject, index) => (
                <div key={subject.id} className="p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{subject.subject}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{subject.duration}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStudyClick(subject.id)}
                      className="glass hover:bg-white/10 hover:shadow-glow-sm transition-all duration-300"
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
                      <Progress value={subject.progress} className="h-2" 
                        indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      subject.difficulty === "easy" 
                        ? "bg-green-900/20 text-green-400" 
                        : subject.difficulty === "medium" 
                          ? "bg-amber-900/20 text-amber-400" 
                          : "bg-red-900/20 text-red-400"
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
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold">Recommended Resources</h2>
          </div>
          <Button variant="link" size="sm" className="text-primary">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card hover:shadow-glow-sm transition-all duration-300 group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-900/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Book className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">JEE Physics Formula Sheet</h3>
                <p className="text-sm text-muted-foreground">All important formulas in one place</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card hover:shadow-glow-sm transition-all duration-300 group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-900/20 text-green-400 group-hover:scale-110 transition-transform duration-300">
                <Book className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Chemistry Reaction Guide</h3>
                <p className="text-sm text-muted-foreground">Master organic reactions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card hover:shadow-glow-sm transition-all duration-300 group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-900/20 text-purple-400 group-hover:scale-110 transition-transform duration-300">
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

      {/* Floating Action Button */}
      <FloatingActionButton>
        <FloatingActionItem
          icon={<Plus className="h-5 w-5 text-white" />}
          label="Quick Study"
          onClick={() => navigate('/ai-tutor')}
        />
        <FloatingActionItem
          icon={<Search className="h-5 w-5 text-white" />}
          label="Find Resources"
          onClick={() => navigate('/resources')}
        />
        <FloatingActionItem
          icon={<Calendar className="h-5 w-5 text-white" />}
          label="Schedule"
          onClick={() => navigate('/study-schedule')}
        />
      </FloatingActionButton>
    </div>
  );
}
