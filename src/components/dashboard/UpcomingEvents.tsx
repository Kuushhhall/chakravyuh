
import { Calendar, Clock, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";

interface Event {
  id: string;
  title: string;
  type: "deadline" | "live" | "challenge";
  date: string;
  time?: string;
  description: string;
}

const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Physics Assignment Due",
    type: "deadline",
    date: "Today",
    time: "11:59 PM",
    description: "Complete the Mechanics problem set"
  },
  {
    id: "2",
    title: "Live Q&A Session",
    type: "live",
    date: "Tomorrow",
    time: "4:00 PM",
    description: "Organic Chemistry concepts discussion"
  },
  {
    id: "3",
    title: "Weekend Challenge",
    type: "challenge",
    date: "Sat, Jun 15",
    description: "Compete in the Math Olympics"
  }
];

const getEventIcon = (type: Event["type"]) => {
  switch (type) {
    case "deadline":
      return <Clock className="h-5 w-5 text-amber-500" />;
    case "live":
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case "challenge":
      return <Flame className="h-5 w-5 text-red-500" />;
  }
};

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Upcoming Events</span>
          <Button variant="ghost" size="sm" className="text-xs">View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {dummyEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full bg-muted">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{event.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                {event.time && (
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" /> {event.time}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
