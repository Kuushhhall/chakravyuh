
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Progress } from "@/components/ui-custom/Progress";
import { AvatarContainer, AvatarImage, AvatarFallback } from "@/components/ui-custom/Avatar";
import { useToast } from "@/hooks/use-toast";
import { Award, BookOpen, Clock, Edit, FileEdit, LineChart, LogOut, Mail, Phone, Settings, User, Beaker, GraduationCap, Sigma } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui-custom/Modal";
import { StudentAvatarSelector, AvatarOption } from "@/components/StudentAvatarSelector";

interface UserData {
  name: string;
  email: string;
  phone: string;
  targetExam: string;
  targetYear: string;
  profileImage: string;
  avatarId?: string;
}

interface StatsData {
  totalStudyHours: number;
  questionsAnswered: number;
  averageScore: number;
  streak: number;
}

interface ActivityItem {
  type: "study" | "test";
  subject: string;
  topic: string;
  time: string;
  duration?: string;
  score?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState<UserData>({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    targetExam: "JEE Advanced",
    targetYear: "2024",
    profileImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=200&h=200",
    avatarId: "photo-1"
  });
  
  // Mock stats data
  const stats: StatsData = {
    totalStudyHours: 120,
    questionsAnswered: 1450,
    averageScore: 72,
    streak: 15
  };
  
  // Mock recent activities
  const recentActivities: ActivityItem[] = [
    { type: "study", subject: "Physics", topic: "Mechanics", time: "2 hours ago", duration: "45 minutes" },
    { type: "test", subject: "Chemistry", topic: "Organic Chemistry Test", time: "Yesterday", score: "85%" },
    { type: "study", subject: "Mathematics", topic: "Calculus", time: "Yesterday", duration: "60 minutes" },
    { type: "test", subject: "Physics", topic: "Weekly Assessment", time: "2 days ago", score: "78%" }
  ];
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      duration: 3000,
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      duration: 3000,
    });
    navigate("/");
  };

  const handleAvatarChange = (avatarId: string) => {
    // In a real app, you'd save this to the backend
    setUserData({
      ...userData,
      avatarId: avatarId
    });
    
    // Close modal after short delay to show selection animation
    setTimeout(() => {
      setShowAvatarModal(false);
      toast({
        title: "Avatar Updated",
        description: "Your profile avatar has been updated successfully.",
        duration: 3000,
      });
    }, 500);
  };
  
  // Find the avatar source based on the selected avatar ID
  const getAvatarSource = () => {
    // If using default image from userData
    if (!userData.avatarId) return userData.profileImage;
    
    // Find avatar from our options (code in StudentAvatarSelector)
    const selectedAvatarId = userData.avatarId;
    // This would normally be imported from the StudentAvatarSelector
    const avatarOptions: AvatarOption[] = [
      // Flat icon avatars (these won't have image URLs, they use icons)
      { id: "flat-1", type: "flat", name: "Default" },
      // 3D rendered avatars
      { id: "3d-1", type: "3d", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=student1&backgroundColor=b6e3f4", name: "3D Shape 1" },
      { id: "3d-2", type: "3d", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=student2&backgroundColor=d1d4f9", name: "3D Shape 2" },
      { id: "3d-3", type: "3d", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=student3&backgroundColor=c0aede", name: "3D Shape 3" },
      { id: "3d-4", type: "3d", imageUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=student1", name: "3D Thumbs 1" },
      { id: "3d-5", type: "3d", imageUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=student2", name: "3D Thumbs 2" },
      { id: "3d-6", type: "3d", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1", name: "3D Avatar 1" },
      { id: "3d-7", type: "3d", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=student2", name: "3D Avatar 2" },
      // Photo avatars
      { id: "photo-1", type: "photo", imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=200&h=200", name: "Photo 1" },
      { id: "photo-2", type: "photo", imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=200&h=200", name: "Photo 2" },
      { id: "photo-3", type: "photo", imageUrl: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?auto=format&fit=crop&w=200&h=200", name: "Photo 3" },
    ];
    
    const avatar = avatarOptions.find(a => a.id === selectedAvatarId);
    return avatar?.imageUrl || userData.profileImage;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Settings className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Profile details */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <AvatarContainer size="lg" className="h-24 w-24">
                        <AvatarImage src={getAvatarSource()} alt={userData.name} />
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      </AvatarContainer>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                        onClick={() => setShowAvatarModal(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                    <p className="text-muted-foreground">Preparing for {userData.targetExam}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        {isEditing ? (
                          <input 
                            type="email" 
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            className="w-full p-2 mt-1 border rounded-md"
                          />
                        ) : (
                          <p>{userData.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        {isEditing ? (
                          <input 
                            type="tel" 
                            value={userData.phone}
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            className="w-full p-2 mt-1 border rounded-md"
                          />
                        ) : (
                          <p>{userData.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Target Exam</p>
                        {isEditing ? (
                          <select 
                            value={userData.targetExam}
                            onChange={(e) => setUserData({...userData, targetExam: e.target.value})}
                            className="w-full p-2 mt-1 border rounded-md"
                          >
                            <option>JEE Main</option>
                            <option>JEE Advanced</option>
                            <option>NEET</option>
                            <option>BITSAT</option>
                          </select>
                        ) : (
                          <p>{userData.targetExam}</p>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <Button 
                        className="w-full mt-4" 
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Your Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Total Study Hours</p>
                        <p className="text-sm font-semibold">{stats.totalStudyHours} hrs</p>
                      </div>
                      <Progress value={stats.totalStudyHours / 2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Questions Answered</p>
                        <p className="text-sm font-semibold">{stats.questionsAnswered}</p>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Average Score</p>
                        <p className="text-sm font-semibold">{stats.averageScore}%</p>
                      </div>
                      <Progress value={stats.averageScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Day Streak</p>
                        <p className="text-sm font-semibold">{stats.streak} days</p>
                      </div>
                      <Progress value={stats.streak * 5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Activity and progress */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Subject Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Physics</p>
                        <p className="text-sm font-semibold">65%</p>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Chemistry</p>
                        <p className="text-sm font-semibold">42%</p>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Mathematics</p>
                        <p className="text-sm font-semibold">30%</p>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Biology</p>
                        <p className="text-sm font-semibold">80%</p>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/dashboard')}
                  >
                    View Detailed Progress
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">Recent Activity</h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div className={`p-2 rounded-full mr-3 ${
                          activity.type === 'study' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {activity.type === 'study' ? (
                            <BookOpen className="h-5 w-5" />
                          ) : (
                            <FileEdit className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{activity.subject}: {activity.topic}</h4>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === 'study' 
                              ? `Studied for ${activity.duration}` 
                              : `Scored ${activity.score}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Performance Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-secondary/30 border-0">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-3">
                          <Clock className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold">{stats.totalStudyHours} hrs</p>
                        <p className="text-sm text-muted-foreground">Total Study Time</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/30 border-0">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mb-3">
                          <LineChart className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold">{stats.averageScore}%</p>
                        <p className="text-sm text-muted-foreground">Average Test Score</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Button className="w-full mt-4" onClick={() => navigate('/test-results/latest')}>
                    View Performance Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Avatar Selection Modal */}
      <Modal 
        isOpen={showAvatarModal} 
        onClose={() => setShowAvatarModal(false)}
        title="Choose Your Avatar"
        size="lg"
      >
        <StudentAvatarSelector 
          selectedAvatar={userData.avatarId}
          onSelect={handleAvatarChange}
        />
        
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => setShowAvatarModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
