import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Home from './pages/Home';
import Films from './pages/Films';
import About from './pages/About';
import ShootDetail from './pages/ShootDetail';
import Portfolio from './pages/Portfolio';
import WeddingGallery from './pages/WeddingGallery';
import PreWeddingGallery from './pages/PreWeddingGallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import ContentPages from './pages/ContentPages';
import FAQ from './pages/FAQ';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import MobileAppTabBar from './components/MobileAppTabBar';
import { SiteConfigProvider } from './context/SiteConfigProvider';
import './App.css';

// Lazy-loaded: the admin dashboard/login are internal-only, noindexed, and
// were previously shipped to every visitor in the main bundle regardless of
// whether they'd ever visit /admin. Splitting them into their own chunk
// keeps the public-facing bundle (already flagged for its size) smaller.
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('admin');

  useLayoutEffect(() => {
    // Return a cleanup function that runs *before* the route path changes (unmount of the old route)
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      document.querySelectorAll('.pin-spacer').forEach(spacer => {
        if (spacer.children.length === 0) spacer.parentNode?.removeChild(spacer);
      });
    };
  }, [location.pathname]);

  return (
    <SiteConfigProvider>
      <SmoothScroll />
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/about" element={<About />} />
          <Route path="/shoot/:id" element={<ShootDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/wedding" element={<WeddingGallery />} />
          <Route path="/portfolio/pre-wedding" element={<PreWeddingGallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="/services" element={<ContentPages kind="service" />} />
          <Route path="/services/:slug" element={<ContentPages kind="service" />} />
          <Route path="/locations" element={<ContentPages kind="location" />} />
          <Route path="/locations/:slug" element={<ContentPages kind="location" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Admin Portal — lazy-loaded, its own chunk */}
          <Route path="/admin" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
          <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
          <Route path="/blog/admin-login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
          <Route path="/admin/dashboard" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileAppTabBar />}
    </SiteConfigProvider>
  );
}

export default App;
