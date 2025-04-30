
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// This component still exists but is no longer used in the app
// It's kept for reference in case you want to enable protected routes in the future
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // This line is commented out to allow all users access regardless of auth status
  // if (!user) {
  //   return <Navigate to="/signin" replace />;
  // }

  return <>{children}</>;
};
