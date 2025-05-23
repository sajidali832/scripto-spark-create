
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Globe, Save, Copy, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SCRIPTO
          </h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')}
          className="hover:bg-purple-50 transition-colors"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Content Creation
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            Create Stunning
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Scripts & Content
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            AI-powered content generation for creators. Generate scripts, captions, hashtags, bios, and more in seconds.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => navigate('/auth')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            TRY SCRIPTO
            <ArrowRight className={`ml-2 w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Script Generator</h3>
              <p className="text-gray-600">Generate YouTube scripts from 3 to 30 minutes with AI precision and web search integration.</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Multi-Platform Content</h3>
              <p className="text-gray-600">Create captions, hashtags, and bios optimized for Instagram, LinkedIn, YouTube, and Twitter.</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Save className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Save & Manage</h3>
              <p className="text-gray-600">Copy, save, regenerate, and delete your content with powerful management tools.</p>
            </CardContent>
          </Card>
        </div>

        {/* Tools Preview */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-12">Powerful Tools for Creators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Script Generator", icon: "📝", platform: "YouTube" },
              { name: "Caption Writer", icon: "💬", platform: "Instagram" },
              { name: "Hashtag Generator", icon: "#️⃣", platform: "All Platforms" },
              { name: "Bio Creator", icon: "👤", platform: "Social Media" }
            ].map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 bg-white/60 backdrop-blur-sm border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">{tool.icon}</div>
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.platform}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Create Amazing Content?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of creators using SCRIPTO to generate engaging content.</p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => navigate('/auth')}
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">SCRIPTO</span>
          </div>
          <p className="text-gray-400">AI-powered content creation for the modern creator.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
