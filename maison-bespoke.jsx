import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// ============================================
// CONTEXTS
// ============================================
const CartContext = createContext();
const UserContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, id: Date.now() + Math.random() }]);
    setIsCartOpen(true);
    setTimeout(() => setIsCartOpen(false), 3000);
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const getCartTotal = () => cartItems.reduce((t, i) => t + (i.price * (i.quantity || 1)), 0);
  const getCartCount = () => cartItems.reduce((c, i) => c + (i.quantity || 1), 0);
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, getCartTotal, getCartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (email, password) => {
    setUser({ email, name: email.split('@')[0], id: Date.now() });
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, isLoginModalOpen, setIsLoginModalOpen, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

const useCart = () => useContext(CartContext);
const useUser = () => useContext(UserContext);

// ============================================
// PRODUCT DATA
// ============================================
const productCategories = {
  shirts: { name: 'Custom Shirts', basePrice: 49.99, description: '100% Premium Cotton Exclusive Fabrics', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', heroImage: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=1200' },
  suits: { name: 'Custom Suits', basePrice: 239, description: 'Over 220 Exclusive Premium Fabrics', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200' },
  jackets: { name: 'Custom Jackets', basePrice: 169, description: 'Unparalleled Designs And A Distinguishing Fit', image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800', heroImage: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1200' },
  vests: { name: 'Custom Vests', basePrice: 89, description: 'Stay Styled - Give The Blazer A Day Off', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', heroImage: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200' },
  pants: { name: 'Custom Pants', basePrice: 74, description: 'Feel The Fit - Create What You Appreciate', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', heroImage: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200' },
  tuxedos: { name: 'Custom Tuxedos', basePrice: 249, description: 'Memorable Fashions For Memorable Times', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800', heroImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200' },
  threePieceSuits: { name: '3-Piece Suits', basePrice: 279, description: 'The Timeless Piece Every Man Should Own', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800', heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200' },
  overcoats: { name: 'Custom Overcoats', basePrice: 259, description: 'No Tears Here, These Layers Turn Heads', image: 'https://images.unsplash.com/photo-1544923246-77307dd628b5?w=800', heroImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200' },
};

const fabrics = [
  { id: 'f1', name: 'Egyptian Cotton White', color: '#FFFFFF', weave: 'Poplin', weight: 'Light', yarn: '100s 2-ply', price: 0, season: 'all' },
  { id: 'f2', name: 'Sea Island Blue', color: '#4A90D9', weave: 'Twill', weight: 'Light', yarn: '120s 2-ply', price: 10, season: 'spring' },
  { id: 'f3', name: 'Navy Pinstripe', color: '#1E3A5F', weave: 'Poplin', weight: 'Medium', yarn: '100s 2-ply', price: 15, season: 'fall' },
  { id: 'f4', name: 'Classic Pink', color: '#FFB6C1', weave: 'Oxford', weight: 'Light', yarn: '100s 2-ply', price: 0, season: 'spring' },
  { id: 'f5', name: 'Charcoal Herringbone', color: '#36454F', weave: 'Herringbone', weight: 'Medium', yarn: '100s', price: 20, season: 'winter' },
  { id: 'f6', name: 'Midnight Black', color: '#1A1A1A', weave: 'Satin', weight: 'Medium', yarn: '100s 2-ply', price: 15, season: 'all' },
  { id: 'f7', name: 'Burgundy Wine', color: '#722F37', weave: 'Twill', weight: 'Medium', yarn: '100s', price: 10, season: 'fall' },
  { id: 'f8', name: 'Royal Oxford Blue', color: '#002366', weave: 'Oxford', weight: 'Medium', yarn: '100s', price: 10, season: 'all' },
  { id: 'f9', name: 'Ivory Linen', color: '#FFFFF0', weave: 'Plain', weight: 'Light', yarn: 'Linen', price: 25, season: 'summer' },
  { id: 'f10', name: 'Forest Green', color: '#228B22', weave: 'Twill', weight: 'Medium', yarn: '100s', price: 10, season: 'fall' },
  { id: 'f11', name: 'Lavender Mist', color: '#B57EDC', weave: 'Poplin', weight: 'Light', yarn: '100s 2-ply', price: 10, season: 'spring' },
  { id: 'f12', name: 'Steel Grey', color: '#71797E', weave: 'Twill', weight: 'Medium', yarn: '120s', price: 15, season: 'all' },
  // Checkered/Cheque Patterns
  { id: 'c1', name: 'Classic Blue Check', pattern: 'check', colors: ['#FFFFFF', '#4A90D9'], weave: 'Twill', weight: 'Light', yarn: '100s 2-ply', price: 20, season: 'all' },
  { id: 'c2', name: 'Tartan Red Check', pattern: 'check', colors: ['#FFFFFF', '#C41E3A', '#1E3A5F'], weave: 'Twill', weight: 'Medium', yarn: '100s', price: 25, season: 'fall' },
  { id: 'c3', name: 'Gingham Black Check', pattern: 'check', colors: ['#FFFFFF', '#1A1A1A'], weave: 'Poplin', weight: 'Light', yarn: '100s 2-ply', price: 15, season: 'all' },
  { id: 'c4', name: 'Hunter Green Check', pattern: 'check', colors: ['#FFFFFF', '#228B22'], weave: 'Twill', weight: 'Medium', yarn: '100s', price: 20, season: 'fall' },
  { id: 'c5', name: 'Navy Windowpane Check', pattern: 'check', colors: ['#F5F5F5', '#1E3A5F'], weave: 'Oxford', weight: 'Medium', yarn: '120s', price: 22, season: 'all' },
];

const styleOptions = {
  collar: [
    { id: 'c1', name: 'Classic Spread', icon: '👔', description: 'Versatile for most occasions', price: 0 },
    { id: 'c2', name: 'Button Down', icon: '👔', description: 'Casual American style', price: 0 },
    { id: 'c3', name: 'Cutaway', icon: '👔', description: 'Wide spread for larger tie knots', price: 0 },
    { id: 'c4', name: 'Point Collar', icon: '👔', description: 'Traditional narrow spread', price: 0 },
    { id: 'c5', name: 'Mandarin', icon: '👔', description: 'Band collar without fold', price: 5 },
    { id: 'c6', name: 'Tab Collar', icon: '👔', description: 'Tabs hold tie knot in place', price: 5 },
  ],
  cuff: [
    { id: 'cu1', name: 'Barrel Single Button', icon: '⬜', description: 'Classic single button cuff', price: 0 },
    { id: 'cu2', name: 'Barrel Double Button', icon: '⬜', description: 'Two button barrel cuff', price: 0 },
    { id: 'cu3', name: 'French Cuff', icon: '⬜', description: 'Formal cufflink cuff', price: 5 },
    { id: 'cu4', name: 'Convertible Cuff', icon: '⬜', description: 'Button or cufflink option', price: 5 },
  ],
  pocket: [
    { id: 'p1', name: 'No Pocket', icon: '❌', description: 'Clean formal look', price: 0 },
    { id: 'p2', name: 'Rounded Pocket', icon: '🔲', description: 'Classic casual style', price: 0 },
    { id: 'p3', name: 'Angled Pocket', icon: '🔲', description: 'Modern angled opening', price: 0 },
  ],
  back: [
    { id: 'b1', name: 'Plain Back', icon: '⬛', description: 'Clean flat back', price: 0 },
    { id: 'b2', name: 'Box Pleat', icon: '⬛', description: 'Center pleat for mobility', price: 0 },
    { id: 'b3', name: 'Side Pleats', icon: '⬛', description: 'Two side pleats', price: 0 },
  ],
};

const buttonOptions = [
  { id: 'btn-white', name: 'White', color: '#FFFFFF', price: 0 },
  { id: 'btn-cream', name: 'Cream', color: '#FFFDD0', price: 0 },
  { id: 'btn-blue', name: 'Blue', color: '#4169E1', price: 0 },
  { id: 'btn-black', name: 'Black', color: '#000000', price: 0 },
  { id: 'btn-mop-white', name: 'Mother of Pearl', color: '#F5F5F5', price: 1.99, premium: true },
  { id: 'btn-horn', name: 'Horn', color: '#3D2B1F', price: 1.99, premium: true },
];

const threadColors = [
  { id: 'th-white', name: 'White', color: '#FFFFFF' },
  { id: 'th-black', name: 'Black', color: '#000000' },
  { id: 'th-navy', name: 'Navy', color: '#000080' },
  { id: 'th-red', name: 'Red', color: '#FF0000' },
  { id: 'th-gold', name: 'Gold', color: '#FFD700' },
  { id: 'th-pink', name: 'Pink', color: '#FFC0CB' },
];

const standardSizes = {
  S: { neck: 15, chest: 41.75, stomach: 39.5, hip: 40, length: 29, shoulder: 17.5, sleeve: 33 },
  M: { neck: 16, chest: 44.5, stomach: 42.5, hip: 43, length: 30, shoulder: 18.5, sleeve: 34 },
  L: { neck: 16.5, chest: 47.5, stomach: 45.5, hip: 46, length: 31, shoulder: 19.5, sleeve: 35 },
  XL: { neck: 17, chest: 49.5, stomach: 47.5, hip: 48, length: 32, shoulder: 20, sleeve: 35.5 },
  XXL: { neck: 18, chest: 52, stomach: 50, hip: 51, length: 33, shoulder: 21, sleeve: 36 },
};

const fitTypes = [
  { id: 'standard', name: 'Signature Standard Fit', description: 'Classic comfortable fit with room' },
  { id: 'slim', name: 'Euro Slim Fit', description: 'Modern tailored silhouette' },
  { id: 'athletic', name: 'Athletic Fit', description: 'Extra room in chest, tapered waist' },
];

// ============================================
// HEADER COMPONENT
// ============================================
function Header({ navigateTo, currentPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { getCartCount, setIsCartOpen } = useCart();
  const { user, setIsLoginModalOpen } = useUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      label: "Men's", items: [
        { label: 'Custom Shirts', product: 'shirts' },
        { label: 'Custom Suits', product: 'suits' },
        { label: '3-Piece Suits', product: 'threePieceSuits' },
        { label: 'Custom Jackets', product: 'jackets' },
        { label: 'Custom Vests', product: 'vests' },
        { label: 'Custom Pants', product: 'pants' },
        { label: 'Custom Tuxedos', product: 'tuxedos' },
        { label: 'Custom Overcoats', product: 'overcoats' },
      ]
    },
    {
      label: "Collection", items: [
        { label: 'Shirt Collection', product: 'shirts', page: 'catalog' },
        { label: 'Suit Collection', product: 'suits', page: 'catalog' },
      ]
    },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${currentPage === 'home' ? 'transparent' : ''}`}>
      <div className="header-top">
        <div className="header-promo">Free Worldwide Shipping · No Tariffs Guaranteed · Perfect Fit Promise</div>
      </div>
      <div className="header-main">
        <button className="mobile-menu-btn"><span></span><span></span><span></span></button>
        <nav className="header-nav-left">
          {menuItems.map((menu, idx) => (
            <div key={idx} className="nav-item" onMouseEnter={() => setActiveDropdown(menu.label)} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="nav-link">{menu.label}</button>
              {activeDropdown === menu.label && (
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    {menu.items.map((item, i) => (
                      <button key={i} className="dropdown-item" onClick={() => { navigateTo(item.page || 'customizer', item.product); setActiveDropdown(null); }}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <button className="header-logo" onClick={() => navigateTo('home')}>
          <span className="logo-text">MAISON</span>
          <span className="logo-tagline">Bespoke Tailoring</span>
        </button>
        <nav className="header-nav-right">
          <button className="nav-link" onClick={() => navigateTo('about')}>About</button>
          <button className="nav-link" onClick={() => navigateTo('contact')}>Contact</button>
        </nav>
        <div className="header-actions">
          <button className="header-action-btn" onClick={() => user ? null : setIsLoginModalOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </button>
          <button className="header-action-btn cart-btn" onClick={() => setIsCartOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M6 6L5 3H2" />
            </svg>
            {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
          </button>
        </div>
      </div>
      <CartDrawer />
      <LoginModal />
    </header>
  );
}

// ============================================
// CART DRAWER
// ============================================
function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, getCartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Bag</h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>×</button>
        </div>
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M6 6L5 3H2" />
                </svg>
              </div>
              <p className="cart-empty-text">Your bag is empty</p>
              <p className="cart-empty-subtext">Add items to begin your bespoke journey</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image" style={{ backgroundColor: item.fabricColor || '#f0f0f0' }}>
                    {item.productType?.charAt(0).toUpperCase()}
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-fabric">{item.fabricName}</p>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                  <div className="cart-item-price">${item.price?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-total-amount">${getCartTotal().toFixed(2)}</span>
            </div>
            <p className="cart-shipping-note">Shipping & taxes calculated at checkout</p>
            <button className="cart-checkout-btn">Proceed to Checkout</button>
            <button className="cart-continue-btn" onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// LOGIN MODAL
// ============================================
function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
    setFormData({ email: '', password: '' });
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)} />
      <div className="modal login-modal">
        <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>×</button>
        <div className="login-modal-content">
          <div className="login-modal-header">
            <h2 className="login-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="login-subtitle">{isRegister ? 'Join the Maison for exclusive benefits' : 'Sign in to access your saved designs'}</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" />
            </div>
            <button type="submit" className="login-submit-btn">{isRegister ? 'Create Account' : 'Sign In'}</button>
          </form>
          <p className="login-toggle">
            {isRegister ? <>Already have an account? <button onClick={() => setIsRegister(false)}>Sign In</button></> : <>Don't have an account? <button onClick={() => setIsRegister(true)}>Create One</button></>}
          </p>
        </div>
      </div>
    </>
  );
}

// ============================================
// FOOTER COMPONENT
// ============================================
function Footer({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Join The Maison</h2>
          <p className="newsletter-subtitle">Exclusive access to new collections, styling tips, and members-only offers.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }}>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="newsletter-input" />
            <button type="submit" className="newsletter-btn">{subscribed ? 'Subscribed ✓' : 'Subscribe'}</button>
          </form>
        </div>
      </div>
      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('customizer', 'shirts')}>Custom Shirts</button></li>
              <li><button onClick={() => navigateTo('customizer', 'suits')}>Custom Suits</button></li>
              <li><button onClick={() => navigateTo('customizer', 'jackets')}>Custom Jackets</button></li>
              <li><button onClick={() => navigateTo('customizer', 'tuxedos')}>Custom Tuxedos</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Why Maison</h3>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('about')}>Our Story</button></li>
              <li><button>Quality & Craftsmanship</button></li>
              <li><button>How It Works</button></li>
              <li><button>Customer Reviews</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('contact')}>Contact Us</button></li>
              <li><button>FAQ</button></li>
              <li><button>Shipping & Delivery</button></li>
              <li><button>Size Guide</button></li>
            </ul>
          </div>
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <span className="logo-text">MAISON</span>
              <span className="logo-tagline">Bespoke Tailoring</span>
            </div>
            <p className="footer-description">The world's leading online tailor. Superior service & quality, pioneers of the tailoring industry since 1983.</p>
            <div className="footer-social">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">tw</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <button>Terms & Conditions</button>
              <button>Privacy Policy</button>
            </div>
            <p className="footer-copyright">© 2024 Maison Bespoke. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// HOME PAGE
// ============================================
function HomePage({ navigateTo }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    { title: 'Bespoke Suits', subtitle: 'Limitless Style Options', description: 'Over 200 exclusive fabric choices. Countless styles. Superior craftsmanship.', price: '$239', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920', product: 'suits', accent: '#c9a962' },
    { title: 'Luxury Shirts', subtitle: 'Premium Cotton Collection', description: '450+ fabrics. Complimentary monogramming. Unlimited design options.', price: '$49.99', image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=1920', product: 'shirts', accent: '#4A90D9' },
    { title: 'Evening Wear', subtitle: 'Black Tie Excellence', description: 'Memorable fashions for memorable occasions. Custom tuxedos crafted to perfection.', price: '$249', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1920', product: 'tuxedos', accent: '#1A1A1A' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const featuredProducts = ['shirts', 'suits', 'jackets', 'vests', 'pants', 'tuxedos', 'threePieceSuits', 'overcoats'].map(key => ({ key, ...productCategories[key] }));

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <div className="hero-background" style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-text">
                <span className="hero-label" style={{ color: slide.accent }}>New Collection</span>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-price">
                  <span className="price-label">Starting at</span>
                  <span className="price-value">{slide.price}</span>
                </div>
                <div className="hero-actions">
                  <button className="hero-btn primary" onClick={() => navigateTo('customizer', slide.product)}>Design Now</button>
                  <button className="hero-btn secondary" onClick={() => navigateTo('catalog', slide.product)}>View Collection</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button key={index} className={`indicator ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-banner">
        <div className="stats-grid">
          <div className="stat-item"><span className="stat-number">310K+</span><span className="stat-label">Customers Served</span></div>
          <div className="stat-item"><span className="stat-number">150+</span><span className="stat-label">Countries Shipped</span></div>
          <div className="stat-item"><span className="stat-number">450+</span><span className="stat-label">Fabric Choices</span></div>
          <div className="stat-item"><span className="stat-number">40+</span><span className="stat-label">Years of Excellence</span></div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <span className="section-label">The Collection</span>
          <h2 className="section-title">Tailored to Perfection</h2>
          <p className="section-description">From boardroom to black tie, discover our complete range of bespoke menswear</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product, index) => (
            <div key={product.key} className={`product-card ${index === 0 || index === 3 ? 'large' : ''}`} onClick={() => navigateTo('customizer', product.key)}>
              <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>
                <div className="product-overlay"><span className="product-cta">Design Yours</span></div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <span className="product-price">From ${product.basePrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="editorial-section">
        <div className="editorial-image">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200" alt="Craftsmanship" />
        </div>
        <div className="editorial-content">
          <span className="editorial-label">Craftsmanship Redefined</span>
          <h2 className="editorial-title">The Art of Bespoke</h2>
          <p className="editorial-description">Every stitch tells a story. Our master tailors bring over 40 years of expertise to each garment, ensuring perfection in every detail.</p>
          <button className="editorial-btn" onClick={() => navigateTo('about')}>Learn More</button>
        </div>
      </section>

      <section className="editorial-section right">
        <div className="editorial-image">
          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200" alt="3D Designer" />
        </div>
        <div className="editorial-content">
          <span className="editorial-label">3D Design Experience</span>
          <h2 className="editorial-title">Your Vision, Our Canvas</h2>
          <p className="editorial-description">Visualize your creation in real-time with our revolutionary 360° designer. Choose from hundreds of fabrics, styles, and personalization options.</p>
          <button className="editorial-btn" onClick={() => navigateTo('customizer', 'shirts')}>Start Designing</button>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <div className="section-header">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Four Simple Steps</h2>
        </div>
        <div className="process-grid">
          {[
            { num: '01', title: 'Choose Your Fabric', desc: 'Browse our collection of over 450 premium fabrics from the world\'s finest mills' },
            { num: '02', title: 'Design Your Style', desc: 'Customize every detail with our intuitive 3D designer — collars, cuffs, buttons, and more' },
            { num: '03', title: 'Enter Measurements', desc: 'Follow our simple guide or use standard sizes — our tailors ensure a perfect fit' },
            { num: '04', title: 'Receive Your Creation', desc: 'Expertly crafted and delivered worldwide in 2-3 weeks with our fit guarantee' },
          ].map((step, i) => (
            <div key={i} className="process-step">
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header light">
          <span className="section-label">Client Stories</span>
          <h2 className="section-title">What They Say</h2>
        </div>
        <div className="testimonials-grid">
          {[
            { quote: "The fit is absolutely perfect. I've never had a shirt that feels this tailored to my body.", author: 'James M.', location: 'New York, USA' },
            { quote: "Exceptional quality and attention to detail. The 3D designer made it so easy to visualize.", author: 'David L.', location: 'London, UK' },
            { quote: "From fabric selection to delivery, the entire experience was seamless. My suit exceeded all expectations.", author: 'Michael R.', location: 'Sydney, Australia' },
          ].map((t, i) => (
            <div key={i} className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">"{t.quote}"</blockquote>
              <div className="testimonial-author">
                <span className="author-name">{t.author}</span>
                <span className="author-location">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Begin Your Bespoke Journey</h2>
          <p className="cta-description">Experience the art of custom tailoring with our easy-to-use 3D designer</p>
          <div className="cta-actions">
            <button className="cta-btn primary" onClick={() => navigateTo('customizer', 'shirts')}>Design a Shirt</button>
            <button className="cta-btn secondary" onClick={() => navigateTo('customizer', 'suits')}>Design a Suit</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// PRODUCT CUSTOMIZER PAGE
// ============================================
function ProductCustomizer({ productType, navigateTo }) {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState(fabrics[0]);
  const [selectedStyles, setSelectedStyles] = useState({});
  const [selectedButton, setSelectedButton] = useState(buttonOptions[0]);
  const [selectedThread, setSelectedThread] = useState(threadColors[0]);
  const [monogram, setMonogram] = useState({ text: '', color: threadColors[4] });
  const [measurementType, setMeasurementType] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedFit, setSelectedFit] = useState('standard');
  const [previewAngle, setPreviewAngle] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [fabricApplication, setFabricApplication] = useState({ sleeve: true, body: true, collar: true });

  const product = productCategories[productType] || productCategories.shirts;
  const steps = ['Fabric', 'Style', 'Details', 'Measurements'];

  useEffect(() => {
    const defaults = {};
    Object.entries(styleOptions).forEach(([cat, opts]) => { if (opts.length) defaults[cat] = opts[0]; });
    setSelectedStyles(defaults);
  }, [productType]);

  const calculatePrice = useCallback(() => {
    let total = product.basePrice;
    if (selectedFabric?.price) total += selectedFabric.price;
    Object.values(selectedStyles).forEach(s => { if (s?.price) total += s.price; });
    if (selectedButton?.price) total += selectedButton.price;
    return total * quantity;
  }, [product, selectedFabric, selectedStyles, selectedButton, quantity]);

  const handleAddToCart = () => {
    addToCart({
      productType, name: product.name, fabricId: selectedFabric?.id, fabricName: selectedFabric?.name,
      fabricColor: selectedFabric?.color, fabricPattern: selectedFabric?.pattern,
      fabricPatternColors: selectedFabric?.colors, fabricApplication: selectedFabric?.pattern ? fabricApplication : null,
      styles: selectedStyles, button: selectedButton,
      monogram, fit: fitTypes.find(f => f.id === selectedFit)?.name, quantity, price: calculatePrice() / quantity,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="customizer-step fabric-step">
            <div className="step-header">
              <h2 className="step-title">Choose Your Fabric</h2>
              <p className="step-subtitle">Select from our premium collection of {fabrics.length} fabrics</p>
            </div>
            <div className="fabrics-grid">
              {fabrics.map(fabric => (
                <div key={fabric.id} className={`fabric-card ${selectedFabric?.id === fabric.id ? 'selected' : ''}`} onClick={() => setSelectedFabric(fabric)}>
                  <div
                    className={`fabric-swatch ${fabric.pattern === 'check' ? 'fabric-swatch-check' : ''}`}
                    style={fabric.pattern === 'check'
                      ? {
                        background: `repeating-conic-gradient(${fabric.colors[0]} 0% 25%, ${fabric.colors[1]} 0% 50%) 50% / 16px 16px`
                      }
                      : { backgroundColor: fabric.color }}
                  >
                    {selectedFabric?.id === fabric.id && <div className="fabric-check">✓</div>}
                  </div>
                  <div className="fabric-info">
                    <h4 className="fabric-name">{fabric.name}</h4>
                    <p className="fabric-details">{fabric.weave} · {fabric.weight}</p>
                    {fabric.price > 0 && <span className="fabric-price">+${fabric.price}</span>}
                  </div>
                </div>
              ))}
            </div>
            {selectedFabric && (
              <div className="selected-fabric-details">
                <h3>Selected: {selectedFabric.name}</h3>
                <div className="fabric-specs">
                  <span>Weight: {selectedFabric.weight}</span>
                  <span>Yarn: {selectedFabric.yarn}</span>
                  <span>Weave: {selectedFabric.weave}</span>
                  <span>Season: {selectedFabric.season}</span>
                </div>
                {selectedFabric.pattern === 'check' && (
                  <div className="fabric-application-section">
                    <h4>Apply Pattern To:</h4>
                    <div className="fabric-application-options">
                      <label className={`application-option ${fabricApplication.body ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={fabricApplication.body}
                          onChange={(e) => setFabricApplication(prev => ({ ...prev, body: e.target.checked }))}
                        />
                        <span className="option-label">Body</span>
                      </label>
                      <label className={`application-option ${fabricApplication.sleeve ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={fabricApplication.sleeve}
                          onChange={(e) => setFabricApplication(prev => ({ ...prev, sleeve: e.target.checked }))}
                        />
                        <span className="option-label">Sleeve</span>
                      </label>
                      <label className={`application-option ${fabricApplication.collar ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={fabricApplication.collar}
                          onChange={(e) => setFabricApplication(prev => ({ ...prev, collar: e.target.checked }))}
                        />
                        <span className="option-label">Collar</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="customizer-step style-step">
            <div className="step-header">
              <h2 className="step-title">Customize Your Style</h2>
              <p className="step-subtitle">Define every detail to match your vision</p>
            </div>
            <div className="style-categories">
              {Object.entries(styleOptions).map(([category, options]) => (
                <div key={category} className="style-category">
                  <h3 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className="style-options">
                    {options.map(option => (
                      <div key={option.id} className={`style-option ${selectedStyles[category]?.id === option.id ? 'selected' : ''}`} onClick={() => setSelectedStyles(prev => ({ ...prev, [category]: option }))}>
                        <div className="option-icon">{option.icon}</div>
                        <div className="option-info">
                          <span className="option-name">{option.name}</span>
                          <span className="option-desc">{option.description}</span>
                          {option.price > 0 && <span className="option-price">+${option.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="customizer-step details-step">
            <div className="step-header">
              <h2 className="step-title">Finishing Details</h2>
              <p className="step-subtitle">Add the perfect finishing touches</p>
            </div>
            <div className="details-sections">
              <div className="detail-section">
                <h3>Button Style</h3>
                <div className="button-options">
                  {buttonOptions.map(btn => (
                    <button key={btn.id} className={`button-option ${selectedButton?.id === btn.id ? 'selected' : ''}`} onClick={() => setSelectedButton(btn)}>
                      <span className="btn-swatch" style={{ backgroundColor: btn.color, border: btn.color === '#FFFFFF' ? '1px solid #ddd' : 'none' }} />
                      <span className="btn-name">{btn.name}</span>
                      {btn.price > 0 && <span className="btn-price">+${btn.price}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h3>Buttonhole Thread</h3>
                <div className="thread-options">
                  {threadColors.map(thread => (
                    <button key={thread.id} className={`thread-option ${selectedThread?.id === thread.id ? 'selected' : ''}`} onClick={() => setSelectedThread(thread)} title={thread.name}>
                      <span className="thread-swatch" style={{ backgroundColor: thread.color }} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h3>Monogram (Free)</h3>
                <div className="monogram-config">
                  <div className="monogram-input">
                    <label>Initials (up to 4 characters)</label>
                    <input type="text" maxLength={4} value={monogram.text} onChange={(e) => setMonogram(prev => ({ ...prev, text: e.target.value.toUpperCase() }))} placeholder="e.g., JDS" />
                  </div>
                  {monogram.text && (
                    <div className="monogram-colors">
                      <label>Color</label>
                      <div className="color-options">
                        {threadColors.map(color => (
                          <button key={color.id} className={`color-btn ${monogram.color?.id === color.id ? 'selected' : ''}`} onClick={() => setMonogram(prev => ({ ...prev, color }))} style={{ backgroundColor: color.color }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="customizer-step measurements-step">
            <div className="step-header">
              <h2 className="step-title">Your Measurements</h2>
              <p className="step-subtitle">Choose how you'd like to provide your sizing</p>
            </div>
            {!measurementType && (
              <div className="measurement-types">
                <div className="measurement-type-card" onClick={() => setMeasurementType('later')}>
                  <div className="type-icon">📧</div>
                  <h3>Provide Later</h3>
                  <p>Our stylist will guide you via email or WhatsApp</p>
                </div>
                <div className="measurement-type-card" onClick={() => setMeasurementType('standard')}>
                  <div className="type-icon">📏</div>
                  <h3>Standard Sizes</h3>
                  <p>Select from our standard size chart</p>
                </div>
                <div className="measurement-type-card" onClick={() => setMeasurementType('body')}>
                  <div className="type-icon">✂️</div>
                  <h3>Body Measurements</h3>
                  <p>Enter your exact measurements</p>
                </div>
              </div>
            )}
            {measurementType === 'standard' && (
              <div className="standard-sizes">
                <button className="back-to-types" onClick={() => setMeasurementType(null)}>← Back</button>
                <h3>Select Your Size</h3>
                <div className="size-buttons">
                  {Object.keys(standardSizes).map(size => (
                    <button key={size} className={`size-btn ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
                  ))}
                </div>
                <h3>Select Your Fit</h3>
                <div className="fit-options">
                  {fitTypes.map(fit => (
                    <div key={fit.id} className={`fit-option ${selectedFit === fit.id ? 'selected' : ''}`} onClick={() => setSelectedFit(fit.id)}>
                      <span className="fit-name">{fit.name}</span>
                      <span className="fit-desc">{fit.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {measurementType === 'later' && (
              <div className="provide-later">
                <button className="back-to-types" onClick={() => setMeasurementType(null)}>← Back</button>
                <div className="later-info">
                  <div className="type-icon">📧</div>
                  <h3>We'll Guide You</h3>
                  <p>After your order, our expert stylist will contact you to guide you through the measurement process.</p>
                  <ul>
                    <li>✓ Personal measurement assistance</li>
                    <li>✓ Video call option available</li>
                    <li>✓ Step-by-step guidance</li>
                    <li>✓ Fit guarantee included</li>
                  </ul>
                </div>
              </div>
            )}
            {measurementType === 'body' && (
              <div className="body-measurements">
                <button className="back-to-types" onClick={() => setMeasurementType(null)}>← Back</button>
                <p>Enter your measurements using our size guide (feature coming soon)</p>
                <h3>Select Your Fit</h3>
                <div className="fit-options">
                  {fitTypes.map(fit => (
                    <div key={fit.id} className={`fit-option ${selectedFit === fit.id ? 'selected' : ''}`} onClick={() => setSelectedFit(fit.id)}>
                      <span className="fit-name">{fit.name}</span>
                      <span className="fit-desc">{fit.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {measurementType && (
              <div className="quantity-section">
                <h3>Quantity</h3>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="customizer-page">
      <div className="customizer-container">
        <div className="preview-panel">
          <div className="preview-header">
            <button className="back-btn" onClick={() => navigateTo('home')}>← Back</button>
            <h1 className="preview-title">{product.name}</h1>
          </div>
          <div className="preview-display">
            <div className="product-preview" style={{ transform: `rotateY(${previewAngle}deg)`, backgroundColor: selectedFabric?.color || '#f0f0f0' }}>
              <div className="preview-placeholder">
                <div className="garment-body" style={{ backgroundColor: selectedFabric?.color || '#fff' }}>
                  <div className="collar-preview">{selectedStyles.collar?.name || 'Classic'}</div>
                  <div className="button-preview">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="btn-dot" style={{ backgroundColor: selectedButton?.color }} />)}
                  </div>
                  {monogram.text && <div className="monogram-preview" style={{ color: monogram.color?.color }}>{monogram.text}</div>}
                </div>
                <span className="preview-label">360° Preview</span>
              </div>
            </div>
            <div className="preview-controls">
              <button onClick={() => setPreviewAngle(prev => prev - 45)}>↺</button>
              <button onClick={() => setPreviewAngle(0)}>Front</button>
              <button onClick={() => setPreviewAngle(prev => prev + 45)}>↻</button>
            </div>
          </div>
          <div className="preview-summary">
            <div className="summary-row"><span>Fabric</span><span>{selectedFabric?.name}</span></div>
            <div className="summary-row"><span>Collar</span><span>{selectedStyles.collar?.name}</span></div>
            <div className="summary-row"><span>Cuff</span><span>{selectedStyles.cuff?.name}</span></div>
            <div className="summary-total"><span>Total</span><span className="total-price">${calculatePrice().toFixed(2)}</span></div>
          </div>
        </div>
        <div className="customization-panel">
          <div className="steps-nav">
            {steps.map((step, index) => (
              <button key={step} className={`step-nav-btn ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`} onClick={() => setCurrentStep(index + 1)}>
                <span className="step-number">{index + 1}</span>
                <span className="step-name">{step}</span>
              </button>
            ))}
          </div>
          <div className="step-content">{renderStepContent()}</div>
          <div className="step-actions">
            {currentStep > 1 && <button className="step-btn secondary" onClick={() => setCurrentStep(prev => prev - 1)}>← Back</button>}
            {currentStep < steps.length ? (
              <button className="step-btn primary" onClick={() => setCurrentStep(prev => prev + 1)}>Continue →</button>
            ) : (
              <button className="step-btn primary add-to-cart" onClick={handleAddToCart} disabled={!measurementType}>Add to Bag — ${calculatePrice().toFixed(2)}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OTHER PAGES
// ============================================
function AboutPage({ navigateTo }) {
  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>Our Story</h1>
        <p>Four decades of excellence in bespoke tailoring</p>
      </section>
      <section className="page-content">
        <div className="content-block">
          <h2>The Maison Legacy</h2>
          <p>Founded in 1983, Maison has been at the forefront of custom tailoring, combining traditional craftsmanship with modern technology. Our master tailors bring decades of experience to every garment, ensuring that each piece meets our exacting standards.</p>
        </div>
        <div className="content-block">
          <h2>Our Commitment</h2>
          <p>We believe that exceptional clothing should be accessible to everyone. Our innovative 3D design platform and streamlined production process allow us to offer bespoke quality at ready-to-wear prices, without compromising on materials or craftsmanship.</p>
        </div>
      </section>
    </div>
  );
}

function ContactPage({ navigateTo }) {
  return (
    <div className="contact-page">
      <section className="page-hero">
        <h1>Contact Us</h1>
        <p>We're here to help with your bespoke journey</p>
      </section>
      <section className="page-content">
        <div className="contact-info">
          <h3>Customer Service</h3>
          <p>Available 24/7</p>
          <p>Email: info@maison-bespoke.com</p>
        </div>
        <form className="contact-form">
          <div className="form-group"><label>Name</label><input type="text" placeholder="Your name" /></div>
          <div className="form-group"><label>Email</label><input type="email" placeholder="Your email" /></div>
          <div className="form-group"><label>Message</label><textarea placeholder="How can we help?" rows={5} /></div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </section>
    </div>
  );
}

function ProductCatalog({ productType, navigateTo }) {
  const product = productCategories[productType] || productCategories.shirts;
  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <div className="catalog-hero-bg" style={{ backgroundImage: `url(${product.heroImage})` }} />
        <div className="catalog-hero-overlay" />
        <div className="catalog-hero-content">
          <span className="catalog-label">The Collection</span>
          <h1 className="catalog-title">{product.name}</h1>
          <p className="catalog-description">{product.description}</p>
        </div>
      </section>
      <div className="catalog-grid">
        {fabrics.map((fabric, i) => (
          <div key={fabric.id} className="catalog-item" onClick={() => navigateTo('customizer', productType)}>
            <div className="catalog-item-image" style={{ backgroundColor: fabric.color }}>
              <div className="item-overlay"><button className="quick-customize-btn">Customize Now</button></div>
            </div>
            <div className="catalog-item-info">
              <h3 className="item-name">{product.name.replace('Custom ', '')} in {fabric.name}</h3>
              <p className="item-details">{fabric.weave} · {fabric.weight}</p>
              <div className="item-price"><span className="price-from">From </span><span className="price-value">${(product.basePrice + fabric.price).toFixed(2)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartPage({ navigateTo }) {
  const { cartItems, getCartTotal, removeFromCart } = useCart();
  return (
    <div className="cart-page-full">
      <h1>Your Shopping Bag</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your bag is empty</p>
          <button onClick={() => navigateTo('home')}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-items-full">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-full">
              <div className="item-color" style={{ backgroundColor: item.fabricColor }} />
              <div className="item-details"><h3>{item.name}</h3><p>{item.fabricName}</p></div>
              <div className="item-price">${item.price?.toFixed(2)}</div>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">Total: ${getCartTotal().toFixed(2)}</div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [productType, setProductType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (page, product = null) => {
    setCurrentPage(page);
    if (product) setProductType(product);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigateTo={navigateTo} />;
      case 'customizer': return <ProductCustomizer productType={productType} navigateTo={navigateTo} />;
      case 'catalog': return <ProductCatalog productType={productType} navigateTo={navigateTo} />;
      case 'cart': return <CartPage navigateTo={navigateTo} />;
      case 'about': return <AboutPage navigateTo={navigateTo} />;
      case 'contact': return <ContactPage navigateTo={navigateTo} />;
      default: return <HomePage navigateTo={navigateTo} />;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-logo">MAISON</h1>
          <p className="loading-tagline">Bespoke Tailoring</p>
          <div className="loading-bar"><div className="loading-progress"></div></div>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <CartProvider>
        <div className="app">
          <Header navigateTo={navigateTo} currentPage={currentPage} />
          <main className="main-content">{renderPage()}</main>
          <Footer navigateTo={navigateTo} />
        </div>
      </CartProvider>
    </UserProvider>
  );
}
