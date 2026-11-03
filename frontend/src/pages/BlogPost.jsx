import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../config';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { localBlogPosts } from '../data/localBlogPosts';
import './BlogPost.css';
import { articleSchema } from '../utils/articleSeo';

const findLocalPost = (slug) => localBlogPosts.find((p) => p.slug === slug);

const BlogPostContent = ({ slug }) => {
  const [post, setPost] = useState(() => findLocalPost(slug) || null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(!findLocalPost(slug));

  useEffect(() => {
    const local = findLocalPost(slug);

    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/${slug}`);
        const data = await res.json();
        if (res.ok && data.blog) {
          setPost({
            ...data.blog,
            slug: data.blog.slug,
            title: data.blog.title,
            date: new Date(data.blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            cat: (data.blog.tags && data.blog.tags[0]) ? data.blog.tags[0].toUpperCase() : 'ARTISTRY',
            excerpt: data.blog.content ? data.blog.content.substring(0, 160) : '',
            content: data.blog.content ? data.blog.content.split('\n\n') : [],
            img: data.blog.coverImageUrl,
          });
        } else if (!local) {
          setNotFound(true);
        }
      } catch {
        if (!local) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const articleJsonLd = post ? articleSchema(post) : null;

  useSEO({
    title: post ? (post.metaTitle || `${post.title} | Shoot At Sight Weddings Journal`) : 'Article Not Found',
    description: post ? (post.metaDescription || post.excerpt) : 'This article could not be found.',
    ogImage: post ? post.img : undefined,
    canonicalUrl: post?.canonicalUrl,
    noindex: !post,
    jsonLd: articleJsonLd ? [articleJsonLd] : [],
    breadcrumbLabels: post ? { [`/blog/${slug}`]: post.title } : undefined,
  });

  if (loading) {
    return (
      <div className="blog-post-page section-padding" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#8c8c8c', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase' }}>Loading article...</span>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-post-page section-padding container" style={{ minHeight: '60vh', textAlign: 'center' }}>
        <h1>Article not found</h1>
        <p>This article may have been moved or removed.</p>
        <Link to="/blog" className="btn-premium">Back to the Journal</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <Breadcrumbs currentLabel={post.title} />
      <article className="blog-post-content container section-padding">
        <div className="blog-post-meta-top">
          <span className="blog-post-cat">{post.cat}</span>
          <span className="blog-post-dot">•</span>
          <span className="blog-post-date">{post.date}</span>
        </div>

        <h1 className="blog-post-title">{post.title}</h1>
        <p className="blog-post-author">By {post.authorUrl ? <a href={post.authorUrl}>{post.authorName || 'Shoot At Sight Weddings'}</a> : (post.authorName || 'Shoot At Sight Weddings')}</p>

        {post.img && (
          <div className="blog-post-hero-img">
            <img src={post.img} alt={post.altText || post.title} loading="eager" fetchPriority="high" />
          </div>
        )}

        <div className="blog-post-body">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <Link to="/blog" className="blog-post-back-link">&larr; Back to the Journal</Link>
      </article>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  return <BlogPostContent key={slug} slug={slug} />;
};

export default BlogPost;
