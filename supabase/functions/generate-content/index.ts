
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, platform, duration } = await req.json();
    
    // Define system prompt based on content type
    let systemPrompt = "You are an AI assistant that helps create content.";
    
    if (type === "script") {
      systemPrompt = `You are a professional script writer specialized in creating ${platform || "YouTube"} scripts. 
      Create a well-structured script for a ${duration || "5"} minute video about "${prompt}".
      Include an engaging introduction, 3-5 main points with explanations, and a strong conclusion with call-to-action.
      Format the script with clear sections using markdown headings.`;
    } else if (type === "caption") {
      systemPrompt = `You are a social media expert who creates engaging captions for ${platform || "Instagram"}.
      Create a captivating caption about "${prompt}" that will drive engagement.
      Include 2-3 sentences of content, 2-3 relevant emojis, and a question to encourage comments.`;
    } else if (type === "hashtags") {
      systemPrompt = `You are a hashtag specialist for ${platform || "Instagram"}.
      Generate 20-25 relevant, trending, and specific hashtags related to "${prompt}".
      Include a mix of popular and niche hashtags to maximize reach.`;
    } else if (type === "bio") {
      systemPrompt = `You are a professional bio writer for ${platform || "Instagram"}.
      Create an engaging profile bio about "${prompt}" that will attract followers.
      Include relevant emojis, a clear value proposition, and a call-to-action.
      Format the bio to fit within the platform's character limits.`;
    }

    console.log(`Generating ${type} content with prompt: ${prompt}`);
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://scripto.lovable.dev",
        "X-Title": "SCRIPTO"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-14b:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      throw new Error(data.error?.message || "Failed to generate content");
    }

    const generatedContent = data.choices[0].message.content;
    console.log("Content generated successfully");

    return new Response(JSON.stringify({ generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in generate-content function:", error);
    
    return new Response(JSON.stringify({ error: error.message || "An error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
