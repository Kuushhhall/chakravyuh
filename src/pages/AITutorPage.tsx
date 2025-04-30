
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/container";
import { ElevenLabsSetup } from "@/components/ai-tutor/ElevenLabsSetup";
import VoiceConversation from "@/components/ai-tutor/VoiceConversation";
import { ELEVEN_LABS_API_KEY, isElevenLabsConfigured } from "@/config/env";

export default function AITutorPage() {
  const [apiKey, setApiKey] = useState<string>(ELEVEN_LABS_API_KEY);
  const [isConfigured, setIsConfigured] = useState<boolean>(isElevenLabsConfigured);

  // Check for API key in localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("elevenLabsApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsConfigured(true);
    }
  }, []);

  const handleSetupComplete = (apiKey: string) => {
    setApiKey(apiKey);
    setIsConfigured(true);
  };

  return (
    <PageLayout showFooter={false}>
      <Container className="py-4">
        {isConfigured ? (
          <VoiceConversation apiKey={apiKey} />
        ) : (
          <ElevenLabsSetup onSetupComplete={handleSetupComplete} />
        )}
      </Container>
    </PageLayout>
  );
}
