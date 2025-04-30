
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { LearningProvider } from "@/contexts/LearningContext";
import { AITutorContent } from "@/components/ai-tutor/AITutorContent";
import { ElevenLabsProvider } from "@11labs/react";

// Eleven Labs API key
const ELEVEN_LABS_API_KEY = "sk_dd2ee8f36a60735c51baf428a276f3ef0e08509779a13e7e";

export default function AITutorPage() {
  return (
    <ElevenLabsProvider apiKey={ELEVEN_LABS_API_KEY}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-4">
          <Container>
            <LearningProvider>
              <AITutorContent />
            </LearningProvider>
          </Container>
        </main>
        <Footer />
      </div>
    </ElevenLabsProvider>
  );
}
