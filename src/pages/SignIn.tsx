
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SignInOption } from "@/components/SignInOptions";
import { FaGoogle, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

const SignIn = () => {
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google");
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setLoading("");
    }
  };

  const handleEmailSignIn = () => {
    navigate("/email-signin");
  };

  const handlePhoneSignIn = () => {
    navigate("/phone-signin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md px-6 py-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue learning</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-3 border border-yellow-300 bg-yellow-50 rounded-md flex items-center gap-2 text-sm text-yellow-800">
              <p>
                Authentication is in demo mode. You can sign in with any method to proceed.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <SignInOption
              icon={<FaGoogle className="h-5 w-5 text-red-500" />}
              text="Continue with Google"
              onClick={handleGoogleSignIn}
              loading={loading === "google"}
            />
            <SignInOption
              icon={<FaEnvelope className="h-5 w-5 text-blue-500" />}
              text="Continue with Email"
              onClick={handleEmailSignIn}
              loading={loading === "email"}
            />
            <SignInOption
              icon={<FaPhone className="h-5 w-5 text-green-500" />}
              text="Continue with Phone"
              onClick={handlePhoneSignIn}
              loading={loading === "phone"}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary hover:underline font-medium">
                Sign Up
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
