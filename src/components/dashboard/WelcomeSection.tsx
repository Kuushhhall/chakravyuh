
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { AvatarContainer, AvatarFallback, AvatarImage } from "@/components/ui-custom/Avatar";

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName = "Student" }: WelcomeSectionProps) {
  const [greeting, setGreeting] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setTimeOfDay("morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
      setTimeOfDay("afternoon");
    } else {
      setGreeting("Good evening");
      setTimeOfDay("evening");
    }
  }, []);

  return (
    <Card className="mb-6 overflow-hidden bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-none">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AvatarContainer size="lg">
                <AvatarImage src="/placeholder.svg" alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </AvatarContainer>
              <div>
                <h2 className="text-2xl font-bold">{greeting}, {userName}!</h2>
                <p className="text-muted-foreground">Ready for your {timeOfDay} study session?</p>
              </div>
            </div>
            <p className="text-sm mt-2 max-w-md">
              Your next priority topic appears to be <span className="font-medium">Electromagnetism</span>. 
              You've made great progress this week - keep it up!
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center bg-white/80 dark:bg-white/10 p-2 rounded-lg">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">15</span>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>
              <div className="flex flex-col items-center bg-white/80 dark:bg-white/10 p-2 rounded-lg">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">42%</span>
                <span className="text-xs text-muted-foreground">Course</span>
              </div>
              <div className="flex flex-col items-center bg-white/80 dark:bg-white/10 p-2 rounded-lg">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">3</span>
                <span className="text-xs text-muted-foreground">Hours Today</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
