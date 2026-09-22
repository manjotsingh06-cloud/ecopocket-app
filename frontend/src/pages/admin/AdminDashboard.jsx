import { useEffect, useState } from 'react';
import Reveal from '../../components/ui/Reveal';
import api from '../../api/axios';
import { formatPrice } from '../../data/products';
import {
  FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiImage,
  FiUser, FiMail, FiStar, FiLoader, FiUpload,
} from 'react-icons/fi';

const TABS = ['Products', 'Analytics', 'Users', 'Messages', 'Testimonials', 'Blogs', 'Gallery', 'Newsletter'];

// Must match the allowed values in backend/models/Product.js
const CATEGORIES = [
  'Sandwich Pocket', 'Chapati Pocket', 'Lunch Wrap', 'Snack Bag', 'Bread Bag',
  'Fruit Pocket', 'Bottle Sleeve', 'Coffee Cup Sleeve', 'Cutlery Holder', 'Picnic Organizer',
  'Tiffin Tote', 'Produce Bag', 'Food Wrap', 'Casserole Cover', 'Travel Pouch',
];
const FABRICS = ['Organic Cotton', 'Hemp', 'Linen', 'Recycled Cotton'];
const PATTERNS = ['Diamond', 'Square', 'Wave', 'Plain'];
const MESSAGE_STATUSES = ['new', 'read', 'replied'];

// Must match backend model enums
const BLOG_CATEGORIES = ['Sustainable Living', 'Textile Innovation', 'Eco Friendly Fashion', 'Quilting Techniques', 'Zero Waste Dining'];
const GALLERY_CATEGORIES = ['Product Images', 'Manufacturing', 'Quilting', 'Lifestyle', 'Fabric Textures', 'Workshop'];

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest text-xs';

const emptyForm = () => ({
  isNew: true,
  name: '',
  slug: '',
  category: 'Sandwich Pocket',
  fabric: 'Organic Cotton',
  quiltingPattern: 'Diamond',
  price: '',
  stock: 50,
  ecoScore: 85,
  description: '',
  materialComposition: '',
  careInstructions: '',
  usageInstructions: '',
  features: '',
  isFeatured: false,
  imageUrls: [''],
});

const toForm = (p) => ({
  isNew: false,
  _id: p._id,
  name: p.name,
  slug: p.slug || '',
  category: p.category,
  fabric: p.fabric,
  quiltingPattern: p.quiltingPattern || 'Diamond',
  price: p.price,
  stock: p.stock ?? 50,
  ecoScore: p.ecoScore ?? 85,
  description: p.description || '',
  materialComposition: p.materialComposition || '',
  careInstructions: p.careInstructions || '',
  usageInstructions: p.usageInstructions || '',
  features: Array.isArray(p.features) ? p.features.join(', ') : '',
  isFeatured: !!p.isFeatured,
  imageUrls: p.images && p.images.length ? p.images.map((img) => img.url) : [''],
});

const emptyBlogForm = () => ({
  isNew: true,
  title: '',
  slug: '',
  category: 'Sustainable Living',
  excerpt: '',
  content: '',
  coverImage: '',
  published: true,
});

const toBlogForm = (b) => ({
  isNew: false,
  _id: b._id,
  title: b.title,
  slug: b.slug || '',
  category: b.category,
  excerpt: b.excerpt,
  content: b.content,
  coverImage: (b.coverImage && b.coverImage.url) || '',
  published: !!b.published,
});

export default function AdminDashboard() {
  const [tab, setTab] = useState('Products');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [blogForm, setBlogForm] = useState(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ imageUrl: '', category: 'Product Images', caption: '', file: null });
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const refreshAnalytics = () =>
    api.get('/admin/analytics').then((res) => setAnalytics(res.data.analytics)).catch(() => {});

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products?limit=200').then((res) => setProducts(res.data.products || [])).finally(() => setLoading(false));
  };
  const fetchUsers = () => api.get('/admin/users').then((res) => setUsers(res.data.users || [])).catch(() => {});
  const fetchTestimonials = () => api.get('/admin/testimonials').then((res) => setTestimonials(res.data.testimonials || [])).catch(() => {});
  const fetchMessages = () => api.get('/contact').then((res) => setMessages(res.data.messages || [])).catch(() => {});
  const fetchBlogs = () => api.get('/admin/blogs').then((res) => setBlogs(res.data.blogs || [])).catch(() => {});
  const fetchGallery = () => api.get('/gallery').then((res) => setGallery(res.data.items || [])).catch(() => {});
  const fetchSubscribers = () => api.get('/newsletter').then((res) => setSubscribers(res.data.subscribers || [])).catch(() => {});

  useEffect(() => {
    refreshAnalytics();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (tab === 'Users') fetchUsers();
    if (tab === 'Messages') fetchMessages();
    if (tab === 'Testimonials') fetchTestimonials();
    if (tab === 'Blogs') fetchBlogs();
    if (tab === 'Gallery') fetchGallery();
    if (tab === 'Newsletter') fetchSubscribers();
  }, [tab]);

  const openNew = () => setProductForm(emptyForm());
  const openEdit = (p) => setProductForm(toForm(p));
  const setField = (key, value) => setProductForm((f) => ({ ...f, [key]: value }));

  const addImageRow = () => setProductForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ''] }));
  const removeImageRow = (i) => setProductForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== i) }));

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const f = productForm;
    if (!f.imageUrls.some((u) => u && u.trim())) {
      alert('Add at least one image URL before saving.');
      return;
    }
    setSaving(true);
    const payload = {
      name: f.name.trim(),
      slug: (f.slug || slugify(f.name)).trim(),
      category: f.category,
      fabric: f.fabric,
      quiltingPattern: f.quiltingPattern,
      price: Number(f.price),
      stock: Number(f.stock || 0),
      ecoScore: Number(f.ecoScore || 0),
      description: f.description.trim(),
      materialComposition: f.materialComposition.trim(),
      careInstructions: f.careInstructions.trim(),
      usageInstructions: f.usageInstructions.trim(),
      features: f.features.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: !!f.isFeatured,
      images: f.imageUrls.filter((u) => u && u.trim()).map((url) => ({ url: url.trim() })),
    };
    try {
      if (f.isNew) {
        await api.post('/products', payload);
        showToast('Product created successfully!');
      } else {
        await api.put(`/products/${f._id}`, payload);
        showToast('Product updated successfully!');
      }
      setProductForm(null);
      fetchProducts();
      refreshAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      showToast('Product deleted.');
      fetchProducts();
      refreshAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleRoleToggle = async (u) => {
    const next = u.role === 'admin' ? 'user' : 'admin';
    if (u.email === 'admin@ecopocket.com' && next === 'user') {
      alert('You cannot demote the primary admin account.');
      return;
    }
    try {
      await api.put(`/admin/users/${u._id}/role`, { role: next });
      showToast(`${u.name} is now ${next}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleApproveTestimonial = async (t, approved) => {
    try {
      await api.put(`/testimonials/${t._id}/approve`, { approved });
      showToast(`Testimonial ${approved ? 'approved' : 'unapproved'}.`);
      fetchTestimonials();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update testimonial.');
    }
  };

  const handleDeleteTestimonial = async (t) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${t._id}`);
      showToast('Testimonial deleted.');
      fetchTestimonials();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete testimonial.');
    }
  };

  const handleMessageStatus = async (m, status) => {
    try {
      await api.put(`/contact/${m._id}/status`, { status });
      setMessages((ms) => ms.map((x) => (x._id === m._id ? { ...x, status } : x)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update message status.');
    }
  };

  const setBlogField = (key, value) => setBlogForm((f) => ({ ...f, [key]: value }));

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setSavingBlog(true);
    const f = blogForm;
    const payload = {
      title: f.title.trim(),
      slug: (f.slug || slugify(f.title)).trim(),
      category: f.category,
      excerpt: f.excerpt.trim(),
      content: f.content.trim(),
      published: !!f.published,
      ...(f.coverImage.trim() ? { coverImage: { url: f.coverImage.trim() } } : {}),
    };
    try {
      if (f.isNew) {
        await api.post('/blogs', payload);
        showToast('Blog post created!');
      } else {
        await api.put(`/blogs/${f._id}`, payload);
        showToast('Blog post updated!');
      }
      setBlogForm(null);
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save blog post.');
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (b) => {
    if (!window.confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/blogs/${b._id}`);
      showToast('Blog post deleted.');
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog post.');
    }
  };

  const setGalleryField = (key, value) => setGalleryForm((f) => ({ ...f, [key]: value }));

  const handleAddGallery = async () => {
    const fd = new FormData();
    fd.append('category', galleryForm.category);
    fd.append('caption', galleryForm.caption);
    if (galleryForm.file) {
      fd.append('image', galleryForm.file);
    } else if (galleryForm.imageUrl.trim()) {
      fd.append('imageUrl', galleryForm.imageUrl.trim());
    } else {
      alert('Choose a file or paste an image URL first.');
      return;
    }
    try {
      await api.post('/gallery', fd);
      showToast('Gallery item added!');
      setGalleryForm({ imageUrl: '', category: 'Product Images', caption: '', file: null });
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add gallery item.');
    }
  };

  const handleDeleteGallery = async (item) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      await api.delete(`/gallery/${item._id}`);
      showToast('Gallery item deleted.');
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete gallery item.');
    }
  };

  const handleUploadProductImage = async (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    if (!productForm || productForm.isNew || !productForm._id) {
      alert('Save the product first, then use "Upload image" to add files from your computer.');
      return;
    }
    const existing = new Set(productForm.imageUrls.map((u) => (u || '').trim()).filter(Boolean));
    setUploadingImage(true);
    const fd = new FormData();
    list.forEach((fl) => fd.append('images', fl));
    try {
      const res = await api.post(`/products/${productForm._id}/images`, fd);
      const urls = (res.data.images || []).map((img) => img.url).filter((u) => u && !existing.has(u));
      setProductForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((u) => u && u.trim()).concat(urls) }));
      showToast(`${urls.length} image(s) uploaded and attached.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="mb-10">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-2">Admin</p>
          <h1 className="font-display font-bold text-3xl text-forest dark:text-sage-soft">Website Dashboard</h1>
        </Reveal>

        {toast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <FiCheck size={16} /> {toast}
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-5 py-2.5 rounded-full border transition-all font-semibold ${
                tab === t
                  ? 'bg-forest text-cream border-forest shadow-md dark:bg-white dark:text-forest dark:border-white'
                  : 'border-forest/20 dark:border-white/20 opacity-75 hover:opacity-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Reveal delay={0.05} className="glass rounded-3xl p-6 sm:p-8 min-h-[360px] border border-forest/15 dark:border-white/10 shadow-xl">
          {/* TAB 1: PRODUCTS MANAGER (FULL CRUD) */}
          {tab === 'Products' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-forest dark:text-cream">Product Catalog Manager</h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Add, edit (image, price, stock, details) or delete products. Changes appear on the storefront instantly.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-forest/10 dark:bg-white/10">
                    {products.length} Products
                  </span>
                  <button
                    onClick={openNew}
                    className="px-4 py-2 rounded-full bg-earth text-cream text-xs font-bold shadow hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                  >
                    <FiPlus size={14} /> New Product
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-xs opacity-60 py-12 text-center inline-flex items-center gap-2 justify-center w-full">
                  <FiLoader className="animate-spin" size={14} /> Loading products from database...
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-forest/10 dark:border-white/10 opacity-60">
                        <th className="pb-3 font-semibold">Image</th>
                        <th className="pb-3 font-semibold">Name</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Fabric</th>
                        <th className="pb-3 font-semibold">Price</th>
                        <th className="pb-3 font-semibold">Stock</th>
                        <th className="pb-3 font-semibold">Featured</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest/5 dark:divide-white/5">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-forest/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4">
                            <img
                              src={p.images?.[0]?.url || '/images/products/quilted-sandwich-pocket.jpg'}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-forest/10"
                            />
                          </td>
                          <td className="py-3 pr-4 font-bold text-forest dark:text-cream">{p.name}</td>
                          <td className="py-3 pr-4 opacity-75">{p.category}</td>
                          <td className="py-3 pr-4 opacity-75">{p.fabric}</td>
                          <td className="py-3 pr-4 font-bold text-earth">{formatPrice(p.price)}</td>
                          <td className="py-3 pr-4">{p.stock}</td>
                          <td className="py-3 pr-4">{p.isFeatured ? <span className="text-earth">★</span> : <span className="opacity-30">—</span>}</td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEdit(p)}
                              className="px-3 py-1.5 rounded-full bg-earth text-cream font-bold text-[11px] shadow hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 mr-2"
                            >
                              <FiEdit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="px-3 py-1.5 rounded-full bg-red-600/90 text-cream font-bold text-[11px] shadow hover:bg-red-600 transition-colors inline-flex items-center gap-1.5"
                            >
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALYTICS */}
          {tab === 'Analytics' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
              {analytics ? (
                Object.entries(analytics).map(([k, v]) => (
                  <div key={k} className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-forest/10 text-center shadow-sm">
                    <p className="font-display font-extrabold text-4xl text-forest dark:text-sage-soft">{v}</p>
                    <p className="text-xs opacity-60 mt-2 capitalize font-semibold">{k.replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                ))
              ) : (
                <p className="opacity-60 col-span-4 text-sm text-center">Loading analytics...</p>
              )}
            </div>
          )}

          {/* TAB 3: USERS */}
          {tab === 'Users' && (
            <div>
              <h3 className="font-display font-bold text-xl text-forest dark:text-cream mb-1">User Accounts</h3>
              <p className="text-xs opacity-70 mb-6">Manage roles. Admins can access this dashboard and manage the site.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-forest/10 dark:border-white/10 opacity-60">
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Verified</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/5 dark:divide-white/5">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-forest/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-bold text-forest dark:text-cream">
                          <FiUser size={13} className="inline mr-1 opacity-50" /> {u.name}
                        </td>
                        <td className="py-3 pr-4 opacity-75">{u.email}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-earth/15 text-earth' : 'bg-forest/10'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {u.isEmailVerified ? <span className="text-emerald-600 font-semibold">Verified</span> : <span className="opacity-40">Unverified</span>}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleRoleToggle(u)}
                            className="px-3 py-1.5 rounded-full border border-forest/25 dark:border-white/20 text-[11px] font-bold hover:bg-forest/5 transition-colors"
                          >
                            {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {tab === 'Messages' && (
            <div>
              <h3 className="font-display font-bold text-xl text-forest dark:text-cream mb-1">Contact Messages</h3>
              <p className="text-xs opacity-70 mb-6">Messages from the contact form. Update their status as you work through them.</p>
              {messages.length === 0 ? (
                <p className="text-xs opacity-60 py-12 text-center">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={`p-4 rounded-2xl border ${m.status === 'new' ? 'border-earth/30 bg-earth/5' : 'border-forest/10 bg-white/40 dark:bg-white/5'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <FiMail className="opacity-60" size={13} />
                          <span className="text-forest dark:text-cream">{m.name}</span>
                          <span className="opacity-50 font-normal">({m.email})</span>
                        </div>
                        <select
                          value={m.status}
                          onChange={(e) => handleMessageStatus(m, e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5"
                        >
                          {MESSAGE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      {m.subject && <p className="text-xs font-semibold opacity-70 mb-1">{m.subject}</p>}
                      <p className="text-xs opacity-80 leading-relaxed">{m.message}</p>
                      <p className="text-[10px] opacity-40 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {tab === 'Testimonials' && (
            <div>
              <h3 className="font-display font-bold text-xl text-forest dark:text-cream mb-1">Testimonials & Reviews</h3>
              <p className="text-xs opacity-70 mb-6">Approve or remove customer reviews. Only approved ones appear on the site.</p>
              {testimonials.length === 0 ? (
                <p className="text-xs opacity-60 py-12 text-center">No testimonials yet.</p>
              ) : (
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div
                      key={t._id}
                      className={`p-4 rounded-2xl border ${t.approved ? 'border-forest/10 bg-white/40 dark:bg-white/5' : 'border-earth/40 bg-earth/5'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="pr-4 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-forest dark:text-cream">
                              <FiUser size={12} className="inline mr-1 opacity-60" /> {t.name}
                            </span>
                            {t.role && <span className="text-[10px] opacity-50">— {t.role}</span>}
                            <span className="text-earth text-[11px] font-bold inline-flex items-center gap-0.5 ml-1">
                              {Array.from({ length: Math.min(t.rating || 5, 5) }).map((_, i) => <FiStar key={i} size={11} />)}
                            </span>
                          </div>
                          <p className="text-xs opacity-80 leading-relaxed">{t.text}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {t.approved ? (
                            <button
                              onClick={() => handleApproveTestimonial(t, false)}
                              className="px-3 py-1.5 rounded-full border border-forest/25 dark:border-white/20 text-[11px] font-bold hover:bg-forest/5 transition-colors"
                            >
                              Unapprove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproveTestimonial(t, true)}
                              className="px-3 py-1.5 rounded-full bg-forest text-cream text-[11px] font-bold shadow hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                            >
                              <FiCheck size={12} /> Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTestimonial(t)}
                            className="px-3 py-1.5 rounded-full bg-red-600/90 text-cream text-[11px] font-bold shadow hover:bg-red-600 transition-colors inline-flex items-center gap-1.5"
                          >
                            <FiTrash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BLOGS */}
          {tab === 'Blogs' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-forest dark:text-cream">Blog Editor</h3>
                  <p className="text-xs opacity-70 mt-0.5">Write, edit, publish or unpublish articles.</p>
                </div>
                <button
                  onClick={() => setBlogForm(emptyBlogForm())}
                  className="px-4 py-2 rounded-full bg-earth text-cream text-xs font-bold shadow hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                >
                  <FiPlus size={14} /> New Post
                </button>
              </div>
              {blogs.length === 0 ? (
                <p className="text-xs opacity-60 py-12 text-center">No blog posts yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-forest/10 dark:border-white/10 opacity-60">
                        <th className="pb-3 font-semibold">Title</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Author</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest/5 dark:divide-white/5">
                      {blogs.map((b) => (
                        <tr key={b._id} className="hover:bg-forest/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 font-bold text-forest dark:text-cream">{b.title}</td>
                          <td className="py-3 pr-4 opacity-75">{b.category}</td>
                          <td className="py-3 pr-4">
                            {b.published ? <span className="text-emerald-600 font-semibold">Published</span> : <span className="text-earth font-semibold">Draft</span>}
                          </td>
                          <td className="py-3 pr-4 opacity-75">{b.author?.name || '—'}</td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => setBlogForm(toBlogForm(b))}
                              className="px-3 py-1.5 rounded-full bg-earth text-cream font-bold text-[11px] shadow hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 mr-2"
                            >
                              <FiEdit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b)}
                              className="px-3 py-1.5 rounded-full bg-red-600/90 text-cream font-bold text-[11px] shadow hover:bg-red-600 transition-colors inline-flex items-center gap-1.5"
                            >
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {tab === 'Gallery' && (
            <div>
              <h3 className="font-display font-bold text-xl text-forest dark:text-cream mb-1">Gallery Manager</h3>
              <p className="text-xs opacity-70 mb-6">Upload an image from your computer, or paste a URL to add it.</p>
              <div className="p-4 rounded-2xl border border-forest/15 dark:border-white/10 bg-white/40 dark:bg-white/5 mb-6 space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <input type="file" accept="image/*" className="text-xs" onChange={(e) => setGalleryField('file', e.target.files?.[0] || null)} />
                  <input type="text" value={galleryForm.imageUrl} onChange={(e) => setGalleryField('imageUrl', e.target.value)} placeholder="...or paste an image URL" className={inputCls} />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <select value={galleryForm.category} onChange={(e) => setGalleryField('category', e.target.value)} className="flex-1 min-w-[160px] px-3.5 py-2 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 text-xs">
                    {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" value={galleryForm.caption} onChange={(e) => setGalleryField('caption', e.target.value)} placeholder="Caption (optional)" className="flex-1 min-w-[160px] px-3.5 py-2 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 text-xs" />
                  <button onClick={handleAddGallery} className="px-4 py-2 rounded-xl bg-earth text-cream text-xs font-bold shadow hover:opacity-90 inline-flex items-center gap-1.5 shrink-0">
                    <FiPlus size={13} /> Add
                  </button>
                </div>
              </div>
              {gallery.length === 0 ? (
                <p className="text-xs opacity-60 py-12 text-center">No gallery items yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {gallery.map((item) => (
                    <div key={item._id} className="group relative rounded-2xl overflow-hidden border border-forest/10 bg-white/30">
                      <img src={item.image?.url} alt={item.caption || item.category} className="w-full h-28 object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] py-1 px-2 text-cream opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.caption || item.category}
                        <button onClick={() => handleDeleteGallery(item)} className="underline ml-1 hover:opacity-80">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: NEWSLETTER */}
          {tab === 'Newsletter' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-forest dark:text-cream">Newsletter Subscribers</h3>
                  <p className="text-xs opacity-70 mt-0.5">Everyone who subscribed to the newsletter.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-forest/10 dark:bg-white/10">
                  {subscribers.filter((s) => s.active).length} Active / {subscribers.length} Total
                </span>
              </div>
              {subscribers.length === 0 ? (
                <p className="text-xs opacity-60 py-12 text-center">No subscribers yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-forest/10 dark:border-white/10 opacity-60">
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Subscribed</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest/5 dark:divide-white/5">
                      {subscribers.map((s) => (
                        <tr key={s._id} className="hover:bg-forest/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 font-bold text-forest dark:text-cream">{s.email}</td>
                          <td className="py-3 pr-4 opacity-75">{new Date(s.subscribedAt || s.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 pr-4">
                            {s.active ? <span className="text-emerald-600 font-semibold">Active</span> : <span className="opacity-40">Unsubscribed</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </Reveal>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {productForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#10251B] border border-forest/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-forest/10 dark:border-white/10 pb-4">
              <h3 className="font-display font-bold text-base text-forest dark:text-cream">
                {productForm.isNew ? 'New Product' : 'Edit Product & Images'}
              </h3>
              <button onClick={() => setProductForm(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="e.g. Quilted Sandwich Pocket"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Slug</label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    onBlur={(e) => { if (!e.target.value) setField('slug', slugify(productForm.name)); }}
                    placeholder="auto-generated from name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Price (₹)</label>
                  <input type="number" required min="0" value={productForm.price}
                    onChange={(e) => setField('price', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Stock</label>
                  <input type="number" min="0" value={productForm.stock}
                    onChange={(e) => setField('stock', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Eco Score</label>
                  <input type="number" min="0" max="100" value={productForm.ecoScore}
                    onChange={(e) => setField('ecoScore', e.target.value)} className={inputCls} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer opacity-80">
                    <input type="checkbox" checked={productForm.isFeatured}
                      onChange={(e) => setField('isFeatured', e.target.checked)}
                      className="accent-earth w-4 h-4" /> Featured
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Category</label>
                  <select value={productForm.category} onChange={(e) => setField('category', e.target.value)} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Fabric</label>
                  <select value={productForm.fabric} onChange={(e) => setField('fabric', e.target.value)} className={inputCls}>
                    {FABRICS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Quilting Pattern</label>
                  <select value={productForm.quiltingPattern} onChange={(e) => setField('quiltingPattern', e.target.value)} className={inputCls}>
                    {PATTERNS.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>
              {/* ----DESC-SECTION---- */}
              <div>
                <label className="block font-semibold mb-1 opacity-80">Description</label>
                <textarea
                  required
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setField('description', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Material Composition</label>
                  <input
                    type="text"
                    value={productForm.materialComposition}
                    onChange={(e) => setField('materialComposition', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Care Instructions</label>
                  <input
                    type="text"
                    value={productForm.careInstructions}
                    onChange={(e) => setField('careInstructions', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Usage Instructions</label>
                <input
                  type="text"
                  value={productForm.usageInstructions}
                  onChange={(e) => setField('usageInstructions', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Features (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.features}
                  onChange={(e) => setField('features', e.target.value)}
                  placeholder="e.g. Leak-resistant, Machine washable"
                  className={inputCls}
                />
              </div>
              {/* ----IMAGE-MANAGER---- */}
              <div>
                <label className="block font-semibold mb-1 opacity-80 inline-flex items-center gap-2">
                  <FiImage size={14} /> Images
                  <span className="text-[10px] opacity-60">
                    ({productForm.imageUrls.filter((u) => u && u.trim()).length} saved)
                  </span>
                </label>
                <div className="space-y-2">
                  {productForm.imageUrls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setField('imageUrls', productForm.imageUrls.map((u, idx) => (idx === i ? e.target.value : u)))}
                        placeholder="/images/products/your-file.jpg or https://..."
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageRow(i)}
                        disabled={productForm.imageUrls.length === 1}
                        className="p-2.5 rounded-xl border border-forest/20 dark:border-white/15 disabled:opacity-30 hover:bg-forest/5 shrink-0"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageRow}
                    className="px-3.5 py-2 rounded-xl border border-dashed border-forest/30 text-[11px] font-semibold inline-flex items-center gap-1.5 hover:bg-forest/5"
                  >
                    <FiPlus size={12} /> Add another image
                  </button>
                  {!productForm.isNew && (
                    <label className="px-3.5 py-2 rounded-xl border border-dashed border-earth/40 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-earth/5">
                      <FiUpload size={12} /> {uploadingImage ? 'Uploading...' : 'Upload image from computer'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => { handleUploadProductImage(e.target.files); e.target.value = ''; }}
                      />
                    </label>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 p-3 rounded-xl bg-forest/5 dark:bg-white/5 border border-forest/10 overflow-x-auto">
                  {productForm.imageUrls.filter((u) => u && u.trim()).map((u, idx) => (
                    <img
                      key={idx}
                      src={u.trim()}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-forest/10 shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ))}
                  <span className="text-[11px] font-semibold opacity-70 whitespace-nowrap">Live Preview</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-forest/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setProductForm(null)}
                  className="flex-1 py-3 rounded-full border border-forest/20 text-xs font-semibold hover:bg-forest/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-full bg-forest text-cream text-xs font-bold shadow hover:bg-earth transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {saving ? <><FiLoader className="animate-spin" size={13} /> Saving...</> : (productForm.isNew ? 'Create Product' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG CREATE / EDIT MODAL */}
      {blogForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#10251B] border border-forest/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-forest/10 dark:border-white/10 pb-4">
              <h3 className="font-display font-bold text-base text-forest dark:text-cream">
                {blogForm.isNew ? 'New Blog Post' : 'Edit Blog Post'}
              </h3>
              <button onClick={() => setBlogForm(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Title</label>
                  <input type="text" required value={blogForm.title} onChange={(e) => setBlogField('title', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Slug</label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogField('slug', e.target.value)}
                    onBlur={(e) => { if (!e.target.value) setBlogField('slug', slugify(blogForm.title)); }}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Category</label>
                  <select value={blogForm.category} onChange={(e) => setBlogField('category', e.target.value)} className={inputCls}>
                    {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer opacity-80">
                    <input type="checkbox" checked={blogForm.published} onChange={(e) => setBlogField('published', e.target.checked)} className="accent-earth w-4 h-4" /> Publish (visible on site)
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Cover Image URL</label>
                <input type="text" value={blogForm.coverImage} onChange={(e) => setBlogField('coverImage', e.target.value)} placeholder="/images/... or https://..." className={inputCls} />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Excerpt</label>
                <input type="text" required value={blogForm.excerpt} onChange={(e) => setBlogField('excerpt', e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Content</label>
                <textarea required rows={6} value={blogForm.content} onChange={(e) => setBlogField('content', e.target.value)} className={inputCls} />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-forest/10 dark:border-white/10">
                <button type="button" onClick={() => setBlogForm(null)} className="flex-1 py-3 rounded-full border border-forest/20 text-xs font-semibold hover:bg-forest/5">
                  Cancel
                </button>
                <button type="submit" disabled={savingBlog} className="flex-1 py-3 rounded-full bg-forest text-cream text-xs font-bold shadow hover:bg-earth transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  {savingBlog ? <><FiLoader className="animate-spin" size={13} /> Saving...</> : (blogForm.isNew ? 'Publish Post' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}