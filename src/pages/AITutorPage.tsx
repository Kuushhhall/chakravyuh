
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { LearningProvider } from "@/contexts/LearningContext";
import { AITutorContent } from "@/components/ai-tutor/AITutorContent";

export default function AITutorPage() {
  return (
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
  );
}
