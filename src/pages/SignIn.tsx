
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui-custom/Button";
import { SignInOption } from "@/components/SignInOptions";
import { Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Github, Phone, AlertTriangle } from "lucide-react";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });
    
    // Show a toast if Supabase is not configured
    if (!isSupabaseConfigured) {
      toast.error("Supabase configuration is missing. Auth features will not work.", {
        duration: 5000,
      });
    }
  }, [navigate]);
  
  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured. Please set the environment variables.");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGithubSignIn = async () => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured. Please set the environment variables.");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("GitHub sign in error:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailSignIn = () => {
    navigate("/email-signin");
  };
  
  const handlePhoneSignIn = () => {
    navigate("/phone-signin");
  };

  // Mock sign in for demo
  const handleDemoSignIn = () => {
    toast.success("Signed in with demo account");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md px-4 py-8 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Personal AI Tutor</h1>
            <p className="text-muted-foreground">
              Personalized study plans for competitive exam preparation
            </p>
          </div>
          
          {!isSupabaseConfigured && (
            <div className="mb-6 p-3 border border-yellow-300 bg-yellow-50 rounded-md flex items-center gap-2 text-sm text-yellow-800">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p>
                Authentication is in demo mode. Click any option to proceed to the dashboard.
              </p>
            </div>
          )}
          
          <div className="space-y-4 animate-fade-in">
            <SignInOption 
              icon={<svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                  fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335" />
              </svg>}
              text="Continue with Google"
              onClick={isSupabaseConfigured ? handleGoogleSignIn : handleDemoSignIn}
              loading={loading}
            />
            
            <SignInOption 
              icon={<Github className="h-5 w-5" />}
              text="Continue with GitHub"
              onClick={isSupabaseConfigured ? handleGithubSignIn : handleDemoSignIn}
              loading={loading}
            />
            
            <SignInOption 
              icon={<Mail className="h-5 w-5" />}
              text="Continue with Email"
              onClick={isSupabaseConfigured ? handleEmailSignIn : handleDemoSignIn}
              loading={loading}
            />
            
            <SignInOption 
              icon={<Phone className="h-5 w-5" />}
              text="Continue with Phone"
              onClick={isSupabaseConfigured ? handlePhoneSignIn : handleDemoSignIn}
              loading={loading}
            />
          </div>
          
          <div className="mt-6 text-center text-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
