import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/${slug}`).then((res) => setBlog(res.data.blog)).catch(() => setBlog(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-40 text-center opacity-60">Loading…</div>;
  if (!blog) return (
    <div className="pt-40 pb-24 text-center">
      <p className="opacity-70 mb-4">That article isn't available yet.</p>
      <Link to="/blog" className="text-earth font-semibold underline">Back to journal</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <p className="text-xs uppercase tracking-wide text-earth font-semibold mb-3">{blog.category}</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft mb-6">{blog.title}</h1>
          {blog.coverImage?.url && <img src={blog.coverImage.url} alt="" className="w-full rounded-2xl mb-8" />}
          <div className="prose prose-sm max-w-none opacity-85 leading-relaxed whitespace-pre-line">{blog.content}</div>
        </Reveal>
      </div>
    </div>
  );
}
