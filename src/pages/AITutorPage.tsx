
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/container";
import VoiceConversation from "@/components/ai-tutor/VoiceConversation";
import { VAPI_API_KEY, DEFAULT_ASSISTANT_ID } from "@/config/env";

export default function AITutorPage() {
  const [apiKey] = useState<string>(VAPI_API_KEY);
  const [assistantId] = useState<string>(DEFAULT_ASSISTANT_ID);

  return (
    <PageLayout showFooter={false}>
      <Container className="py-4">
        <VoiceConversation 
          apiKey={apiKey} 
          assistantId={assistantId} 
        />
      </Container>
    </PageLayout>
  );
}
