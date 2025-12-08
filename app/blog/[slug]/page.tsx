"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Tag, Loader2, BookOpen, AlertTriangle } from "lucide-react"
import { getBlogBySlug, getRecentBlogs, formatBlogDate, getCategoryColor, type Blog } from "@/lib/services/blogService"

// Simple markdown renderer
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold italic">$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 mb-2 text-stone-300">$1</li>')
    .replace(/(<li.*<\/li>)\n(?=<li)/g, '$1')
    .replace(/(<li.*<\/li>)(?!\n<li)/g, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
    // Numbered lists
    .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 mb-2 text-stone-300">$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-400 hover:text-teal-300 underline">$1</a>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-stone-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-stone-300">$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-stone-800 px-1.5 py-0.5 rounded text-teal-400 text-sm">$1</code>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-stone-300 leading-relaxed mb-4">')
    // Line breaks
    .replace(/\n/g, '<br />')
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [blogData, recentData] = await Promise.all([
        getBlogBySlug(slug),
        getRecentBlogs(5)
      ])
      
      if (!blogData) {
        router.push("/blog")
        return
      }
      
      setBlog(blogData)
      setRecentBlogs(recentData.filter(b => b.slug !== slug))
      setLoading(false)
    }
    
    if (slug) {
      fetchData()
    }
  }, [slug, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    )
  }

  if (!blog) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-12">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a8a29e05_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e05_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-stone-800/50">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getCategoryColor(blog.category)}`}>
                {blog.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-stone-500">
                <Clock className="w-4 h-4" />
                {blog.read_time} min read
              </span>
              <span className="flex items-center gap-1.5 text-sm text-stone-500">
                <Calendar className="w-4 h-4" />
                {formatBlogDate(blog.created_at)}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            
            <p className="text-lg text-stone-400">
              {blog.excerpt}
            </p>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Tag className="w-4 h-4 text-stone-500" />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-stone-800/50 text-stone-400 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-800/50">
              <img 
                src="/images/matthews-wong.jpeg" 
                alt="Matthews Wong"
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/30"
              />
              <div>
                <p className="text-sm font-medium text-white">Matthews Wong</p>
                <a href="https://matthewswong.com" target="_blank" rel="noopener noreferrer" className="text-xs text-teal-400 hover:text-teal-300">
                  matthewswong.com
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Disclaimer */}
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300/90">
                <span className="font-medium">Disclaimer:</span> I am just a gym enthusiast sharing my knowledge and experience. 
                If you find any incorrect information, please feel free to comment on our{" "}
                <a href="/forum" className="text-amber-400 hover:text-amber-300 underline">forums</a>.
              </p>
            </div>

            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: `<p class="text-stone-300 leading-relaxed mb-4">${renderMarkdown(blog.content)}</p>` 
              }}
            />
          </div>
        </article>

        {/* Recent Posts */}
        {recentBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              More Articles
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {recentBlogs.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-stone-900/50 border border-stone-800/50 rounded-xl p-4 hover:border-teal-500/30 transition-all"
                >
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border capitalize mb-2 ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <h3 className="font-medium text-white group-hover:text-teal-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2">
                    {formatBlogDate(post.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
