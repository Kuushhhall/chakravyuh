
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import {
  AlignRight,
  BookOpen,
  Calendar,
  ChevronDown,
  Home,
  Lightbulb,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AvatarContainer, AvatarImage, AvatarFallback } from "@/components/ui-custom/Avatar";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { label: "Home", icon: <Home className="h-4 w-4 mr-2" />, path: "/dashboard" },
    { label: "Study", icon: <BookOpen className="h-4 w-4 mr-2" />, path: "/ai-tutor" },
    { label: "Schedule", icon: <Calendar className="h-4 w-4 mr-2" />, path: "/study-schedule" },
    { label: "Resources", icon: <Lightbulb className="h-4 w-4 mr-2" />, path: "/resources" },
  ];

  // Function to get avatar URL if available from user metadata or provider data
  const getAvatarUrl = () => {
    if (!user) return null;
    
    // Try to get avatar from user metadata
    const avatarUrl = user.user_metadata?.avatar_url;
    if (avatarUrl) return avatarUrl;
    
    // If not found in metadata, check each provider's data
    if (user.identities && user.identities.length > 0) {
      for (const identity of user.identities) {
        if (identity.provider === 'google' && identity.identity_data?.avatar_url) {
          return identity.identity_data.avatar_url;
        }
      }
    }
    
    return null;
  };

  // Get the display name of the user
  const getDisplayName = () => {
    if (!user) return '';
    
    return user.user_metadata?.name || 
           user.user_metadata?.full_name || 
           (user.identities && user.identities.length > 0 && user.identities[0].identity_data?.full_name) || 
           user.email?.split('@')[0] || 
           '';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl inline-block">StudyAI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:flex">
            {user && menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
              >
                <Link 
                  to={item.path}
                  className="flex items-center justify-center"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative overflow-hidden rounded-full"
              >
                <Link to="/profile">
                  <AvatarContainer size="md">
                    <AvatarImage src={getAvatarUrl() || undefined} alt={getDisplayName()} />
                    <AvatarFallback>{getDisplayName().charAt(0).toUpperCase()}</AvatarFallback>
                  </AvatarContainer>
                </Link>
              </Button>
              <div className="hidden md:flex">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                asChild
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button
                size={isMobile ? "sm" : "default"}
                asChild
              >
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="container pb-4">
          <nav className="flex flex-col space-y-2">
            {user ? (
              <>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className="justify-start"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="justify-start text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/");
                    setIsOpen(false);
                  }}
                  className="justify-start"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/explore");
                    setIsOpen(false);
                  }}
                  className="justify-start"
                >
                  <AlignRight className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
