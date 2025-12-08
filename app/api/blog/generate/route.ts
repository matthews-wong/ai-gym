import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
]

export async function POST(request: Request) {
  try {
    // Verify secret key for security
    const authHeader = request.headers.get("authorization")
    const expectedKey = process.env.BLOG_GENERATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!authHeader || !authHeader.includes(expectedKey || "")) {
      // Allow if called from edge function with service role
      const body = await request.json().catch(() => ({}))
      if (!body.internal_call) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: "GROQ API key not configured" }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    // Create Supabase client with service role for insert
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Pick a random topic
    const topic = FITNESS_TOPICS[Math.floor(Math.random() * FITNESS_TOPICS.length)]

    // Generate blog content using Groq
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional fitness blogger. Write engaging, informative blog posts about fitness, nutrition, and health. Use a friendly, motivational tone. Include practical tips and scientific backing where appropriate. Always return valid JSON.",
          },
          {
            role: "user",
            content: `Write a comprehensive blog post about: "${topic}"

Return your response as a JSON object with this exact structure:
{
  "title": "Catchy blog title (50-80 characters)",
  "excerpt": "A compelling 1-2 sentence summary (max 200 characters)",
  "content": "Full blog content in markdown format with headings (##), bullet points, and paragraphs. Make it 800-1200 words. Use proper markdown formatting.",
  "category": "one of: fitness, nutrition, recovery, mindset, workout",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "read_time": 5
}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error("Groq API error:", errorText)
      return NextResponse.json({ error: "Failed to generate blog content" }, { status: 500 })
    }

    const groqData = await groqResponse.json()
    const blogContent = groqData.choices[0]?.message?.content

    if (!blogContent) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 })
    }

    const blogData = JSON.parse(blogContent)

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
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Failed to save blog" }, { status: 500 })
    }

    return NextResponse.json({ success: true, blog: data })
  } catch (error) {
    console.error("Blog generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate blog" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Blog generation API",
    usage: "POST with authorization header to generate a new blog",
  })
}
