
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FuturisticLanding } from "@/components/landing/FuturisticLanding";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <FuturisticLanding />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
