
import { 
  FloatingActionButton, 
  FloatingActionItem 
} from "@/components/ui/floating-action-button";
import { Book, Calendar, Play, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    switch (action) {
      case "study":
        navigate("/ai-tutor");
        break;
      case "schedule":
        navigate("/study-schedule");
        break;
      case "practice":
        navigate("/practice-tests");
        break;
      case "add":
        toast({
          title: "Create New",
          description: "This feature will be available soon!",
        });
        break;
    }
  };

  return (
    <FloatingActionButton>
      <FloatingActionItem
        icon={<Play className="h-5 w-5" />}
        label="Start Studying"
        onClick={() => handleAction("study")}
      />
      <FloatingActionItem
        icon={<Calendar className="h-5 w-5" />}
        label="Schedule"
        onClick={() => handleAction("schedule")}
      />
      <FloatingActionItem
        icon={<Book className="h-5 w-5" />}
        label="Practice Test"
        onClick={() => handleAction("practice")}
      />
      <FloatingActionItem
        icon={<PlusCircle className="h-5 w-5" />}
        label="Add Custom"
        onClick={() => handleAction("add")}
      />
    </FloatingActionButton>
  );
}
