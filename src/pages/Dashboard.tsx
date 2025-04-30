
import { PageLayout } from "@/components/layout/PageLayout";
import { SubjectDashboard } from "@/components/SubjectDashboard";

const Dashboard = () => {
  return (
    <PageLayout showFooter={false}>
      <SubjectDashboard />
    </PageLayout>
  );
};

export default Dashboard;
