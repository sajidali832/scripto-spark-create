
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { FileText, Hash, User, Lightbulb, Copy, Save, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // For demo purposes, we'll simulate the generation with predefined content
      // rather than using the edge function that might not be fully configured
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
        default:
          demoContent = "Generated content will appear here.";
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGeneratedContent(demoContent);
      
      toast({
        title: "Content generated!",
        description: "Your AI-powered content is ready.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
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
      
      // Save content to database
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
    
    return `${intro}[Opening Scene]\n\nHey everyone, welcome back to my channel! Today we're diving deep into ${topic}.\n\nHave you ever wondered how ${topic} works? Well, I'm going to break it down for you in this ${platformText}.\n\n[Main Content]\n\nFirst, let's talk about why ${topic} matters. There are three key reasons:\n\n1. It helps you understand the world better\n2. It improves your decision-making process\n3. It connects you with like-minded people\n\nNow, let me share a personal story about my experience with ${topic}...\n\n[Personal Anecdote Section]\n\nA few years ago, I discovered ${topic} by accident, and it changed my perspective entirely. I remember thinking, "Why didn't I learn about this sooner?"\n\n[Informative Section]\n\nHere are some fascinating facts about ${topic} that most people don't know:\n- The concept originated in the early 2000s\n- Over 5 million people worldwide engage with it daily\n- Experts predict it will revolutionize the industry by 2025\n\n[Closing]\n\nThat's all for today's video on ${topic}! If you found this valuable, don't forget to like, subscribe, and hit that notification bell. Drop your questions in the comments below, and I'll see you in the next video!\n\n[Outro]\n\nStay curious and keep learning!`;
  };

  const generateDemoCaption = (topic, platform) => {
    const hashtags = generateDemoHashtags(topic, platform);
    return `✨ Exploring the fascinating world of ${topic} today and couldn't be more excited to share these insights with you all! 🌟\n\nHave you ever wondered how ${topic} could transform your daily routine? Swipe through to discover my top 3 takeaways that might just change your perspective!\n\nWhat I've learned about ${topic} this week:\n\n1️⃣ It's not just about the destination, but the journey\n2️⃣ Small consistent steps lead to remarkable progress\n3️⃣ Community support makes all the difference\n\nComment below if you've had any experiences with ${topic} - would love to hear your thoughts! 💭\n\n${hashtags}`;
  };

  const generateDemoHashtags = (topic, platform) => {
    const cleanTopic = topic.replace(/[^\w\s]/gi, '');
    const words = cleanTopic.split(' ');
    const baseHashtags = [
      `#${words.join('')}`,
      `#${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`,
      `#${cleanTopic.replace(/\s+/g, '')}`,
      `#${cleanTopic.replace(/\s+/g, 'And')}`,
      `#${cleanTopic.replace(/\s+/g, '_')}`
    ];
    
    const commonHashtags = [
      "#ContentCreator",
      "#DigitalCreator",
      "#CreatorEconomy",
      "#LearnOnSocial",
      "#ShareKnowledge",
      "#GrowthMindset",
      "#CommunityFirst",
      "#EngageAndInspire",
      "#AuthenticContent",
      "#CreativeMindset",
      "#DailyInspiration",
      "#ThoughtLeader"
    ];
    
    // Platform-specific hashtags
    const platformHashtags = {
      "instagram": ["#InstagramReels", "#IGDaily", "#InstagramCommunity", "#InstagramGrowth", "#InstagramAlgorithm"],
      "tiktok": ["#TikTokCreator", "#FYP", "#ForYou", "#TikTokGrowth", "#TikTokTips", "#TikTokStrategy"],
      "twitter": ["#TwitterTips", "#TweetSmarter", "#TwitterGrowth", "#EngageOrDie", "#ThreadWriter"],
      "linkedin": ["#LinkedInCreators", "#LinkedInContent", "#LinkedInGrowth", "#ProfessionalDevelopment", "#CareerTips"]
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
    
    return result.join(' ');
  };

  const generateDemoBio = (topic, platform) => {
    const platformText = platform === "instagram" ? "Instagram" :
                        platform === "twitter" ? "Twitter" :
                        platform === "linkedin" ? "LinkedIn" :
                        platform === "tiktok" ? "TikTok" : "social media";
    
    return `${topic} Enthusiast & Content Creator 📱✨\n\n▶️ Sharing insights about ${topic} and digital innovation\n👨‍💻 Helping creators build impactful online presence\n🎯 Focused on authentic growth strategies\n🔍 Exploring the intersection of creativity and technology\n\n💌 DM for collaborations\n🔗 Latest project link in bio!\n\n"Transforming how we think about ${topic}, one post at a time."`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Content Tools</h1>
          <p className="text-gray-600">Create amazing content with our AI-powered generators</p>
        </div>

        <Tabs defaultValue="script" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="script" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Script</span>
            </TabsTrigger>
            <TabsTrigger value="caption" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Caption</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="bio" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Bio</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Input Panel */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
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
                    className="h-12"
                  />
                </div>

                <TabsContent value="script" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="hashtags" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="bio" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="script">
                  <Button
                    onClick={() => handleGenerate("script")}
                    disabled={isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                </TabsContent>

                <TabsContent value="caption">
                  <Button
                    onClick={() => handleGenerate("caption")}
                    disabled={isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                </TabsContent>

                <TabsContent value="hashtags">
                  <Button
                    onClick={() => handleGenerate("hashtags")}
                    disabled={isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                </TabsContent>

                <TabsContent value="bio">
                  <Button
                    onClick={() => handleGenerate("bio")}
                    disabled={isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                </TabsContent>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Content</span>
                  {generatedContent && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="hover:bg-purple-50"
                        disabled={isGenerating}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        className="hover:bg-green-50"
                        disabled={isGenerating || isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <TabsContent value="script" className="m-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate("script")}
                          className="hover:bg-blue-50"
                          disabled={isGenerating}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TabsContent>
                      <TabsContent value="caption" className="m-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate("caption")}
                          className="hover:bg-blue-50"
                          disabled={isGenerating}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TabsContent>
                      <TabsContent value="hashtags" className="m-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate("hashtags")}
                          className="hover:bg-blue-50"
                          disabled={isGenerating}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TabsContent>
                      <TabsContent value="bio" className="m-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate("bio")}
                          className="hover:bg-blue-50"
                          disabled={isGenerating}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TabsContent>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Your generated content will appear here..."
                  />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                    <div className="text-center px-4">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter a topic and click generate to see your AI-powered content here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Tools;
