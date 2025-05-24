
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Hash, User, Lightbulb, Plus, Copy, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedContent, setSavedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            setUserData(profileData);
          }
          
          // Fetch user content
          const { data: contentData, error } = await supabase
            .from('user_content')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setSavedContent(contentData || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleCopy = async (id) => {
    try {
      // Find the content to copy
      const contentToCopy = savedContent.find(item => item.id === id);
      if (contentToCopy) {
        await navigator.clipboard.writeText(contentToCopy.content);
        toast({
          title: "Content copied!",
          description: "The content has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error copying content:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('user_content')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSavedContent(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Content deleted",
        description: "The content has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete the content. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Function to get appropriate icon based on content type
  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'script':
        return <FileText className="w-5 h-5 text-white" />;
      case 'caption':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'hashtag':
      case 'hashtags':
        return <Hash className="w-5 h-5 text-white" />;
      case 'bio':
        return <User className="w-5 h-5 text-white" />;
      default:
        return <Lightbulb className="w-5 h-5 text-white" />;
    }
  };

  // Function to format time elapsed
  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    // Fix: Convert dates to numbers before arithmetic operations
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center mb-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 mb-4 sm:mb-0"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome{userData?.full_name ? ` ${userData.full_name}` : ''} to SCRIPTO</h1>
              <p className="text-gray-600">Ready to create amazing content today?</p>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12"
          >
            <motion.div variants={itemVariants}>
              <Card 
                className="group hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/tools')}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Script Generator</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Create YouTube scripts</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card 
                className="group hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/tools')}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Hashtag Generator</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Trending hashtags</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card 
                className="group hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/tools')}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Bio Generator</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Perfect profiles</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card 
                className="group hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/tools')}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Ideas Generator</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Content inspiration</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* User Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl">Your Content</CardTitle>
              <Button 
                onClick={() => navigate('/tools')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading your content...</p>
                  </div>
                </div>
              ) : savedContent.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-12"
                >
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">No content yet</h3>
                  <p className="text-gray-600 mb-6">Start creating amazing content with our AI tools</p>
                  <Button 
                    onClick={() => navigate('/tools')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Content
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3 sm:space-y-4"
                >
                  {savedContent.map((item) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">{item.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{item.platform || 'General'} • {getTimeElapsed(item.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(item.id)}
                          className="hover:bg-purple-100 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
