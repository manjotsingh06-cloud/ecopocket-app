import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiCalendar, FiUser, FiShare2, FiCheck, FiBookOpen } from 'react-icons/fi';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';
import { BLOGS, getBlogBySlug, getBlogImage } from '../data/blogs';

export default function BlogPost() {
  const { slug } = useParams();
  // Instant initial load using curated fallback data
  const [blog, setBlog] = useState(() => getBlogBySlug(slug));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Also fetch fresh backend data in the background
    api
      .get(`/blogs/${slug}`)
      .then((res) => {
        if (res.data?.blog) {
          setBlog({
            ...res.data.blog,
            coverImage: {
              url: res.data.blog.coverImage?.url || getBlogImage(slug),
            },
          });
        }
      })
      .catch(() => {
        // Fallback remains active
      });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!blog) {
    return (
      <div className="pt-40 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-display font-bold text-2xl mb-3 text-forest dark:text-cream">Article Not Found</h2>
        <p className="text-sm opacity-70 mb-6 max-w-sm">
          The story you are looking for may have been moved or archived.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-cream text-xs font-semibold hover:bg-earth transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Journal
        </Link>
      </div>
    );
  }

  // Related articles (other 2 blogs)
  const related = BLOGS.filter((b) => b.slug !== slug).slice(0, 3);
  const imageUrl = blog.coverImage?.url || getBlogImage(slug);

  return (
    <article className="pt-32 pb-24 min-h-screen bg-[#FAF7F2] dark:bg-[#0A1610] text-[#1D3325] dark:text-[#E8F0EA] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Category */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-earth hover:underline transition-all"
          >
            <FiArrowLeft size={14} /> Back to Journal
          </Link>

          <span className="px-3 py-1 rounded-full bg-forest/8 dark:bg-white/10 text-forest dark:text-cream font-bold text-[11px] uppercase tracking-wider">
            {blog.category}
          </span>
        </div>

        {/* Title & Metadata */}
        <Reveal>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-forest dark:text-cream mb-6 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-y border-forest/10 dark:border-white/10 text-xs opacity-75">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <FiUser size={13} className="text-earth" />
                {blog.author?.name || blog.author || 'EcoPocket Editorial'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} />
                {blog.date || 'Recent Issue'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiClock size={13} />
                {blog.readTime || '4 min read'}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest/20 dark:border-white/20 hover:bg-forest/5 text-xs font-medium transition-colors"
            >
              {copied ? <FiCheck size={13} className="text-green-600" /> : <FiShare2 size={13} />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </Reveal>

        {/* Hero Cover Image */}
        <Reveal className="mb-12">
          <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-3xl overflow-hidden shadow-lg border border-forest/10 dark:border-white/10">
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/journal/why-zero-waste-dining-starts-in-the-kitchen-drawer.jpg';
              }}
            />
          </div>
        </Reveal>

        {/* Lead Excerpt */}
        {blog.excerpt && (
          <Reveal className="mb-8">
            <p className="text-lg sm:text-xl font-medium text-forest dark:text-cream/90 leading-relaxed italic border-l-4 border-earth pl-6 py-1">
              "{blog.excerpt}"
            </p>
          </Reveal>
        )}

        {/* Article Body */}
        <Reveal className="mb-16">
          <div className="prose prose-lg dark:prose-invert max-w-none text-forest/90 dark:text-cream/80 leading-relaxed font-sans space-y-6 whitespace-pre-line text-base sm:text-lg">
            {blog.content}
          </div>
        </Reveal>

        {/* Author Box */}
        <Reveal className="mb-16">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11241B] border border-forest/10 dark:border-white/10 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-forest text-cream flex items-center justify-center font-display font-bold text-xl flex-shrink-0">
              {(blog.author?.name || blog.author || 'E')[0]}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-earth font-bold mb-1">Written By</p>
              <h4 className="font-display font-bold text-base text-forest dark:text-cream">
                {blog.author?.name || blog.author || 'EcoPocket Collective'}
              </h4>
              <p className="text-xs opacity-70 mt-1">
                {blog.authorRole || 'Sustainable culinary artisans committed to zero-waste food preservation.'}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-forest/15 dark:border-white/15">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-2xl text-forest dark:text-cream">
                Continue Reading
              </h3>
              <Link to="/blog" className="text-xs font-semibold text-earth hover:underline">
                View all articles →
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/blog/${item.slug}`}
                  className="group block bg-white dark:bg-[#11241B] rounded-2xl overflow-hidden border border-forest/10 dark:border-white/10 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-forest/5">
                    <img
                      src={item.coverImage?.url || getBlogImage(item.slug)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-earth uppercase tracking-wider mb-1">
                      {item.category}
                    </p>
                    <h5 className="font-display font-bold text-sm text-forest dark:text-cream group-hover:text-earth transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
