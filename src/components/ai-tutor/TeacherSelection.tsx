
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { PageHeader } from "@/components/ui/page-header";
import { Teacher } from "@/data/teacherProfiles";

interface TeacherSelectionProps {
  teachers: Teacher[];
  onTeacherSelect: (teacherId: string) => void;
}

export default function TeacherSelection({ teachers, onTeacherSelect }: TeacherSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Choose Your AI Tutor"
        description="Select a specialized tutor to begin your personalized JEE preparation journey"
        gradient
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {teachers.map((teacher) => (
          <Card 
            key={teacher.id}
            className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 duration-300"
            onClick={() => onTeacherSelect(teacher.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/20 bg-secondary/5">
                {/* Image container with CSS to center the face */}
                <div className="w-full h-full relative">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="absolute w-[120%] h-[120%] object-cover object-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold">{teacher.name}</h3>
              <p className="text-primary font-medium">{teacher.title}</p>
              <p className="text-muted-foreground mt-2 text-sm">{teacher.description}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="bg-secondary/40 px-2 py-1 rounded-full text-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
              <Button 
                className="mt-6 w-full" 
                variant="default"
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
