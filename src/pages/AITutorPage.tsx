
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/container";
import { VAPI_API_KEY, DEFAULT_ASSISTANT_ID } from "@/config/env";
import { teachers } from "@/data/teacherProfiles";
import TeacherSelection from "@/components/ai-tutor/TeacherSelection";
import ImmersiveClassroom from "@/components/ai-tutor/ImmersiveClassroom";

export default function AITutorPage() {
  const [apiKey] = useState<string>(VAPI_API_KEY);
  const [assistantId] = useState<string>(DEFAULT_ASSISTANT_ID);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);

  useEffect(() => {
    if (selectedTeacherId) {
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      if (teacher) {
        setSelectedTeacher(teacher);
      }
    }
  }, [selectedTeacherId]);

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
  };

  return (
    <PageLayout showFooter={false}>
      {!selectedTeacherId ? (
        <Container>
          <TeacherSelection
            teachers={teachers}
            onTeacherSelect={handleTeacherSelect}
          />
        </Container>
      ) : (
        <ImmersiveClassroom
          apiKey={apiKey}
          assistantId={assistantId}
          teacher={selectedTeacher}
        />
      )}
    </PageLayout>
  );
}
