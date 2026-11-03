import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { API_URL } from '../config';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { localBlogPosts } from '../data/localBlogPosts';
import './Blog.css';

const img1 = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC3521_-_Copy.webp";

const Blog = () => {
  const container = useRef();

  useSEO({
    title: 'Wedding Photography Journal & Guides | Shoot At Sight',
    description: 'Guides on planning your shoot, choosing locations around Bangalore and looking natural on camera, from Shoot At Sight Weddings.',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs`);
        const data = await res.json();
        if (res.ok && data.blogs && data.blogs.length > 0) {
          const mapped = data.blogs.map((b, idx) => ({
            id: b._id,
            slug: b.slug,
            title: b.title,
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            cat: (b.tags && b.tags[0]) ? b.tags[0].toUpperCase() : 'ARTISTRY',
            excerpt: b.content ? (b.content.substring(0, 140) + '...') : '',
            content: b.content ? b.content.split('\n\n') : [],
            img: b.coverImageUrl || img1,
            featured: idx === 0
          }));
          setPosts([...mapped, ...localBlogPosts]);
        } else {
          setPosts(localBlogPosts);
        }
      } catch {
        setPosts(localBlogPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useGSAP(() => {
    if (loading || posts.length === 0) return;

    // Typing Animation for Title
    const chars = container.current.querySelectorAll('.typing-char');
    gsap.fromTo(chars,
      { opacity: 0 },
      { opacity: 1, duration: 0.05, stagger: 0.05, ease: 'none', delay: 0.2 }
    );

    // Parallax on large background numbers
    gsap.utils.toArray('.bg-number', container.current).forEach((num) => {
      gsap.to(num, {
        y: -100,
        scrollTrigger: {
          trigger: num,
          scrub: true,
        }
      });
    });

    // Image Mask Reveals
    gsap.utils.toArray('.blog-img-box', container.current).forEach((box) => {
      gsap.from(box, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.5,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: box,
          start: 'top 90%',
        }
      });
    });

    // Refresh ScrollTrigger parameters on the next tick to ensure dynamic layout offsets are computed correctly
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(refreshTimer);
  }, { scope: container, dependencies: [loading, posts] });

  const renderTypingText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="typing-char" style={{ opacity: 0 }}>
        {char}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="blog-page section-padding" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#8c8c8c', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase' }}>Curating the Journal...</span>
      </div>
    );
  }

  return (
    <div ref={container} className="blog-page">
      <Breadcrumbs />
      <div className="blog-hero-section section-padding container">
        <div className="blog-header-stylish">
          <span className="subtitle-accent">04 // BLOG</span>
          <h1 className="editorial-title">
            <i>{renderTypingText("Behind")}</i> <br />
            {renderTypingText("The Scenes")}
          </h1>
          <div className="title-accent-line"></div>
        </div>
      </div>

      <div className="blog-container container">
        {posts.map((post, index) => (
          <article key={post.id} className={`blog-post-card ${index % 2 === 0 ? 'even' : 'odd'} ${post.featured ? 'featured' : ''}`}>
            <div className="bg-number">0{index + 1}</div>

            <div className="post-visual">
              <div className="blog-img-box">
                <img src={post.img} alt={post.title} />
              </div>
              <div className="post-cat-vertical">{post.cat}</div>
            </div>

            <div className="post-details">
              <div className="post-meta-top">
                <span className="post-date">{post.date}</span>
                <div className="meta-line"></div>
              </div>
              <h2 className="post-title-stylish">{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="read-more-magazine">
                <span>Read Article</span>
                <div className="btn-line"></div>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="journal-footer-cta section-padding">
        <div className="container">
          <div className="cta-box-editorial">
            <h3>Subscribe to <i>The Blog</i></h3>
            <p>A monthly curation of shoot stories, lighting tips, and backstage guides delivered directly to your inbox.</p>
            <div className="editorial-input-group">
              <input type="email" placeholder="YOUR EMAIL ADDRESS" />
              <button>JOIN</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
