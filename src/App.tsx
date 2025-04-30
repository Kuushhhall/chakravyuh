
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LearningProvider } from "@/contexts/LearningContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import AITutorPage from "@/pages/AITutorPage";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import SubjectDetail from "@/pages/SubjectDetail";
import StudySchedule from "@/pages/StudySchedule";
import PracticeTests from "@/pages/PracticeTests";
import ConceptMapPage from "@/pages/ConceptMapPage";
import NotFound from "@/pages/NotFound";
import Explore from "@/pages/Explore";
import ResourceLibrary from "@/pages/ResourceLibrary";
import Profile from "@/pages/Profile";
import ExamSelect from "@/pages/ExamSelect";
import Assessment from "@/pages/Assessment";
import Onboarding from "@/pages/Onboarding";
import EmailSignIn from "@/pages/EmailSignIn";
import PhoneSignIn from "@/pages/PhoneSignIn";

import "./App.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LearningProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/email-signin" element={<EmailSignIn />} />
              <Route path="/phone-signin" element={<PhoneSignIn />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/explore" element={<Explore />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-tutor" element={<AITutorPage />} />
                <Route path="/subject/:id" element={<SubjectDetail />} />
                <Route path="/study-schedule" element={<StudySchedule />} />
                <Route path="/practice-tests" element={<PracticeTests />} />
                <Route path="/concept-map" element={<ConceptMapPage />} />
                <Route path="/resources" element={<ResourceLibrary />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/exam-select" element={<ExamSelect />} />
                <Route path="/assessment" element={<Assessment />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" richColors />
          </LearningProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
