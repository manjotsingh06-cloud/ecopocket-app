import { useEffect, useState } from 'react';
import Reveal from '../../components/ui/Reveal';
import api from '../../api/axios';
import { formatPrice } from '../../data/products';
import {
  FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiImage,
  FiUsers, FiUser, FiMail, FiStar, FiLoader,
} from 'react-icons/fi';

const TABS = ['Products', 'Analytics', 'Users', 'Messages', 'Testimonials'];

// Must match the allowed values in backend/models/Product.js
const CATEGORIES = [
  'Sandwich Pocket', 'Chapati Pocket', 'Lunch Wrap', 'Snack Bag', 'Bread Bag',
  'Fruit Pocket', 'Bottle Sleeve', 'Coffee Cup Sleeve', 'Cutlery Holder', 'Picnic Organizer',
  'Tiffin Tote', 'Produce Bag', 'Food Wrap', 'Casserole Cover', 'Travel Pouch',
];
const FABRICS = ['Organic Cotton', 'Hemp', 'Linen', 'Recycled Cotton'];
const PATTERNS = ['Diamond', 'Square', 'Wave', 'Plain'];
const MESSAGE_STATUSES = ['new', 'read', 'replied'];

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

export default function AdminDashboard() {
  const [tab, setTab] = useState('Products');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
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

  useEffect(() => {
    refreshAnalytics();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (tab === 'Users') fetchUsers();
    if (tab === 'Messages') fetchMessages();
    if (tab === 'Testimonials') fetchTestimonials();
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

        <Reveal delay={0.05} className="glass rounded-3xl p-6 sm:p-8 min-h-[360px] border border-forest/15 dark:border-white/10 shadow-xl"></Reveal>