
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lightbulb, Loader2, Hash, ArrowRight, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface IdeasInspirationProps {
  onGenerateContent: (content: string) => void;
}

export function IdeasInspiration({ onGenerateContent }: IdeasInspirationProps) {
  const [category, setCategory] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [contentFormat, setContentFormat] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedIdea, setGeneratedIdea] = useState<string>("");
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!category || !platform || !contentFormat || !topic) {
      toast({
        title: "Missing information",
        description: "Please fill out the required fields to generate ideas.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedIdea("");
    
    try {
      // We'll simulate the loading while generating content
      await new Promise(resolve => {
        // Simulate typing animation by adding content piece by piece
        let fullContent = generateDemoInspirations(category, platform, contentFormat, topic, audience);
        let currentText = "";
        let index = 0;
        
        const typingInterval = setInterval(() => {
          if (index < fullContent.length) {
            currentText += fullContent.charAt(index);
            setGeneratedIdea(currentText);
            index++;
          } else {
            clearInterval(typingInterval);
            resolve(null);
            setIsGenerating(false);
          }
        }, 20);
      });
      
      const finalContent = generateDemoInspirations(category, platform, contentFormat, topic, audience);
      onGenerateContent(finalContent);
      
      toast({
        title: "Ideas generated!",
        description: "Your inspiration has arrived. Ready to create amazing content!",
      });
    } catch (error) {
      console.error("Error generating inspiration:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate inspiration. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };
  
  const generateDemoInspirations = (category: string, platform: string, format: string, topic: string, audience: string = "") => {
    const targetAudience = audience || "your audience";
    
    const platformSpecificIntros = {
      "instagram": `✨ Instagram ${format} Content Ideas for ${category}:`,
      "tiktok": `🔥 TikTok ${format} Content Ideas for ${category}:`,
      "youtube": `🎬 YouTube ${format} Content Ideas for ${category}:`,
      "linkedin": `💼 LinkedIn ${format} Content Ideas for ${category}:`,
      "twitter": `🐦 Twitter ${format} Content Ideas for ${category}:`,
    };
    
    const intro = platformSpecificIntros[platform.toLowerCase()] || `Content Ideas for ${category} on ${platform}:`;
    
    const shortFormIdeas = [
      `"${topic} in 60 Seconds" - Quick educational breakdown that hooks viewers instantly`,
      `"${category} Myths BUSTED" - Debunk common misconceptions in your industry`,
      `"Day in the Life: ${topic} Edition" - Behind-the-scenes content that builds connection`,
      `"${topic} Before & After" - Show impressive transformations related to your content`,
      `"${topic} Hacks Nobody Tells You About" - Share insider tips that provide immediate value`,
      `"React to ${topic} Trends" - Give your expert take on what's currently viral`,
      `"${topic} Quick Start Guide" - Beginner-friendly introduction to your topic`,
      `"${category} Questions Answered" - Address FAQs in a rapid-fire format`
    ];
    
    const longFormIdeas = [
      `"The Ultimate Guide to ${topic}" - Comprehensive breakdown with actionable steps`,
      `"${topic} Case Study: From Beginner to Expert" - Detailed analysis with real examples`,
      `"${category} Masterclass: ${topic} Edition" - In-depth tutorial covering advanced techniques`,
      `"${topic} Deep Dive" - Explore nuanced aspects most creators overlook`,
      `"${topic} Interview Series" - Feature experts sharing diverse perspectives`,
      `"${category} Review Roundup: ${topic} Edition" - Compare multiple approaches or products`,
      `"Building a ${topic} Strategy for ${new Date().getFullYear()}" - Timely, forward-looking content`,
      `"${topic} Workshop" - Interactive session that breaks complex concepts into digestible parts`
    ];
    
    const contentIdeas = format.toLowerCase().includes("short") ? shortFormIdeas : longFormIdeas;
    const selectedIdeas = contentIdeas.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    const hashtags = generateHashtags(topic, platform, category);
    
    return `${intro}\n\n${selectedIdeas.map((idea, index) => `${index + 1}. ${idea}`).join('\n\n')}\n\n✅ Target Audience: People interested in ${topic} (${targetAudience})\n✅ Platform: ${platform}\n✅ Format: ${format}\n\n💡 Content Strategy Tips:\n• Post consistently at peak times for ${platform} (research shows ${getOptimalPostingTime(platform)})\n• Use eye-catching thumbnails/covers featuring ${topic}\n• Include CTAs asking viewers what they'd like to learn about ${topic}\n• Create a content series to build anticipation and return viewers\n• Repurpose successful ${format} content across other platforms\n\n${hashtags}\n\nNow pick ONE idea and start creating! 🚀`;
  };
  
  const generateHashtags = (topic: string, platform: string, category: string) => {
    const generalHashtags = ["ContentCreator", "DigitalMarketing", "CreatorEconomy", "OnlineContent"];
    
    const topicWords = topic.split(" ")
      .filter(word => word.length > 2)
      .map(word => word.replace(/[^\w]/g, ""));
    
    const categoryWords = category.split(" ")
      .filter(word => word.length > 2)
      .map(word => word.replace(/[^\w]/g, ""));
    
    const platformHashtags = {
      "instagram": ["Instagram", "IGCreator", "InstagramGrowth", "InstagramStrategy", "Reels"],
      "tiktok": ["TikTok", "TikTokCreator", "FYP", "ForYouPage", "TikTokGrowth"],
      "youtube": ["YouTube", "YouTuber", "YTCreator", "YouTubeTips", "VideoContent"],
      "linkedin": ["LinkedIn", "LinkedInContent", "LinkedInCreator", "ProfessionalContent"],
      "twitter": ["Twitter", "TwitterTips", "TweetSmarter", "TwitterGrowth", "ThreadWriter"]
    };
    
    const selectedGeneral = generalHashtags.sort(() => 0.5 - Math.random()).slice(0, 3);
    const platformSpecific = platformHashtags[platform.toLowerCase()] || [];
    const selectedPlatform = platformSpecific.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const combinedTags = [
      ...topicWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)),
      ...categoryWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)),
      ...selectedGeneral,
      ...selectedPlatform
    ].filter(Boolean);
    
    return `Popular Hashtags to Use:\n${combinedTags.map(tag => `#${tag}`).join(" ")}`;
  };
  
  const getOptimalPostingTime = (platform: string) => {
    const times = {
      "instagram": "weekdays between 11am-2pm and 7pm-9pm",
      "tiktok": "evenings between 7pm-11pm, especially Wednesday through Friday",
      "youtube": "weekends between 9am-11am or Thursday/Friday evenings",
      "linkedin": "Tuesday through Thursday between 8am-2pm",
      "twitter": "weekdays between 8am-10am and 6pm-7pm"
    };
    
    return times[platform.toLowerCase()] || "midday and evenings when your audience is most active";
  };
  
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="font-semibold text-xl">Ideas Inspiration Generator</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 transition-all duration-300 hover:border-purple-400 focus:border-purple-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="food">Food & Cooking</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="h-12 transition-all duration-300 hover:border-purple-400 focus:border-purple-500">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Format</Label>
              <Select value={contentFormat} onValueChange={setContentFormat}>
                <SelectTrigger className="h-12 transition-all duration-300 hover:border-purple-400 focus:border-purple-500">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Short-form">Short-form</SelectItem>
                  <SelectItem value="Long-form">Long-form</SelectItem>
                  <SelectItem value="Series">Series</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Vlog">Vlog</SelectItem>
                  <SelectItem value="Live">Live Stream</SelectItem>
                  <SelectItem value="Podcast">Podcast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input 
                placeholder="Who are you creating for?" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="h-12 transition-all duration-300 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Main Topic/Niche</Label>
            <Input 
              placeholder="What's your content about?" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-12 transition-all duration-300 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300"
            />
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Inspiration...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Creative Ideas
                </>
              )}
            </Button>
          </motion.div>
          
          <AnimatePresence>
            {isGenerating && !generatedIdea && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-indigo-400 border-l-purple-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Lightbulb className="w-6 h-6 text-purple-500" />
                  </motion.div>
                </div>
                <motion.p 
                  className="text-purple-600 mt-4 text-sm font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Brewing creative ideas...
                </motion.p>
              </motion.div>
            )}

            {generatedIdea && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative"
                >
                  <Textarea
                    value={generatedIdea}
                    onChange={(e) => setGeneratedIdea(e.target.value)}
                    className="min-h-[300px] font-medium text-sm mt-4 border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 bg-white/90"
                  />
                  <motion.div
                    className="absolute right-3 top-3"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-xs border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedIdea);
                        toast({ title: "Copied to clipboard!" });
                      }}
                    >
                      Copy All
                    </Button>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="flex justify-end mt-4 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-sm text-indigo-600 font-medium"
                    onClick={() => {
                      onGenerateContent(generatedIdea);
                      toast({ 
                        title: "Ideas added to output!",
                        description: "You can now edit or save these ideas."
                      });
                    }}
                  >
                    Use These Ideas
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95, rotate: -5 }}
                    className="flex items-center text-sm text-purple-600 font-medium"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <Hash className="mr-1 w-4 h-4" />
                    Generate More
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
    </Card>
  );
}
