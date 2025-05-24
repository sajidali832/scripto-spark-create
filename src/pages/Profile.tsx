
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { User, Settings, LogOut, Copy, Trash2, FileText, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: "", avatar_url: "" });
  const [savedContent, setSavedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    scripts: 0,
    captions: 0,
    total: 0
  });
  
  // Fetch user data on component mount
  useEffect(() => {
    const getUser = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        setUser(session.user);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        if (profileData) {
          setProfile({
            full_name: profileData.full_name || "",
            avatar_url: profileData.avatar_url || ""
          });
        }
        
        // Fetch user content
        const { data: contentData, error: contentError } = await supabase
          .from('user_content')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (contentError) {
          throw contentError;
        }
        
        if (contentData) {
          setSavedContent(contentData);
          
          // Calculate stats
          const scripts = contentData.filter(item => item.type === 'script').length;
          const captions = contentData.filter(item => item.type === 'caption').length;
          
          setStats({
            scripts,
            captions,
            total: contentData.length
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "Please try again or sign in again."
        });
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [navigate, toast]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message
      });
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard!",
      description: "Content has been copied successfully."
    });
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('user_content')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setSavedContent(savedContent.filter(item => item.id !== id));
      
      // Update stats
      const item = savedContent.find(item => item.id === id);
      if (item) {
        if (item.type === 'script') {
          setStats(prev => ({ ...prev, scripts: prev.scripts - 1, total: prev.total - 1 }));
        } else if (item.type === 'caption') {
          setStats(prev => ({ ...prev, captions: prev.captions - 1, total: prev.total - 1 }));
        } else {
          setStats(prev => ({ ...prev, total: prev.total - 1 }));
        }
      }
      
      toast({
        title: "Content deleted!",
        description: "The content has been removed from your saved items."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting content",
        description: error.message
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      // Less than a day
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      // Less than a week
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // More than a week
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and saved content</p>
        </div>

        <Tabs defaultValue="info" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile Info</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Saved Content</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid gap-8">
              {/* Profile Information */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.full_name || ''}
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="h-12 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 pt-6 border-t">
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleLogout}
                      className="hover:bg-red-50 text-red-600 border-red-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.scripts}</div>
                    <p className="text-gray-600">Scripts Generated</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.captions}</div>
                    <p className="text-gray-600">Captions Created</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.total}</div>
                    <p className="text-gray-600">Total Content</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>Saved Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedContent.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No saved content</h3>
                    <p className="text-gray-600 mb-6">Start creating content to see it here</p>
                    <Button 
                      onClick={() => navigate('/tools')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Create Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedContent.map((item) => (
                      <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              {item.type === 'script' && <FileText className="w-6 h-6 text-white" />}
                              {item.type === 'caption' && <User className="w-6 h-6 text-white" />}
                              {item.type === 'hashtag' && <Hash className="w-6 h-6 text-white" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.platform || 'General'} • {formatDate(item.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(item.content)}
                              className="hover:bg-purple-50"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-red-50 text-red-600 border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 line-clamp-3">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
