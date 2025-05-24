
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, UserCheck, Shield, LogOut, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          setEmail(session.user.email);
          
          // Get profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFullName(data.full_name || "");
            setUserData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async () => {
    setLoading(true);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("No active session");
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clean up auth state
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
        
        Object.keys(sessionStorage || {}).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      };
      
      // Clean auth state
      cleanupAuthState();
      
      // Try global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for a clean state
      window.location.href = '/auth';
      
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingProfile ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-start justify-between">
                      <Label htmlFor="fullName" className="text-base font-medium mb-2">Full Name</Label>
                      {!isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-purple-600 hover:text-purple-700"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12"
                      />
                    ) : (
                      <p className="text-gray-700 py-2 px-3 bg-gray-50 rounded-md">{fullName || "Not set"}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-base font-medium mb-2">Email</Label>
                    <p className="text-gray-700 py-2 px-3 bg-gray-50 rounded-md">{email}</p>
                  </div>
                  
                  {isEditing && (
                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          // Reset to original values
                          if (userData) {
                            setFullName(userData.full_name || "");
                          }
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-purple-600" />
                      <span className="font-medium">Account Security</span>
                    </div>
                    <Button 
                      variant="outline"
                      className="text-sm border-gray-300"
                      onClick={() => {
                        // Password reset flow would go here
                        toast({
                          title: "Feature coming soon",
                          description: "Password reset functionality will be available soon.",
                        });
                      }}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-purple-600" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Content Created</p>
                    <p className="text-2xl font-bold text-purple-700">0</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Days Active</p>
                    <p className="text-2xl font-bold text-blue-700">1</p>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-6" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
