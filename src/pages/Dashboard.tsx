
import { PageLayout } from "@/components/layout/PageLayout";
import { SubjectDashboard } from "@/components/SubjectDashboard";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <PageLayout showFooter={false}>
      <div className="container py-6">
        <WelcomeSection userName="Alex" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SubjectDashboard />
          </div>
          <div className="space-y-6">
            <UpcomingEvents />
          </div>
        </div>
        <QuickActions />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
