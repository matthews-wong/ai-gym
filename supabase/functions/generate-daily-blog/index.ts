import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const FITNESS_TOPICS = [
  "Best compound exercises for building muscle mass",
  "How to break through a weight loss plateau",
  "The science behind protein timing for muscle growth",
  "HIIT vs steady-state cardio: Which is better for fat loss",
  "Top 10 mobility exercises for better workout performance",
  "How to properly warm up before lifting weights",
  "The benefits of progressive overload in strength training",
  "Nutrition tips for muscle recovery after intense workouts",
  "How to build a home gym on a budget",
  "The importance of sleep for muscle growth and recovery",
  "Best exercises for building a stronger core",
  "How to track macros for optimal body composition",
  "The role of creatine in athletic performance",
  "Effective stretching routines for flexibility",
  "How to prevent common gym injuries",
  "Building mental toughness for fitness success",
  "The benefits of resistance training for weight loss",
  "How to stay motivated on your fitness journey",
  "Understanding muscle soreness and recovery",
  "Best pre-workout nutrition strategies",
  "Post-workout meal ideas for muscle growth",
  "How to balance cardio and strength training",
  "The science of fat loss explained simply",
  "Bodyweight exercises for a full-body workout",
  "How to improve your squat form",
  "The benefits of morning workouts",
  "Hydration tips for optimal performance",
  "How to build bigger arms naturally",
  "The importance of rest days in training",
  "Meal prep tips for busy fitness enthusiasts",
  "Best exercises for improving posture",
  "How to increase your bench press",
  "The benefits of yoga for athletes",
  "Understanding different types of protein supplements",
  "How to train for a 5K run",
  "Best leg exercises for strength and size",
  "The science of muscle hypertrophy",
  "How to fix common squat mistakes",
  "Benefits of foam rolling and self-myofascial release",
  "How to create an effective push-pull-legs routine",
]

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const groqApiKey = Deno.env.get("GROQ_API_KEY")!

    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY is not set")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Pick a random topic
    const topic = FITNESS_TOPICS[Math.floor(Math.random() * FITNESS_TOPICS.length)]

    console.log(`Generating blog about: ${topic}`)

    // Generate blog using JSON mode
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness blogger. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: `Write a blog post about: "${topic}". Return a JSON object with these fields: title (string), excerpt (string, max 150 chars), content (string, 500-700 words with markdown headings), category (one of: fitness, nutrition, recovery, mindset, workout), tags (array of 3-5 strings), read_time (number, minutes to read)`
          }
        ],
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
        stop: null
      }),
    })

    const groqData = await groqResponse.json()
    
    console.log("Groq status:", groqResponse.status)
    
    if (!groqResponse.ok) {
      console.error("Groq error:", JSON.stringify(groqData))
      throw new Error(`Groq API error: ${groqResponse.status}`)
    }

    if (!groqData.choices?.[0]?.message?.content) {
      console.error("Invalid response:", JSON.stringify(groqData))
      throw new Error("Invalid Groq response")
    }

    const blogData = JSON.parse(groqData.choices[0].message.content)

    // Generate a unique slug
    const baseSlug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const slug = `${baseSlug}-${dateStr}`

    // Insert blog into database
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: blogData.title,
        slug: slug,
        excerpt: blogData.excerpt?.slice(0, 200) || blogData.title,
        content: blogData.content,
        category: blogData.category || "fitness",
        tags: blogData.tags || [],
        read_time: blogData.read_time || 5,
        author: "Matthews Wong",
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      throw error
    }

    console.log(`Blog created successfully: ${data.title}`)

    return new Response(JSON.stringify({ success: true, blog: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating blog:", error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
