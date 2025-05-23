
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Hash, User, Lightbulb, Plus, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  const navigate = useNavigate();
  const [savedContent, setSavedContent] = useState([
    { id: 1, type: "Script", title: "YouTube Video: How to Start a Business", platform: "YouTube", createdAt: "2 hours ago" },
    { id: 2, type: "Caption", title: "Instagram Post Caption", platform: "Instagram", createdAt: "1 day ago" },
    { id: 3, type: "Hashtags", title: "Fitness Hashtags", platform: "Instagram", createdAt: "3 days ago" },
  ]);

  const handleCopy = (id: number) => {
    console.log("Copying content with id:", id);
    // Implement copy functionality
  };

  const handleDelete = (id: number) => {
    setSavedContent(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back to SCRIPTO</h1>
              <p className="text-gray-600">Ready to create amazing content today?</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card 
              className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate('/tools')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Script Generator</h3>
                <p className="text-sm text-gray-600">Create YouTube scripts</p>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate('/tools')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Hashtag Generator</h3>
                <p className="text-sm text-gray-600">Trending hashtags</p>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate('/tools')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Bio Generator</h3>
                <p className="text-sm text-gray-600">Perfect profiles</p>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate('/tools')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Ideas Generator</h3>
                <p className="text-sm text-gray-600">Content inspiration</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Content */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Your Recent Content</CardTitle>
            <Button 
              onClick={() => navigate('/tools')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </CardHeader>
          <CardContent>
            {savedContent.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No content yet</h3>
                <p className="text-gray-600 mb-6">Start creating amazing content with our AI tools</p>
                <Button 
                  onClick={() => navigate('/tools')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Try a Feature
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        {item.type === 'Script' && <FileText className="w-5 h-5 text-white" />}
                        {item.type === 'Caption' && <User className="w-5 h-5 text-white" />}
                        {item.type === 'Hashtags' && <Hash className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.platform} • {item.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(item.id)}
                        className="hover:bg-purple-100"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
