
import { Button } from "@/components/ui-custom/Button";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Sparkles, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/contexts/ThemeContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const resourcesMenu = [
    { title: "Blog", path: "/blog", description: "Insights and guides for JEE preparation" },
    { title: "Help Center", path: "/help", description: "Answers to common questions" },
    { title: "Testimonials", path: "/testimonials", description: "Student success stories" },
  ];

  const companyMenu = [
    { title: "About Us", path: "/about", description: "Our vision and mission" },
    { title: "Careers", path: "/careers", description: "Join our team" },
    { title: "Contact", path: "/contact", description: "Get in touch with us" },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "border-b bg-background/95 backdrop-blur-lg shadow-sm" 
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-gradient">Chakravyuh</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      isActive("/dashboard") && "bg-accent/50"
                    )}
                  >
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/ai-tutor">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      isActive("/ai-tutor") && "bg-accent/50"
                    )}
                  >
                    AI Tutor
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/explore">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(), 
                      isActive("/explore") && "bg-accent/50"
                    )}
                  >
                    Explore
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  location.pathname.startsWith("/resources") ||
                  location.pathname.startsWith("/blog") ||
                  location.pathname.startsWith("/help") ||
                  location.pathname.startsWith("/testimonials") 
                    ? "bg-accent/50" : "")}>
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {resourcesMenu.map((item) => (
                      <li key={item.path}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(item.path) && "bg-accent/50"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  location.pathname.startsWith("/about") || 
                  location.pathname.startsWith("/careers") ||
                  location.pathname.startsWith("/contact") 
                    ? "bg-accent/50" : "")}>
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {companyMenu.map((item) => (
                      <li key={item.path}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(item.path) && "bg-accent/50"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <div className="relative group">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300" 
                asChild
              >
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm">Profile</span>
                </Link>
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="relative overflow-hidden group"
              asChild
            >
              <Link to="/signin" className="flex items-center gap-2">
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </Link>
            </Button>
          )}
          
          {/* Mobile menu button */}
          <button
            className="block md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background/95 backdrop-blur-md p-6 pb-32 animate-in slide-in-from-top-5 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/dashboard"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary py-2 border-b border-border/50",
                isActive("/dashboard") && "text-primary"
              )}
            >
              Dashboard
            </Link>
            <Link 
              to="/ai-tutor"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary py-2 border-b border-border/50",
                isActive("/ai-tutor") && "text-primary"
              )}
            >
              AI Tutor
            </Link>
            <Link 
              to="/explore"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary py-2 border-b border-border/50",
                isActive("/explore") && "text-primary"
              )}
            >
              Explore
            </Link>
            <div className="py-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Resources</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {resourcesMenu.map(item => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-base transition-colors hover:text-primary",
                      isActive(item.path) && "text-primary"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="py-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Company</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {companyMenu.map(item => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-base transition-colors hover:text-primary",
                      isActive(item.path) && "text-primary"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-6">
              {user ? (
                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button className="w-full" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
