
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { User, Settings, LogOut, Copy, Trash2, FileText, Hash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  
  const [savedContent] = useState([
    { id: 1, type: "Script", title: "YouTube Video: How to Start a Business", platform: "YouTube", createdAt: "2 hours ago", content: "Full script content here..." },
    { id: 2, type: "Caption", title: "Instagram Post Caption", platform: "Instagram", createdAt: "1 day ago", content: "Caption content here..." },
    { id: 3, type: "Hashtags", title: "Fitness Hashtags", platform: "Instagram", createdAt: "3 days ago", content: "#fitness #health #workout..." },
  ]);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved.",
    });
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard!",
      description: "Content has been copied successfully.",
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Content deleted!",
      description: "The content has been removed from your saved items.",
    });
  };

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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 pt-6 border-t">
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Save Changes
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
                    <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
                    <p className="text-gray-600">Scripts Generated</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">18</div>
                    <p className="text-gray-600">Captions Created</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">42</div>
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
                              {item.type === 'Script' && <FileText className="w-6 h-6 text-white" />}
                              {item.type === 'Caption' && <User className="w-6 h-6 text-white" />}
                              {item.type === 'Hashtags' && <Hash className="w-6 h-6 text-white" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.platform} • {item.createdAt}</p>
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
