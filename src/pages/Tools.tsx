
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { FileText, Hash, User, Lightbulb, Copy, Save, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ToolCard } from "@/components/ToolCard";
import { IdeaGenerator } from "@/components/IdeaGenerator";
import { IdeasInspiration } from "@/components/IdeasInspiration";
import { LoadingScreen } from "@/components/LoadingScreen";

const Tools = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("script");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading AI content tools...");
  const [isContentGeneratorVisible, setIsContentGeneratorVisible] = useState(false);

  // Enhanced loading animation
  useEffect(() => {
    const loadingMessages = [
      "Loading AI content tools...",
      "Preparing your creative tools...",
      "Setting up the content studio...",
      "Almost ready..."
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[currentIndex]);
    }, 1000);
    
    const timer = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      
      // Show content generator with animation
      setTimeout(() => {
        setIsContentGeneratorVisible(true);
      }, 300);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleGenerate = async (type) => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "We need a topic to generate content for you.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setTitle(topic); // Set the title based on the topic
    
    try {
      // Show animation while content is being generated
      setGeneratedContent("");
      
      // Use the Supabase Edge Function to generate content
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt: topic,
          type, 
          platform,
          duration
        }
      });

      if (error) throw error;

      if (data?.generatedContent) {
        // Simulate typing effect for the generated content
        const content = data.generatedContent;
        let currentText = "";
        
        // Start by showing 20% of content immediately
        const initialChunk = Math.floor(content.length * 0.2);
        currentText = content.substring(0, initialChunk);
        setGeneratedContent(currentText);
        
        // Then animate the rest
        for (let i = initialChunk; i < content.length; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 1));
          currentText = content.substring(0, i);
          setGeneratedContent(currentText);
        }
        
        // Ensure complete content is set
        setGeneratedContent(content);
        
        toast({
          title: "Content generated!",
          description: "Your AI-powered content is ready.",
        });
      } else {
        // If the API fails, fall back to demo content
        let demoContent = "";
        switch(type) {
          case "script":
            demoContent = generateDemoScript(topic, platform, duration);
            break;
          case "caption":
            demoContent = generateDemoCaption(topic, platform);
            break;
          case "hashtags":
            demoContent = generateDemoHashtags(topic, platform);
            break;
          case "bio":
            demoContent = generateDemoBio(topic, platform);
            break;
          case "ideas":
            demoContent = generateDemoIdeas(topic, platform);
            break;
          case "inspiration":
            demoContent = generateDemoInspirations(topic, platform);
            break;
        }
        
        // Animate the demo content appearance
        let currentText = "";
        for (let i = 0; i < demoContent.length; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 1));
          currentText = demoContent.substring(0, i);
          setGeneratedContent(currentText);
        }
        
        // Ensure complete content is set
        setGeneratedContent(demoContent);
        
        toast({
          title: "Content ready!",
          description: "Your content has been generated successfully.",
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      
      // Fall back to demo data with animation
      let demoContent = "";
      switch(type) {
        case "script":
          demoContent = generateDemoScript(topic, platform, duration);
          break;
        case "caption":
          demoContent = generateDemoCaption(topic, platform);
          break;
        case "hashtags":
          demoContent = generateDemoHashtags(topic, platform);
          break;
        case "bio":
          demoContent = generateDemoBio(topic, platform);
          break;
        case "ideas":
          demoContent = generateDemoIdeas(topic, platform);
          break;
        case "inspiration":
          demoContent = generateDemoInspirations(topic, platform);
          break;
      }
      
      // Animate the demo content appearance
      let currentText = "";
      for (let i = 0; i < demoContent.length; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 1));
        currentText = demoContent.substring(0, i);
        setGeneratedContent(currentText);
      }
      
      // Ensure complete content is set
      setGeneratedContent(demoContent);
      
      toast({
        title: "Content ready!",
        description: "Your content has been generated successfully.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard!",
      description: "Your content has been copied and is ready to use.",
    });
  };

  const handleSave = async () => {
    if (!generatedContent) {
      toast({
        title: "Nothing to save",
        description: "Please generate content first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("You must be logged in to save content");
      
      // Save content to database with visual feedback
      const savingToast = toast({
        title: "Saving your content...",
        description: (
          <div className="flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>Storing your creative work...</span>
          </div>
        ),
        duration: 3000,
      });
      
      const { error } = await supabase
        .from('user_content')
        .insert({
          user_id: session.user.id,
          title: title || topic,
          content: generatedContent,
          type: activeTab,
          platform: platform || null
        });
      
      if (error) throw error;
      
      toast({
        title: "Content saved!",
        description: "Your content has been saved to your dashboard.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = (type) => {
    handleGenerate(type);
  };

  // Demo content generators
  const generateDemoScript = (topic, platform, duration) => {
    const platformText = platform === "youtube" ? "YouTube video" : 
                        platform === "reels" ? "Instagram Reel" :
                        platform === "shorts" ? "YouTube Short" :
                        platform === "tiktok" ? "TikTok video" : "video";
    
    const durationMinutes = duration || "5";
    const intro = `Title: ${topic}\nPlatform: ${platformText}\nDuration: ${durationMinutes} minutes\n\n`;
    
    return `${intro}[Opening Scene]\n\nHey everyone, welcome back to my channel! Today we are diving deep into ${topic}.\n\nHave you ever wondered how ${topic} works? Well, I am going to break it down for you in this ${platformText}.\n\n[Main Content]\n\nFirst, let us talk about why ${topic} matters. There are three key reasons:\n\n1. It helps you understand the world better\n2. It improves your decision making process\n3. It connects you with like minded people\n\nNow, let me share a personal story about my experience with ${topic}...\n\n[Personal Anecdote Section]\n\nA few years ago, I discovered ${topic} by accident, and it changed my perspective entirely. I remember thinking, Why did not I learn about this sooner?\n\n[Informative Section]\n\nHere are some fascinating facts about ${topic} that most people do not know:\n- The concept originated in the early 2000s\n- Over 5 million people worldwide engage with it daily\n- Experts predict it will revolutionize the industry by 2025\n\n[Closing]\n\nThat is all for today is video on ${topic}! If you found this valuable, do not forget to like, subscribe, and hit that notification bell. Drop your questions in the comments below, and I will see you in the next video!\n\n[Outro]\n\nStay curious and keep learning!`;
  };

  const generateDemoCaption = (topic, platform) => {
    const cleanHashtags = generateDemoHashtags(topic, platform).replace(/[#]/g, '');
    return `Exploring the fascinating world of ${topic} today and could not be more excited to share these insights with you all!\n\nHave you ever wondered how ${topic} could transform your daily routine? Swipe through to discover my top 3 takeaways that might just change your perspective!\n\nWhat I have learned about ${topic} this week:\n\n1 It is not just about the destination, but the journey\n2 Small consistent steps lead to remarkable progress\n3 Community support makes all the difference\n\nComment below if you have had any experiences with ${topic}. Would love to hear your thoughts!\n\n${cleanHashtags}`;
  };

  const generateDemoHashtags = (topic, platform) => {
    const cleanTopic = topic.replace(/[^\w\s]/gi, '');
    const words = cleanTopic.split(' ');
    const baseHashtags = [
      `${words.join('')}`,
      `${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`,
      `${cleanTopic.replace(/\s+/g, '')}`,
      `${cleanTopic.replace(/\s+/g, 'And')}`,
      `${cleanTopic.replace(/\s+/g, '_')}`
    ];
    
    const commonHashtags = [
      "ContentCreator",
      "DigitalCreator",
      "CreatorEconomy",
      "LearnOnSocial",
      "ShareKnowledge",
      "GrowthMindset",
      "CommunityFirst",
      "EngageAndInspire",
      "AuthenticContent",
      "CreativeMindset",
      "DailyInspiration",
      "ThoughtLeader"
    ];
    
    // Platform-specific hashtags
    const platformHashtags = {
      "instagram": ["InstagramReels", "IGDaily", "InstagramCommunity", "InstagramGrowth", "InstagramAlgorithm"],
      "tiktok": ["TikTokCreator", "FYP", "ForYou", "TikTokGrowth", "TikTokTips", "TikTokStrategy"],
      "twitter": ["TwitterTips", "TweetSmarter", "TwitterGrowth", "EngageOrDie", "ThreadWriter"],
      "linkedin": ["LinkedInCreators", "LinkedInContent", "LinkedInGrowth", "ProfessionalDevelopment", "CareerTips"]
    };
    
    // Combine hashtags
    let result = [...baseHashtags];
    
    // Add 5 random common hashtags
    const shuffledCommon = commonHashtags.sort(() => 0.5 - Math.random());
    result = result.concat(shuffledCommon.slice(0, 5));
    
    // Add platform-specific hashtags if platform is selected
    if (platform && platformHashtags[platform]) {
      const platformTags = platformHashtags[platform].sort(() => 0.5 - Math.random()).slice(0, 3);
      result = result.concat(platformTags);
    }
    
    // Join without hashtags per request
    return result.join(' ');
  };

  const generateDemoBio = (topic, platform) => {
    const platformText = platform === "instagram" ? "Instagram" :
                        platform === "twitter" ? "Twitter" :
                        platform === "linkedin" ? "LinkedIn" :
                        platform === "tiktok" ? "TikTok" : "social media";
    
    return `${topic} Enthusiast & Content Creator\n\nSharing insights about ${topic} and digital innovation\nHelping creators build impactful online presence\nFocused on authentic growth strategies\nExploring the intersection of creativity and technology\n\nDM for collaborations\nLatest project link in bio!\n\nTransforming how we think about ${topic}, one post at a time.`;
  };

  const generateDemoIdeas = (topic, platform) => {
    return `Content Ideas for ${topic} on ${platform || "all platforms"}:\n\n1. "Day in the Life of a ${topic} Expert" - Show behind-the-scenes of your work/passion\n\n2. "Top 5 Myths about ${topic} Debunked" - Address common misconceptions\n\n3. "${topic} Transformation Challenge" - Before and after results\n\n4. "How to Get Started with ${topic} as a Beginner" - Entry-level tutorial\n\n5. "What Nobody Tells You About ${topic}" - Insider perspectives\n\n6. "My Favorite Tools for ${topic}" - Resource roundup\n\n7. "${topic} Q&A" - Answer commonly asked questions\n\n8. "The History of ${topic} in 60 Seconds" - Quick educational content\n\n9. "Why I Love ${topic}" - Personal story content\n\n10. "${topic} Tips That Changed My Life" - High-value actionable advice`;
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
  
  const generateDemoInspirations = (topic, platform) => {
    return `✨ Creative Inspiration for ${topic} on ${platform || "all platforms"}:\n\n1. "${topic} Transformation Story" - Show the before and after journey with emotional impact\n\n2. "Behind the Scenes of ${topic}" - Give your audience an exclusive look at your process\n\n3. "${topic} Expert Interview Series" - Connect with thought leaders in your niche\n\n4. "${topic} Challenge" - Create a participatory event that encourages audience engagement\n\n5. "The Truth About ${topic}" - Tackle common misconceptions with authoritative insights\n\n6. "${topic} Quick Start Guide" - Break down complex concepts into simple, actionable steps\n\n7. "${topic} Trends for ${new Date().getFullYear()}" - Position yourself as a forward-thinking expert\n\n8. "How I Built My ${topic} Business/Following" - Share your authentic journey to success\n\n#ContentCreation #${topic.replace(/\s+/g, '')} #CreativeIdeas #${platform || "SocialMedia"} #ContentStrategy`;
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
  
  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1 }
  };

  if (loading) {
    return <LoadingScreen message={loadingText} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Content Tools</h1>
          <p className="text-gray-600">Create amazing content with our AI-powered generators</p>
        </motion.div>

        <Tabs defaultValue="script" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="script" className="flex items-center space-x-2">
              <motion.div
                variants={tabVariants}
                animate={activeTab === "script" ? "active" : "inactive"}
                className="flex items-center space-x-1"
              >
                <FileText className="w-4 h-4" />
                <span>Script</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="caption" className="flex items-center space-x-2">
              <motion.div
                variants={tabVariants}
                animate={activeTab === "caption" ? "active" : "inactive"}
                className="flex items-center space-x-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>Caption</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center space-x-2">
              <motion.div
                variants={tabVariants}
                animate={activeTab === "hashtags" ? "active" : "inactive"}
                className="flex items-center space-x-1"
              >
                <Hash className="w-4 h-4" />
                <span>Hashtags</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="bio" className="flex items-center space-x-2">
              <motion.div
                variants={tabVariants}
                animate={activeTab === "bio" ? "active" : "inactive"}
                className="flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Bio</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center space-x-2">
              <motion.div
                variants={tabVariants}
                animate={activeTab === "ideas" ? "active" : "inactive"}
                className="flex items-center space-x-1"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Ideas</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="inspiration" className="flex items-center space-x-2">
              <motion.div
                variants={tabVariants}
                animate={activeTab === "inspiration" ? "active" : "inactive"}
                className="flex items-center space-x-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>Inspiration</span>
              </motion.div>
            </TabsTrigger>
          </TabsList>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isContentGeneratorVisible ? "visible" : "hidden"}
            className="grid lg:grid-cols-2 gap-6 sm:gap-8"
          >
            {/* Input Panel */}
            <motion.div variants={itemVariants}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "ideas" ? (
                    <IdeaGenerator onGenerateContent={setGeneratedContent} />
                  ) : activeTab === "inspiration" ? (
                    <IdeasInspiration onGenerateContent={setGeneratedContent} />
                  ) : (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                            transition={{ duration: 0.6 }}
                          >
                            {activeTab === "script" && <FileText className="w-5 h-5 text-purple-600" />}
                            {activeTab === "caption" && <Sparkles className="w-5 h-5 text-purple-600" />}
                            {activeTab === "hashtags" && <Hash className="w-5 h-5 text-purple-600" />}
                            {activeTab === "bio" && <User className="w-5 h-5 text-purple-600" />}
                          </motion.div>
                          <span>Content Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="topic">Topic/Subject</Label>
                          <Input
                            id="topic"
                            placeholder="Enter your topic or subject"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-purple-300"
                          />
                        </div>

                        <TabsContent value="script" className="space-y-4 mt-0">
                          <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                              <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="reels">Instagram Reels</SelectItem>
                                <SelectItem value="shorts">YouTube Shorts</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Select value={duration} onValueChange={setDuration}>
                              <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="3">3 minutes</SelectItem>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="10">10 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>

                        <TabsContent value="caption" className="space-y-4 mt-0">
                          <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                              <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Content Category</Label>
                            <Select>
                              <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>

                        <TabsContent value="hashtags" className="space-y-4 mt-0">
                          <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                              <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Content Category</Label>
                            <Select>
                              <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>

                        <TabsContent value="bio" className="space-y-4 mt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Platform</Label>
                              <Select value={platform} onValueChange={setPlatform}>
                                <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="instagram">Instagram</SelectItem>
                                  <SelectItem value="twitter">Twitter</SelectItem>
                                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                                  <SelectItem value="tiktok">TikTok</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Industry</Label>
                              <Select>
                                <SelectTrigger className="h-12 transition-all hover:border-purple-300">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="tech">Technology</SelectItem>
                                  <SelectItem value="creative">Creative Arts</SelectItem>
                                  <SelectItem value="business">Business</SelectItem>
                                  <SelectItem value="health">Health & Wellness</SelectItem>
                                  <SelectItem value="education">Education</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="script">
                          <motion.div
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              onClick={() => handleGenerate("script")}
                              disabled={isGenerating}
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating Script...
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Generate Script
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="caption">
                          <motion.div
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              onClick={() => handleGenerate("caption")}
                              disabled={isGenerating}
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating Caption...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate Caption
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="hashtags">
                          <motion.div
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              onClick={() => handleGenerate("hashtags")}
                              disabled={isGenerating}
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating Hashtags...
                                </>
                              ) : (
                                <>
                                  <Hash className="w-4 h-4 mr-2" />
                                  Generate Hashtags
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="bio">
                          <motion.div
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              onClick={() => handleGenerate("bio")}
                              disabled={isGenerating}
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating Bio...
                                </>
                              ) : (
                                <>
                                  <User className="w-4 h-4 mr-2" />
                                  Generate Bio
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </TabsContent>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Output Panel */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Generated Content</span>
                    {generatedContent && (
                      <div className="flex items-center space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="hover:bg-purple-50 transition-all duration-200"
                            disabled={isGenerating}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSave}
                            className="hover:bg-green-50 transition-all duration-200"
                            disabled={isGenerating || isSaving}
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                        </motion.div>
                        
                        {activeTab !== "ideas" && activeTab !== "inspiration" && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRegenerate(activeTab)}
                              className="hover:bg-blue-50 transition-all duration-200"
                              disabled={isGenerating}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="min-h-[400px] font-mono text-sm resize-y transition-all duration-200 focus:ring-2 focus:ring-purple-300"
                        placeholder="Your generated content will appear here..."
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-center h-[400px] text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed"
                    >
                      <motion.div 
                        className="text-center px-4"
                        animate={{ 
                          y: [0, -10, 0],
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Enter a topic and click generate to see your AI-powered content here</p>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Loading animation during generation */}
                  {isGenerating && !generatedContent && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-b-xl"
                    >
                      <div className="flex flex-col items-center">
                        <motion.div 
                          className="w-16 h-16 border-4 border-t-purple-500 border-purple-200 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.p 
                          className="mt-4 text-purple-600 font-medium"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Generating amazing content...
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </Tabs>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold mb-6">Try More AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard 
              title="Social Media Calendar" 
              description="Plan and schedule your content across multiple platforms"
              icon={<FileText />}
              color="from-blue-500 to-cyan-400"
              comingSoon
            />
            <ToolCard 
              title="Thread Generator" 
              description="Create engaging Twitter threads that drive engagement"
              icon={<Hash />}
              color="from-purple-500 to-pink-400"
              comingSoon
            />
            <ToolCard 
              title="Email Templates" 
              description="Professional email templates for marketing and sales"
              icon={<Lightbulb />}
              color="from-amber-500 to-orange-400"
              comingSoon
            />
          </div>
        </motion.div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <motion.p 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Lovingly crafted by Sajid
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
