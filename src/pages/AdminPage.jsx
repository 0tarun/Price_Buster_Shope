import { useEffect, useState } from 'react';
import { ImagePlus, LogOut, PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { categories } from '../data/products';
import {
  deleteAdminProduct,
  getAdminHomepageSettings,
  getAdminProducts,
  hasAdminKey,
  loginAdmin,
  logoutAdmin,
  saveAdminProduct,
  saveHomepageSettings,
  uploadAdminImage,
  uploadAdminVideo,
} from '../services/api';
import './admin.css';

const emptyProduct = {
  name: '',
  brand: '',
  category: categories[0].slug,
  subCategory: '',
  tagline: '',
  subtitle: '',
  price: '',
  oldPrice: '',
  stockLeft: '',
  rating: '0',
  shortDescription: '',
  highlightsText: '',
  howToUseText: '',
  sizesText: '',
  detailsText: '',
  deliveryEta: '',
  deliveryNote: '',
  imageFiles: [],
};

const emptyHero = {
  eyebrow: '',
  title: '',
  subtitle: '',
  image: '',
  buttonLabel: 'Shop now',
  productId: '',
};

const emptySideBanner = {
  eyebrow: 'Special Offer',
  title: '',
  description: '',
  image: '',
  price: '',
  oldPrice: '',
  buttonLabel: 'Shop now',
  productId: '',
  endTime: '',
};

const emptyCustomerVideo = {
  author: '',
  quote: '',
  product: '',
  productId: '',
  videoUrl: '',
  videoPublicId: '',
};

function parseLines(value) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function parseDetails(value) {
  return Object.fromEntries(parseLines(value).map((line) => {
    const separator = line.indexOf(':');
    return separator > 0
      ? [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
      : [line, ''];
  }));
}

function toLocalDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function productToForm(product) {
  return {
    name: product.name || '',
    brand: product.brand || '',
    category: product.category || categories[0].slug,
    subCategory: product.subCategory || '',
    tagline: product.tagline || '',
    subtitle: product.subtitle || '',
    price: String(product.price ?? ''),
    oldPrice: String(product.oldPrice ?? ''),
    stockLeft: String(product.stockLeft ?? ''),
    rating: String(product.rating ?? 0),
    shortDescription: product.shortDescription || '',
    highlightsText: (product.highlights || []).map((item) => `${item.title || ''}: ${item.text || ''}`).join('\n'),
    howToUseText: (product.howToUse || []).join('\n'),
    sizesText: (product.sizes || []).join(', '),
    detailsText: Object.entries(product.details || {}).map(([key, value]) => `${key}: ${value}`).join('\n'),
    deliveryEta: product.delivery?.eta || '',
    deliveryNote: product.delivery?.note || '',
    imageFiles: [],
  };
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(hasAdminKey);
  const [adminKey, setAdminKey] = useState('');
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroForm, setHeroForm] = useState(emptyHero);
  const [heroFile, setHeroFile] = useState(null);
  const [editingHeroId, setEditingHeroId] = useState(null);
  const [sideBanner, setSideBanner] = useState(null);
  const [sideBannerForm, setSideBannerForm] = useState(emptySideBanner);
  const [sideBannerFile, setSideBannerFile] = useState(null);
  const [customerVideos, setCustomerVideos] = useState([]);
  const [videoForm, setVideoForm] = useState(emptyCustomerVideo);
  const [videoFile, setVideoFile] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function refreshDashboard() {
    const [savedProducts, settingsResponse] = await Promise.all([
      getAdminProducts(),
      getAdminHomepageSettings(),
    ]);
    setProducts(savedProducts);
    setHeroSlides(settingsResponse.heroSlides || []);
    setSideBanner(settingsResponse.sideBanner || null);
    setSideBannerForm(settingsResponse.sideBanner
      ? { ...settingsResponse.sideBanner, endTime: toLocalDateTime(settingsResponse.sideBanner.endTime) }
      : emptySideBanner);
    setCustomerVideos(settingsResponse.customerVideos || []);
  }

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    async function loadDashboard() {
      try {
        const [savedProducts, settingsResponse] = await Promise.all([
          getAdminProducts(),
          getAdminHomepageSettings(),
        ]);
        if (!active) return;
        setProducts(savedProducts);
        setHeroSlides(settingsResponse.heroSlides || []);
        setSideBanner(settingsResponse.sideBanner || null);
        setSideBannerForm(settingsResponse.sideBanner
          ? { ...settingsResponse.sideBanner, endTime: toLocalDateTime(settingsResponse.sideBanner.endTime) }
          : emptySideBanner);
        setCustomerVideos(settingsResponse.customerVideos || []);
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }
    loadDashboard();
    return () => {
      active = false;
    };
  }, [authenticated]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await loginAdmin(adminKey);
      setAuthenticated(true);
      setAdminKey('');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setBusy(false);
    }
  };

  const updateProductField = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const currentImages = editingProduct?.images?.length
        ? editingProduct.images
        : editingProduct?.image ? [editingProduct.image] : [];
      const uploadedImages = [];
      for (const file of productForm.imageFiles) {
        uploadedImages.push((await uploadAdminImage(file)).url);
      }
      const images = [...currentImages, ...uploadedImages];
      if (!images.length) throw new Error('Please select at least one product image.');

      const saved = await saveAdminProduct({
        name: productForm.name.trim(),
        brand: productForm.brand.trim(),
        category: productForm.category,
        categoryLabel: categories.find((category) => category.slug === productForm.category)?.name || productForm.category,
        subCategory: productForm.subCategory.trim(),
        tagline: productForm.tagline.trim(),
        subtitle: productForm.subtitle.trim(),
        price: Number(productForm.price),
        oldPrice: productForm.oldPrice === '' ? 0 : Number(productForm.oldPrice),
        discountPercent: Number(productForm.oldPrice) > Number(productForm.price)
          ? Math.round((1 - Number(productForm.price) / Number(productForm.oldPrice)) * 100)
          : 0,
        rating: Number(productForm.rating) || 0,
        shortDescription: productForm.shortDescription.trim(),
        description: productForm.shortDescription.trim(),
        highlights: parseLines(productForm.highlightsText).map((line) => {
          const separator = line.indexOf(':');
          return separator > 0
            ? { title: line.slice(0, separator).trim(), text: line.slice(separator + 1).trim() }
            : { title: line, text: '' };
        }),
        howToUse: parseLines(productForm.howToUseText),
        delivery: { eta: productForm.deliveryEta.trim(), note: productForm.deliveryNote.trim() },
        image: images[0],
        thumbnail: images[0],
        images,
        sizes: productForm.sizesText.split(',').map((size) => size.trim()).filter(Boolean),
        details: parseDetails(productForm.detailsText),
        stockLeft: Number(productForm.stockLeft) || 0,
        inStock: Number(productForm.stockLeft) > 0,
      }, editingProduct?.mongoId);
      setMessage(`“${saved.name}” ${editingProduct ? 'আপডেট' : 'সংরক্ষণ'} হয়েছে।`);
      setProductForm(emptyProduct);
      setEditingProduct(null);
      await refreshDashboard();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleHeroSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const image = heroFile ? (await uploadAdminImage(heroFile)).url : heroForm.image;
      if (!image) throw new Error('Please upload a homepage banner image.');
      const savedSlide = {
        ...heroForm,
        id: editingHeroId || (window.crypto.randomUUID ? window.crypto.randomUUID() : `banner-${Date.now()}`),
        image,
        eyebrow: heroForm.eyebrow.trim(),
        title: heroForm.title.trim(),
        subtitle: heroForm.subtitle.trim(),
        buttonLabel: heroForm.buttonLabel.trim() || 'Shop now',
      };
      const nextSlides = editingHeroId
        ? heroSlides.map((slide) => (slide.id === editingHeroId ? savedSlide : slide))
        : [...heroSlides, savedSlide];
      const saved = await saveHomepageSettings({ heroSlides: nextSlides, sideBanner, customerVideos });
      setHeroSlides(saved.heroSlides);
      setSideBanner(saved.sideBanner);
      setHeroForm(emptyHero);
      setHeroFile(null);
      setEditingHeroId(null);
      setMessage(`বড় ব্যানার ${editingHeroId ? 'আপডেট' : 'যোগ'} হয়েছে।`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEditHero = (slide) => {
    setEditingHeroId(slide.id);
    setHeroForm({ ...emptyHero, ...slide });
    setHeroFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHero = async (slide) => {
    if (!window.confirm(`“${slide.title}” ব্যানারটি মুছে ফেলবেন?`)) return;
    setError('');
    setMessage('');
    try {
      const nextSlides = heroSlides.filter((item) => item.id !== slide.id);
      const saved = await saveHomepageSettings({ heroSlides: nextSlides, sideBanner, customerVideos });
      setHeroSlides(saved.heroSlides);
      setSideBanner(saved.sideBanner);
      if (editingHeroId === slide.id) {
        setEditingHeroId(null);
        setHeroForm(emptyHero);
        setHeroFile(null);
      }
      setMessage('বড় ব্যানার মুছে ফেলা হয়েছে।');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleSideBannerSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const image = sideBannerFile ? (await uploadAdminImage(sideBannerFile)).url : sideBannerForm.image;
      if (!image) throw new Error('পাশের ব্যানারের জন্য একটি ছবি বাছুন।');
      const banner = {
        ...sideBannerForm,
        image,
        price: Number(sideBannerForm.price),
        oldPrice: Number(sideBannerForm.oldPrice) || 0,
        buttonLabel: sideBannerForm.buttonLabel.trim() || 'Shop now',
        endTime: sideBannerForm.endTime ? new Date(sideBannerForm.endTime).toISOString() : '',
      };
      const saved = await saveHomepageSettings({ heroSlides, sideBanner: banner, customerVideos });
      setHeroSlides(saved.heroSlides);
      setSideBanner(saved.sideBanner);
      setSideBannerForm({ ...saved.sideBanner, endTime: toLocalDateTime(saved.sideBanner.endTime) });
      setSideBannerFile(null);
      setMessage('পাশের ছোট ব্যানার সংরক্ষণ হয়েছে।');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteSideBanner = async () => {
    if (!window.confirm('পাশের ছোট ব্যানারটি মুছে ফেলবেন?')) return;
    setError('');
    setMessage('');
    try {
      const saved = await saveHomepageSettings({ heroSlides, sideBanner: null, customerVideos });
      setHeroSlides(saved.heroSlides);
      setSideBanner(null);
      setSideBannerForm(emptySideBanner);
      setSideBannerFile(null);
      setMessage('পাশের ছোট ব্যানার মুছে ফেলা হয়েছে।');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleCustomerVideoSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const uploaded = videoFile ? await uploadAdminVideo(videoFile) : null;
      const videoUrl = uploaded?.url || videoForm.videoUrl;
      if (!videoUrl) throw new Error('ভিডিও ফাইল বাছুন।');
      const savedVideo = {
        ...videoForm,
        id: editingVideoId || (window.crypto.randomUUID ? window.crypto.randomUUID() : `video-${Date.now()}`),
        author: videoForm.author.trim(),
        quote: videoForm.quote.trim(),
        product: videoForm.product.trim(),
        videoUrl,
        videoPublicId: uploaded?.publicId || videoForm.videoPublicId || '',
      };
      const nextVideos = editingVideoId
        ? customerVideos.map((item) => (item.id === editingVideoId ? savedVideo : item))
        : [...customerVideos, savedVideo];
      const saved = await saveHomepageSettings({ heroSlides, sideBanner, customerVideos: nextVideos });
      setHeroSlides(saved.heroSlides);
      setSideBanner(saved.sideBanner);
      setCustomerVideos(saved.customerVideos);
      setVideoForm(emptyCustomerVideo);
      setVideoFile(null);
      setEditingVideoId(null);
      setMessage(`ভিডিও ${editingVideoId ? 'আপডেট' : 'যোগ'} হয়েছে।`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideoId(video.id);
    setVideoForm({ ...emptyCustomerVideo, ...video });
    setVideoFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (video) => {
    if (!window.confirm(`“${video.product}” ভিডিওটি মুছে ফেলবেন?`)) return;
    setError('');
    setMessage('');
    try {
      const nextVideos = customerVideos.filter((item) => item.id !== video.id);
      const saved = await saveHomepageSettings({ heroSlides, sideBanner, customerVideos: nextVideos });
      setCustomerVideos(saved.customerVideos);
      if (editingVideoId === video.id) {
        setEditingVideoId(null);
        setVideoForm(emptyCustomerVideo);
        setVideoFile(null);
      }
      setMessage('ভিডিওটি মুছে ফেলা হয়েছে।');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`“${product.name}” মুছে ফেলবেন?`)) return;
    setError('');
    setMessage('');
    try {
      await deleteAdminProduct(product.mongoId);
      setProducts((current) => current.filter((item) => item.mongoId !== product.mongoId));
      setMessage('প্রোডাক্ট মুছে ফেলা হয়েছে।');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setProductForm(productToForm(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    setProducts([]);
    setHeroSlides([]);
    setSideBanner(null);
    setCustomerVideos([]);
  };

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form className="admin-login__card" onSubmit={handleLogin}>
          <div className="admin-eyebrow">PRICE BUSTER SHOP</div>
          <h1>অ্যাডমিন লগইন</h1>
          <p>ড্যাশবোর্ডে যেতে আপনার backend admin key দিন।</p>
          {error ? <div className="admin-alert admin-alert--error" role="alert">{error}</div> : null}
          <label htmlFor="admin-key">Admin key</label>
          <input
            id="admin-key"
            type="password"
            autoComplete="current-password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            required
          />
          <button className="admin-button" type="submit" disabled={busy}>
            {busy ? 'যাচাই হচ্ছে…' : 'ড্যাশবোর্ডে প্রবেশ'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <div className="admin-eyebrow">PRICE BUSTER SHOP</div>
          <h1>অ্যাডমিন ড্যাশবোর্ড</h1>
          <p>প্রোডাক্ট, ব্যানার এবং customer video পরিচালনা করুন।</p>
        </div>
        <button type="button" className="admin-button admin-button--light" onClick={handleLogout}>
          <LogOut size={16} /> লগআউট
        </button>
      </header>

      {error ? <div className="admin-alert admin-alert--error" role="alert">{error}</div> : null}
      {message ? <div className="admin-alert admin-alert--success" role="status">{message}</div> : null}

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <ImagePlus size={20} />
          <div><h2>{editingHeroId ? 'বড় ব্যানার সম্পাদনা' : 'বড় ব্যানার যোগ করুন'}</h2><p>একাধিক ব্যানার যোগ করুন; হোমপেজে এগুলো স্লাইড হিসেবে দেখাবে।</p></div>
        </div>
        <form onSubmit={handleHeroSubmit} className="admin-form admin-form--hero">
          <label>ছোট শিরোনাম<input value={heroForm.eyebrow} onChange={(event) => setHeroForm({ ...heroForm, eyebrow: event.target.value })} maxLength="100" required /></label>
          <label>ব্যানার শিরোনাম<textarea value={heroForm.title} onChange={(event) => setHeroForm({ ...heroForm, title: event.target.value })} maxLength="160" required rows="2" /></label>
          <label className="admin-form__wide">বর্ণনা<textarea value={heroForm.subtitle} onChange={(event) => setHeroForm({ ...heroForm, subtitle: event.target.value })} maxLength="300" required rows="2" /></label>
          <label>বাটনের লেখা<input value={heroForm.buttonLabel} onChange={(event) => setHeroForm({ ...heroForm, buttonLabel: event.target.value })} maxLength="60" /></label>
          <label>কোন প্রোডাক্টে যাবে
            <select value={heroForm.productId} onChange={(event) => setHeroForm({ ...heroForm, productId: event.target.value })}>
              <option value="">প্রোডাক্ট বাছুন</option>
              {products.map((product) => <option key={product.mongoId} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          <label className="admin-upload">
            বড় ব্যানারের ছবি
            <input type="file" accept="image/*" onChange={(event) => setHeroFile(event.target.files?.[0] || null)} />
            <span>{heroFile?.name || (heroForm.image ? 'বর্তমান ছবি সেট করা আছে · নতুন ছবি বাছুন' : 'ছবি বাছুন')}</span>
          </label>
          {heroForm.image ? <img className="admin-hero-preview" src={heroForm.image} alt="Banner preview" /> : null}
          <div className="admin-form__actions admin-form__wide">
            <button className="admin-button" type="submit" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে…' : editingHeroId ? 'ব্যানার আপডেট' : 'ব্যানার যোগ করুন'}</button>
            {editingHeroId ? <button className="admin-button admin-button--light" type="button" onClick={() => { setEditingHeroId(null); setHeroForm(emptyHero); setHeroFile(null); }}>বাতিল</button> : null}
          </div>
        </form>
        <div className="admin-banner-list">
          <h3>সংরক্ষিত বড় ব্যানার ({heroSlides.length})</h3>
          {heroSlides.length ? heroSlides.map((slide) => (
            <article className="admin-product" key={slide.id}>
              <img src={slide.image} alt="" />
              <div className="admin-product__info"><strong>{slide.title}</strong><span>{slide.eyebrow}</span></div>
              <button type="button" className="admin-icon-button" onClick={() => handleEditHero(slide)} aria-label="ব্যানার সম্পাদনা"><Pencil size={17} /></button>
              <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => handleDeleteHero(slide)} aria-label="ব্যানার মুছুন"><Trash2 size={17} /></button>
            </article>
          )) : <p className="admin-empty">এখনো কোনো বড় ব্যানার যোগ করা হয়নি।</p>}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <ImagePlus size={20} />
          <div><h2>পাশের ছোট ব্যানার</h2><p>হোমপেজের প্রধান ব্যানারের পাশের অফারটি সেট করুন।</p></div>
        </div>
        <form onSubmit={handleSideBannerSubmit} className="admin-form admin-form--hero">
          <label>ছোট শিরোনাম<input value={sideBannerForm.eyebrow} onChange={(event) => setSideBannerForm({ ...sideBannerForm, eyebrow: event.target.value })} maxLength="100" required /></label>
          <label>ব্যানার শিরোনাম<input value={sideBannerForm.title} onChange={(event) => setSideBannerForm({ ...sideBannerForm, title: event.target.value })} maxLength="160" required /></label>
          <label className="admin-form__wide">বর্ণনা<textarea value={sideBannerForm.description} onChange={(event) => setSideBannerForm({ ...sideBannerForm, description: event.target.value })} maxLength="300" rows="2" required /></label>
          <label>দাম (৳)<input type="number" min="0" step="0.01" value={sideBannerForm.price} onChange={(event) => setSideBannerForm({ ...sideBannerForm, price: event.target.value })} required /></label>
          <label>আগের দাম (৳)<input type="number" min="0" step="0.01" value={sideBannerForm.oldPrice} onChange={(event) => setSideBannerForm({ ...sideBannerForm, oldPrice: event.target.value })} /></label>
          <label>অফারের শেষ সময় <span className="admin-hint">(ঐচ্ছিক)</span>
            <input type="datetime-local" value={sideBannerForm.endTime || ''} onChange={(event) => setSideBannerForm({ ...sideBannerForm, endTime: event.target.value })} />
          </label>
          <label>বাটনের লেখা<input value={sideBannerForm.buttonLabel} onChange={(event) => setSideBannerForm({ ...sideBannerForm, buttonLabel: event.target.value })} maxLength="60" /></label>
          <label>কোন প্রোডাক্টে যাবে
            <select value={sideBannerForm.productId} onChange={(event) => setSideBannerForm({ ...sideBannerForm, productId: event.target.value })}>
              <option value="">প্রোডাক্ট বাছুন</option>
              {products.map((product) => <option key={product.mongoId} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          <label className="admin-upload admin-form__wide">
            ছোট ব্যানারের ছবি
            <input type="file" accept="image/*" onChange={(event) => setSideBannerFile(event.target.files?.[0] || null)} />
            <span>{sideBannerFile?.name || (sideBannerForm.image ? 'বর্তমান ছবি সেট করা আছে · নতুন ছবি বাছুন' : 'ছবি বাছুন')}</span>
          </label>
          {sideBannerForm.image ? <img className="admin-hero-preview" src={sideBannerForm.image} alt="Side banner preview" /> : null}
          <div className="admin-form__actions admin-form__wide">
            <button className="admin-button" type="submit" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে…' : sideBanner ? 'ছোট ব্যানার আপডেট' : 'ছোট ব্যানার তৈরি'}</button>
            {sideBanner ? <button className="admin-button admin-button--light" type="button" onClick={handleDeleteSideBanner}>ছোট ব্যানার মুছুন</button> : null}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <ImagePlus size={20} />
          <div><h2>{editingVideoId ? 'Customer video সম্পাদনা' : 'Customer video যোগ করুন'}</h2><p>ভিডিও Cloudinary-তে, আর ভিডিওর তথ্য MongoDB-তে সংরক্ষিত হবে।</p></div>
        </div>
        <form onSubmit={handleCustomerVideoSubmit} className="admin-form admin-form--hero">
          <label>ব্যক্তির নাম<input value={videoForm.author} onChange={(event) => setVideoForm({ ...videoForm, author: event.target.value })} maxLength="100" required /></label>
          <label>প্রোডাক্টের নাম<input value={videoForm.product} onChange={(event) => setVideoForm({ ...videoForm, product: event.target.value })} maxLength="160" required /></label>
          <label className="admin-form__wide">ভিডিওর quote / বক্তব্য<textarea value={videoForm.quote} onChange={(event) => setVideoForm({ ...videoForm, quote: event.target.value })} maxLength="500" rows="2" required /></label>
          <label>কোন প্রোডাক্টে যাবে
            <select value={videoForm.productId} onChange={(event) => setVideoForm({ ...videoForm, productId: event.target.value })}>
              <option value="">প্রোডাক্ট বাছুন (ঐচ্ছিক)</option>
              {products.map((product) => <option key={product.mongoId} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          <label className="admin-upload">
            ভিডিও ফাইল (সর্বোচ্চ ৫০ MB)
            <input type="file" accept="video/*" onChange={(event) => setVideoFile(event.target.files?.[0] || null)} />
            <span>{videoFile?.name || (videoForm.videoUrl ? 'বর্তমান ভিডিও সেট করা আছে · নতুন ভিডিও বাছুন' : 'ভিডিও বাছুন')}</span>
          </label>
          <div className="admin-form__actions admin-form__wide">
            <button className="admin-button" type="submit" disabled={busy || (!editingVideoId && customerVideos.length >= 30)}>{busy ? 'ভিডিও আপলোড হচ্ছে…' : editingVideoId ? 'ভিডিও আপডেট' : 'ভিডিও যোগ করুন'}</button>
            {editingVideoId ? <button className="admin-button admin-button--light" type="button" onClick={() => { setEditingVideoId(null); setVideoForm(emptyCustomerVideo); setVideoFile(null); }}>বাতিল</button> : null}
          </div>
        </form>
        <div className="admin-banner-list">
          <h3>সংরক্ষিত ভিডিও ({customerVideos.length}/৩০)</h3>
          {customerVideos.length ? customerVideos.map((video) => (
            <article className="admin-product" key={video.id}>
              <video src={video.videoUrl} preload="metadata" />
              <div className="admin-product__info"><strong>{video.product}</strong><span>{video.author} · {video.quote}</span></div>
              <button type="button" className="admin-icon-button" onClick={() => handleEditVideo(video)} aria-label="ভিডিও সম্পাদনা"><Pencil size={17} /></button>
              <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => handleDeleteVideo(video)} aria-label="ভিডিও মুছুন"><Trash2 size={17} /></button>
            </article>
          )) : <p className="admin-empty">এখনো কোনো ভিডিও যোগ করা হয়নি।</p>}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <PackagePlus size={20} />
          <div><h2>{editingProduct ? 'প্রোডাক্ট সম্পাদনা' : 'নতুন প্রোডাক্ট যোগ করুন'}</h2><p>তথ্য MongoDB-তে এবং ছবি Cloudinary-তে সংরক্ষিত হবে।</p></div>
        </div>
        <form onSubmit={handleProductSubmit} className="admin-form">
          <label>প্রোডাক্টের নাম<input name="name" value={productForm.name} onChange={updateProductField} maxLength="160" required /></label>
          <label>ব্র্যান্ড<input name="brand" value={productForm.brand} onChange={updateProductField} maxLength="100" /></label>
          <label>ক্যাটাগরি
            <select name="category" value={productForm.category} onChange={updateProductField}>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
          <label>সাব-ক্যাটাগরি<input name="subCategory" value={productForm.subCategory} onChange={updateProductField} maxLength="100" /></label>
          <label>ট্যাগলাইন<input name="tagline" value={productForm.tagline} onChange={updateProductField} maxLength="200" /></label>
          <label>সাবটাইটেল<input name="subtitle" value={productForm.subtitle} onChange={updateProductField} maxLength="200" /></label>
          <label>দাম (৳)<input name="price" type="number" min="0" step="0.01" value={productForm.price} onChange={updateProductField} required /></label>
          <label>আগের দাম (৳)<input name="oldPrice" type="number" min="0" step="0.01" value={productForm.oldPrice} onChange={updateProductField} /></label>
          <label>স্টক<input name="stockLeft" type="number" min="0" step="1" value={productForm.stockLeft} onChange={updateProductField} required /></label>
          <label>রেটিং (০–৫)<input name="rating" type="number" min="0" max="5" step="0.1" value={productForm.rating} onChange={updateProductField} /></label>
          <label className="admin-form__wide">সংক্ষিপ্ত বর্ণনা<textarea name="shortDescription" value={productForm.shortDescription} onChange={updateProductField} maxLength="2000" rows="3" /></label>
          <label className="admin-form__wide">হাইলাইট <span className="admin-hint">(প্রতি লাইনে শিরোনাম: বিবরণ)</span>
            <textarea name="highlightsText" value={productForm.highlightsText} onChange={updateProductField} rows="3" />
          </label>
          <label className="admin-form__wide">ব্যবহারের নিয়ম <span className="admin-hint">(প্রতি লাইনে একটি ধাপ)</span>
            <textarea name="howToUseText" value={productForm.howToUseText} onChange={updateProductField} rows="3" />
          </label>
          <label className="admin-form__wide">সাইজ / ভ্যারিয়েন্ট <span className="admin-hint">(কমা দিয়ে আলাদা করুন)</span>
            <input name="sizesText" value={productForm.sizesText} onChange={updateProductField} placeholder="যেমন: Small, Medium, Large" />
          </label>
          <label className="admin-form__wide">বৈশিষ্ট্য <span className="admin-hint">(প্রতি লাইনে নাম: বিবরণ)</span>
            <textarea name="detailsText" value={productForm.detailsText} onChange={updateProductField} placeholder={'Size: 300 ml\nউপাদান: Aloe vera'} rows="4" />
          </label>
          <label>ডেলিভারির সময়<input name="deliveryEta" value={productForm.deliveryEta} onChange={updateProductField} placeholder="যেমন: ২–৪ কর্মদিবস" /></label>
          <label>ডেলিভারি নোট<input name="deliveryNote" value={productForm.deliveryNote} onChange={updateProductField} /></label>
          <label className="admin-upload admin-form__wide">
            প্রোডাক্টের ছবি {editingProduct ? <span className="admin-hint">(নতুন ছবি যোগ করলে আগেরগুলোও থাকবে)</span> : null}
            <input type="file" accept="image/*" multiple onChange={(event) => setProductForm((current) => ({ ...current, imageFiles: Array.from(event.target.files || []) }))} />
            <span>{productForm.imageFiles.length ? `${productForm.imageFiles.length}টি ছবি বাছাই করা হয়েছে` : 'এক বা একাধিক ছবি বাছুন · সর্বোচ্চ ৫০ MB প্রতি ছবি'}</span>
          </label>
          <div className="admin-form__actions admin-form__wide">
            <button className="admin-button" type="submit" disabled={busy}>{busy ? 'সংরক্ষণ হচ্ছে…' : editingProduct ? 'পরিবর্তন সংরক্ষণ' : 'প্রোডাক্ট সংরক্ষণ'}</button>
            {editingProduct ? <button className="admin-button admin-button--light" type="button" onClick={() => { setEditingProduct(null); setProductForm(emptyProduct); }}>বাতিল</button> : null}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <PackagePlus size={20} />
          <div><h2>সংরক্ষিত প্রোডাক্ট</h2><p>{products.length}টি প্রোডাক্ট</p></div>
        </div>
        {products.length ? (
          <div className="admin-products">
            {products.map((product) => (
              <article className="admin-product" key={product.mongoId}>
                <img src={product.image} alt="" />
                <div className="admin-product__info">
                  <strong>{product.name}</strong>
                  <span>{product.categoryLabel || product.category} · ৳ {Number(product.price).toLocaleString('en-BD')} · স্টক {product.stockLeft}</span>
                </div>
                <button type="button" className="admin-icon-button" onClick={() => startEditing(product)} aria-label={`${product.name} সম্পাদনা`}><Pencil size={17} /></button>
                <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => handleDelete(product)} aria-label={`${product.name} মুছুন`}><Trash2 size={17} /></button>
              </article>
            ))}
          </div>
        ) : <p className="admin-empty">এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>}
      </section>
    </main>
  );
}

export default AdminPage;
