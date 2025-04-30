
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SubjectDashboard } from "@/components/SubjectDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SubjectDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
