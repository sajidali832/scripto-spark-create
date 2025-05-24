
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lightbulb, Loader2, ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface IdeaGeneratorProps {
  onGenerateContent: (content: string) => void;
}

export function IdeaGenerator({ onGenerateContent }: IdeaGeneratorProps) {
  const [category, setCategory] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [contentFormat, setContentFormat] = useState<string>("");
  const [niche, setNiche] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedIdea, setGeneratedIdea] = useState<string>("");
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!category || !platform || !contentFormat || !niche) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to generate ideas.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate the content idea based on the inputs
      setTimeout(() => {
        const idea = generateDemoIdea(category, platform, contentFormat, niche);
        setGeneratedIdea(idea);
        onGenerateContent(idea);
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating idea:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate content idea. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };
  
  const generateDemoIdea = (category: string, platform: string, format: string, niche: string) => {
    const shortFormIdeas = [
      `"${niche} Myths Debunked" - An educational series correcting misconceptions in your field.`,
      `"Day in the Life of a ${niche} Expert" - Share your daily routine with behind-the-scenes insights.`,
      `"Top 5 ${niche} Tips You Never Knew" - Quick actionable advice that viewers can immediately apply.`,
      `"${niche} Transformation" - Before and after showcases with dramatic results.`,
      `"${niche} Reaction" - React to trending content in your field with expert commentary.`
    ];
    
    const longFormIdeas = [
      `"The Complete Guide to ${niche}" - An in-depth tutorial breaking down complex concepts into understandable segments.`,
      `"${niche} Case Study" - Analyze a successful example and extract valuable lessons for your audience.`,
      `"${niche} Interview Series" - Connect with other experts and share diverse perspectives.`,
      `"${niche} Masterclass" - Teach advanced techniques with detailed explanations and demonstrations.`,
      `"${niche} Review Marathon" - Evaluate multiple products or approaches in one comprehensive video.`
    ];
    
    const contentIdeas = format.toLowerCase().includes("short") ? shortFormIdeas : longFormIdeas;
    const randomIdea = contentIdeas[Math.floor(Math.random() * contentIdeas.length)];
    
    return `Content Idea for ${platform} (${format}):\n\n${randomIdea}\n\nCategory: ${category}\nTarget Audience: People interested in ${niche}\nPlatform: ${platform}\nFormat: ${format}\n\nSuggested Approach:\n- Research trending topics in the ${niche} space\n- Create an engaging intro that hooks viewers in the first 3 seconds\n- Include clear calls-to-action throughout\n- Use relevant keywords in your title and description\n- Post consistently at optimal times for your audience`;
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-xl">Content Ideas Generator</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="h-12">
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
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Short-form">Short-form</SelectItem>
                  <SelectItem value="Long-form">Long-form</SelectItem>
                  <SelectItem value="Series">Series</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Vlog">Vlog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Your Niche</Label>
              <Input 
                placeholder="Enter your niche or specialty" 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="h-12"
              />
            </div>
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-[1.02]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Generate Content Ideas
              </>
            )}
          </Button>
          
          <AnimatePresence>
            {generatedIdea && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Textarea
                  value={generatedIdea}
                  readOnly
                  className="min-h-[200px] font-mono text-sm mt-4 border-orange-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                />
                <div className="flex justify-end mt-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-orange-600 flex items-center"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedIdea);
                      toast({ title: "Copied to clipboard!" });
                    }}
                  >
                    Use This Idea
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
    </Card>
  );
}
