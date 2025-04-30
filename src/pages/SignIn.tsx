
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui-custom/Button";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { SignInOption } from "@/components/SignInOptions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignIn = () => {
  const [loading, setLoading] = useState<{
    google?: boolean;
    email?: boolean;
    phone?: boolean;
  }>({});
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading({ google: true });
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setLoading({ google: false });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md px-4 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your learning journey</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-3 border border-yellow-300 bg-yellow-50 rounded-md flex items-center gap-2 text-sm text-yellow-800">
              <p>
                Authentication is in demo mode. Click any option to proceed without actual authentication.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <SignInOption
              icon={
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.171 8.368h-.67v-.035H10v3.333h4.709A4.998 4.998 0 0 1 5 10a5 5 0 0 1 5-5c1.275 0 2.434.48 3.317 1.268l2.357-2.357A8.295 8.295 0 0 0 10 1.667a8.334 8.334 0 1 0 8.171 6.7Z" fill="#FFC107" />
                  <path d="M2.628 6.121 5.366 8.13A4.998 4.998 0 0 1 10 5c1.275 0 2.434.482 3.317 1.268l2.357-2.357A8.295 8.295 0 0 0 10 1.667a8.329 8.329 0 0 0-7.372 4.454Z" fill="#FF3D00" />
                  <path d="M10 18.333a8.294 8.294 0 0 0 5.587-2.163l-2.579-2.183A4.963 4.963 0 0 1 10 15a4.998 4.998 0 0 1-4.701-3.333L2.58 13.783A8.327 8.327 0 0 0 10 18.333Z" fill="#4CAF50" />
                  <path d="M18.171 8.368H17.5v-.034H10v3.333h4.71a5.017 5.017 0 0 1-1.703 2.321l2.58 2.182c-.182.166 2.746-2.003 2.746-6.17 0-.559-.057-1.104-.162-1.632Z" fill="#1976D2" />
                </svg>
              }
              text="Continue with Google"
              onClick={handleGoogleSignIn}
              loading={loading.google}
            />

            <Link to="/email-signin">
              <SignInOption
                icon={<Mail className="h-5 w-5 text-gray-600" />}
                text="Continue with Email"
                onClick={() => {}}
                loading={loading.email}
              />
            </Link>

            <Link to="/phone-signin">
              <SignInOption
                icon={<Phone className="h-5 w-5 text-gray-600" />}
                text="Continue with Phone"
                onClick={() => {}}
                loading={loading.phone}
              />
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
