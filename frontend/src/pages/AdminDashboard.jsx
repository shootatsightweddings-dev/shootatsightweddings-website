import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import useSEO from '../hooks/useSEO';
import { DEFAULT_VIDEO_URL, DEFAULT_POSTER_URL, DEFAULT_MOBILE_VIDEO_URL } from '../data/videoDefaults';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Admin Dashboard Portal',
    noindex: true
  });

  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'blogs-list', 'create-blog'
  const [shoots, setShoots] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Create Shoot Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wedding');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [heroImage, setHeroImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  // Gallery Edit State
  const [editingShoot, setEditingShoot] = useState(null); // shoot being edited
  const [editingBlog, setEditingBlog] = useState(null);   // blog being edited
  const [editUploading, setEditUploading] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  // Blog Management State
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('ARTISTRY');
  const [blogContent, setBlogContent] = useState('');
  const [blogCover, setBlogCover] = useState("https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC3521_-_Copy.webp");

  // UI States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Testimonials Management State
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialNum, setTestimonialNum] = useState('');
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialLocation, setTestimonialLocation] = useState('');
  const [testimonialTags, setTestimonialTags] = useState('');
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Site Editor State
  const [editorSubTab, setEditorSubTab] = useState('home'); // 'home', 'films', 'about', 'contact'
  const [siteConfig, setSiteConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [editorSaving, setEditorSaving] = useState(false);


  const fetchEditorConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch(`${API_URL}/site-config`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSiteConfig(data.config);
      } else {
        setError('Failed to fetch site configurations.');
      }
    } catch {
      setError('Could not fetch site configurations.');
    } finally {
      setLoadingConfig(false);
    }
  };

  const uploadImage = async (file) => {
    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API_URL}/images/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      } else {
        throw new Error(data.message || 'Image upload failed');
      }
    } catch (err) {
      throw new Error(err.message || 'Image upload failed', { cause: err });
    }
  };

  const handleConfigChange = (sectionKey, field, value) => {
    setSiteConfig(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value
      }
    }));
  };

  const handleConfigArrayChange = (sectionKey, arrayField, index, field, value) => {
    setSiteConfig(prev => {
      const updatedArray = [...prev[sectionKey][arrayField]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [arrayField]: updatedArray
        }
      };
    });
  };

  const handleConfigImageUpload = async (e, sectionKey, field, index = null, arrayField = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(`Uploading image for ${field}...`);
    try {
      const url = await uploadImage(file);
      if (index !== null && arrayField) {
        handleConfigArrayChange(sectionKey, arrayField, index, field, url);
      } else {
        handleConfigChange(sectionKey, field, url);
      }
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Image upload failed.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const saveSectionConfig = async (sectionKey) => {
    setEditorSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/site-config/${sectionKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(siteConfig[sectionKey])
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`✅ Section config for "${sectionKey}" saved successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to save section.');
      }
    } catch {
      setError('Connection to server failed.');
    } finally {
      setEditorSaving(false);
    }
  };

  const fetchTestimonials = () => fetch(`${API_URL}/testimonials`)
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) setTestimonials(data.testimonials || []);
      else setError('Failed to fetch testimonials.');
    })
    .catch(() => setError('Could not connect to the server.'))
    .finally(() => setLoadingTestimonials(false));

  const fetchShoots = () => fetch(`${API_URL}/shoots`)
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) setShoots(data.data || []);
      else setError('Failed to fetch collections.');
    })
    .catch(() => setError('Could not connect to the server.'))
    .finally(() => setLoadingList(false));

  const fetchBlogs = () => {
    const token = localStorage.getItem('adminToken');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    return fetch(`${API_URL}/admin/blogs`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) setBlogs(data.blogs || []);
      })
      .catch(() => setBlogs([]))
      .finally(() => {
        clearTimeout(timeout);
        setLoadingBlogs(false);
      });
  };

  useEffect(() => {
    // Auth Guard
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchShoots();
    fetchBlogs();
    fetchTestimonials();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const requestConfirm = ({ title, message, confirmLabel = 'Confirm', onConfirm }) => {
    setConfirmModal({ title, message, confirmLabel, onConfirm });
  };

  const closeConfirmModal = () => setConfirmModal(null);

  const handleConfirmAction = () => {
    if (!confirmModal?.onConfirm) return;
    const action = confirmModal.onConfirm;
    setConfirmModal(null);
    action();
  };

  const handleHeroChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setHeroImage(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e) => {
    if (e.target.files) {
      setGallery(Array.from(e.target.files));
    }
  };

  const handleDelete = (shootId, shootTitle) => {
    requestConfirm({
      title: 'Delete Story Archive',
      message: `Are you sure you want to delete "${shootTitle}" and all its uploaded images? This cannot be undone.`,
      confirmLabel: 'Delete Archive',
      onConfirm: async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const res = await fetch(`${API_URL}/shoots/${shootId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await res.json();
          if (res.ok) {
            setSuccess('Shoot deleted successfully.');
            setShoots(shoots.filter(s => s._id !== shootId));
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError(data.message || 'Deletion failed.');
          }
        } catch {
          setError('Connection to server failed during deletion.');
        }
      },
    });
  };

  // ── Gallery Edit Handlers ────────────────────────────────────────────────
  const openEditPanel = (shoot) => {
    setEditingShoot({ ...shoot, gallery: [...(shoot.gallery || [])] });
    setEditMsg('');
  };

  const handleAddGalleryImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setEditUploading(true);
    setEditMsg('Uploading new images...');
    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    files.forEach(f => fd.append('gallery', f));
    try {
      const res = await fetch(`${API_URL}/shoots/${editingShoot._id}/gallery`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setEditingShoot(prev => ({ ...prev, gallery: data.gallery }));
        setShoots(prev => prev.map(s => s._id === editingShoot._id ? { ...s, gallery: data.gallery } : s));
        setEditMsg(`✅ ${files.length} image(s) added successfully!`);
      } else {
        setEditMsg(`❌ ${data.message || 'Upload failed'}`);
      }
    } catch { setEditMsg('❌ Connection error'); }
    finally { setEditUploading(false); e.target.value = ''; }
  };

  const handleRemoveGalleryImage = (imageUrl) => {
    requestConfirm({
      title: 'Remove Gallery Image',
      message: 'Remove this image from the gallery? The file will be permanently deleted from storage.',
      confirmLabel: 'Remove Image',
      onConfirm: async () => {
        setEditUploading(true);
        setEditMsg('Removing image...');
        const token = localStorage.getItem('adminToken');
        try {
          const res = await fetch(`${API_URL}/shoots/${editingShoot._id}/gallery`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl }),
          });
          const data = await res.json();
          if (res.ok) {
            setEditingShoot(prev => ({ ...prev, gallery: data.gallery }));
            setShoots(prev => prev.map(s => s._id === editingShoot._id ? { ...s, gallery: data.gallery } : s));
            setEditMsg('✅ Image removed.');
          } else {
            setEditMsg(`❌ ${data.message || 'Remove failed'}`);
          }
        } catch { setEditMsg('❌ Connection error'); }
        finally { setEditUploading(false); }
      },
    });
  };

  const handleChangeHero = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    setEditMsg('Updating cover image...');
    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    fd.append('heroImage', file);
    try {
      const res = await fetch(`${API_URL}/shoots/${editingShoot._id}/hero`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setEditingShoot(prev => ({ ...prev, heroImage: data.heroImage }));
        setShoots(prev => prev.map(s => s._id === editingShoot._id ? { ...s, heroImage: data.heroImage } : s));
        setEditMsg('✅ Cover image updated!');
      } else {
        setEditMsg(`❌ ${data.message || 'Update failed'}`);
      }
    } catch { setEditMsg('❌ Connection error'); }
    finally { setEditUploading(false); e.target.value = ''; }
  };

  // ── Blog Cover Upload & Edit Handlers ────────────────────────────────────
  const handleBlogCoverUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) {
      setEditUploading(true);
      setEditMsg('Uploading cover image...');
    } else {
      setUploading(true);
      setUploadProgress('Uploading blog cover image...');
    }

    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await fetch(`${API_URL}/images/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (isEdit) {
          setEditingBlog(prev => ({ ...prev, coverImageUrl: data.url }));
          setEditMsg('✅ Cover image uploaded!');
        } else {
          setBlogCover(data.url);
          setSuccess('✅ Cover image uploaded!');
          setTimeout(() => setSuccess(''), 3000);
        }
      } else {
        const errMsg = data.message || 'Upload failed';
        if (isEdit) setEditMsg(`❌ ${errMsg}`);
        else setError(errMsg);
      }
    } catch {
      if (isEdit) setEditMsg('❌ Connection error');
      else setError('Connection error');
    } finally {
      if (isEdit) setEditUploading(false);
      else {
        setUploading(false);
        setUploadProgress('');
      }
      e.target.value = '';
    }
  };

  const openEditBlogPanel = (blog) => {
    if (!blog) {
      setEditingBlog(null);
      return;
    }
    setEditingBlog({ ...blog });
    setEditMsg('');
  };

  const handleEditBlogSubmit = async (e) => {
    e.preventDefault();
    setEditUploading(true);
    setEditMsg('Updating blog post...');
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingBlog.title,
          content: editingBlog.content,
          coverImageUrl: editingBlog.coverImageUrl,
          tags: editingBlog.tags,
          isPublished: editingBlog.isPublished ?? true
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBlogs(prev => prev.map(b => b._id === editingBlog._id ? data.blog : b));
        setEditingBlog(null);
        setSuccess('✅ Blog article updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setEditMsg(`❌ ${data.message || 'Update failed'}`);
      }
    } catch {
      setEditMsg('❌ Connection error');
    } finally {
      setEditUploading(false);
    }
  };

  const handleDeleteBlog = (blogId, blogTitle) => {
    requestConfirm({
      title: 'Delete Blog Article',
      message: `Are you sure you want to delete "${blogTitle}"? This cannot be undone.`,
      confirmLabel: 'Delete Article',
      onConfirm: async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const res = await fetch(`${API_URL}/admin/blogs/${blogId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            setSuccess('Blog deleted successfully.');
            setBlogs(blogs.filter(b => b._id !== blogId));
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError('Blog deletion failed.');
          }
        } catch {
          setError('Connection to server failed during deletion.');
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!heroImage) {
      setError('A Hero Cover Image is required.');
      return;
    }

    setUploading(true);
    setUploadProgress('Preparing files & connecting...');

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('desc', desc);
    formData.append('heroImage', heroImage);

    gallery.forEach((file) => {
      formData.append('gallery', file);
    });

    try {
      setUploadProgress('Crafting your story archive — optimising images for the web...');
      const res = await fetch(`${API_URL}/shoots`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      setUploadProgress('Saving records to storage...');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload shoot');
      }

      setSuccess(`Successfully published "${title}"!`);

      // Reset Form
      setTitle('');
      setCategory('Wedding');
      setLocation('');
      setDate('');
      setDesc('');
      setHeroImage(null);
      setGallery([]);

      // Clear file inputs
      const heroInput = document.getElementById('heroImageInput');
      const galleryInput = document.getElementById('galleryInput');
      if (heroInput) heroInput.value = '';
      if (galleryInput) galleryInput.value = '';

      // Refresh Shoots list
      setLoadingList(true); fetchShoots();

      // Navigate back to list tab
      setTimeout(() => {
        setActiveTab('list');
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to submit shoot.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setUploading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blogTitle,
          content: blogContent,
          coverImageUrl: blogCover,
          tags: [blogCategory],
          isPublished: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to publish blog');
      setSuccess(`Successfully published "${blogTitle}"!`);
      setBlogTitle(''); setBlogContent('');
      setLoadingBlogs(true); fetchBlogs();
      setTimeout(() => { setActiveTab('blogs-list'); setSuccess(''); }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit blog.');
    } finally {
      setUploading(false);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          num: testimonialNum,
          quote: testimonialQuote,
          author: testimonialAuthor,
          location: testimonialLocation,
          tags: testimonialTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to publish testimonial');
      setSuccess(`Successfully published testimonial by "${testimonialAuthor}"!`);
      setTestimonialNum('');
      setTestimonialQuote('');
      setTestimonialAuthor('');
      setTestimonialLocation('');
      setTestimonialTags('');
      setLoadingTestimonials(true); fetchTestimonials();
      setTimeout(() => { setActiveTab('testimonials-list'); setSuccess(''); }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit testimonial.');
    } finally {
      setUploading(false);
    }
  };

  const handleEditTestimonialSubmit = async (e) => {
    e.preventDefault();
    setEditUploading(true);
    setEditMsg('Updating testimonial...');
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/testimonials/${editingTestimonial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          num: editingTestimonial.num,
          quote: editingTestimonial.quote,
          author: editingTestimonial.author,
          location: editingTestimonial.location,
          tags: Array.isArray(editingTestimonial.tags)
            ? editingTestimonial.tags
            : editingTestimonial.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonials(prev => prev.map(t => t._id === editingTestimonial._id ? data.testimonial : t));
        setEditingTestimonial(null);
        setSuccess('✅ Testimonial updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setEditMsg(`❌ ${data.message || 'Update failed'}`);
      }
    } catch {
      setEditMsg('❌ Connection error');
    } finally {
      setEditUploading(false);
    }
  };

  const handleDeleteTestimonial = (id, author) => {
    requestConfirm({
      title: 'Delete Testimonial',
      message: `Are you sure you want to delete the testimonial from "${author}"? This cannot be undone.`,
      confirmLabel: 'Delete Testimonial',
      onConfirm: async () => {
        const token = localStorage.getItem('adminToken');
        try {
          const res = await fetch(`${API_URL}/admin/testimonials/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            setSuccess('Testimonial deleted successfully.');
            setTestimonials(testimonials.filter(t => t._id !== id));
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError('Testimonial deletion failed.');
          }
        } catch {
          setError('Connection to server failed during deletion.');
        }
      },
    });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar / Topbar Header */}
      <header className="dashboard-header">
        <div className="header-branding">
          <span className="subtitle-accent">PORTFOLIO & BLOG CONSOLE</span>
          <h2 className="header-title">Studio <i>Admin</i> Console</h2>
        </div>
        <div className="header-actions">
          <span className="admin-badge">{localStorage.getItem('adminEmail')}</span>
          <button onClick={handleLogout} className="btn-logout">Sign Out</button>
        </div>
      </header>

      {/* Primary Notifications */}
      {success && <div className="dash-alert success">{success}</div>}
      {error && <div className="dash-alert error">{error}</div>}

      <main className="dashboard-main container">
        {/* Navigation Tabs */}
        <div className="dash-tabs">
          <button
            className={`dash-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
            disabled={uploading}
          >
            Archives List ({shoots.length})
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
            disabled={uploading}
          >
            Publish New Story
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'blogs-list' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blogs-list'); setLoadingBlogs(true); fetchBlogs(); }}
            disabled={uploading}
          >
            Blog Articles ({blogs.length})
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'create-blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('create-blog')}
            disabled={uploading}
          >
            Write Blog Post
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'testimonials-list' ? 'active' : ''}`}
            onClick={() => { setActiveTab('testimonials-list'); setLoadingTestimonials(true); fetchTestimonials(); }}
            disabled={uploading}
          >
            Testimonials ({testimonials.length})
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'create-testimonial' ? 'active' : ''}`}
            onClick={() => setActiveTab('create-testimonial')}
            disabled={uploading}
          >
            Add Testimonial
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'site-editor' ? 'active' : ''}`}
            onClick={() => { setActiveTab('site-editor'); fetchEditorConfig(); }}
            disabled={uploading}
          >
            Site Editor
          </button>
        </div>

        {/* Tab content 1: Shoots List */}
        {activeTab === 'list' && (
          <div className="tab-content list-tab">
            {loadingList ? (
              <div className="dash-loader">Retrieving archives...</div>
            ) : shoots.length === 0 ? (
              <div className="dash-empty-state">
                <p>No shoots found in database. Create your first portfolio story!</p>
                <button onClick={() => setActiveTab('create')} className="btn-premium-action">Publish First Story</button>
              </div>
            ) : (
              <div className="admin-shoots-grid">
                {shoots.map((shoot) => (
                  <div key={shoot._id} className="admin-shoot-card">
                    <div className="card-thumbnail-wrapper">
                      <img src={editingShoot?._id === shoot._id ? editingShoot.heroImage : shoot.heroImage} alt={shoot.title} />
                      <span className="card-cat-badge">{shoot.category}</span>
                    </div>
                    <div className="card-details">
                      <h4 className="card-title-new">{shoot.title}</h4>
                      <p className="card-meta-faint">{shoot.location} // {shoot.date}</p>
                      <p className="card-gallery-count">
                        {(editingShoot?._id === shoot._id ? editingShoot.gallery : shoot.gallery)?.length || 0} gallery photos
                      </p>
                      <div className="card-actions-framer">
                        <a href={`/shoot/${shoot.slug}`} target="_blank" rel="noreferrer" className="btn-preview-link">View Live ↗</a>
                        <button onClick={() => openEditPanel(shoot)} className="btn-edit-gallery">
                          Edit Gallery
                        </button>
                        <button onClick={() => handleDelete(shoot._id, shoot.title)} className="btn-delete-card">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: Create Form */}
        {activeTab === 'create' && (
          <div className="tab-content form-tab">
            <form onSubmit={handleSubmit} className="admin-chic-form">
              <div className="form-double-column">
                <div className="input-group-chic">
                  <label htmlFor="shootTitle">Couple Names (Title)</label>
                  <input
                    type="text"
                    id="shootTitle"
                    required
                    placeholder="e.g., Naveen & Swetha"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <div className="input-group-chic">
                  <label htmlFor="shootCategory">Category</label>
                  <select
                    id="shootCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={uploading}
                    className="select-chic"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-wedding">Pre-wedding</option>
                    <option value="Candid">Candid</option>
                    <option value="Cinematic Film">Cinematic Film</option>
                  </select>
                </div>
              </div>

              <div className="form-double-column">
                <div className="input-group-chic">
                  <label htmlFor="shootLocation">Location</label>
                  <input
                    type="text"
                    id="shootLocation"
                    required
                    placeholder="e.g., Hyderabad"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <div className="input-group-chic">
                  <label htmlFor="shootDate">Date</label>
                  <input
                    type="text"
                    id="shootDate"
                    required
                    placeholder="e.g., Jan 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="input-group-chic">
                <label htmlFor="shootDesc">The Narrative Story</label>
                <textarea
                  id="shootDesc"
                  required
                  rows="5"
                  placeholder="Tell the beautiful story of this capture..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  disabled={uploading}
                />
              </div>

              {/* Uploads row */}
              <div className="form-double-column">
                <div className="input-group-chic upload-box-chic">
                  <label htmlFor="heroImageInput">Hero Cover Image (Card Thumbnail)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="heroImageInput"
                      accept="image/*"
                      onChange={handleHeroChange}
                      disabled={uploading}
                    />
                    <div className="custom-file-label">
                      {heroImage ? `Selected: ${heroImage.name}` : 'Choose Cover Photo'}
                    </div>
                  </div>
                </div>

                <div className="input-group-chic upload-box-chic">
                  <label htmlFor="galleryInput">Gallery Photos (Collage Collection)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="galleryInput"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      disabled={uploading}
                    />
                    <div className="custom-file-label">
                      {gallery.length > 0 ? `Selected: ${gallery.length} files` : 'Choose Gallery Photos'}
                    </div>
                  </div>
                </div>
              </div>

              {uploading && (
                <div className="upload-progress-card">
                  <div className="progress-spinner"></div>
                  <p className="progress-text">{uploadProgress}</p>
                </div>
              )}

              <button type="submit" className="btn-premium-submit" disabled={uploading}>
                {uploading ? 'Processing & Uploading...' : 'Publish Story Archive'}
              </button>
            </form>
          </div>
        )}

        {/* Tab content 3: Blogs List */}
        {activeTab === 'blogs-list' && (
          <div className="tab-content list-tab">
            {loadingBlogs ? (
              <div className="dash-loader">Retrieving blog articles...</div>
            ) : blogs.length === 0 ? (
              <div className="dash-empty-state">
                <p>No blog articles published yet. Write your first behind-the-scenes piece!</p>
                <button onClick={() => setActiveTab('create-blog')} className="btn-premium-action">Write First Blog</button>
              </div>
            ) : (
              <div className="admin-shoots-grid">
                {blogs.map((blog) => (
                  <div key={blog._id} className="admin-shoot-card">
                    <div className="card-thumbnail-wrapper">
                      <img src={(editingBlog?._id === blog._id ? editingBlog.coverImageUrl : blog.coverImageUrl) || "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC3521_-_Copy.webp"} alt={blog.title} />
                      <span className="card-cat-badge">{(editingBlog?._id === blog._id ? editingBlog.tags?.[0] : blog.tags?.[0]) || 'ARTISTRY'}</span>
                    </div>
                    <div className="card-details">
                      <h4 className="card-title-new">{blog.title}</h4>
                      <p className="card-meta-faint">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {!blog.isPublished && <span className="draft-badge"> (DRAFT)</span>}
                      </p>
                      <div className="card-actions-framer">
                        <a href="/blog" target="_blank" rel="noreferrer" className="btn-preview-link">
                          View Live ↗
                        </a>
                        <button onClick={() => openEditBlogPanel(blog)} className="btn-edit-gallery">
                          Edit Article
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id, blog.title)}
                          className="btn-delete-card"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab content 4: Create Blog */}
        {activeTab === 'create-blog' && (
          <div className="tab-content form-tab">
            <form onSubmit={handleBlogSubmit} className="admin-chic-form">
              <div className="form-double-column">
                <div className="input-group-chic">
                  <label htmlFor="blogTitle">Article Title</label>
                  <input
                    type="text"
                    id="blogTitle"
                    required
                    placeholder="e.g., Finding the Light in Candid Moments"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <div className="input-group-chic">
                  <label htmlFor="blogCategory">Tag / Category</label>
                  <select
                    id="blogCategory"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    disabled={uploading}
                    className="select-chic"
                  >
                    <option value="ARTISTRY">ARTISTRY</option>
                    <option value="GUIDE">GUIDE</option>
                    <option value="INSPIRATION">INSPIRATION</option>
                    <option value="DESTINATIONS">DESTINATIONS</option>
                  </select>
                </div>
              </div>

              <div className="input-group-chic upload-box-chic">
                <label htmlFor="blogCoverInput">Cover Image (R2 Optimized)</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="blogCoverInput"
                    accept="image/*"
                    onChange={(e) => handleBlogCoverUpload(e, false)}
                    disabled={uploading}
                  />
                  <div className="custom-file-label">
                    {blogCover ? '✅ Cover Image Uploaded (Click to Change)' : 'Choose Cover Photo'}
                  </div>
                </div>
                {blogCover && (
                  <div className="hero-preview-row" style={{ marginTop: '15px' }}>
                    <img src={blogCover} alt="blog cover preview" className="hero-thumb-edit" />
                  </div>
                )}
              </div>

              <div className="input-group-chic">
                <label htmlFor="blogContent">Article Content (Paragraphs)</label>
                <textarea
                  id="blogContent"
                  required
                  rows="8"
                  placeholder="Write your article content here. Separate paragraphs with a blank line (double newline)..."
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  disabled={uploading}
                />
              </div>

              {uploading && (
                <div className="upload-progress-card">
                  <div className="progress-spinner"></div>
                  <p className="progress-text">Publishing article...</p>
                </div>
              )}

              <button type="submit" className="btn-premium-submit" disabled={uploading}>
                {uploading ? 'Publishing...' : 'Publish Blog Article'}
              </button>
            </form>
          </div>
        )}

        {/* Tab content 5: Testimonials List */}
        {activeTab === 'testimonials-list' && (
          <div className="tab-content list-tab">
            {loadingTestimonials ? (
              <div className="dash-loader">Retrieving testimonials...</div>
            ) : testimonials.length === 0 ? (
              <div className="dash-empty-state">
                <p>No testimonials found in database. Add your first testimonial!</p>
                <button onClick={() => setActiveTab('create-testimonial')} className="btn-premium-action">Add First Testimonial</button>
              </div>
            ) : (
              <div className="admin-shoots-grid">
                {testimonials.map((t) => (
                  <div key={t._id} className="admin-shoot-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', minHeight: '220px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)' }}>#{t.num}</span>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>{t.location}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#eaeaea', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', margin: '10px 0', lineHeight: '1.5' }}>
                      "{t.quote}"
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#ffffff', margin: 0 }}>{t.author}</h4>
                      <div className="card-actions-framer" style={{ display: 'flex', gap: '8px', margin: 0 }}>
                        <button onClick={() => setEditingTestimonial({ ...t, tags: Array.isArray(t.tags) ? t.tags.join(', ') : t.tags })} className="btn-edit-gallery" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTestimonial(t._id, t.author)} className="btn-delete-card" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab content 6: Create Testimonial */}
        {activeTab === 'create-testimonial' && (
          <div className="tab-content form-tab">
            <form onSubmit={handleTestimonialSubmit} className="admin-chic-form">
              <div className="form-double-column">
                <div className="input-group-chic">
                  <label htmlFor="testNum">Number (Order index, e.g. 01, 02)</label>
                  <input
                    type="text"
                    id="testNum"
                    required
                    placeholder="e.g., 05"
                    value={testimonialNum}
                    onChange={(e) => setTestimonialNum(e.target.value)}
                    disabled={uploading}
                  />
                </div>
                <div className="input-group-chic">
                  <label htmlFor="testAuthor">Couple Names (Author)</label>
                  <input
                    type="text"
                    id="testAuthor"
                    required
                    placeholder="e.g., Srinidhi & Ramya"
                    value={testimonialAuthor}
                    onChange={(e) => setTestimonialAuthor(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="form-double-column">
                <div className="input-group-chic">
                  <label htmlFor="testLocation">Wedding Event Title (Location)</label>
                  <input
                    type="text"
                    id="testLocation"
                    required
                    placeholder="e.g., THE FINE ART LEGACY"
                    value={testimonialLocation}
                    onChange={(e) => setTestimonialLocation(e.target.value)}
                    disabled={uploading}
                  />
                </div>
                <div className="input-group-chic">
                  <label htmlFor="testTags">Editorial Tags (Comma separated)</label>
                  <input
                    type="text"
                    id="testTags"
                    placeholder="e.g., Fine Art Legacy, Color Grading"
                    value={testimonialTags}
                    onChange={(e) => setTestimonialTags(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="input-group-chic">
                <label htmlFor="testQuote">The Praise / Testimonial Quote</label>
                <textarea
                  id="testQuote"
                  required
                  rows="5"
                  placeholder="Capture the client's wonderful feedback..."
                  value={testimonialQuote}
                  onChange={(e) => setTestimonialQuote(e.target.value)}
                  disabled={uploading}
                />
              </div>

              {uploading && (
                <div className="upload-progress-card">
                  <div className="progress-spinner"></div>
                  <p className="progress-text">Saving testimonial to database...</p>
                </div>
              )}

              <button type="submit" className="btn-premium-submit" disabled={uploading}>
                {uploading ? 'Publishing...' : 'Publish Testimonial'}
              </button>
            </form>
          </div>
        )}

        {/* Tab content 7: Site Editor */}
        {activeTab === 'site-editor' && (
          <div className="tab-content site-editor-tab" style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '30px', marginTop: '20px' }}>
            <div className="editor-sub-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
              {['home', 'films', 'about', 'contact', 'faq'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`editor-sub-tab-btn ${editorSubTab === tab ? 'active' : ''}`}
                  onClick={() => setEditorSubTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: editorSubTab === tab ? 'var(--accent)' : '#a0a0a0',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    borderBottom: editorSubTab === tab ? '2px solid var(--accent)' : 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  {tab} Page
                </button>
              ))}
            </div>

            {loadingConfig || !siteConfig ? (
              <div className="dash-loader">Retrieving editor configuration...</div>
            ) : (
              <div className="site-editor-workspace">
                {/* ─── SUB-TAB: HOME PAGE ─── */}
                {editorSubTab === 'home' && (
                  <div>
                    {/* SECTION 1: HERO */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>01 // Hero Header</h3>

                      <div className="input-group-chic">
                        <label>Cloudflare R2 Mobile Video URL</label>
                        <input type="url" value={siteConfig.hero?.mobileVideoUrl ?? DEFAULT_MOBILE_VIDEO_URL}
                          onChange={(e) => handleConfigChange('hero', 'mobileVideoUrl', e.target.value)} />
                      </div>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Tagline (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.tagline || ''}
                            onChange={(e) => handleConfigChange('hero', 'tagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Cloudflare R2 Desktop Video URL</label>
                          <input
                            type="url" placeholder="https://your-bucket.r2.dev/video.mp4"
                            value={siteConfig.hero?.videoUrl || ''}
                            onChange={(e) => handleConfigChange('hero', 'videoUrl', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Line 1 Main (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.line1Main || ''}
                            onChange={(e) => handleConfigChange('hero', 'line1Main', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Line 1 Italic Highlight (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.line1Italic || ''}
                            onChange={(e) => handleConfigChange('hero', 'line1Italic', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Line 1 End (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.line1End || ''}
                            onChange={(e) => handleConfigChange('hero', 'line1End', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Line 2 Main (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.line2Main || ''}
                            onChange={(e) => handleConfigChange('hero', 'line2Main', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Line 2 Gold Highlight (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.line2Highlight || ''}
                            onChange={(e) => handleConfigChange('hero', 'line2Highlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Line 2 End (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.hero?.line2End || ''}
                            onChange={(e) => handleConfigChange('hero', 'line2End', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic upload-box-chic" style={{ marginTop: '15px' }}>
                        <label>Fallback Background Cover Image</label>
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleConfigImageUpload(e, 'hero', 'bgImage')}
                          />
                          <div className="custom-file-label">
                            {siteConfig.hero?.bgImage ? '✅ Change Cover Photo' : 'Choose Cover Photo'}
                          </div>
                        </div>
                        {siteConfig.hero?.bgImage && (
                          <div className="hero-preview-row" style={{ marginTop: '15px' }}>
                            <img src={siteConfig.hero.bgImage} alt="hero bg" className="hero-thumb-edit" style={{ width: '160px', height: '100px', borderRadius: '4px' }} />
                          </div>
                        )}
                      </div>

                      <button type="button" className="btn-edit-gallery" style={{ marginTop: '20px', padding: '10px 20px' }} onClick={() => saveSectionConfig('hero')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Hero Config'}
                      </button>
                    </div>

                    {/* SECTION 2: ABOUT PHILOSOPHY */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>02 // About Philosophy</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Section Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.about_philosophy?.tagline || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'tagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Main (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.about_philosophy?.titleMain || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'titleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Italic Highlight (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_philosophy?.titleHighlight || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'titleHighlight', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Lead Paragraph (max 250 chars)</label>
                        <textarea
                          rows={3}
                          maxLength={250}
                          value={siteConfig.about_philosophy?.pLead || ''}
                          onChange={(e) => handleConfigChange('about_philosophy', 'pLead', e.target.value)}
                        />
                      </div>

                      <div className="input-group-chic">
                        <label>Body Paragraph (max 250 chars)</label>
                        <textarea
                          rows={3}
                          maxLength={250}
                          value={siteConfig.about_philosophy?.pBody || ''}
                          onChange={(e) => handleConfigChange('about_philosophy', 'pBody', e.target.value)}
                        />
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Stat 1 Number (max 6 chars)</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={siteConfig.about_philosophy?.stat1Num || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'stat1Num', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Stat 1 Label (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_philosophy?.stat1Label || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'stat1Label', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Stat 2 Number (max 6 chars)</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={siteConfig.about_philosophy?.stat2Num || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'stat2Num', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Stat 2 Label (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_philosophy?.stat2Label || ''}
                            onChange={(e) => handleConfigChange('about_philosophy', 'stat2Label', e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                        {['img1', 'img2', 'img3'].map((imgKey, idx) => (
                          <div key={imgKey} className="input-group-chic upload-box-chic">
                            <label>Philosophy Photo {idx + 1}</label>
                            <div className="file-input-wrapper">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleConfigImageUpload(e, 'about_philosophy', imgKey)}
                              />
                              <div className="custom-file-label">
                                {siteConfig.about_philosophy?.[imgKey] ? '✅ Change Photo' : 'Choose Photo'}
                              </div>
                            </div>
                            {siteConfig.about_philosophy?.[imgKey] && (
                              <div className="hero-preview-row" style={{ marginTop: '10px' }}>
                                <img src={siteConfig.about_philosophy[imgKey]} alt="preview" className="hero-thumb-edit" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button type="button" className="btn-edit-gallery" style={{ marginTop: '20px', padding: '10px 20px' }} onClick={() => saveSectionConfig('about_philosophy')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Philosophy Config'}
                      </button>
                    </div>

                    {/* SECTION 3: SERVICES */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>03 // Services Section</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Section Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.services?.tagline || ''}
                            onChange={(e) => handleConfigChange('services', 'tagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Main (max 45 chars)</label>
                          <input
                            type="text"
                            maxLength={45}
                            value={siteConfig.services?.titleMain || ''}
                            onChange={(e) => handleConfigChange('services', 'titleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Highlight (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.services?.titleHighlight || ''}
                            onChange={(e) => handleConfigChange('services', 'titleHighlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title End (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.services?.titleEnd || ''}
                            onChange={(e) => handleConfigChange('services', 'titleEnd', e.target.value)}
                          />
                        </div>
                      </div>

                      <h4 style={{ color: '#eaeaea', marginTop: '25px', marginBottom: '15px' }}>Service Offerings List:</h4>
                      {siteConfig.services?.list?.map((service, index) => (
                        <div key={index} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                          <div className="form-double-column">
                            <div className="input-group-chic">
                              <label>Service Number</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={service.num || ''}
                                onChange={(e) => handleConfigArrayChange('services', 'list', index, 'num', e.target.value)}
                              />
                            </div>
                            <div className="input-group-chic">
                              <label>Service Title (max 35 chars)</label>
                              <input
                                type="text"
                                maxLength={35}
                                value={service.title || ''}
                                onChange={(e) => handleConfigArrayChange('services', 'list', index, 'title', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="input-group-chic">
                            <label>Service Description (max 250 chars)</label>
                            <textarea
                              rows={2}
                              maxLength={250}
                              value={service.desc || ''}
                              onChange={(e) => handleConfigArrayChange('services', 'list', index, 'desc', e.target.value)}
                            />
                          </div>
                          <div className="input-group-chic upload-box-chic">
                            <label>Floating Preview Image</label>
                            <div className="file-input-wrapper">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleConfigImageUpload(e, 'services', 'img', index, 'list')}
                              />
                              <div className="custom-file-label">
                                {service.img ? '✅ Change Service Photo' : 'Choose Photo'}
                              </div>
                            </div>
                            {service.img && (
                              <div className="hero-preview-row" style={{ marginTop: '10px' }}>
                                <img src={service.img} alt="service" className="hero-thumb-edit" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <button type="button" className="btn-edit-gallery" style={{ marginTop: '10px', padding: '10px 20px' }} onClick={() => saveSectionConfig('services')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Services Config'}
                      </button>
                    </div>

                    {/* SECTION 4: EXPERIENCE */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>04 // Experience Section</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Section Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.experience?.tagline || ''}
                            onChange={(e) => handleConfigChange('experience', 'tagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Main (max 45 chars)</label>
                          <input
                            type="text"
                            maxLength={45}
                            value={siteConfig.experience?.titleMain || ''}
                            onChange={(e) => handleConfigChange('experience', 'titleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Highlight (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.experience?.titleHighlight || ''}
                            onChange={(e) => handleConfigChange('experience', 'titleHighlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title End (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.experience?.titleEnd || ''}
                            onChange={(e) => handleConfigChange('experience', 'titleEnd', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Subtitle / Description Paragraph (max 150 chars)</label>
                        <input
                          type="text"
                          maxLength={150}
                          value={siteConfig.experience?.subtitle || ''}
                          onChange={(e) => handleConfigChange('experience', 'subtitle', e.target.value)}
                        />
                      </div>

                      <h4 style={{ color: '#eaeaea', marginTop: '25px', marginBottom: '15px' }}>Three deliberate phases:</h4>
                      {siteConfig.experience?.phases?.map((phase, index) => (
                        <div key={index} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                          <div className="form-double-column">
                            <div className="input-group-chic">
                              <label>Phase Number / Tagline (max 35 chars)</label>
                              <input
                                type="text"
                                maxLength={35}
                                value={phase.num || ''}
                                onChange={(e) => handleConfigArrayChange('experience', 'phases', index, 'num', e.target.value)}
                              />
                            </div>
                            <div className="input-group-chic">
                              <label>Heading (max 35 chars)</label>
                              <input
                                type="text"
                                maxLength={35}
                                value={phase.heading || ''}
                                onChange={(e) => handleConfigArrayChange('experience', 'phases', index, 'heading', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="input-group-chic">
                            <label>Description (max 180 chars)</label>
                            <textarea
                              rows={2}
                              maxLength={180}
                              value={phase.desc || ''}
                              onChange={(e) => handleConfigArrayChange('experience', 'phases', index, 'desc', e.target.value)}
                            />
                          </div>
                          <div className="input-group-chic">
                            <label>Tags (comma-separated list, e.g. Lighting, Styling)</label>
                            <input
                              type="text"
                              value={phase.tags?.join(', ') || ''}
                              onChange={(e) => handleConfigArrayChange('experience', 'phases', index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                            />
                          </div>
                          <div className="input-group-chic upload-box-chic">
                            <label>Phase Illustration Photo</label>
                            <div className="file-input-wrapper">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleConfigImageUpload(e, 'experience', 'img', index, 'phases')}
                              />
                              <div className="custom-file-label">
                                {phase.img ? '✅ Change Phase Photo' : 'Choose Photo'}
                              </div>
                            </div>
                            {phase.img && (
                              <div className="hero-preview-row" style={{ marginTop: '10px' }}>
                                <img src={phase.img} alt="phase" className="hero-thumb-edit" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <button type="button" className="btn-edit-gallery" style={{ marginTop: '10px', padding: '10px 20px' }} onClick={() => saveSectionConfig('experience')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Experience Config'}
                      </button>
                    </div>

                    {/* SECTION 5: FEATURED FILM */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>05 // Featured Film</h3>

                      <div className="input-group-chic">
                        <label>Featured Poster Image URL</label>
                        <input type="url" value={siteConfig.featured_film?.posterUrl ?? DEFAULT_POSTER_URL}
                          onChange={(e) => handleConfigChange('featured_film', 'posterUrl', e.target.value)} />
                      </div>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Featured Cloudflare R2 Video URL</label>
                          <input
                            type="url" placeholder="https://your-bucket.r2.dev/video.mp4"
                            value={siteConfig.featured_film?.videoUrl ?? DEFAULT_VIDEO_URL}
                            onChange={(e) => handleConfigChange('featured_film', 'videoUrl', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Section Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.featured_film?.tagline || ''}
                            onChange={(e) => handleConfigChange('featured_film', 'tagline', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Heading Main (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.featured_film?.headingMain || ''}
                            onChange={(e) => handleConfigChange('featured_film', 'headingMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading Italic Highlight (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.featured_film?.headingHighlight || ''}
                            onChange={(e) => handleConfigChange('featured_film', 'headingHighlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Button text (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.featured_film?.buttonText || ''}
                            onChange={(e) => handleConfigChange('featured_film', 'buttonText', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Description Text (max 200 chars)</label>
                        <textarea
                          rows={2}
                          maxLength={200}
                          value={siteConfig.featured_film?.description || ''}
                          onChange={(e) => handleConfigChange('featured_film', 'description', e.target.value)}
                        />
                      </div>

                      <button type="button" className="btn-edit-gallery" style={{ marginTop: '20px', padding: '10px 20px' }} onClick={() => saveSectionConfig('featured_film')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Featured Film Config'}
                      </button>
                    </div>

                    {/* SECTION 6: CTA */}
                    <div className="edit-section" style={{ paddingBottom: '10px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>06 // CTA Booking Block</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Heading Main (max 45 chars)</label>
                          <input
                            type="text"
                            maxLength={45}
                            value={siteConfig.cta?.headingMain || ''}
                            onChange={(e) => handleConfigChange('cta', 'headingMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading Italic Highlight (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.cta?.headingHighlight || ''}
                            onChange={(e) => handleConfigChange('cta', 'headingHighlight', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Subtext (max 120 chars)</label>
                          <input
                            type="text"
                            maxLength={120}
                            value={siteConfig.cta?.subtext || ''}
                            onChange={(e) => handleConfigChange('cta', 'subtext', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Background Watermark Text (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.cta?.bgText || ''}
                            onChange={(e) => handleConfigChange('cta', 'bgText', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Button Text (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.cta?.buttonText || ''}
                            onChange={(e) => handleConfigChange('cta', 'buttonText', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic upload-box-chic" style={{ marginTop: '15px' }}>
                        <label>CTA Section Background Image</label>
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleConfigImageUpload(e, 'cta', 'bgImage')}
                          />
                          <div className="custom-file-label">
                            {siteConfig.cta?.bgImage ? '✅ Change CTA Photo' : 'Choose Photo'}
                          </div>
                        </div>
                        {siteConfig.cta?.bgImage && (
                          <div className="hero-preview-row" style={{ marginTop: '15px' }}>
                            <img src={siteConfig.cta.bgImage} alt="cta bg" className="hero-thumb-edit" style={{ width: '160px', height: '100px', borderRadius: '4px' }} />
                          </div>
                        )}
                      </div>

                      <button type="button" className="btn-edit-gallery" style={{ marginTop: '20px', padding: '10px 20px' }} onClick={() => saveSectionConfig('cta')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save CTA Config'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── SUB-TAB: FILMS PAGE ─── */}
                {editorSubTab === 'films' && (
                  <div>
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Films Header & Metadata</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Section Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.films_page?.tagline || ''}
                            onChange={(e) => handleConfigChange('films_page', 'tagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading Main (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.films_page?.headingMain || ''}
                            onChange={(e) => handleConfigChange('films_page', 'headingMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading Italic Highlight (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.films_page?.headingHighlight || ''}
                            onChange={(e) => handleConfigChange('films_page', 'headingHighlight', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Description Paragraph (max 200 chars)</label>
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={siteConfig.films_page?.description || ''}
                          onChange={(e) => handleConfigChange('films_page', 'description', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="edit-section">
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Video List (4 items)</h3>
                      {siteConfig.films_page?.list?.map((film, index) => (
                        <div key={index} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                          <div className="form-double-column">
                            <div className="input-group-chic">
                              <label>Video Order Number (e.g. 01)</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={film.num || ''}
                                onChange={(e) => handleConfigArrayChange('films_page', 'list', index, 'num', e.target.value)}
                              />
                            </div>
                            <div className="input-group-chic">
                              <label>Cloudflare R2 Video URL</label>
                              <input
                                type="url" placeholder="https://your-bucket.r2.dev/video.mp4"
                                value={film.videoUrl || ''}
                                onChange={(e) => handleConfigArrayChange('films_page', 'list', index, 'videoUrl', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="input-group-chic">
                            <label>Poster Image URL</label>
                            <input type="url" value={film.posterUrl || ''}
                              onChange={(e) => handleConfigArrayChange('films_page', 'list', index, 'posterUrl', e.target.value)} />
                          </div>
                          <div className="form-double-column">
                            <div className="input-group-chic">
                              <label>Video Tag / Label (max 35 chars)</label>
                              <input
                                type="text"
                                maxLength={35}
                                value={film.label || ''}
                                onChange={(e) => handleConfigArrayChange('films_page', 'list', index, 'label', e.target.value)}
                              />
                            </div>
                            <div className="input-group-chic">
                              <label>Location (max 25 chars)</label>
                              <input
                                type="text"
                                maxLength={25}
                                value={film.location || ''}
                                onChange={(e) => handleConfigArrayChange('films_page', 'list', index, 'location', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button type="button" className="btn-premium-submit" style={{ marginTop: '20px' }} onClick={() => saveSectionConfig('films_page')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Films Page Changes'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── SUB-TAB: ABOUT PAGE ─── */}
                {editorSubTab === 'about' && (
                  <div>
                    {/* SECTION 1: ABOUT HERO */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>01 // About Hero</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Hero Title Main (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.about_page?.heroTitleMain || ''}
                            onChange={(e) => handleConfigChange('about_page', 'heroTitleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Hero Title Highlight (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_page?.heroTitleHighlight || ''}
                            onChange={(e) => handleConfigChange('about_page', 'heroTitleHighlight', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="input-group-chic">
                        <label>Hero Subtitle / Tagline (max 60 chars)</label>
                        <input
                          type="text"
                          maxLength={60}
                          value={siteConfig.about_page?.heroTagline || ''}
                          onChange={(e) => handleConfigChange('about_page', 'heroTagline', e.target.value)}
                        />
                      </div>
                      <div className="input-group-chic upload-box-chic" style={{ marginTop: '15px' }}>
                        <label>Hero Parallax Background Image</label>
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleConfigImageUpload(e, 'about_page', 'heroBg')}
                          />
                          <div className="custom-file-label">
                            {siteConfig.about_page?.heroBg ? '✅ Change Hero background' : 'Choose Photo'}
                          </div>
                        </div>
                        {siteConfig.about_page?.heroBg && (
                          <div className="hero-preview-row" style={{ marginTop: '15px' }}>
                            <img src={siteConfig.about_page.heroBg} alt="hero bg" className="hero-thumb-edit" style={{ width: '160px', height: '100px', borderRadius: '4px' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 2: THE FOUNDER */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>02 // The Founder Profile</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Founder Tagline (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.about_page?.founderTagline || ''}
                            onChange={(e) => handleConfigChange('about_page', 'founderTagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Founder Name (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_page?.founderName || ''}
                            onChange={(e) => handleConfigChange('about_page', 'founderName', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Founder Subtitle (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.about_page?.founderSub || ''}
                            onChange={(e) => handleConfigChange('about_page', 'founderSub', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Quote Main (max 150 chars)</label>
                          <input
                            type="text"
                            maxLength={150}
                            value={siteConfig.about_page?.founderQuote || ''}
                            onChange={(e) => handleConfigChange('about_page', 'founderQuote', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Quote Highlight Word (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_page?.founderQuoteHighlight || ''}
                            onChange={(e) => handleConfigChange('about_page', 'founderQuoteHighlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Quote End (max 150 chars)</label>
                          <input
                            type="text"
                            maxLength={150}
                            value={siteConfig.about_page?.founderQuoteEnd || ''}
                            onChange={(e) => handleConfigChange('about_page', 'founderQuoteEnd', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Bio Paragraph 1 (max 450 chars)</label>
                        <textarea
                          rows={4}
                          maxLength={450}
                          value={siteConfig.about_page?.founderBio1 || ''}
                          onChange={(e) => handleConfigChange('about_page', 'founderBio1', e.target.value)}
                        />
                      </div>

                      <div className="input-group-chic">
                        <label>Bio Paragraph 2 (max 450 chars)</label>
                        <textarea
                          rows={4}
                          maxLength={450}
                          value={siteConfig.about_page?.founderBio2 || ''}
                          onChange={(e) => handleConfigChange('about_page', 'founderBio2', e.target.value)}
                        />
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Pillar 1 Title (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_page?.pillar1Title || ''}
                            onChange={(e) => handleConfigChange('about_page', 'pillar1Title', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Pillar 1 Description (max 120 chars)</label>
                          <input
                            type="text"
                            maxLength={120}
                            value={siteConfig.about_page?.pillar1Desc || ''}
                            onChange={(e) => handleConfigChange('about_page', 'pillar1Desc', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Pillar 2 Title (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_page?.pillar2Title || ''}
                            onChange={(e) => handleConfigChange('about_page', 'pillar2Title', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Pillar 2 Description (max 120 chars)</label>
                          <input
                            type="text"
                            maxLength={120}
                            value={siteConfig.about_page?.pillar2Desc || ''}
                            onChange={(e) => handleConfigChange('about_page', 'pillar2Desc', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column" style={{ marginTop: '15px' }}>
                        <div className="input-group-chic">
                          <label>Signature Title Label (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_page?.signatureTitle || ''}
                            onChange={(e) => handleConfigChange('about_page', 'signatureTitle', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic upload-box-chic">
                          <label>Founder Portrait Photo</label>
                          <div className="file-input-wrapper">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleConfigImageUpload(e, 'about_page', 'founderImg')}
                            />
                            <div className="custom-file-label">
                              {siteConfig.about_page?.founderImg ? '✅ Change Founder Photo' : 'Choose Photo'}
                            </div>
                          </div>
                          {siteConfig.about_page?.founderImg && (
                            <div className="hero-preview-row" style={{ marginTop: '10px' }}>
                              <img src={siteConfig.about_page.founderImg} alt="founder" className="hero-thumb-edit" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: THE STUDIO */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>03 // The Studio Spread</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Studio Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.about_page?.studioTagline || ''}
                            onChange={(e) => handleConfigChange('about_page', 'studioTagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading Main (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_page?.studioTitleMain || ''}
                            onChange={(e) => handleConfigChange('about_page', 'studioTitleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading Italic Highlight (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_page?.studioTitleHighlight || ''}
                            onChange={(e) => handleConfigChange('about_page', 'studioTitleHighlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Heading End (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_page?.studioTitleEnd || ''}
                            onChange={(e) => handleConfigChange('about_page', 'studioTitleEnd', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Studio Narrative Paragraph (max 300 chars)</label>
                        <textarea
                          rows={3}
                          maxLength={300}
                          value={siteConfig.about_page?.studioDesc || ''}
                          onChange={(e) => handleConfigChange('about_page', 'studioDesc', e.target.value)}
                        />
                      </div>

                      <div className="form-double-column" style={{ marginTop: '15px' }}>
                        <div className="input-group-chic">
                          <label>Team Image Caption (max 60 chars)</label>
                          <input
                            type="text"
                            maxLength={60}
                            value={siteConfig.about_page?.teamCaption || ''}
                            onChange={(e) => handleConfigChange('about_page', 'teamCaption', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic upload-box-chic">
                          <label>Team Collective Photo</label>
                          <div className="file-input-wrapper">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleConfigImageUpload(e, 'about_page', 'teamImg')}
                            />
                            <div className="custom-file-label">
                              {siteConfig.about_page?.teamImg ? '✅ Change Team Photo' : 'Choose Photo'}
                            </div>
                          </div>
                          {siteConfig.about_page?.teamImg && (
                            <div className="hero-preview-row" style={{ marginTop: '10px' }}>
                              <img src={siteConfig.about_page.teamImg} alt="team" className="hero-thumb-edit" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: PHILOSOPHY */}
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>04 // Core Philosophy</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Section Tagline (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.about_page?.philosophyTagline || ''}
                            onChange={(e) => handleConfigChange('about_page', 'philosophyTagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Main (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.about_page?.philosophyTitleMain || ''}
                            onChange={(e) => handleConfigChange('about_page', 'philosophyTitleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Highlight (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.about_page?.philosophyTitleHighlight || ''}
                            onChange={(e) => handleConfigChange('about_page', 'philosophyTitleHighlight', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic upload-box-chic" style={{ marginTop: '15px' }}>
                        <label>Philosophy Backdrop Photo</label>
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleConfigImageUpload(e, 'about_page', 'philosophyBg')}
                          />
                          <div className="custom-file-label">
                            {siteConfig.about_page?.philosophyBg ? '✅ Change Photo' : 'Choose Photo'}
                          </div>
                        </div>
                        {siteConfig.about_page?.philosophyBg && (
                          <div className="hero-preview-row" style={{ marginTop: '10px' }}>
                            <img src={siteConfig.about_page.philosophyBg} alt="philosophy" className="hero-thumb-edit" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                          </div>
                        )}
                      </div>

                      <h4 style={{ color: '#eaeaea', marginTop: '25px', marginBottom: '15px' }}>Philosophy Pillars (3 items):</h4>
                      {siteConfig.about_page?.philosophyPillars?.map((pillar, index) => (
                        <div key={index} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                          <div className="form-double-column">
                            <div className="input-group-chic">
                              <label>Pillar Index (e.g. 01 /)</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={pillar.num || ''}
                                onChange={(e) => handleConfigArrayChange('about_page', 'philosophyPillars', index, 'num', e.target.value)}
                              />
                            </div>
                            <div className="input-group-chic">
                              <label>Pillar Title (max 30 chars)</label>
                              <input
                                type="text"
                                maxLength={30}
                                value={pillar.title || ''}
                                onChange={(e) => handleConfigArrayChange('about_page', 'philosophyPillars', index, 'title', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="input-group-chic">
                            <label>Pillar Description (max 200 chars)</label>
                            <textarea
                              rows={2}
                              maxLength={200}
                              value={pillar.desc || ''}
                              onChange={(e) => handleConfigArrayChange('about_page', 'philosophyPillars', index, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SECTION 5: CLOSING */}
                    <div className="edit-section">
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>05 // Closing Editorial Quote</h3>
                      <div className="input-group-chic">
                        <label>Closing Quote (max 150 chars)</label>
                        <input
                          type="text"
                          maxLength={150}
                          value={siteConfig.about_page?.closingQuote || ''}
                          onChange={(e) => handleConfigChange('about_page', 'closingQuote', e.target.value)}
                        />
                      </div>
                      <div className="input-group-chic">
                        <label>Signature Text (max 30 chars)</label>
                        <input
                          type="text"
                          maxLength={30}
                          value={siteConfig.about_page?.closingSignature || ''}
                          onChange={(e) => handleConfigChange('about_page', 'closingSignature', e.target.value)}
                        />
                      </div>
                    </div>

                    <button type="button" className="btn-premium-submit" style={{ marginTop: '20px' }} onClick={() => saveSectionConfig('about_page')} disabled={editorSaving}>
                      {editorSaving ? 'Saving...' : 'Save About Page Changes'}
                    </button>
                  </div>
                )}

                {/* ─── SUB-TAB: CONTACT PAGE ─── */}
                {editorSubTab === 'contact' && (
                  <div>
                    <div className="edit-section">
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Contact Details & Copy</h3>
                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Section Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.contact_page?.tagline || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'tagline', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Main (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.contact_page?.heroTitleMain || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'heroTitleMain', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Highlight (max 30 chars)</label>
                          <input
                            type="text"
                            maxLength={30}
                            value={siteConfig.contact_page?.heroTitleHighlight || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'heroTitleHighlight', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic">
                        <label>Attitude Bold Paragraph (max 150 chars)</label>
                        <textarea
                          rows={2}
                          maxLength={150}
                          value={siteConfig.contact_page?.pBold || ''}
                          onChange={(e) => handleConfigChange('contact_page', 'pBold', e.target.value)}
                        />
                      </div>

                      <div className="input-group-chic">
                        <label>Attitude Light Paragraph (max 250 chars)</label>
                        <textarea
                          rows={3}
                          maxLength={250}
                          value={siteConfig.contact_page?.pLight || ''}
                          onChange={(e) => handleConfigChange('contact_page', 'pLight', e.target.value)}
                        />
                      </div>

                      <div className="input-group-chic">
                        <label>Attitude Gold Paragraph (max 200 chars)</label>
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={siteConfig.contact_page?.pGold || ''}
                          onChange={(e) => handleConfigChange('contact_page', 'pGold', e.target.value)}
                        />
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Vertical Image Tagline (max 50 chars)</label>
                          <input
                            type="text"
                            maxLength={50}
                            value={siteConfig.contact_page?.verticalLabel || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'verticalLabel', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Studio Location Text (max 60 chars)</label>
                          <input
                            type="text"
                            maxLength={60}
                            value={siteConfig.contact_page?.studioInfo || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'studioInfo', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Direct Email Link (max 50 chars)</label>
                          <input
                            type="email"
                            maxLength={50}
                            value={siteConfig.contact_page?.email || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'email', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Direct Phone Channel (max 25 chars)</label>
                          <input
                            type="text"
                            maxLength={25}
                            value={siteConfig.contact_page?.phone || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Form Title (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.contact_page?.formTitle || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'formTitle', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Form Subtitle Description (max 120 chars)</label>
                          <input
                            type="text"
                            maxLength={120}
                            value={siteConfig.contact_page?.formSub || ''}
                            onChange={(e) => handleConfigChange('contact_page', 'formSub', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group-chic upload-box-chic" style={{ marginTop: '15px' }}>
                        <label>Side Editorial Showcase Photo</label>
                        <div className="file-input-wrapper">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleConfigImageUpload(e, 'contact_page', 'contactImg')}
                          />
                          <div className="custom-file-label">
                            {siteConfig.contact_page?.contactImg ? '✅ Change Photo' : 'Choose Photo'}
                          </div>
                        </div>
                        {siteConfig.contact_page?.contactImg && (
                          <div className="hero-preview-row" style={{ marginTop: '15px' }}>
                            <img src={siteConfig.contact_page.contactImg} alt="contact" className="hero-thumb-edit" style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '4px' }} />
                          </div>
                        )}
                      </div>

                      <button type="button" className="btn-premium-submit" style={{ marginTop: '20px' }} onClick={() => saveSectionConfig('contact_page')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save Contact Page Changes'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── SUB-TAB: FAQ PAGE ─── */}
                {editorSubTab === 'faq' && (
                  <div>
                    <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <h3 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>01 // FAQ Page Header & Text</h3>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Page Eyebrow Tagline (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.faq_page?.eyebrow || ''}
                            onChange={(e) => handleConfigChange('faq_page', 'eyebrow', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Title Main Heading (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.faq_page?.titleMain || ''}
                            onChange={(e) => handleConfigChange('faq_page', 'titleMain', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>Title Italic Highlight (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.faq_page?.titleHighlight || ''}
                            onChange={(e) => handleConfigChange('faq_page', 'titleHighlight', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>Page Subtitle Description (max 150 chars)</label>
                          <input
                            type="text"
                            maxLength={150}
                            value={siteConfig.faq_page?.subtitle || ''}
                            onChange={(e) => handleConfigChange('faq_page', 'subtitle', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-double-column">
                        <div className="input-group-chic">
                          <label>CTA Strip Question Text (max 120 chars)</label>
                          <input
                            type="text"
                            maxLength={120}
                            value={siteConfig.faq_page?.ctaText || ''}
                            onChange={(e) => handleConfigChange('faq_page', 'ctaText', e.target.value)}
                          />
                        </div>
                        <div className="input-group-chic">
                          <label>CTA Button Text (max 40 chars)</label>
                          <input
                            type="text"
                            maxLength={40}
                            value={siteConfig.faq_page?.ctaBtnText || ''}
                            onChange={(e) => handleConfigChange('faq_page', 'ctaBtnText', e.target.value)}
                          />
                        </div>
                      </div>

                      <button type="button" className="btn-premium-submit" style={{ marginTop: '20px' }} onClick={() => saveSectionConfig('faq_page')} disabled={editorSaving}>
                        {editorSaving ? 'Saving...' : 'Save FAQ Page Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── SPACIOUS FULL-SCREEN PORTFOLIO EDIT MODAL ── */}
      {editingShoot && (
        <div className="premium-edit-modal-overlay" onClick={() => setEditingShoot(null)}>
          <div className="premium-edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditingShoot(null)}>✕</button>

            <div className="edit-panel-header" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9b57f' }}>Manage Client Shoot</span>
              {editMsg && <span className={`edit-msg ${editMsg.startsWith('✅') ? 'ok' : 'err'}`}>{editMsg}</span>}
            </div>

            <h2 className="modal-title-editorial">
              Editing: <i>{editingShoot.title}</i>
            </h2>

            <div className="modal-body-scrollable" data-lenis-prevent>
              {/* Cover Photo */}
              <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '25px', marginBottom: '25px' }}>
                <div className="edit-section-label">Cover / Hero Image</div>
                <div className="hero-preview-row">
                  <img src={editingShoot.heroImage} alt="cover" className="hero-thumb-edit" style={{ width: '160px', height: '100px', borderRadius: '4px' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '12px', lineHeight: '1.4' }}>
                      This represents the face of this shoot archive. Upload a new landscape/portrait image to change it.
                    </p>
                    <label className={`btn-edit-upload ${editUploading ? 'disabled' : ''}`}>
                      {editUploading ? 'Uploading WebP...' : '⬆ Upload New Cover'}
                      <input type="file" accept="image/*" hidden onChange={handleChangeHero} disabled={editUploading} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="edit-section">
                <div className="edit-section-label" style={{ marginBottom: '10px' }}>
                  Gallery Collage Collection ({editingShoot.gallery?.length || 0} images)
                </div>
                <p style={{ fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '20px', lineHeight: '1.4' }}>
                  These images populate the scrollable narrative collection. Click the red ✕ button on any image to permanently delete it, or click "Add Photos" to upload multiple new images.
                </p>

                <div className="gallery-edit-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
                  {(editingShoot.gallery || []).map((url, idx) => (
                    <div key={idx} className="gallery-edit-thumb" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img src={url} alt={`gallery-${idx}`} />
                      <button
                        className="gallery-remove-btn"
                        onClick={() => handleRemoveGalleryImage(url)}
                        disabled={editUploading}
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {/* Add More Card */}
                  <label className={`gallery-add-btn ${editUploading ? 'disabled' : ''}`} style={{ minHeight: '130px' }}>
                    <span>＋</span>
                    <small>Add Photos</small>
                    <input type="file" accept="image/*" multiple hidden onChange={handleAddGalleryImages} disabled={editUploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SPACIOUS FULL-SCREEN BLOG EDIT MODAL ── */}
      {editingBlog && (
        <div className="premium-edit-modal-overlay" onClick={() => setEditingBlog(null)}>
          <div className="premium-edit-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <button className="modal-close-btn" onClick={() => setEditingBlog(null)}>✕</button>

            <div className="edit-panel-header" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9b57f' }}>Edit Blog Post</span>
              {editMsg && <span className={`edit-msg ${editMsg.startsWith('✅') ? 'ok' : 'err'}`}>{editMsg}</span>}
            </div>

            <h2 className="modal-title-editorial">
              Editing: <i>{editingBlog.title}</i>
            </h2>

            <form onSubmit={handleEditBlogSubmit} className="modal-body-scrollable" data-lenis-prevent>
              {/* Title */}
              <div className="edit-section">
                <label className="edit-section-label">Article Title</label>
                <input
                  type="text"
                  required
                  className="input-chic"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog(prev => ({ ...prev, title: e.target.value }))}
                  disabled={editUploading}
                />
              </div>

              {/* Category & Status */}
              <div className="form-double-column edit-section" style={{ gap: '20px' }}>
                <div>
                  <label className="edit-section-label">Tag / Category</label>
                  <select
                    value={editingBlog.tags?.[0] || 'ARTISTRY'}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, tags: [e.target.value] }))}
                    className="select-chic"
                    style={{ width: '100%', padding: '14px', background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)' }}
                    disabled={editUploading}
                  >
                    <option value="ARTISTRY">ARTISTRY</option>
                    <option value="GUIDE">GUIDE</option>
                    <option value="INSPIRATION">INSPIRATION</option>
                    <option value="DESTINATIONS">DESTINATIONS</option>
                  </select>
                </div>
                <div>
                  <label className="edit-section-label">Status</label>
                  <select
                    value={editingBlog.isPublished ? 'Published' : 'Draft'}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, isPublished: e.target.value === 'Published' }))}
                    className="select-chic"
                    style={{ width: '100%', padding: '14px', background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)' }}
                    disabled={editUploading}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '25px', marginBottom: '25px' }}>
                <label className="edit-section-label">Cover Image</label>
                <div className="hero-preview-row">
                  <img src={editingBlog.coverImageUrl || "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC3521_-_Copy.webp"} alt="cover" className="hero-thumb-edit" style={{ width: '160px', height: '100px', borderRadius: '4px' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '12px' }}>
                      Choose an image from your computer to update this article's primary cover.
                    </p>
                    <label className={`btn-edit-upload ${editUploading ? 'disabled' : ''}`}>
                      {editUploading ? 'Uploading WebP...' : '⬆ Upload New Cover'}
                      <input type="file" accept="image/*" hidden onChange={(e) => handleBlogCoverUpload(e, true)} disabled={editUploading} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="edit-section">
                <label className="edit-section-label">Content (Separate paragraphs with a blank line)</label>
                <textarea
                  required
                  rows="10"
                  className="textarea-chic"
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog(prev => ({ ...prev, content: e.target.value }))}
                  disabled={editUploading}
                />
              </div>

              <button type="submit" className="btn-premium-submit" style={{ width: '100%', padding: '16px', background: '#ffeaa7', color: '#111' }} disabled={editUploading}>
                {editUploading ? 'Saving changes...' : 'Save Blog Post Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── SPACIOUS FULL-SCREEN TESTIMONIAL EDIT MODAL ── */}
      {editingTestimonial && (
        <div className="premium-edit-modal-overlay" onClick={() => setEditingTestimonial(null)}>
          <div className="premium-edit-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close-btn" onClick={() => setEditingTestimonial(null)}>✕</button>

            <div className="edit-panel-header" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9b57f' }}>Edit Testimonial</span>
              {editMsg && <span className={`edit-msg ${editMsg.startsWith('✅') ? 'ok' : 'err'}`}>{editMsg}</span>}
            </div>

            <h2 className="modal-title-editorial">
              Editing Testimonial: <i>{editingTestimonial.author}</i>
            </h2>

            <form onSubmit={handleEditTestimonialSubmit} className="modal-body-scrollable" data-lenis-prevent>
              <div className="form-double-column edit-section" style={{ gap: '20px' }}>
                <div>
                  <label className="edit-section-label">Number / Order (e.g. 01)</label>
                  <input
                    type="text"
                    required
                    className="input-chic"
                    value={editingTestimonial.num}
                    onChange={(e) => setEditingTestimonial(prev => ({ ...prev, num: e.target.value }))}
                    disabled={editUploading}
                  />
                </div>
                <div>
                  <label className="edit-section-label">Author / Names</label>
                  <input
                    type="text"
                    required
                    className="input-chic"
                    value={editingTestimonial.author}
                    onChange={(e) => setEditingTestimonial(prev => ({ ...prev, author: e.target.value }))}
                    disabled={editUploading}
                  />
                </div>
              </div>

              <div className="form-double-column edit-section" style={{ gap: '20px' }}>
                <div>
                  <label className="edit-section-label">Event / Location</label>
                  <input
                    type="text"
                    required
                    className="input-chic"
                    value={editingTestimonial.location}
                    onChange={(e) => setEditingTestimonial(prev => ({ ...prev, location: e.target.value }))}
                    disabled={editUploading}
                  />
                </div>
                <div>
                  <label className="edit-section-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="input-chic"
                    value={editingTestimonial.tags}
                    onChange={(e) => setEditingTestimonial(prev => ({ ...prev, tags: e.target.value }))}
                    disabled={editUploading}
                  />
                </div>
              </div>

              <div className="edit-section">
                <label className="edit-section-label">Testimonial Quote</label>
                <textarea
                  required
                  rows="5"
                  className="textarea-chic"
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                  disabled={editUploading}
                />
              </div>

              <button type="submit" className="btn-premium-submit" style={{ width: '100%', padding: '16px', background: '#ffeaa7', color: '#111' }} disabled={editUploading}>
                {editUploading ? 'Saving changes...' : 'Save Testimonial Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="confirm-modal-overlay" onClick={closeConfirmModal}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
            <span className="confirm-modal-accent">CONFIRM ACTION</span>
            <h3 id="confirm-modal-title" className="confirm-modal-title">{confirmModal.title}</h3>
            <p className="confirm-modal-message">{confirmModal.message}</p>
            <div className="confirm-modal-actions">
              <button type="button" className="btn-confirm-cancel" onClick={closeConfirmModal}>
                Cancel
              </button>
              <button type="button" className="btn-confirm-danger" onClick={handleConfirmAction}>
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
