
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { FileText, Hash, User, Lightbulb, Copy, Save, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Tools = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [duration, setDuration] = useState("");

  const handleGenerate = async (type: string) => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "We need a topic to generate content for you.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      let content = "";
      
      switch (type) {
        case "script":
          content = `# ${topic} - YouTube Script (${duration} minutes)

## Introduction
Welcome to today's video where we'll dive deep into ${topic}. This is a game-changer that you don't want to miss!

## Main Content
[Hook] Did you know that understanding ${topic} can completely transform your approach? Let me break this down for you...

### Key Point 1
The first thing you need to understand about ${topic} is...

### Key Point 2
Here's what most people get wrong about ${topic}...

### Key Point 3
The secret to mastering ${topic} lies in...

## Conclusion
If you found this helpful, make sure to like and subscribe for more content like this. What's your experience with ${topic}? Let me know in the comments below!

---
*Generated with SCRIPTO AI - Enhanced with web search data*`;
          break;
        case "caption":
          content = `🚀 Ready to dive into ${topic}? Here's everything you need to know!

This ${topic} guide will change the way you think about success. Swipe to see the key insights that made all the difference! ✨

What's your biggest challenge with ${topic}? Drop a comment below! 👇

#${topic.replace(/\s+/g, '')} #ContentCreator #Growth #Tips #Success #Motivation`;
          break;
        case "hashtags":
          content = `#${topic.replace(/\s+/g, '')} #${topic.replace(/\s+/g, '')}Tips #${topic.replace(/\s+/g, '')}Guide #ContentCreator #Digital #Success #Growth #Motivation #Inspiration #Learning #Skills #Business #Marketing #SocialMedia #Trending #Viral #Engaging #Quality #Professional #Expert #Tutorial #HowTo #Tips #Tricks #Secrets #Strategy #Results #Achievement #Goals #Progress #Development #Knowledge #Wisdom`;
          break;
        case "bio":
          content = `🚀 ${topic} Expert & Content Creator
✨ Helping you master ${topic} one post at a time
📈 Turning passion into profit
🎯 Join 10K+ followers on this journey
👇 Get my free ${topic} guide below`;
          break;
        default:
          content = `Generated content for ${topic}`;
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: "Content generated!",
        description: "Your AI-powered content is ready.",
      });
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard!",
      description: "Your content has been copied and is ready to use.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Content saved!",
      description: "Your content has been saved to your dashboard.",
    });
  };

  const handleRegenerate = (type: string) => {
    handleGenerate(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Content Tools</h1>
          <p className="text-gray-600">Create amazing content with our AI-powered generators</p>
        </div>

        <Tabs defaultValue="script" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
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

          <div className="grid lg:grid-cols-2 gap-8">
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
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="25">25 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
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
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
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
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
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
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
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
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
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
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        className="hover:bg-green-50"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <TabsContent value="script" className="m-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate("script")}
                          className="hover:bg-blue-50"
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
                    <div className="text-center">
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
