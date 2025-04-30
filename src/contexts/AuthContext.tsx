
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User, Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (avatarUrl?: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Update user profile in database with provider data if available
          if (session?.user) {
            setTimeout(() => {
              syncUserProfileWithProviderData(session.user);
            }, 0);
          }
          navigate('/dashboard');
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Function to sync user profile with provider data
  const syncUserProfileWithProviderData = async (user: User) => {
    try {
      if (!user) return;

      // Check if user has identity data from providers
      if (!user.identities || user.identities.length === 0) return;

      // Get provider data (prioritize Google)
      const googleIdentity = user.identities.find(identity => identity.provider === 'google');
      const identityData = googleIdentity ? googleIdentity.identity_data : user.identities[0].identity_data;

      if (!identityData) return;

      // Get existing profile data
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Update fields only if they're not already set
      const updates = {
        display_name: existingProfile?.display_name || identityData.full_name || identityData.name || user.user_metadata.name,
        email: existingProfile?.email || user.email,
        profile_picture: existingProfile?.profile_picture || identityData.avatar_url || user.user_metadata.avatar_url,
        updated_at: new Date().toISOString()
      };

      // Update the profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...updates
        });

      if (error) {
        console.error('Error updating profile with provider data:', error);
      }
    } catch (error) {
      console.error('Error syncing user profile with provider data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("Account created successfully! Please verify your email.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  // Function to update user profile with new avatar or name
  const updateUserProfile = async (avatarUrl?: string, name?: string) => {
    try {
      if (!user) return;

      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      
      if (avatarUrl) updates.profile_picture = avatarUrl;
      if (name) updates.display_name = name;

      // Update the profile table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update auth metadata if name changed
      if (name) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { name }
        });

        if (metadataError) throw metadataError;
      }

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
