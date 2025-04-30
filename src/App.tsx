import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import EmailSignIn from "./pages/EmailSignIn";
import PhoneSignIn from "./pages/PhoneSignIn";
import ExamSelect from "./pages/ExamSelect";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AITutorPage from "./pages/AITutorPage";
import SubjectDetail from "./pages/SubjectDetail";
import Assessment from "./pages/Assessment";
import ConceptMapPage from "./pages/ConceptMapPage";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import PracticeTests from "./pages/PracticeTests";
import TestResults from "./pages/TestResults";
import StudySchedule from "./pages/StudySchedule";
import ResourceLibrary from "./pages/ResourceLibrary";
import About from "./pages/About"; 
import Explore from "./pages/Explore";

// Page imports
import Blog from "./pages/Blog";
import HelpCenter from "./pages/HelpCenter";
import Testimonials from "./pages/Testimonials";
import Company from "./pages/Company";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" expand={true} richColors closeButton />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignIn />} />
              <Route path="/email-signin" element={<EmailSignIn />} />
              <Route path="/phone-signin" element={<PhoneSignIn />} />
              
              {/* Content routes - no authentication required */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-tutor" element={<AITutorPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/practice-tests" element={<PracticeTests />} />
              <Route path="/test-results/:testId" element={<TestResults />} />
              <Route path="/study-schedule" element={<StudySchedule />} />
              
              {/* Other routes */}
              <Route path="/exam-select" element={<ExamSelect />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/subject/:subjectId" element={<SubjectDetail />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/concept-map" element={<ConceptMapPage />} />
              <Route path="/resources" element={<ResourceLibrary />} />
              <Route path="/about" element={<About />} />
              <Route path="/explore" element={<Explore />} />
              
              {/* Resource pages */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/testimonials" element={<Testimonials />} />
              
              {/* Company pages */}
              <Route path="/company" element={<Company />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Legal pages */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              
              {/* Redirect /study to /ai-tutor */}
              <Route path="/study" element={<Navigate to="/ai-tutor" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
