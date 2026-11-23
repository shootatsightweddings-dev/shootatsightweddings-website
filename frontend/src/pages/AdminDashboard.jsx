import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useSiteConfig } from '../context/siteConfigState';
import useSEO from '../hooks/useSEO';
import './AdminDashboard.css';
import VisualAdminBar from '../components/visual-builder/VisualAdminBar';
import VisualPageViewer from '../components/visual-builder/VisualPageViewer';
import VisualEditorDrawer from '../components/visual-builder/VisualEditorDrawer';
import SeoFields from '../components/SeoFields';
import { defaultFaqs } from '../data/defaultFaqs';
import { defaultPortfolio } from '../data/portfolioDefaults';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { refreshConfig } = useSiteConfig();

  useSEO({
    title: 'Admin Dashboard Portal',
    noindex: true
  });

  const [blogSeo,setBlogSeo] = useState({});
  const [activeMode, setActiveMode] = useState('visual-page'); // 'visual-page', 'shoots', 'blogs', 'testimonials'
  const [visualPage, setVisualPage] = useState('home'); // 'home', 'about', 'portfolio', 'films', 'contact', 'faq'
  const [shootSubTab, setShootSubTab] = useState('list');
  const [blogSubTab, setBlogSubTab] = useState('list');
  const [testimonialSubTab, setTestimonialSubTab] = useState('list');
  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    sectionKey: '',
    title: '',
    subtitle: '',
    initialData: null
  });

  const openDrawer = (sectionKey, title, subtitle) => {
    setDrawerState({
      isOpen: true,
      sectionKey,
      title,
      subtitle,
      initialData: siteConfig ? siteConfig[sectionKey] : {}
    });
  };

  const closeDrawer = () => {
    setDrawerState(prev => ({ ...prev, isOpen: false }));
  };

  const handleDrawerSave = async (sectionKey, newContent) => {
    setEditorSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/admin/site-config/${sectionKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSiteConfig(prev => ({
          ...prev,
          [sectionKey]: newContent
        }));
        await refreshConfig();
        showToast('success', `Saved ${drawerState.title || sectionKey} successfully!`);
        closeDrawer();
      } else {
        setError(data.message || 'Failed to save section.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save section.');
    } finally {
      setEditorSaving(false);
    }
  };

  const handleQuickDelete = async (sectionKey, arrayKey, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const currentSection = { ...siteConfig[sectionKey] };
    const list = [...(currentSection[arrayKey] || [])];
    list.splice(index, 1);
    currentSection[arrayKey] = list;
    await handleDrawerSave(sectionKey, currentSection);
  };

  const handleQuickAdd = async (sectionKey, arrayKey, newItem, isDirectValue) => {
    const currentSection = { ...siteConfig[sectionKey] };
    if (isDirectValue) {
      const keys = arrayKey.split('.');
      let curr = currentSection;
      for (let i = 0; i < keys.length - 1; i++) {
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = newItem;
    } else {
      const list = [...(currentSection[arrayKey] || [])];
      list.push(newItem);
      currentSection[arrayKey] = list;
    }
    await handleDrawerSave(sectionKey, currentSection);
  };

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const toastSequenceRef = useRef(0);

  const showToast = useCallback((type, message) => {
    const text = String(message || '').replace(/^[✅❌]\s*/, '').trim();
    if (!text) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ id: ++toastSequenceRef.current, type, message: text });
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  const handleDirectImageUpload = async (file) => {
    if (!file) return null;
    setEditorSaving(true);
    try {
      const url = await uploadImage(file);
      showToast('success', 'Image uploaded.');
      return url;
    } catch (err) {
      showToast('error', err.message);
      throw err;
    } finally {
      setEditorSaving(false);
    }
  };

  const handleDirectShootHeroUpload = async (shootId, file) => {
    if (!file) return;
    setEditorSaving(true);
    showToast('info', 'Uploading cover photo...');
    try {
      const token = localStorage.getItem('adminToken');
      const fd = new FormData();
      fd.append('heroImage', file);
      fd.append('heroImageAlt', 'Shoot Cover Photo');
      const res = await fetch(`${API_URL}/shoots/${shootId}/hero`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update cover photo');
      await fetchShoots();
      showToast('success', 'Cover photo successfully updated!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setEditorSaving(false);
    }
  };
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
  const [editMsg, setEditMsgState] = useState('');

  const setSuccess = (message) => { if (message) showToast('success', message); };
  const setError = (message) => { if (message) showToast('error', message); };
  const setEditMsg = (message) => {
    setEditMsgState(message);
    if (!message || /^(Saving|Uploading|Removing|Updating)/i.test(message)) return;
    const type = /✅|saved|success|updated|removed|added/i.test(message) ? 'success' : 'error';
    showToast(type, message);
  };

  // Blog Management State
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('ARTISTRY');
  const [blogContent, setBlogContent] = useState('');
  const [blogCover, setBlogCover] = useState("/common/_DSC3521_-_Copy.webp");

  // UI States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

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
  const [successModal, setSuccessModal] = useState(null);

  // Site Editor State
  const [siteConfig, setSiteConfig] = useState(null);
  const [editorSaving, setEditorSaving] = useState(false);

  const fetchEditorConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/site-config`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSiteConfig({
          ...data.config,
          portfolio_page: {
            ...data.config.portfolio_page,
            heading: data.config.portfolio_page?.heading || defaultPortfolio.heading,
            featuredTitle: data.config.portfolio_page?.featuredTitle || defaultPortfolio.featuredTitle,
            collections: (Array.isArray(data.config.portfolio_page?.collections) && data.config.portfolio_page.collections.every(c => Array.isArray(c.panels)))
              ? data.config.portfolio_page.collections
              : defaultPortfolio.collections,
            heroImagesText: (data.config.portfolio_page?.heroImages || defaultPortfolio.heroImages).join('\n'),
            featuredImagesText: (data.config.portfolio_page?.featuredImages || defaultPortfolio.featuredImages).join('\n'),
          },
          faq_page: {
            ...data.config.faq_page,
            faqs: data.config.faq_page?.faqs?.length ? data.config.faq_page.faqs : defaultFaqs,
          },
        });
      } else {
        setError('Failed to fetch site configurations.');
      }
    } catch {
      setError('Could not fetch site configurations.');
    }
  };

  const uploadImage = async (file, altText) => {
    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    fd.append('image', file);
    fd.append('altText',altText);
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

  const uploadVideo = async (file, onProgress) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('video', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/videos/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        // nginx answers 413 (with an HTML page) when a file is over its upload limit.
        if (xhr.status === 413) {
          reject(new Error('This video is larger than the server currently accepts. Compress it, or ask the developer to raise the upload limit (see docs/deployment.md).'));
          return;
        }
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && res.success) {
            resolve(res.url);
          } else {
            reject(new Error(res.message || `Video upload failed (HTTP ${xhr.status})`));
          }
        } catch {
          reject(new Error(`Server error (${xhr.status || 'unknown'}): ${xhr.statusText || 'Upload failed'}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during video upload'));
      xhr.send(formData);
    });
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
    fetchEditorConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (files.length > 50) {
      setError('Choose up to 50 gallery photos per upload. Split larger folders into smaller batches.');
      e.target.value = '';
      return;
    }
    setError('');
    setGallery(files);
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

  const saveShootMetadata = async () => {
    setEditUploading(true);
    setEditMsg('Saving story details...');
    try {
      const res = await fetch(`${API_URL}/shoots/${editingShoot._id}/metadata`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingShoot.title,
          category: editingShoot.category,
          location: editingShoot.location,
          date: editingShoot.date,
          desc: editingShoot.desc || editingShoot.narrative || '',
          narrative: editingShoot.desc || editingShoot.narrative || ''
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      setEditingShoot(data.data);
      setShoots(previous => previous.map(shoot => shoot._id === data.data._id ? data.data : shoot));
      setEditMsg('✅ Story details saved successfully.');
    } catch (error) {
      setEditMsg(`❌ ${error.message}`);
    } finally {
      setEditUploading(false);
    }
  };

  const handleAddGalleryImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    if (files.length > 50) {
      setEditMsg('Choose up to 50 gallery photos per upload. Split larger folders into smaller batches.');
      return;
    }
    setEditUploading(true);
    setEditMsg(`Uploading ${files.length} photo(s)...`);
    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    files.forEach(f => fd.append('gallery', f));
    fd.append('galleryAlt', JSON.stringify(files.map(() => '')));
    try {
      const res = await fetch(`${API_URL}/shoots/${editingShoot._id}/gallery`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setEditingShoot(prev => ({ ...prev, gallery: data.gallery, galleryAlt: data.galleryAlt }));
        setShoots(prev => prev.map(s => s._id === editingShoot._id ? { ...s, gallery: data.gallery } : s));
        setEditMsg(`✅ ${files.length} image(s) added successfully!`);
      } else {
        setEditMsg(`❌ ${data.message || 'Upload failed'}`);
      }
    } catch {
      setEditMsg('❌ Connection error');
    } finally {
      setEditUploading(false);
    }
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
    fd.append('heroImageAlt',editingShoot.heroImageAlt || '');
    try {
      const res = await fetch(`${API_URL}/shoots/${editingShoot._id}/hero`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setEditingShoot(prev => ({ ...prev, heroImage: data.heroImage, heroImageAlt:data.heroImageAlt }));
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
    const altText=(isEdit?editingBlog.altText:blogSeo.altText)?.trim();
    if(!altText){if(isEdit)setEditMsg('Describe the cover image before uploading.');else setError('Describe the cover image before uploading.');e.target.value='';return;}

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
    fd.append('altText',altText);

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
          ...editingBlog,
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
      alert('⚠️ Cover Photo Required: Please select a Cover Photo for the wedding shoot before publishing.');
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
    formData.append('heroImageAlt', `${title} Cover Photo`);
    formData.append('galleryAlt', JSON.stringify(gallery.map(() => '')));

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
      setSuccessModal({
        title: 'Story Published Successfully!',
        subtitle: `"${title}" has been added to your wedding portfolio.`,
        details: `${category} • ${location} • ${date}`,
        galleryCount: gallery.length,
        category: category,
      });

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
        setActiveMode('shoots');
        setShootSubTab('list');
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
          ...blogSeo,
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
      setBlogTitle(''); setBlogContent(''); setBlogSeo({});
      setLoadingBlogs(true); fetchBlogs();
      setTimeout(() => { setActiveMode('blogs'); setBlogSubTab('list'); setSuccess(''); }, 2000);
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
      setTimeout(() => { setActiveMode('testimonials'); setTestimonialSubTab('list'); setSuccess(''); }, 2000);
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
    <div className="admin-root-visual-builder" style={{ minHeight: '100vh', background: '#050505' }}>
      {/* 1. Top Persistent WordPress / Elementor Style Admin Bar */}
      <VisualAdminBar
        currentPage={visualPage}
        onSelectPage={setVisualPage}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        onLogout={handleLogout}
        isSaving={editorSaving}
      />

      {/* Primary Notifications Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'} aria-live={toast.type === 'error' ? 'assertive' : 'polite'} key={toast.id}>
          <span className="admin-toast-icon" aria-hidden="true">{toast.type === 'success' ? '✓' : '!'}</span>
          <div className="admin-toast-copy">
            <strong>{toast.type === 'success' ? 'Done' : 'Please check'}</strong>
            <span>{toast.message}</span>
          </div>
          <button type="button" className="admin-toast-close" aria-label="Dismiss notification" onClick={() => { clearTimeout(toastTimerRef.current); setToast(null); }}>×</button>
        </div>
      )}

      {/* 2. Mode: Visual Live Website Page Viewer (The Exact Website with Hover & Click-to-Edit like WordPress) */}
      {activeMode === 'visual-page' && (
        <VisualPageViewer
          currentPage={visualPage}
          onSelectPage={setVisualPage}
          config={siteConfig}
          shoots={shoots}
          onOpenEditor={openDrawer}
          onQuickDelete={handleQuickDelete}
          onQuickAdd={handleQuickAdd}
          onDirectUploadImage={handleDirectImageUpload}
          onDirectUploadVideo={uploadVideo}
          onUploadShootHero={handleDirectShootHeroUpload}
          onSaveSection={handleDrawerSave}
          onOpenEditShoot={openEditPanel}
          onOpenCreateShoot={() => { setActiveMode('shoots'); setShootSubTab('create'); }}
          onDeleteShoot={handleDelete}
        />
      )}

      {/* 3. Mode: Stories & Galleries Manager */}
      {activeMode === 'shoots' && (
        <div className="dashboard-wrapper container" style={{ marginTop: '70px', padding: '30px 20px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#ffeaa7] uppercase">PORTFOLIO ARCHIVES</span>
              <h2 className="text-2xl font-serif text-white mt-1">Wedding Stories &amp; Galleries</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                type="button"
                onClick={() => setShootSubTab('list')}
                className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  shootSubTab === 'list' 
                    ? 'bg-[#c9b57f] text-black font-bold shadow-sm' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Stories Library ({shoots.length})
              </button>
              <button 
                type="button"
                onClick={() => setShootSubTab('create')}
                className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  shootSubTab === 'create' 
                    ? 'bg-[#c9b57f] text-black font-bold shadow-sm' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                + Publish New Story
              </button>
            </div>
          </div>

          {shootSubTab === 'list' && (
          <div className="tab-content list-tab">
            {loadingList ? (
              <div className="dash-loader">Retrieving archives...</div>
            ) : shoots.length === 0 ? (
              <div className="dash-empty-state">
                <p>No shoots found in database. Create your first portfolio story!</p>
                <button onClick={() => setShootSubTab('create')} className="btn-premium-action">Publish First Story</button>
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
                {shootSubTab === 'create' && (
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
                  rows="4"
                  placeholder="Tell the beautiful story of this capture..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  disabled={uploading}
                />
              </div>

              {/* Uploads row */}
              <div className="form-double-column">
                <div className="input-group-chic upload-box-chic">
                  <label htmlFor="heroImageInput" style={{ fontWeight: 650, color: '#333', marginBottom: '8px' }}>
                    Hero Cover Image (Card Thumbnail) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div className="file-input-wrapper" style={{ cursor: 'pointer', background: heroImage ? '#f0fdf4' : '#fff', border: heroImage ? '2px solid #22c55e' : '2px dashed #bfa36f', padding: '16px 20px', borderRadius: '10px', textAlign: 'center', transition: 'all 0.2s', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                      type="file"
                      id="heroImageInput"
                      accept="image/*"
                      onChange={handleHeroChange}
                      disabled={uploading}
                    />
                    <div className="custom-file-label" style={{ color: heroImage ? '#15803d' : '#6b5329', fontWeight: 650, fontSize: '0.95rem' }}>
                      {heroImage ? `✅ Cover Photo Selected: ${heroImage.name}` : '📷 Click to Choose Cover Photo'}
                    </div>
                  </div>
                </div>

                <div className="input-group-chic upload-box-chic">
                  <label style={{ fontWeight: 650, color: '#333', marginBottom: '8px' }}>
                    Gallery Photos (Optional, up to 50 photos)
                  </label>
                  <div className="gallery-picker-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    <div className="file-input-wrapper" style={{ cursor: 'pointer', background: '#fff', border: '1px solid #c8b99f', padding: '12px 14px', borderRadius: '8px', textAlign: 'center' }}>
                      <input type="file" id="galleryInput" accept="image/*" multiple onChange={handleGalleryChange} disabled={uploading} />
                      <div className="custom-file-label" style={{ color: '#5f543f', fontWeight: 650, fontSize: '0.9rem' }}>
                        🖼️ Choose Photos
                      </div>
                    </div>
                    <div className="file-input-wrapper" style={{ cursor: 'pointer', background: '#fff', border: '1px solid #c8b99f', padding: '12px 14px', borderRadius: '8px', textAlign: 'center' }}>
                      <input type="file" id="galleryFolderInput" accept="image/*" multiple webkitdirectory="" directory="" onChange={handleGalleryChange} disabled={uploading} />
                      <div className="custom-file-label" style={{ color: '#5f543f', fontWeight: 650, fontSize: '0.9rem' }}>
                        📁 Choose Photo Folder
                      </div>
                    </div>
                  </div>
                  {gallery.length > 0 && (
                    <p className="selected-gallery-count" style={{ color: '#15803d', fontWeight: 650, marginTop: '8px', fontSize: '0.9rem' }}>
                      ✅ {gallery.length} photo{gallery.length === 1 ? '' : 's'} ready to upload
                    </p>
                  )}
                </div>
              </div>

              {uploading && (
                <div className="upload-progress-card" style={{ padding: '20px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', marginTop: '16px', textAlign: 'center' }}>
                  <div className="progress-spinner"></div>
                  <p className="progress-text" style={{ color: '#854d0e', fontWeight: 600 }}>{uploadProgress}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn-premium-submit"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b89325 100%)',
                  color: '#111',
                  fontWeight: 750,
                  fontSize: '1.05rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(212,175,55,0.35)',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  marginTop: '24px',
                  transition: 'all 0.25s ease'
                }}
                disabled={uploading}
              >
                {uploading ? '⏳ Processing & Uploading...' : '✨ Publish Story Archive'}
              </button>
            </form>
                  </div>
                )}
        </div>
      )}

      {/* 4. Mode: Journal Articles Manager */}
      {activeMode === 'blogs' && (
        <div className="dashboard-wrapper container" style={{ marginTop: '70px', padding: '30px 20px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#ffeaa7] uppercase">EDITORIAL JOURNAL</span>
              <h2 className="text-2xl font-serif text-white mt-1">Behind The Scenes &amp; Artistry</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                type="button"
                onClick={() => setBlogSubTab('list')}
                className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  blogSubTab === 'list' 
                    ? 'bg-[#c9b57f] text-black font-bold shadow-sm' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Published Articles ({blogs.length})
              </button>
              <button 
                type="button"
                onClick={() => setBlogSubTab('create')}
                className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  blogSubTab === 'create' 
                    ? 'bg-[#c9b57f] text-black font-bold shadow-sm' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                + Write New Article
              </button>
            </div>
          </div>

                {/* Tab content 3: Blogs List */}
                {blogSubTab === 'list' && (
                  <div className="tab-content list-tab">
                    {loadingBlogs ? (
                      <div className="dash-loader">Retrieving blog articles...</div>
                    ) : blogs.length === 0 ? (
                      <div className="dash-empty-state">
                        <p>No blog articles published yet. Write your first behind-the-scenes piece!</p>
                        <button onClick={() => setBlogSubTab('create')} className="btn-premium-action">Write First Blog</button>
                      </div>
                    ) : (
              <div className="admin-shoots-grid">
                {blogs.map((blog) => (
                  <div key={blog._id} className="admin-shoot-card">
                    <div className="card-thumbnail-wrapper">
                      <img src={(editingBlog?._id === blog._id ? editingBlog.coverImageUrl : blog.coverImageUrl) || "/common/_DSC3521_-_Copy.webp"} alt={blog.title} />
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
                {blogSubTab === 'create' && (
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

              <SeoFields value={blogSeo} onChange={setBlogSeo} image author />
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
        </div>
      )}

      {/* 5. Mode: Testimonials Manager */}
      {activeMode === 'testimonials' && (
        <div className="dashboard-wrapper container" style={{ marginTop: '70px', padding: '30px 20px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-semibold tracking-widest text-[#ffeaa7] uppercase">KIND WORDS</span>
                    <h2 className="text-2xl font-serif text-white mt-1">Client Testimonials &amp; Love</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      type="button"
                      onClick={() => setTestimonialSubTab('list')}
                      className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                        testimonialSubTab === 'list' 
                          ? 'bg-[#c9b57f] text-black font-bold shadow-sm' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      All Testimonials ({testimonials.length})
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTestimonialSubTab('create')}
                      className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                        testimonialSubTab === 'create' 
                          ? 'bg-[#c9b57f] text-black font-bold shadow-sm' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      + Add Testimonial
                    </button>
                  </div>
                </div>

                {/* Tab content 5: Testimonials List */}
                {testimonialSubTab === 'list' && (
                  <div className="tab-content list-tab">
                    {loadingTestimonials ? (
                      <div className="dash-loader">Retrieving testimonials...</div>
                    ) : testimonials.length === 0 ? (
                      <div className="dash-empty-state">
                        <p>No testimonials found in database. Add your first testimonial!</p>
                        <button onClick={() => setTestimonialSubTab('create')} className="btn-premium-action">Add First Testimonial</button>
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
                {testimonialSubTab === 'create' && (
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
        </div>
      )}

      {/* 6. Slide-out Visual Editor Drawer for Any Section */}
      <VisualEditorDrawer
        isOpen={drawerState.isOpen}
        onClose={closeDrawer}
        sectionKey={drawerState.sectionKey}
        title={drawerState.title}
        subtitle={drawerState.subtitle}
        initialData={drawerState.initialData}
        onSave={handleDrawerSave}
        onUploadImage={uploadImage}
        onUploadVideo={uploadVideo}
        isSaving={editorSaving}
      />

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
              <div className="form-double-column" style={{ marginBottom: '15px' }}>
                <div className="input-group-chic">
                  <label>Couple Names (Title)</label>
                  <input
                    type="text"
                    value={editingShoot.title || ''}
                    onChange={(e) => setEditingShoot(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Naveen & Swetha"
                    disabled={editUploading}
                  />
                </div>
                <div className="input-group-chic">
                  <label>Category</label>
                  <select
                    value={editingShoot.category || 'Wedding'}
                    onChange={(e) => setEditingShoot(prev => ({ ...prev, category: e.target.value }))}
                    disabled={editUploading}
                    className="select-chic"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-wedding">Pre-wedding</option>
                    <option value="Candid">Candid</option>
                    <option value="Cinematic Film">Cinematic Film</option>
                  </select>
                </div>
              </div>

              <div className="form-double-column" style={{ marginBottom: '15px' }}>
                <div className="input-group-chic">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editingShoot.location || ''}
                    onChange={(e) => setEditingShoot(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Hyderabad"
                    disabled={editUploading}
                  />
                </div>
                <div className="input-group-chic">
                  <label>Date</label>
                  <input
                    type="text"
                    value={editingShoot.date || ''}
                    onChange={(e) => setEditingShoot(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g., Jan 2026"
                    disabled={editUploading}
                  />
                </div>
              </div>

              <div className="input-group-chic" style={{ marginBottom: '20px' }}>
                <label>The Narrative Story</label>
                <textarea
                  rows="4"
                  value={editingShoot.desc || editingShoot.narrative || ''}
                  onChange={(e) => setEditingShoot(prev => ({ ...prev, desc: e.target.value, narrative: e.target.value }))}
                  placeholder="Tell the beautiful story of this capture..."
                  disabled={editUploading}
                />
              </div>

              <button
                type="button"
                className="btn-premium-submit"
                style={{ width: '100%', marginBottom: '30px', padding: '14px', background: '#e0c075', color: '#111', fontWeight: 600 }}
                disabled={editUploading}
                onClick={saveShootMetadata}
              >
                {editUploading ? 'Saving Story Details...' : 'Save Story Details'}
              </button>

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
                  These images populate the scrollable narrative collection. Remove an image with ✕, or add up to 50 images from individual files or a folder in each batch.
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
                  <label className={`gallery-add-btn ${editUploading ? 'disabled' : ''}`} style={{ minHeight: '130px' }}>
                    <span>▧</span>
                    <small>Add Folder</small>
                    <input type="file" accept="image/*" multiple webkitdirectory="" directory="" hidden onChange={handleAddGalleryImages} disabled={editUploading} />
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

              <SeoFields value={editingBlog} onChange={setEditingBlog} image author />
              {/* Cover Image */}
              <div className="edit-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '25px', marginBottom: '25px' }}>
                <label className="edit-section-label">Cover Image</label>
                <div className="hero-preview-row">
                  <img src={editingBlog.coverImageUrl || "/common/_DSC3521_-_Copy.webp"} alt="cover" className="hero-thumb-edit" style={{ width: '160px', height: '100px', borderRadius: '4px' }} />
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

      {/* Luxury Success Popup Modal */}
      {successModal && (
        <div className="confirm-modal-overlay" style={{ zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSuccessModal(null)}>
          <div
            className="confirm-modal-content"
            style={{
              textAlign: 'center',
              maxWidth: '450px',
              width: '90%',
              padding: '38px 28px',
              border: '1px solid rgba(212,175,55,0.4)',
              background: '#191714',
              color: '#fff',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '2px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', color: '#d4af37' }}>
              ✓
            </div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              PUBLISHED & LIVE
            </span>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0 0 10px', color: '#fff' }}>
              {successModal.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#dcd3c3', margin: '0 0 8px', lineHeight: 1.5 }}>
              {successModal.subtitle}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#a89c8a', margin: '0 0 24px' }}>
              {successModal.details} {successModal.galleryCount > 0 ? `• ${successModal.galleryCount} gallery photos` : ''}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                style={{ padding: '12px 24px', background: '#d4af37', color: '#111', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.92rem' }}
                onClick={() => {
                  setSuccessModal(null);
                  setActiveMode('visual-page');
                  setVisualPage(successModal.category === 'Pre-wedding' ? 'portfolio-pre-wedding' : 'portfolio-wedding');
                }}
              >
                View in Gallery
              </button>
              <button
                type="button"
                style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.92rem' }}
                onClick={() => setSuccessModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
