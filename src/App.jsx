import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
  shirts: { name: 'Custom Shirts', basePrice: 49.99 },
  kurta: { name: 'Anarkali Kurti', basePrice: 89.99 },
  jackets: { name: 'Custom Jackets', basePrice: 169 },
  pants: { name: 'Custom Pants', basePrice: 74 },
};

const fabricCategories = [
  { id: 'all', name: 'View All', price: null },
  { id: 'daily', name: 'Shirt of the Day', price: 49.99 },
  { id: 'white', name: 'The White', price: 64.99 },
  { id: 'solid', name: 'Solid Colors', price: 64.99 },
  { id: 'premium', name: 'Premium Solid', price: 74.99 },
  { id: 'tone', name: 'Tone-on-Tone', price: 79.99 },
  { id: 'pattern', name: 'Pattern/Organic', price: 79.99 },
  { id: 'check', name: 'Checkered', price: 84.99 },
];

const fabrics = [
  // Whites
  { id: 'f1', name: 'Premium White', color: '#FFFFFF', category: 'white', weave: 'Poplin', weight: '125g', yarn: '100% Cotton', price: 64.99, promo: false },
  { id: 'f2', name: 'Signature White', color: '#FAFAFA', category: 'white', weave: 'Twill', weight: '130g', yarn: '100% Cotton', price: 64.99, promo: false },
  { id: 'f3', name: 'White Herringbone', color: '#F8F8F8', category: 'white', weave: 'Herringbone', weight: '135g', yarn: '100% Cotton', price: 49.99, promo: true },

  // Solid Colors
  { id: 'f4', name: 'Sky Blue', color: '#87CEEB', category: 'solid', weave: 'Poplin', weight: '130g', yarn: '100% Cotton', price: 64.99, promo: false },
  { id: 'f5', name: 'Navy Blue Pinpoint', color: '#1E3A5F', category: 'solid', weave: 'Pinpoint', weight: '140g', yarn: '100% Cotton', price: 49.99, promo: true },
  { id: 'f6', name: 'Light Pink', color: '#FFB6C1', category: 'solid', weave: 'Oxford', weight: '125g', yarn: '100% Cotton', price: 64.99, promo: false },
  { id: 'f7', name: 'Black Shirt', color: '#1A1A1A', category: 'solid', weave: 'Satin', weight: '140g', yarn: '100% Cotton', price: 64.99, promo: false },
  { id: 'f8', name: 'Burgundy', color: '#722F37', category: 'solid', weave: 'Twill', weight: '140g', yarn: '100% Cotton', price: 64.99, promo: false },
  { id: 'f9', name: 'Royal Blue', color: '#4169E1', category: 'solid', weave: 'Oxford', weight: '135g', yarn: '100% Cotton', price: 64.99, promo: false },

  // Premium Solid
  { id: 'f10', name: 'Dusty Rose', color: '#DCAE96', category: 'premium', weave: 'Twill', weight: '140g', yarn: '100% Egyptian Cotton', price: 74.99, promo: false },
  { id: 'f11', name: 'Mauve Shirt', color: '#E0B0FF', category: 'premium', weave: 'Poplin', weight: '130g', yarn: '100% Egyptian Cotton', price: 74.99, promo: false },
  { id: 'f12', name: 'Lavender', color: '#E6E6FA', category: 'premium', weave: 'Poplin', weight: '125g', yarn: '100% Egyptian Cotton', price: 74.99, promo: false },
  { id: 'f13', name: 'Purple Shirt', color: '#9370DB', category: 'premium', weave: 'Twill', weight: '135g', yarn: '100% Egyptian Cotton', price: 74.99, promo: false },

  // Tone-on-Tone
  { id: 'f14', name: 'Lime Green', color: '#98FB98', category: 'tone', weave: 'Jacquard', weight: '140g', yarn: '100% Cotton', price: 79.99, promo: false },
  { id: 'f15', name: 'Yellow Shirt', color: '#FFFF00', category: 'tone', weave: 'Dobby', weight: '130g', yarn: '100% Cotton', price: 79.99, promo: false },
  { id: 'f16', name: 'Mustard', color: '#C4A000', category: 'tone', weave: 'Jacquard', weight: '140g', yarn: '100% Cotton', price: 79.99, promo: false },
  { id: 'f17', name: 'Sage Green', color: '#8FBC8F', category: 'tone', weave: 'Dobby', weight: '135g', yarn: '100% Cotton', price: 79.99, promo: false },

  // Pattern
  { id: 'f18', name: 'Charcoal Grey', color: '#36454F', category: 'pattern', weave: 'Herringbone', weight: '150g', yarn: '100% Cotton', price: 79.99, promo: false },
  { id: 'f19', name: 'Light Grey', color: '#D3D3D3', category: 'pattern', weave: 'Glen Check', weight: '135g', yarn: '100% Cotton', price: 79.99, promo: false },
  { id: 'f20', name: 'Cream', color: '#FFFDD0', category: 'pattern', weave: 'Oxford', weight: '130g', yarn: '100% Cotton', price: 79.99, promo: false },

  // Checkered/Cheque Patterns
  { id: 'c1', name: 'Classic Blue Check', pattern: 'check', colors: ['#FFFFFF', '#4A90D9'], category: 'check', weave: 'Twill', weight: '135g', yarn: '100% Cotton', price: 84.99, promo: false },
  { id: 'c2', name: 'Tartan Red Check', pattern: 'check', colors: ['#FFFFFF', '#C41E3A', '#1E3A5F'], category: 'check', weave: 'Twill', weight: '140g', yarn: '100% Cotton', price: 89.99, promo: false },
  { id: 'c3', name: 'Gingham Black Check', pattern: 'check', colors: ['#FFFFFF', '#1A1A1A'], category: 'check', weave: 'Poplin', weight: '130g', yarn: '100% Cotton', price: 84.99, promo: false },
  { id: 'c4', name: 'Hunter Green Check', pattern: 'check', colors: ['#FFFFFF', '#228B22'], category: 'check', weave: 'Twill', weight: '140g', yarn: '100% Cotton', price: 84.99, promo: false },
  { id: 'c5', name: 'Navy Windowpane Check', pattern: 'check', colors: ['#F5F5F5', '#1E3A5F'], category: 'check', weave: 'Oxford', weight: '140g', yarn: '100% Cotton', price: 89.99, promo: false },

  // NEW FABRICS FROM SPREADSHEET - WITH TEXTURE IMAGES (Local)
  // Cotton Linen Fabrics
  { id: 'sp4', name: 'Cotton Linen Purple', color: '#4A235A', image: '/fabrics/cotton-linen-purple.jpg', category: 'solid', weave: 'Plain', weight: '121g', yarn: 'Cotton Linen', price: 59.99, promo: false },

  // Viscose Uppada Fabrics (Black Floral Pattern)
  { id: 'sp6', name: 'Uppada Midnight Meadow', color: '#F8F8F0', image: '/fabrics/midnight-meadow.jpg', category: 'pattern', weave: 'Jacquard', weight: '96g', yarn: 'Viscose', price: 99.99, promo: true },
];

const styleCategories = [
  { id: 'sleeve', name: 'Sleeve' },
  { id: 'front', name: 'Front' },
  { id: 'back', name: 'Back' },
  { id: 'bottom', name: 'Bottom' },
  { id: 'collar', name: 'Collar' },
  { id: 'cuffs', name: 'Cuffs' },
  { id: 'pockets', name: 'Pockets' },
];

// SVG illustrations for each style option
const styleIcons = {
  // Sleeve styles
  sl1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 20 L40 15 L55 20 L55 65 L40 70 L25 65 Z"/><path d="M25 20 L10 35 L10 55 L25 65"/><path d="M55 20 L70 35 L70 55 L55 65"/></svg>`,
  sl2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 20 L40 15 L55 20 L55 65 L40 70 L25 65 Z"/><path d="M25 20 L10 35 L15 45 L25 50"/><path d="M55 20 L70 35 L65 45 L55 50"/><path d="M12 42 L18 48"/><path d="M68 42 L62 48"/></svg>`,
  sl3: `<svg viewBox="0 0 80 80" fill="none" stroke="#00A86B" stroke-width="1.5"><path d="M25 25 L40 20 L55 25 L55 65 L40 70 L25 65 Z"/><path d="M25 25 L15 35 L15 40 L25 42"/><path d="M55 25 L65 35 L65 40 L55 42"/></svg>`,
  // Front styles  
  fr1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="25" y="15" width="30" height="55" rx="2"/><line x1="40" y1="15" x2="40" y2="70"/><circle cx="40" cy="25" r="2"/><circle cx="40" cy="35" r="2"/><circle cx="40" cy="45" r="2"/><circle cx="40" cy="55" r="2"/></svg>`,
  fr2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="25" y="15" width="30" height="55" rx="2"/><rect x="35" y="15" width="10" height="55"/><circle cx="40" cy="25" r="2"/><circle cx="40" cy="35" r="2"/><circle cx="40" cy="45" r="2"/><circle cx="40" cy="55" r="2"/></svg>`,
  fr3: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="25" y="15" width="30" height="55" rx="2"/><line x1="40" y1="15" x2="40" y2="70" stroke-dasharray="4 2"/></svg>`,
  // Back styles
  bk1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 20 L40 15 L60 20 L60 70 L40 75 L20 70 Z"/></svg>`,
  bk2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 20 L40 15 L60 20 L60 70 L40 75 L20 70 Z"/><path d="M35 20 L35 45 L45 45 L45 20"/></svg>`,
  bk3: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 20 L40 15 L60 20 L60 70 L40 75 L20 70 Z"/><path d="M25 20 L25 50"/><path d="M55 20 L55 50"/></svg>`,
  bk4: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 20 L40 15 L60 20 L60 70 L40 75 L20 70 Z"/><path d="M40 20 L35 50 L45 50 L40 20"/></svg>`,
  // Bottom styles
  bt1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 20 L60 20 L60 55 Q40 70 20 55 Z"/></svg>`,
  bt2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="20" y="20" width="40" height="40"/></svg>`,
  bt3: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 20 L60 20 L60 60 L20 60 Z"/><path d="M20 50 L20 60"/><path d="M60 50 L60 60"/></svg>`,
  // Collar styles
  co1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 50 L30 30 L40 40 L50 30 L60 50"/><path d="M30 30 L40 20 L50 30"/></svg>`,
  co2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M20 50 L30 30 L40 40 L50 30 L60 50"/><path d="M30 30 L40 20 L50 30"/><circle cx="35" cy="38" r="2"/><circle cx="45" cy="38" r="2"/></svg>`,
  co3: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M15 55 L30 25 L40 35 L50 25 L65 55"/><path d="M30 25 L40 15 L50 25"/></svg>`,
  co4: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M15 55 L30 25 L40 35 L50 25 L65 55"/><path d="M30 25 L40 15 L50 25"/><circle cx="33" cy="35" r="2"/><circle cx="47" cy="35" r="2"/></svg>`,
  co5: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M10 55 L25 20 L40 35 L55 20 L70 55"/><path d="M25 20 L40 10 L55 20"/></svg>`,
  co6: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M10 55 L25 20 L40 35 L55 20 L70 55"/><path d="M25 20 L40 10 L55 20"/><circle cx="30" cy="32" r="2"/><circle cx="50" cy="32" r="2"/></svg>`,
  // Pocket styles
  pk1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><line x1="25" y1="25" x2="55" y2="55"/><line x1="55" y1="25" x2="25" y2="55"/></svg>`,
  pk2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 25 L55 25 L55 55 Q40 60 25 55 Z"/></svg>`,
  pk3: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 25 L55 25 L55 55 L25 50 Z"/></svg>`,
  pk4: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 30 L40 25 L55 30 L55 55 L25 55 Z"/></svg>`,
  pk5: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="25" y="25" width="30" height="30"/></svg>`,
  pk6: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 30 L55 30 L55 55 Q40 60 25 55 Z"/><path d="M25 30 Q40 35 55 30"/></svg>`,
  pk7: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 30 L55 30 L55 55 L25 50 Z"/><path d="M25 30 L55 35"/></svg>`,
  pk8: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 30 L40 25 L55 30 L55 55 L25 55 Z"/><path d="M25 30 L40 35 L55 30"/></svg>`,
  pk9: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M25 30 L55 30 L55 55 Q40 60 25 55 Z"/><path d="M25 30 Q40 35 55 30"/><circle cx="40" cy="42" r="5"/></svg>`,
  // Cuff styles
  cf1: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="15" y="25" width="50" height="30" rx="15"/><circle cx="40" cy="40" r="3"/></svg>`,
  cf2: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M15 25 L65 25 L65 55 L15 55 Z"/><path d="M35 25 L35 55"/><path d="M45 25 L45 55"/><circle cx="40" cy="40" r="3"/></svg>`,
  cf3: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="15" y="25" width="50" height="30"/><circle cx="40" cy="40" r="3"/></svg>`,
  cf4: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="15" y="25" width="50" height="30" rx="15"/><circle cx="32" cy="40" r="3"/><circle cx="48" cy="40" r="3"/></svg>`,
  cf5: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M15 25 L65 25 L65 55 L15 55 Z"/><path d="M35 25 L35 55"/><path d="M45 25 L45 55"/><circle cx="32" cy="40" r="3"/><circle cx="48" cy="40" r="3"/></svg>`,
  cf6: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="15" y="25" width="50" height="30"/><circle cx="32" cy="40" r="3"/><circle cx="48" cy="40" r="3"/></svg>`,
  cf7: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="15" y="20" width="50" height="40" rx="15"/><rect x="30" y="35" width="20" height="10"/></svg>`,
  cf8: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><path d="M15 20 L65 20 L65 60 L15 60 Z"/><path d="M35 20 L35 60"/><path d="M45 20 L45 60"/><rect x="30" y="35" width="20" height="10"/></svg>`,
  cf9: `<svg viewBox="0 0 80 80" fill="none" stroke="#5D4037" stroke-width="1.5"><rect x="15" y="20" width="50" height="40"/><rect x="30" y="35" width="20" height="10"/></svg>`,
};

const styleOptions = {
  sleeve: [
    { id: 'sl1', name: 'Long Sleeve', price: 0 },
    { id: 'sl2', name: 'Long Sleeve Roll Up', price: 0 },
    { id: 'sl3', name: 'Short Sleeve', price: 0 },
  ],
  front: [
    { id: 'fr1', name: 'Single Placket', price: 0 },
    { id: 'fr2', name: 'Box Placket', price: 0 },
    { id: 'fr3', name: 'Hidden Buttons', price: 5 },
  ],
  back: [
    { id: 'bk1', name: 'Plain', price: 0 },
    { id: 'bk2', name: 'Box Pleat', price: 0 },
    { id: 'bk3', name: 'Side Pleats', price: 0 },
    { id: 'bk4', name: 'Center Pleats', price: 0 },
  ],
  bottom: [
    { id: 'bt1', name: 'Curved Hem', price: 0 },
    { id: 'bt2', name: 'Straight', price: 0 },
    { id: 'bt3', name: 'Straight Vents', price: 0 },
  ],
  collar: [
    { id: 'co1', name: 'Italian Collar 1 Button', price: 0 },
    { id: 'co2', name: 'Italian Collar 2 Button', price: 0 },
    { id: 'co3', name: 'French Collar 1 Button', price: 0 },
    { id: 'co4', name: 'French Collar 2 Button', price: 0 },
    { id: 'co5', name: 'Cut Away 1 Button', price: 0 },
    { id: 'co6', name: 'Cut Away 2 Button', price: 0 },
  ],
  cuffs: [
    { id: 'cf1', name: '1 Button Round', price: 0 },
    { id: 'cf2', name: '1 Button Angle', price: 0 },
    { id: 'cf3', name: '1 Button Square', price: 0 },
    { id: 'cf4', name: '2 Button Round', price: 0 },
    { id: 'cf5', name: '2 Button Angle', price: 0 },
    { id: 'cf6', name: '2 Button Square', price: 0 },
    { id: 'cf7', name: 'French Round', price: 5 },
    { id: 'cf8', name: 'French Angle', price: 5 },
    { id: 'cf9', name: 'French Square', price: 5 },
  ],
  pockets: [
    { id: 'pk1', name: 'No Pocket', price: 0 },
    { id: 'pk2', name: 'Classic Round', price: 0 },
    { id: 'pk3', name: 'Classic Angle', price: 0 },
    { id: 'pk4', name: 'Diamond Straight', price: 0 },
    { id: 'pk5', name: 'Classic Square', price: 0 },
    { id: 'pk6', name: 'Round Flap', price: 5 },
    { id: 'pk7', name: 'Angle Flap', price: 5 },
    { id: 'pk8', name: 'Diamond Flap', price: 5 },
    { id: 'pk9', name: 'Round with Glass', price: 10 },
  ],
};

// Anarkali Kurti style categories
const kurtaStyleCategories = [
  { id: 'neckFront', name: 'Neck Front' },
  { id: 'neckBack', name: 'Neck Back' },
  { id: 'sleeve', name: 'Sleeve' },
  { id: 'bottom', name: 'Length' },
];

// Anarkali Kurti style options - mapped to actual mesh names
const kurtaStyleOptions = {
  neckFront: [
    { id: 'nf1', name: 'Round Neck', meshName: 'Neck_Front_Round', price: 0 },
    { id: 'nf2', name: 'V-Neck', meshName: 'Neck_front_V', price: 0 },
    { id: 'nf3', name: 'U-Neck', meshName: 'Neck_front_U', price: 0 },
    { id: 'nf4', name: 'Square Neck', meshName: 'Neck_front_square', price: 0 },
    { id: 'nf5', name: 'Scoop Neck', meshName: 'neck_front_scoop', price: 0 },
    { id: 'nf6', name: 'Boat Neck', meshName: 'Neck_front_boat', price: 0 },
    { id: 'nf7', name: 'Sweetheart', meshName: 'Neck_front_sweetheart', price: 5 },
    { id: 'nf8', name: 'V-Notch', meshName: 'Neck_front_V_notch', price: 0 },
    { id: 'nf9', name: 'Crew Neck', meshName: 'Neck_crew', price: 0 },
    { id: 'nf10', name: 'Halter Style 1', meshName: 'Neck_halter_1', price: 5 },
    { id: 'nf11', name: 'Halter Style 2', meshName: 'Neck_halter_2', price: 5 },
    { id: 'nf12', name: 'High Neck', meshName: 'Neck_high', price: 5 },
  ],
  neckBack: [
    { id: 'nb1', name: 'Basic Back', meshName: 'Neck_back_basic', price: 0 },
    { id: 'nb2', name: 'Round Back', meshName: 'Neck_back_round', price: 0 },
    { id: 'nb3', name: 'V-Back', meshName: 'neck_back_v', price: 0 },
    { id: 'nb4', name: 'U-Back', meshName: 'neck_back_u', price: 0 },
    { id: 'nb5', name: 'Square Back', meshName: 'neck_back_square', price: 0 },
    { id: 'nb6', name: 'Rectangle Back', meshName: 'Neck_back_Rectangle', price: 0 },
    { id: 'nb7', name: 'Boat Back', meshName: 'Neck_back_boat', price: 0 },
    { id: 'nb8', name: 'Deep Round', meshName: 'neck_back_deep_round', price: 5 },
    { id: 'nb9', name: 'Keyhole', meshName: 'neck_back_keyhole', price: 5 },
  ],
  sleeve: [
    { id: 'sl1', name: 'Short Basic', meshName: 'sleeve_basic_short', price: 0 },
    { id: 'sl2', name: 'Above Elbow', meshName: 'sleeve_basic_above_elbow', price: 0 },
    { id: 'sl3', name: 'Mid Length', meshName: 'sleeve_basic_midlength', price: 0 },
    { id: 'sl4', name: '3/4 Length', meshName: 'sleeve_basic_3quater', price: 0 },
    { id: 'sl5', name: 'Full Length', meshName: 'sleeve_basic_full', price: 0 },
    { id: 'sl6', name: 'Puff Short', meshName: 'sleeve_puff_Short', price: 5 },
    { id: 'sl7', name: 'Puff Above Elbow', meshName: 'sleeve_puff_above_elbow', price: 5 },
    { id: 'sl8', name: 'Bell 3/4', meshName: 'sleeve_bell_3-4', price: 5 },
    { id: 'sl9', name: 'Bell Full', meshName: 'sleeve_bell_full', price: 5 },
    { id: 'sl10', name: 'Butterfly', meshName: 'sleeve_butterfly', price: 10 },
    { id: 'sl11', name: 'Cape Long', meshName: 'sleeve_cape_long', price: 10 },
    { id: 'sl12', name: 'Flounce', meshName: 'sleeve_flounce', price: 5 },
    { id: 'sl13', name: 'Lantern', meshName: 'sleeve_lantern', price: 5 },
    { id: 'sl14', name: 'Bishop 3/4', meshName: 'sleeve_bishop_3_4th', price: 5 },
    { id: 'sl15', name: 'Bishop Long', meshName: 'sleeve_bishop_long', price: 5 },
    { id: 'sl16', name: 'Cap Short', meshName: 'sleeve_cap_short', price: 0 },
    { id: 'sl17', name: 'Flutter Short', meshName: 'sleeve_flutter_short', price: 5 },
    { id: 'sl18', name: 'Flutter Above Elbow', meshName: 'sleeve_flutter_above_elbow', price: 5 },
    { id: 'sl19', name: 'Balloon 3/4', meshName: 'sleeve_ballon_3_4th', price: 5 },
    { id: 'sl20', name: 'Balloon Long', meshName: 'sleeve_ballon_long', price: 5 },
  ],
  bottom: [
    { id: 'bt1', name: 'Short', meshName: 'Bottom_short', price: 0 },
    { id: 'bt2', name: 'Knee Length', meshName: 'Bottom_knee', price: 0 },
    { id: 'bt3', name: '3/4 Length', meshName: 'bottom_3_4', price: 0 },
    { id: 'bt4', name: 'Ankle Length', meshName: 'bottom_ankle', price: 5 },
    { id: 'bt5', name: 'Floor Length', meshName: 'bottom_floor', price: 10 },
    { id: 'bt6', name: '3/4 High-Low', meshName: 'bottom_3_4_high_low', price: 5 },
    { id: 'bt7', name: 'Ankle High-Low', meshName: 'bottom_ankle_high_low', price: 10 },
    { id: 'bt8', name: 'Floor High-Low', meshName: 'bottom_floor_high_low', price: 15 },
  ],
};

const extraOptions = {
  sleeve: [{ id: 'ep', name: 'Epaulettes', price: 5 }],
  front: [{ id: 'seams', name: 'Seams', price: 5 }],
};

// Button options - Regular, Mother of Pearl, Trendy
const buttonOptions = {
  regular: [
    { id: 'btn-w', name: 'White', color: '#FFFFFF', price: 0 },
    { id: 'btn-cr', name: 'Cream', color: '#FFFDD0', price: 0 },
    { id: 'btn-be', name: 'Beige', color: '#F5F5DC', price: 0 },
    { id: 'btn-y', name: 'Yellow', color: '#FFD700', price: 0 },
    { id: 'btn-o', name: 'Orange', color: '#FFA500', price: 0 },
    { id: 'btn-pk', name: 'Pink', color: '#FFB6C1', price: 0 },
    { id: 'btn-lb', name: 'Light Blue', color: '#87CEEB', price: 0 },
    { id: 'btn-db', name: 'Dark Blue', color: '#00008B', price: 0 },
    { id: 'btn-g', name: 'Green', color: '#228B22', price: 0 },
    { id: 'btn-r', name: 'Red', color: '#DC143C', price: 0 },
    { id: 'btn-br', name: 'Brown', color: '#8B4513', price: 0 },
    { id: 'btn-bl', name: 'Black', color: '#1A1A1A', price: 0 },
  ],
  motherOfPearl: [
    { id: 'mop-w', name: 'White MOP', color: '#FAFAFA', price: 1.99 },
    { id: 'mop-gr', name: 'Grey MOP', color: '#808080', price: 1.99 },
    { id: 'mop-be', name: 'Beige MOP', color: '#D4C4A8', price: 1.99 },
    { id: 'mop-y', name: 'Yellow MOP', color: '#F0E68C', price: 1.99 },
    { id: 'mop-pk', name: 'Pink MOP', color: '#FFE4E1', price: 1.99 },
    { id: 'mop-bl', name: 'Black MOP', color: '#2F2F2F', price: 1.99 },
  ],
  trendy: [
    { id: 'tr-bw', name: 'Black/White', color: '#1A1A1A', border: '#FFFFFF', price: 1.99 },
    { id: 'tr-gb', name: 'Gold/Black', color: '#DAA520', border: '#1A1A1A', price: 1.99 },
    { id: 'tr-og', name: 'Olive/Gold', color: '#808000', border: '#DAA520', price: 1.99 },
    { id: 'tr-rb', name: 'Red/Black', color: '#DC143C', border: '#1A1A1A', price: 1.99 },
    { id: 'tr-pb', name: 'Pink/Black', color: '#FFB6C1', border: '#1A1A1A', price: 1.99 },
  ],
};

// Thread options for buttonholes
const threadOptions = {
  toneOnTone: { id: 'tone', name: 'Tone on Tone', price: 0 },
  colorContrast: [
    { id: 'thr-w', name: 'White', color: '#FFFFFF' },
    { id: 'thr-bl', name: 'Black', color: '#000000' },
    { id: 'thr-nv', name: 'Navy', color: '#000080' },
    { id: 'thr-r', name: 'Red', color: '#DC143C' },
    { id: 'thr-g', name: 'Gold', color: '#DAA520' },
    { id: 'thr-lb', name: 'Light Blue', color: '#87CEEB' },
  ],
};

// Button hole styles
const buttonHoleStyles = [
  { id: 'bh1', name: 'Standard', price: 0 },
  { id: 'bh2', name: 'Keyhole', price: 0 },
  { id: 'bh3', name: 'Rounded', price: 0 },
];

// Contrast fabric options - only options that work with 3D preview
const contrastOptions = [
  { id: 'collar-out', name: 'Collar Outside', price: 0 },
  { id: 'cuff-out', name: 'Cuff Outside', price: 0 },
  { id: 'outside-placket', name: 'Outside Placket', price: 0 },
  { id: 'sleeve-fabric', name: 'Sleeve Fabric', price: 9.99 },
  { id: 'pocket', name: 'Pocket', price: 0 },
];

// Monogram positions
const monogramPositions = [
  { id: 'none', name: 'No Monogram', price: 0 },
  { id: 'collar', name: 'On Collar', price: 0 },
  { id: 'chest', name: 'On Chest', price: 0 },
  { id: 'sleeve', name: 'On Sleeve', price: 0 },
  { id: 'cuff-left', name: 'On Cuff (Left)', price: 0 },
  { id: 'cuff-right', name: 'On Cuff (Right)', price: 0 },
  { id: 'waist', name: 'On Waist', price: 0 },
  { id: 'placket', name: 'On Placket', price: 0 },
];

// Monogram fonts
const monogramFonts = [
  { id: 'block', name: 'BLOCK' },
  { id: 'script', name: 'Script' },
  { id: 'old-english', name: 'Old English' },
];

const threadColors = [
  // Row 1
  { id: 'th1', name: 'White', color: '#FFFFFF' },
  { id: 'th2', name: 'Cream', color: '#F5F5DC' },
  { id: 'th3', name: 'Yellow', color: '#FFD700' },
  { id: 'th4', name: 'Orange', color: '#FFA500' },
  { id: 'th5', name: 'Light Blue', color: '#87CEEB' },
  { id: 'th6', name: 'Sky Blue', color: '#6BB3D9' },
  // Row 2
  { id: 'th7', name: 'Royal Blue', color: '#0066CC' },
  { id: 'th8', name: 'Magenta', color: '#CC00CC' },
  { id: 'th9', name: 'Purple', color: '#800080' },
  { id: 'th10', name: 'Pink', color: '#FFB6C1' },
  // Row 3
  { id: 'th11', name: 'Red', color: '#DC143C' },
  { id: 'th12', name: 'Bright Orange', color: '#FF6600' },
  { id: 'th13', name: 'Taupe', color: '#A89080' },
  { id: 'th14', name: 'Brown', color: '#5C4033' },
  { id: 'th15', name: 'Navy', color: '#000080' },
  { id: 'th16', name: 'Charcoal', color: '#36454F' },
  // Row 4
  { id: 'th17', name: 'Black', color: '#000000' },
  { id: 'th18', name: 'Olive', color: '#808000' },
  { id: 'th19', name: 'Green', color: '#228B22' },
];

// Size chart data
const sizeChart = {
  headers: ['Size', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
  neck: ['Neck', '15', '16', '16.5', '17', '18', '19', '20'],
  chest: ['Chest', '41.75', '44.5', '47.5', '49.5', '52', '55', '58'],
};

const standardSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

// Body measurements fields
const bodyMeasurements = [
  { id: 'neck', name: 'Neck', unit: 'Inch' },
  { id: 'chest', name: 'Chest', unit: 'Inch' },
  { id: 'stomach', name: 'Stomach', unit: 'Inch' },
  { id: 'hip', name: 'Hip', unit: 'Inch' },
  { id: 'length', name: 'Length', unit: 'Inch' },
  { id: 'shoulder', name: 'Shoulder', unit: 'Inch' },
  { id: 'sleeve', name: 'Sleeve', unit: 'Inch' },
];

const fitTypes = [
  { id: 'slim', name: 'Slim Fit', description: 'Modern tailored silhouette' },
  { id: 'regular', name: 'Regular Fit', description: 'Classic comfortable fit' },
  { id: 'relaxed', name: 'Relaxed Fit', description: 'Extra room throughout' },
];

// ============================================
// 3D SHIRT PREVIEW - MODULAR GLB MODEL
// ============================================
// Helper function to create checkered texture with part-specific scaling
function createCheckeredTexture(colors, size = 64, repeatScale = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const squareSize = size / 8; // 8x8 grid of squares
  const color1 = colors[0] || '#FFFFFF';
  const color2 = colors[1] || '#4A90D9';

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatScale, repeatScale); // Part-specific repeat scale

  // FIXED: Improved texture filtering for smoother pattern rendering
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;

  texture.needsUpdate = true;
  return texture;
}

// Repeat scale constants for consistent pattern across different mesh parts
// Calibrated based on UV mapping differences - higher value = smaller squares
const PATTERN_REPEAT_SCALES = {
  body: 4,      // Body baseline - perfect
  sleeve: 3.5,  // Reduced from 6 to match body scale
  collar: 2,    // Reduced from 3
  cuff: 1.5,    // Reduced from 2.5
  pocket: 2,    // Reduced from 4
  placket: 1,   // Reduced from 4
  bottom: 6     // Adjusted to 6 for balance
};


// ============================================
// 3D SHIRT PREVIEW - MODULAR GLB MODEL
// ============================================
function ShirtPreview3D({ partFabrics, selectedStyles, selectedContrasts, contrastFabrics, buttonColor, monogram }) {
  const containerRef = useRef();
  const shirtModelRef = useRef();
  const monogramMeshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const rotationXRef = useRef(0);
  const rotationYRef = useRef(0);
  const autoRotateRef = useRef(true);
  const dragEnabledRef = useRef(true);  // NEW: Control drag enable/disable
  const frameRef = useRef();
  const isDraggingRef = useRef(false);
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const pivotRef = useRef();

  // Exact mesh names to show for each style option
  const getMeshesToShow = useCallback(() => {
    const meshes = new Set();
    const isCurved = selectedStyles?.bottom?.id === 'bt1';

    // SLEEVE
    switch (selectedStyles?.sleeve?.id) {
      case 'sl1':
      case 'sl2':
        meshes.add('sleeve_full');
        meshes.add('Cuff_square');
        meshes.add('Cuff_square_button');
        meshes.add('Cuff_square_sleeve');
        break;
      case 'sl3':
        meshes.add('Sleeve_short');
        break;
      default:
        meshes.add('sleeve_full');
        meshes.add('Cuff_square');
        meshes.add('Cuff_square_button');
        meshes.add('Cuff_square_sleeve');
    }

    // COLLAR
    switch (selectedStyles?.collar?.id) {
      case 'co1':
      case 'co2':
        meshes.add('collar_spread');
        meshes.add('collar_spread_button');
        break;
      case 'co3':
      case 'co4':
        meshes.add('collar_classic_point');
        meshes.add('collar_classic_point_button');
        break;
      case 'co5':
      case 'co6':
        meshes.add('collars_cutaway');
        meshes.add('collars_cutaway_button');
        break;
      default:
        meshes.add('collar_spread');
        meshes.add('collar_spread_button');
    }

    // FRONT
    if (isCurved) {
      switch (selectedStyles?.front?.id) {
        case 'fr1':
          meshes.add('shirt_curved_bot_front_single_placket');
          meshes.add('shirt_curved_bot_front_single_placket_button');
          break;
        case 'fr2':
          meshes.add('shirt_curved_bot_front_box_placket');
          meshes.add('shirt_curved_bot_front_box_placket_button');
          break;
        case 'fr3':
          meshes.add('shirt_curved_bot_front_hidden_placket');
          break;
        default:
          meshes.add('shirt_curved_bot_front_single_placket');
          meshes.add('shirt_curved_bot_front_single_placket_button');
      }
    } else {
      switch (selectedStyles?.front?.id) {
        case 'fr1':
          meshes.add('shirt_front_single_placket');
          meshes.add('shirt_front_single_placket_button');
          break;
        case 'fr2':
          meshes.add('shirt_front_box_placket');
          meshes.add('shirt_front_box_placket_button');
          break;
        case 'fr3':
          meshes.add('shirt_front_hidden_placket');
          break;
        default:
          meshes.add('shirt_front_single_placket');
          meshes.add('shirt_front_single_placket_button');
      }
    }

    // BACK
    if (isCurved) {
      switch (selectedStyles?.back?.id) {
        case 'bk1':
          meshes.add('Shirt_curved_bot_back_normal');
          break;
        case 'bk2':
          meshes.add('Shirt_curved_bot_back_boxpleated');
          break;
        case 'bk3':
          meshes.add('Shirt_curved_bot_back_sidepleated');
          break;
        case 'bk4':
          meshes.add('Shirt_curved_bot_back_centrepleated');
          break;
        default:
          meshes.add('Shirt_curved_bot_back_normal');
      }
    } else {
      switch (selectedStyles?.back?.id) {
        case 'bk1':
          meshes.add('Shirt_Back_normal');
          break;
        case 'bk2':
          meshes.add('Shirt_back_boxpleated');
          break;
        case 'bk3':
          meshes.add('Shirt_back_sidepleated');
          break;
        case 'bk4':
          meshes.add('Shirt_back_centrepleated');
          break;
        default:
          meshes.add('Shirt_Back_normal');
      }
    }

    // POCKETS
    switch (selectedStyles?.pockets?.id) {
      case 'pk1':
        break;
      case 'pk2':
        meshes.add('pocket_rounded_patch');
        break;
      case 'pk3':
        meshes.add('pocket_angled_patch');
        break;
      case 'pk4':
      case 'pk5':
        meshes.add('pocket_square');
        break;
      case 'pk6':
        meshes.add('pocket_rounded_patch');
        meshes.add('pocket_rounded_patch_flap');
        meshes.add('pocket_rounded_patch_flap_button');
        break;
      case 'pk7':
        meshes.add('pocket_angled_patch');
        meshes.add('pocket_angled_patch_flap');
        meshes.add('pocket_angled_patch_flap_button');
        break;
      case 'pk8':
        meshes.add('pocket_square');
        meshes.add('pocket_square_flap');
        meshes.add('pocket_square_flap_button');
        break;
      case 'pk9':
        meshes.add('pocket_rounded_patch');
        meshes.add('pocket_rounded_patch_flap');
        meshes.add('pocket_rounded_patch_flap_button');
        break;
      default:
        break;
    }

    return meshes;
  }, [selectedStyles]);

  // Update mesh visibility based on selected styles
  const updateMeshVisibility = useCallback((model) => {
    if (!model) return;

    const meshesToShow = getMeshesToShow();

    model.traverse((child) => {
      if (child.isMesh) {
        const shouldShow = meshesToShow.has(child.name);
        child.visible = shouldShow;
      }
    });
  }, [getMeshesToShow]);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    if (rendererRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '1';

    // Lighting
    // FIXED: Brighter lighting to remove dark shadows
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, 3, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3);
    bottomLight.position.set(0, -5, 0);
    scene.add(bottomLight);

    // Create pivot for rotation
    const pivot = new THREE.Group();
    scene.add(pivot);
    pivotRef.current = pivot;

    // Load modular model
    const loader = new GLTFLoader();
    loader.load(
      '/models/shirt-modular.glb',
      (gltf) => {
        console.log('Modular shirt loaded!');
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const name = child.name.toLowerCase();
            const isButton = name.endsWith('button') || name.endsWith('buttons');

            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }

            if (isButton) {
              child.geometry.computeVertexNormals();
              const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color('#F5F5DC'),
                side: THREE.DoubleSide,
              });
              child.material = mat;
              child.renderOrder = 10;
            } else {
              const mat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(partFabrics?.body?.color || '#FFFFFF'),
                roughness: 0.85,  // FIXED: Higher roughness
                metalness: 0.0,   // FIXED: No metalness to eliminate dark reflections
                side: THREE.DoubleSide,
                flatShading: false, // FIXED: smooth shading
              });
              child.material = mat;
            }

            child.frustumCulled = false;
            child.visible = false;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5.0 / maxDim;
        model.scale.setScalar(scale);

        model.updateMatrixWorld(true);
        const newBox = new THREE.Box3().setFromObject(model);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        model.position.set(-newCenter.x, -newCenter.y, -newCenter.z);

        pivot.add(model);
        shirtModelRef.current = model;

        updateMeshVisibility(model);

        setIsLoading(false);
        setModelReady(true);
      },
      undefined,
      (error) => {
        console.error('Load error:', error);
        setLoadError('Failed to load model');
        setIsLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (pivotRef.current && autoRotateRef.current && !isDraggingRef.current) {
        rotationYRef.current += 0.005;
        pivotRef.current.rotation.y = rotationYRef.current;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse/Touch handlers - NOW WITH DRAG ENABLE CHECK
    const onPointerDown = (e) => {
      // Don't allow dragging if disabled (monogram position selected)
      if (!dragEnabledRef.current) return;

      isDraggingRef.current = true;
      setIsDragging(true);
      autoRotateRef.current = false;
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
      startXRef.current = clientX;
      startYRef.current = clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current || !pivotRef.current) return;
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

      const deltaX = clientX - startXRef.current;
      const deltaY = clientY - startYRef.current;

      rotationYRef.current += deltaX * 0.01;
      rotationXRef.current += deltaY * 0.01;
      rotationXRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationXRef.current));

      pivotRef.current.rotation.y = rotationYRef.current;
      pivotRef.current.rotation.x = rotationXRef.current;

      startXRef.current = clientX;
      startYRef.current = clientY;
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      // Only show grab cursor if dragging is enabled
      renderer.domElement.style.cursor = dragEnabledRef.current ? 'grab' : 'default';
    };

    // Zoom with scroll wheel - also disable when monogram selected
    const onWheel = (e) => {
      if (!dragEnabledRef.current) return;
      e.preventDefault();
      const zoomSpeed = 0.001;
      camera.position.z += e.deltaY * zoomSpeed * camera.position.z;
      camera.position.z = Math.max(3, Math.min(15, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onPointerDown);
    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('mouseup', onPointerUp);
    renderer.domElement.addEventListener('mouseleave', onPointerUp);
    renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('touchend', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.style.cursor = 'grab';

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Update visibility when styles change
  useEffect(() => {
    if (shirtModelRef.current) {
      updateMeshVisibility(shirtModelRef.current);
    }
  }, [selectedStyles, updateMeshVisibility]);

  // Update colors/textures based on partFabrics (body, sleeve, collar)
  useEffect(() => {
    if (!shirtModelRef.current) return;

    // Get fabric for each part directly from partFabrics
    const bodyFabric = partFabrics?.body;
    const sleeveFabric = partFabrics?.sleeve;
    const collarFabric = partFabrics?.collar;

    // Helper to check if a fabric is checkered
    const isCheckered = (fab) => fab?.pattern === 'check';

    // Helper to check if fabric has an image
    const hasImage = (fab) => fab?.image;

    // Helper to get color from fabric
    const getFabricColor = (fab) => {
      if (!fab) return '#FFFFFF';
      if (fab.pattern === 'check') return fab.colors?.[0] || '#FFFFFF';
      return fab.color || '#FFFFFF';
    };

    // Helper to create checkered texture
    const createCheckTexture = (fab, repeatScale) => {
      if (!fab || fab.pattern !== 'check') return null;

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const squareSize = 16;
      const color1 = fab.colors[0] || '#FFFFFF';
      const color2 = fab.colors[1] || '#4A90D9';

      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          ctx.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
          ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatScale, repeatScale);
      texture.needsUpdate = true;
      return texture;
    };

    // Helper to load image texture from URL
    const loadImageTexture = (imageUrl, repeatScale, onLoad) => {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        imageUrl,
        (texture) => {
          // Use MirroredRepeatWrapping to eliminate visible seams at tile boundaries
          texture.wrapS = THREE.MirroredRepeatWrapping;
          texture.wrapT = THREE.MirroredRepeatWrapping;
          // Use repeat scale to tile the texture properly
          texture.repeat.set(repeatScale, repeatScale);
          // Better filtering for smoother appearance
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.needsUpdate = true;
          if (onLoad) onLoad(texture);
        },
        undefined,
        (error) => {
          console.warn('Failed to load texture:', imageUrl, error);
        }
      );
    };

    // Apply image texture to meshes matching a name pattern (with exclusion patterns)
    const applyImageToMeshes = (imageUrl, repeatScale, namePatterns, excludePatterns = []) => {
      loadImageTexture(imageUrl, repeatScale, (texture) => {
        shirtModelRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const name = child.name.toLowerCase();
            // Check if mesh name matches any include pattern
            const matches = namePatterns.some(pattern => name.includes(pattern));
            // Check if mesh name matches any exclude pattern
            const excluded = excludePatterns.some(pattern => name.includes(pattern));
            if (matches && !excluded) {
              child.material.map = texture;
              child.material.color.set('#FFFFFF');
              child.material.needsUpdate = true;
            }
          }
        });
      });
    };

    // Load image textures asynchronously if fabrics have images
    // Use consistent repeat scale (3) so patterns look the same across all parts
    // Body texture excludes sleeve, cuff, and collar meshes
    if (hasImage(bodyFabric)) {
      applyImageToMeshes(bodyFabric.image, 3, ['shirt', 'back', 'front', 'pocket', 'placket'], ['sleeve', 'cuff', 'collar']);
    }
    // Sleeve texture only for sleeve meshes (not cuff)
    if (hasImage(sleeveFabric)) {
      applyImageToMeshes(sleeveFabric.image, 4, ['sleeve'], ['cuff', 'collar']);
      // Cuff texture with different repeat scale to match the smaller UV area
      applyImageToMeshes(sleeveFabric.image, 1.8, ['cuff'], ['collar', 'sleeve']);
    }
    // Collar texture only for collar meshes
    if (hasImage(collarFabric)) {
      applyImageToMeshes(collarFabric.image, 2, ['collar'], []);
    }

    // Create textures for checkered fabrics (with appropriate repeat scales)
    const CHECK_SIZE = 128; // Higher res

    const bodyTexture = isCheckered(bodyFabric) ? createCheckeredTexture(bodyFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.body) : null;
    const sleeveTexture = isCheckered(sleeveFabric) ? createCheckeredTexture(sleeveFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.sleeve) : null;
    const collarTexture = isCheckered(collarFabric) ? createCheckeredTexture(collarFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.collar) : null;
    const cuffTexture = isCheckered(sleeveFabric) ? createCheckeredTexture(sleeveFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.cuff) : null;
    const pocketTexture = isCheckered(bodyFabric) ? createCheckeredTexture(bodyFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.pocket) : null;
    const placketTexture = isCheckered(bodyFabric) ? createCheckeredTexture(bodyFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.placket) : null;
    const bottomTexture = isCheckered(bodyFabric) ? createCheckeredTexture(bodyFabric.colors, CHECK_SIZE, PATTERN_REPEAT_SCALES.bottom) : null;

    // Contrast colors from Color Contrast step (these override part fabrics if set)
    const contrastCollarColor = (selectedContrasts?.['collar-out'] && contrastFabrics?.['collar-out']?.color)
      ? contrastFabrics['collar-out'].color : null;
    const contrastCuffColor = (selectedContrasts?.['cuff-out'] && contrastFabrics?.['cuff-out']?.color)
      ? contrastFabrics['cuff-out'].color : null;
    const contrastPlacketColor = (selectedContrasts?.['outside-placket'] && contrastFabrics?.['outside-placket']?.color)
      ? contrastFabrics['outside-placket'].color : null;
    const contrastSleeveColor = (selectedContrasts?.['sleeve-fabric'] && contrastFabrics?.['sleeve-fabric']?.color)
      ? contrastFabrics['sleeve-fabric'].color : null;
    const contrastPocketColor = (selectedContrasts?.['pocket'] && contrastFabrics?.['pocket']?.color)
      ? contrastFabrics['pocket'].color : null;

    const btnColor = buttonColor?.color || '#F5F5DC';

    shirtModelRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();

        // BUTTONS - always solid color
        if (name.endsWith('button') || name.endsWith('buttons')) {
          child.material.map = null;
          child.material.color.set(btnColor);
          child.material.needsUpdate = true;
          return;
        }

        // COLLAR - uses collarFabric
        if (name.includes('collar')) {
          if (contrastCollarColor) {
            child.material.map = null;
            child.material.color.set(contrastCollarColor);
          } else if (collarTexture) {
            child.material.map = collarTexture;
            child.material.color.set('#FFFFFF');
          } else {
            child.material.map = null;
            child.material.color.set(getFabricColor(collarFabric));
          }
          child.material.needsUpdate = true;
          return;
        }

        // CUFFS - uses sleeveFabric
        if (name.includes('cuff') && !name.includes('sleeve')) {
          if (contrastCuffColor) {
            child.material.map = null;
            child.material.color.set(contrastCuffColor);
          } else if (cuffTexture) {
            child.material.map = cuffTexture;
            child.material.color.set('#FFFFFF');
          } else {
            child.material.map = null;
            child.material.color.set(getFabricColor(sleeveFabric));
          }
          child.material.needsUpdate = true;
          return;
        }

        // SLEEVES - uses sleeveFabric
        if (name.includes('sleeve')) {
          if (contrastSleeveColor) {
            child.material.map = null;
            child.material.color.set(contrastSleeveColor);
          } else if (sleeveTexture) {
            child.material.map = sleeveTexture;
            child.material.color.set('#FFFFFF');
          } else {
            child.material.map = null;
            child.material.color.set(getFabricColor(sleeveFabric));
          }
          child.material.needsUpdate = true;
          return;
        }

        // POCKETS - uses bodyFabric
        if (name.includes('pocket')) {
          if (contrastPocketColor) {
            child.material.map = null;
            child.material.color.set(contrastPocketColor);
          } else if (pocketTexture) {
            child.material.map = pocketTexture;
            child.material.color.set('#FFFFFF');
          } else {
            child.material.map = null;
            child.material.color.set(getFabricColor(bodyFabric));
          }
          child.material.needsUpdate = true;
          return;
        }

        // PLACKET - uses bodyFabric
        if (name.includes('placket')) {
          if (contrastPlacketColor) {
            child.material.map = null;
            child.material.color.set(contrastPlacketColor);
          } else if (placketTexture) {
            child.material.map = placketTexture;
            child.material.color.set('#FFFFFF');
          } else {
            child.material.map = null;
            child.material.color.set(getFabricColor(bodyFabric));
          }
          child.material.needsUpdate = true;
          return;
        }

        // BOTTOM/SKIRT - uses bodyFabric but specific scale
        // Check for 'Bottom_' or 'bottom' in name to catch Kurta parts
        if (name.includes('bottom') || name.startsWith('bottom_')) {
          if (bottomTexture) {
            child.material.map = bottomTexture;
            child.material.color.set('#FFFFFF');
          } else {
            child.material.map = null;
            child.material.color.set(getFabricColor(bodyFabric));
          }
          child.material.needsUpdate = true;
          return;
        }

        // BODY / MAIN SHIRT PARTS - uses bodyFabric
        if (bodyTexture) {
          child.material.map = bodyTexture;
          child.material.color.set('#FFFFFF');
        } else {
          child.material.map = null;
          child.material.color.set(getFabricColor(bodyFabric));
        }
        child.material.needsUpdate = true;

        // DEBUG: Log mesh names to help identify parts if needed
        // console.log('Mesh:', name, 'Material applied');
      }
    });
  }, [partFabrics, selectedContrasts, contrastFabrics, buttonColor, selectedStyles]);

  // SMOOTH TRANSITION when monogram position changes + DISABLE DRAGGING
  // SMOOTH TRANSITION when monogram position changes + DISABLE DRAGGING
  useEffect(() => {
    if (!pivotRef.current || !cameraRef.current) return;

    // If no monogram position or "none" selected, re-enable dragging and auto-rotate
    if (!monogram || monogram.position === 'none') {
      autoRotateRef.current = true;
      dragEnabledRef.current = true;
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = 'grab';
      }
      return;
    }

    // Stop auto-rotation and DISABLE dragging when a position is selected
    autoRotateRef.current = false;
    dragEnabledRef.current = false;
    if (rendererRef.current) {
      rendererRef.current.domElement.style.cursor = 'default';
    }

    // Target values for smooth transition
    let targetRotationY = rotationYRef.current;
    let targetRotationX = rotationXRef.current;
    let targetCameraZ = cameraRef.current.position.z;
    let targetCameraY = cameraRef.current.position.y;

    switch (monogram.position) {
      case 'collar':
        // Rotate LEFT (negative) so RIGHT side of shirt faces viewer
        targetRotationY = -0.6;
        targetRotationX = 0;
        targetCameraZ = 5;
        targetCameraY = 0.3;
        break;
      case 'chest':
        // Front view
        targetRotationY = 0;
        targetRotationX = 0;
        targetCameraZ = 6;
        targetCameraY = 0;
        break;
      case 'sleeve':
        // Rotate LEFT to show right sleeve from viewer's perspective
        targetRotationY = -1.0;
        targetRotationX = 0.1;
        targetCameraZ = 5.5;
        targetCameraY = 0;
        break;
      case 'cuff-left':
        // Show left side from viewer with cuff visible
        targetRotationY = 1.0;
        targetRotationX = 0.15;
        targetCameraZ = 6;
        targetCameraY = -0.5;
        break;
      case 'cuff-right':
        // Show right side from viewer with cuff visible
        targetRotationY = -1.0;
        targetRotationX = 0.15;
        targetCameraZ = 6;
        targetCameraY = -0.5;
        break;
      case 'waist':
        targetRotationY = 0;
        targetRotationX = 0.15;
        targetCameraZ = 5.5;
        targetCameraY = -0.5;
        break;
      case 'placket':
        targetRotationY = 0;
        targetRotationX = 0;
        targetCameraZ = 5;
        targetCameraY = 0.2;
        break;
      default:
        return;
    }

    // Smooth animation using requestAnimationFrame
    const duration = 800;
    const startTime = performance.now();
    const startRotationY = rotationYRef.current;
    const startRotationX = rotationXRef.current;
    const startCameraZ = cameraRef.current.position.z;
    const startCameraY = cameraRef.current.position.y;

    let animationId;
    const animateTransition = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      rotationYRef.current = startRotationY + (targetRotationY - startRotationY) * easeOut;
      rotationXRef.current = startRotationX + (targetRotationX - startRotationX) * easeOut;

      if (pivotRef.current) {
        pivotRef.current.rotation.y = rotationYRef.current;
        pivotRef.current.rotation.x = rotationXRef.current;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = startCameraZ + (targetCameraZ - startCameraZ) * easeOut;
        cameraRef.current.position.y = startCameraY + (targetCameraY - startCameraY) * easeOut;
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animateTransition);
      }
    };

    animationId = requestAnimationFrame(animateTransition);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [monogram?.position]);

  // RENDER MONOGRAM TEXT ON 3D MODEL
  // RENDER MONOGRAM TEXT ON 3D MODEL
  useEffect(() => {
    if (!pivotRef.current) return;

    // Remove existing monogram mesh if any
    if (monogramMeshRef.current) {
      if (monogramMeshRef.current.parent) {
        monogramMeshRef.current.parent.remove(monogramMeshRef.current);
      }
      if (monogramMeshRef.current.geometry) monogramMeshRef.current.geometry.dispose();
      if (monogramMeshRef.current.material) {
        if (monogramMeshRef.current.material.map) monogramMeshRef.current.material.map.dispose();
        monogramMeshRef.current.material.dispose();
      }
      monogramMeshRef.current = null;
    }

    // Don't render if no monogram or no text
    if (!monogram || monogram.position === 'none' || !monogram.text || monogram.text.trim() === '') {
      return;
    }

    // Create HIGH-RES canvas for crisp text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 512;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font based on selected font style
    let fontFamily = 'Arial, Helvetica, sans-serif';
    let fontWeight = 'bold';
    let fontStyle = 'normal';

    switch (monogram.font) {
      case 'block':
        fontFamily = 'Arial Black, Impact, sans-serif';
        fontWeight = '900';
        fontStyle = 'normal';
        break;
      case 'script':
        fontFamily = 'Brush Script MT, cursive';
        fontWeight = 'normal';
        fontStyle = 'italic';
        break;
      case 'old-english':
        fontFamily = 'Old English Text MT, Times New Roman, serif';
        fontWeight = 'bold';
        fontStyle = 'normal';
        break;
      default:
        fontFamily = 'Georgia, serif';
        fontWeight = 'bold';
        fontStyle = 'normal';
    }

    ctx.imageSmoothingEnabled = false;

    const fontSize = 200;
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`; ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = monogram.color || '#DC143C';
    ctx.fillText(monogram.text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    const geometry = new THREE.PlaneGeometry(0.8, 0.4);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      alphaTest: 0.1,
    });

    const monogramMesh = new THREE.Mesh(geometry, material);

    // Position based on selected position
    switch (monogram.position) {
      case 'collar':
        monogramMesh.position.set(0.42, 1.82, 0.32);
        monogramMesh.rotation.set(-0.15, -0.35, 0.08);
        monogramMesh.scale.set(0.75, 0.75, 0.75);
        break;
      case 'chest':
        // Fully visible on shirt surface
        monogramMesh.position.set(0.45, 1.0, 0.56);
        monogramMesh.rotation.set(0, 0, 0);
        monogramMesh.scale.set(0.65, 0.65, 0.65);
        break;
      case 'sleeve':
        // On the actual sleeve (arm area) - slightly lower
        monogramMesh.position.set(1.55, 0.5, 0.15);
        monogramMesh.rotation.set(0, 0.5, 0);
        monogramMesh.scale.set(0.55, 0.55, 0.55);
        break;
      case 'cuff-left':
        // On the cuff - straight, moved up onto cuff
        monogramMesh.position.set(-2.40, -1.30, 1.0);
        monogramMesh.rotation.set(0, 0, 0);
        monogramMesh.scale.set(0.35, 0.35, 0.35);
        break;
      case 'cuff-right':
        // On the right cuff - straight, mirrored from left
        monogramMesh.position.set(2.40, -1.30, 1.0);
        monogramMesh.rotation.set(0, 0, 0);
        monogramMesh.scale.set(0.35, 0.35, 0.35);
        break;
      case 'waist':
        monogramMesh.position.set(0.4, -0.95, 0.55);
        monogramMesh.rotation.set(0, 0, 0);
        monogramMesh.scale.set(0.6, 0.6, 0.6);
        break;
      case 'placket':
        monogramMesh.position.set(0, 0.35, 0.62);
        monogramMesh.rotation.set(0, 0, 0);
        monogramMesh.scale.set(0.8, 0.8, 0.8);
        break;
      default:
        monogramMesh.position.set(0, 0.8, 0.6);
    }

    monogramMesh.renderOrder = 999;
    pivotRef.current.add(monogramMesh);
    monogramMeshRef.current = monogramMesh;

  }, [monogram?.position, monogram?.text, monogram?.font, monogram?.color]);

  // Reset view function
  const resetView = () => {
    // Re-enable dragging
    dragEnabledRef.current = true;
    autoRotateRef.current = true;

    if (rendererRef.current) {
      rendererRef.current.domElement.style.cursor = 'grab';
    }

    // Smooth reset animation
    const duration = 600;
    const startTime = performance.now();
    const startRotationY = rotationYRef.current;
    const startRotationX = rotationXRef.current;
    const startCameraZ = cameraRef.current?.position.z || 6;
    const startCameraY = cameraRef.current?.position.y || 0;

    const animateReset = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      rotationYRef.current = startRotationY + (0 - startRotationY) * easeOut;
      rotationXRef.current = startRotationX + (0 - startRotationX) * easeOut;

      if (pivotRef.current) {
        pivotRef.current.rotation.y = rotationYRef.current;
        pivotRef.current.rotation.x = rotationXRef.current;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = startCameraZ + (6 - startCameraZ) * easeOut;
        cameraRef.current.position.y = startCameraY + (0 - startCameraY) * easeOut;
      }

      if (progress < 1) {
        requestAnimationFrame(animateReset);
      }
    };

    requestAnimationFrame(animateReset);
  };

  return (
    <div ref={containerRef} style={{
      width: '100%',
      height: '100%',
      minHeight: '500px',
      position: 'relative',
    }}>
      {isLoading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)', zIndex: 10 }}>
          Loading 3D Model...
        </div>
      )}
      {loadError && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ff6b6b', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '8px', textAlign: 'center', zIndex: 10 }}>
          ⚠️ {loadError}<br /><small style={{ color: '#aaa' }}>Check public/models/ folder</small>
        </div>
      )}
      {!isLoading && !loadError && (
        <>
          {(!monogram || monogram.position === 'none') && (
            <button
              onClick={resetView}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                color: '#333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
              }}
            >
              ↻ Reset View
            </button>
          )}
          <p style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.8)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            margin: 0,
            zIndex: 10,
            textAlign: 'center',
          }}>
            {monogram && monogram.position !== 'none'
              ? '🔒 View locked to monogram position'
              : (isDragging ? '↔↕ Release to stop' : '↔↕ Drag to rotate • Scroll to zoom')}
          </p>
        </>
      )}
    </div>
  );
}// ============================================
// 3D ANARKALI KURTI PREVIEW - MESH-BASED CUSTOMIZATION
// ============================================
function KurtaPreview3D({ partFabrics, selectedStyles }) {
  const containerRef = useRef();
  const kurtaModelRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const rotationXRef = useRef(0);
  const rotationYRef = useRef(0);
  const autoRotateRef = useRef(true);
  const frameRef = useRef();
  const isDraggingRef = useRef(false);
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const pivotRef = useRef();

  // Get meshes to show based on selected styles
  const getMeshesToShow = useCallback(() => {
    const meshes = new Set();

    // Add neck front mesh
    if (selectedStyles?.neckFront?.meshName) {
      meshes.add(selectedStyles.neckFront.meshName);
      // Also add piping variant if exists
      meshes.add(selectedStyles.neckFront.meshName + '_piping');
    }

    // Add neck back mesh
    if (selectedStyles?.neckBack?.meshName) {
      meshes.add(selectedStyles.neckBack.meshName);
      // Also add piping variant if exists
      meshes.add(selectedStyles.neckBack.meshName + '_piping');
    }

    // Add sleeve mesh
    if (selectedStyles?.sleeve?.meshName) {
      meshes.add(selectedStyles.sleeve.meshName);
    }

    // Add bottom mesh
    if (selectedStyles?.bottom?.meshName) {
      meshes.add(selectedStyles.bottom.meshName);
    }

    return meshes;
  }, [selectedStyles]);

  // Update mesh visibility
  const updateMeshVisibility = useCallback((model) => {
    if (!model) return;

    const meshesToShow = getMeshesToShow();
    console.log('Showing meshes:', Array.from(meshesToShow));

    model.traverse((child) => {
      if (child.isMesh) {
        // Check if this mesh should be visible
        const shouldShow = meshesToShow.has(child.name);
        child.visible = shouldShow;
      }
    });
  }, [getMeshesToShow]);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    if (rendererRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '1';

    // Lighting - Increased intensity to remove dark shades
    scene.add(new THREE.AmbientLight(0xffffff, 1.2)); // Increased from 0.9

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.6
    fillLight.position.set(-3, 3, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.5
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.3
    bottomLight.position.set(0, -5, 0);
    scene.add(bottomLight);

    // Create pivot for rotation
    const pivot = new THREE.Group();
    scene.add(pivot);
    pivotRef.current = pivot;

    // Load kurta model
    const loader = new GLTFLoader();
    loader.load(
      '/models/Kurtha6_no_avatar.glb',
      (gltf) => {
        console.log('Anarkali Kurti model loaded!');
        const model = gltf.scene;

        // Log all mesh names for debugging
        console.log('=== ANARKALI KURTI MESH NAMES ===');
        model.traverse((child) => {
          if (child.isMesh) {
            console.log('Kurta mesh:', child.name);
          }
        });
        console.log('=================================');

        model.traverse((child) => {
          if (child.isMesh && child.geometry) {
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }

            // Remove vertex colors from geometry to eliminate dark patches
            if (child.geometry.attributes.color) {
              child.geometry.deleteAttribute('color');
            }

            // Apply default material with proper lighting for visibility
            const mat = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#E8E8E8'), // Light gray for visibility
              roughness: 0.7,
              metalness: 0.0,
              side: THREE.DoubleSide,
            });
            child.material = mat;
            child.frustumCulled = false;
            child.visible = true;
          }
        });

        // Calculate bounding box while all meshes are visible
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.5 / maxDim;
        model.scale.setScalar(scale);

        model.updateMatrixWorld(true);
        const newBox = new THREE.Box3().setFromObject(model);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        model.position.set(-newCenter.x, -newCenter.y, -newCenter.z);

        // Now hide all meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.visible = false;
          }
        });

        pivot.add(model);
        kurtaModelRef.current = model;

        // Apply initial visibility based on selected styles
        updateMeshVisibility(model);

        setIsLoading(false);
        setModelReady(true);
      },
      undefined,
      (error) => {
        console.error('Kurta load error:', error);
        setLoadError('Failed to load kurta model');
        setIsLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (pivotRef.current && autoRotateRef.current && !isDraggingRef.current) {
        rotationYRef.current += 0.005;
        pivotRef.current.rotation.y = rotationYRef.current;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse/Touch handlers
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      autoRotateRef.current = false;
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
      startXRef.current = clientX;
      startYRef.current = clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current || !pivotRef.current) return;
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

      const deltaX = clientX - startXRef.current;
      const deltaY = clientY - startYRef.current;

      rotationYRef.current += deltaX * 0.01;
      rotationXRef.current += deltaY * 0.01;
      rotationXRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationXRef.current));

      pivotRef.current.rotation.y = rotationYRef.current;
      pivotRef.current.rotation.x = rotationXRef.current;

      startXRef.current = clientX;
      startYRef.current = clientY;
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      renderer.domElement.style.cursor = 'grab';
    };

    // Zoom with scroll wheel
    const onWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      camera.position.z += e.deltaY * zoomSpeed * camera.position.z;
      camera.position.z = Math.max(3, Math.min(15, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onPointerDown);
    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('mouseup', onPointerUp);
    renderer.domElement.addEventListener('mouseleave', onPointerUp);
    renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('touchend', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.style.cursor = 'grab';

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Update mesh visibility when styles change
  useEffect(() => {
    if (kurtaModelRef.current && modelReady) {
      updateMeshVisibility(kurtaModelRef.current);
    }
  }, [selectedStyles, modelReady, updateMeshVisibility]);

  // Update colors based on partFabrics
  useEffect(() => {
    if (!kurtaModelRef.current || !modelReady) return;

    // Helper to check if a fabric is checkered
    const isCheckered = (fab) => fab?.pattern === 'check';

    // Helper to get color from fabric
    const getFabricColor = (fab) => {
      if (!fab) return '#FFFFFF';
      if (fab.pattern === 'check' && fab.colors) return fab.colors[0];
      return fab.color || '#FFFFFF';
    };

    // Use SAME repeat scale for ALL parts to ensure consistent pattern
    const TEXTURE_REPEAT = 4;

    kurtaModelRef.current.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();

        // Determine which fabric to use based on mesh name
        let fabric = partFabrics?.body; // Default

        if (name.includes('bottom')) {
          fabric = partFabrics?.skirt || partFabrics?.body;
        } else if (name.includes('sleeve') || name.includes('arm')) {
          fabric = partFabrics?.sleeve || partFabrics?.body;
        } else if (name.includes('neck') || name.includes('collar')) {
          fabric = partFabrics?.body;
        }

        // Dispose old material to prevent memory leaks
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }

        // Apply checkered pattern, image texture, or solid color
        if (isCheckered(fabric) && fabric.colors) {
          // Use higher resolution texture for better quality
          const texture = createCheckeredTexture(fabric.colors, 128, 1);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;

          // Base scale for consistency
          let repeatX = 4;
          let repeatY = 4;

          // IMPORTANT: Check sleeve FIRST before 'short' (because sleeve_*_short contains 'short')
          if (name.includes('sleeve') || name.includes('arm')) {
            repeatX = 3.5; // Slightly increased for denser pattern
            repeatY = 3.5;
          } else if (name.includes('high_low')) {
            // High-low skirts have different UV mapping, need higher scale
            repeatX = 14;
            repeatY = 14;
          } else if (name.includes('bottom') || name.includes('skirt') ||
            name.includes('ankle') || name.includes('floor') ||
            name.includes('knee') || name.includes('short')) {
            repeatX = 10;
            repeatY = 10;
          }

          texture.repeat.set(repeatX, repeatY);

          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.0,
          });
        } else if (fabric?.image) {
          // Create material with fabric color first (shown while texture loads)
          const fabricColor = fabric.color || '#4A235A';
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(fabricColor),
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.0,
          });

          // Load texture asynchronously
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(fabric.image, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;

            // Base scale for consistency
            let repeatX = 4;
            let repeatY = 4;

            // IMPORTANT: Check sleeve FIRST before 'short' (because sleeve_*_short contains 'short')
            if (name.includes('sleeve') || name.includes('arm')) {
              repeatX = 3.5; // Slightly increased for denser pattern
              repeatY = 3.5;
            } else if (name.includes('high_low')) {
              // High-low skirts have different UV mapping, need higher scale
              repeatX = 14;
              repeatY = 14;
            } else if (name.includes('bottom') || name.includes('skirt') ||
              name.includes('ankle') || name.includes('floor') ||
              name.includes('knee') || name.includes('short')) {
              repeatX = 10;
              repeatY = 10;
            }

            tex.repeat.set(repeatX, repeatY);
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;

            // Update material with loaded texture
            if (child.material) {
              child.material.map = tex;
              child.material.color.set('#FFFFFF'); // Reset color to white so texture shows correctly
              child.material.needsUpdate = true;
            }
          });
        } else {
          // Solid color fabric
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(getFabricColor(fabric)),
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.0,
          });
        }
      }
    });
  }, [partFabrics, modelReady]);


  // Reset view function
  const resetView = useCallback(() => {
    if (!pivotRef.current || !cameraRef.current) return;
    autoRotateRef.current = true;

    const startRotY = rotationYRef.current;
    const startRotX = rotationXRef.current;
    const startZoom = cameraRef.current.position.z;
    const startTime = performance.now();
    const duration = 800;

    const animateReset = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      rotationYRef.current = startRotY * (1 - eased);
      rotationXRef.current = startRotX * (1 - eased);
      cameraRef.current.position.z = startZoom + (6 - startZoom) * eased;

      if (pivotRef.current) {
        pivotRef.current.rotation.y = rotationYRef.current;
        pivotRef.current.rotation.x = rotationXRef.current;
      }

      if (progress < 1) {
        requestAnimationFrame(animateReset);
      }
    };

    requestAnimationFrame(animateReset);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'transparent',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 20,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTopColor: '#B8860B',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Loading Anarkali Kurti...</p>
        </div>
      )}
      {loadError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#ff6b6b',
          zIndex: 20,
        }}>
          <p>⚠️ {loadError}</p>
        </div>
      )}
      {!isLoading && !loadError && (
        <>
          <button
            onClick={resetView}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}
          >
            ↻ Reset View
          </button>
          <p style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.8)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            margin: 0,
            zIndex: 10,
            textAlign: 'center',
          }}>
            {isDragging ? '↔↕ Release to stop' : '↔↕ Drag to rotate • Scroll to zoom'}
          </p>
        </>
      )}
    </div>
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
          <h2>Shopping Bag ({cartItems.length})</h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>×</button>
        </div>
        <div className="cart-content">
          {cartItems.length === 0 ? <p className="cart-empty">Your bag is empty</p> : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-color" style={{ backgroundColor: item.fabricColor }} />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.fabricName}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
                <div className="cart-item-price">${item.price?.toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal"><span>Subtotal</span><span>${getCartTotal().toFixed(2)}</span></div>
            <button className="cart-checkout-btn">Checkout</button>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  if (!isLoginModalOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)} />
      <div className="modal login-modal">
        <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>×</button>
        <div className="login-modal-content">
          <h2>Welcome Back</h2>
          <form onSubmit={(e) => { e.preventDefault(); login(email, password); }}>
            <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button type="submit" className="login-submit-btn">Sign In</button>
          </form>
        </div>
      </div>
    </>
  );
}

// ============================================
// FOOTER
// ============================================
// ============================================
// FOOTER - MOHAIR STYLE
// ============================================
// ============================================
// CORRECTED FOOTER - Copy and replace your entire Footer function with this
// ============================================

function Footer({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailSuccess(true);
    setEmail('');
    setTimeout(() => setEmailSuccess(false), 3000);
    console.log('Valid email submitted:', email);
  };

  return (
    <footer className="footer-mohair">
      {/* Decorative Elements */}
      <div className="footer-decoration footer-decoration-left">
        <svg viewBox="0 0 100 100" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
          <path d="M10 90 L50 10 L90 90" />
          <path d="M30 90 L50 30 L70 90" />
        </svg>
      </div>

      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-col footer-brand-col">
          <h3 className="footer-brand-name">MAISON</h3>
          <p className="footer-brand-desc">
            Discover the finest tailor and haute couture studio in town, get in touch with us and let's start the work on your new suit together.
          </p>
          <div className="footer-social-icons">
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12 Q12 8 16 12 Q12 16 8 12" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6 C8 6 8 12 12 12 C8 12 8 18 12 18" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Information Column */}
        <div className="footer-col footer-info-col">
          <h4 className="footer-col-title">Information:</h4>
          <p className="footer-info-text">info.tailor@example.com</p>
          <p className="footer-info-text">+345 8892 7413</p>
          <p className="footer-info-text">35 Savile Row, London W1S</p>
          <p className="footer-info-text">Monday to Saturday 10am-6pm</p>
          <p className="footer-info-text">Sunday closed</p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col footer-links-col">
          <h4 className="footer-col-title">Quick Links:</h4>
          <button className="footer-link" onClick={() => navigateTo('about')}>ABOUT</button>
          <button className="footer-link" onClick={() => navigateTo('customizer', 'shirts')}>SERVICES</button>
          <button className="footer-link" onClick={() => navigateTo('about')}>OUR HERITAGE</button>
          <button className="footer-link" onClick={() => navigateTo('customizer', 'suits')}>TAILORS</button>
          <button className="footer-link" onClick={() => navigateTo('contact')}>CONTACT US</button>
        </div>

        {/* Join Us Column - WITH VALIDATION */}
        <div className="footer-col footer-signup-col">
          <h4 className="footer-col-title">Join Us:</h4>
          <p className="footer-signup-text">
            Sign up for exclusive offers, original stories, events and more.
          </p>
          <form onSubmit={handleEmailSubmit} className="footer-email-form">
            <div className="footer-email-input-wrapper">
              <input
                type="text"
                placeholder="Your email *"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                  setEmailSuccess(false);
                }}
                className={`footer-email-field ${emailError ? 'error' : ''} ${emailSuccess ? 'success' : ''}`}
              />
              <button type="submit" className="footer-submit-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {emailError && <span className="footer-email-error">{emailError}</span>}
            {emailSuccess && <span className="footer-email-success">Thank you for subscribing!</span>}
          </form>
        </div>
      </div>
    </footer>
  );
}


// ============================================
// UPDATED HEADER - MOHAIR STYLE
// Replace your existing Header component with this
// ============================================

function Header({ navigateTo, currentPage }) {
  const { getCartCount, setIsCartOpen } = useCart();
  const { setIsLoginModalOpen } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render header on home page - it's built into the hero
  if (currentPage === 'home') return null;

  return (
    <header className={`header-mohair ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-mohair-inner">
        <button className="header-logo-mohair" onClick={() => navigateTo('home')}>
          MAISON
        </button>
        <nav className="header-nav-mohair">
          <button className="nav-link-mohair active" onClick={() => navigateTo('home')}>HOME</button>
          <button className="nav-link-mohair" onClick={() => navigateTo('customizer', 'shirts')}>SHIRTS</button>
          <button className="nav-link-mohair" onClick={() => navigateTo('customizer', 'suits')}>SUITS</button>
          <button className="nav-link-mohair" onClick={() => navigateTo('about')}>ABOUT</button>
          <button className="nav-link-mohair" onClick={() => navigateTo('contact')}>CONTACT</button>
        </nav>
        <div className="header-right-mohair">
          <button className="info-btn-mohair" onClick={() => setIsCartOpen(true)}>
            <span className="info-text">Info</span>
            <span className="info-circle">
              <span className="info-dot"></span>
            </span>
          </button>
        </div>
      </div>
      <CartDrawer />
      <LoginModal />
    </header>
  );
}


// ============================================
// UPDATED HOMEPAGE - MOHAIR STYLE WITH BUILT-IN HEADER
// Replace your existing HomePage component with this
// ============================================

// ============================================
// UPDATED HOMEPAGE - HEADER ONLY APPEARS ON SCROLL
// Replace your existing HomePage function with this
// ============================================

// ============================================
// UPDATED HOMEPAGE - TWO-STATE HEADER
// Transparent header at top, white navbar on scroll
// 
// REPLACE your existing HomePage function with this
// ============================================

// ============================================
// COMPLETE UPDATED HOMEPAGE WITH ANIMATED SERVICES CAROUSEL
// This includes the two-state header AND the animated carousel
// 
// REPLACE your entire HomePage function with this
// ============================================

function HomePage({ navigateTo }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsCartOpen } = useCart();

  const heroSlides = [
    { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920', title: 'Premium couture team.', subtitle: 'High-end suits.', description: 'At vero et justoprovident, similique sunt in culpa mi quis hendrerit...' },
    { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920', title: 'Discover the best tailor', subtitle: 'studio around.', description: 'At vero et justoprovident, similique sunt in culpa mi quis hendrerit...' },
    { image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1920', title: 'Maison has over 40 years of', subtitle: 'experience.', description: 'At vero et justoprovident, similique sunt in culpa mi quis hendrerit...' },
  ];

  // Extended services array for infinite loop effect
  const services = [
    { image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400', title: 'Body Measure', subtitle: 'Custom Tailored', shape: 'square' },
    { image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', title: 'Dress Tailor', subtitle: 'Dress Tailor', shape: 'rounded' },
    { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', title: 'Design Sketches', subtitle: 'Design', shape: 'square' },
    { image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', title: 'Handmade', subtitle: 'Handmade', shape: 'circle' },
    { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', title: 'Singer Machine', subtitle: 'Custom Tailored', shape: 'square' },
  ];

  // ============================================
  // STEP 2: REPLACE the existing testimonials array (around line 1665) with this:
  // ============================================

  const testimonials = [
    {
      name: 'Tailor',
      text: 'Nullam fermentum ex neque aliquam, in ullamcorper massa laoreet. Fusce commodo que, vitae feugiat iaculis.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Sara Brune',
      text: 'Nam orci arcu, tincidunt at ultricies sed, blandit vitae neque. Duis in mollis purus. Nulla pellentesque lorem id justo hendrerit luctus.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Melanie Stil',
      text: 'Duis lorem sapien, rutrum id nibh quis, consectetur eleifend est. Mauris ornare et augue ut dignissim. Donec interdum ati nec finibus. Vitae feugiat nisi iaculis dolor ut.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'James Wilson',
      text: 'Outstanding craftsmanship and impeccable service. Every piece is a work of art that exceeds expectations.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
  ];

  const skills = [
    { name: 'Express repair', value: 78 },
    { name: 'Restoration', value: 52 },
    { name: 'Body measurements', value: 90 },
    { name: 'Resize', value: 65 },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate hero slider
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate services carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceSlide(prev => (prev + 1) % services.length);
    }, 3000); // Slide every 3 seconds
    return () => clearInterval(interval);
  }, [services.length]);

  // ============================================
  // STEP 3: ADD this useEffect for auto-rotation (around line 1700, after other useEffects):
  // ============================================

  // Auto-rotate testimonials carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialSlide(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Service carousel navigation
  const nextService = () => setCurrentServiceSlide(prev => (prev + 1) % services.length);
  const prevService = () => setCurrentServiceSlide(prev => (prev - 1 + services.length) % services.length);

  return (
    <div className="home-page-mohair">

      {/* ============================================
          TRANSPARENT HEADER - Visible at top
          ============================================ */}
      <header className={`home-header-transparent ${isScrolled ? 'hide-up' : ''}`}>
        <div className="header-top-bar-transparent">
          <span className="header-email">Email: tailor@example.com</span>
          <span className="header-brand-center">MAISON</span>
          <span className="header-phone">Call Us: +3266 427 5981</span>
        </div>
        <div className="header-nav-bar-transparent">
          <div className="header-search-transparent">
            <span className="search-icon">⌕</span>
            <span>Search...</span>
          </div>
          <nav className="header-nav-center-transparent">
            <button className="nav-item-transparent" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="nav-dot">◆</span> HOME
            </button>
            <button className="nav-item-transparent">PAGES</button>
            <button className="nav-item-transparent" onClick={() => navigateTo('about')}>PORTFOLIO</button>
            <button className="nav-item-transparent" onClick={() => navigateTo('contact')}>BLOG</button>
            <button className="nav-item-transparent" onClick={() => navigateTo('customizer', 'shirts')}>SHOP</button>
          </nav>
          <button className="info-btn-transparent" onClick={() => setIsCartOpen(true)}>
            <span className="info-label-transparent">Info</span>
            <span className="info-circle-transparent">
              <span className="info-dot-transparent"></span>
            </span>
          </button>
        </div>
      </header>

      {/* ============================================
          WHITE NAVBAR - Appears on scroll
          ============================================ */}
      <header className={`home-header-scrolled ${isScrolled ? 'visible' : 'hidden'}`}>
        <div className="header-nav-bar-scrolled">
          <button className="header-logo-scrolled" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            MAISON
          </button>
          <nav className="header-nav-center-scrolled">
            <button className="nav-item-scrolled" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="nav-dot">◆</span> HOME
            </button>
            <button className="nav-item-scrolled">PAGES</button>
            <button className="nav-item-scrolled" onClick={() => navigateTo('about')}>PORTFOLIO</button>
            <button className="nav-item-scrolled" onClick={() => navigateTo('contact')}>BLOG</button>
            <button className="nav-item-scrolled" onClick={() => navigateTo('customizer', 'shirts')}>SHOP</button>
          </nav>
          <button className="info-btn-scrolled" onClick={() => setIsCartOpen(true)}>
            <span className="info-label-scrolled">Info</span>
            <span className="info-circle-scrolled">
              <span className="info-dot-scrolled"></span>
            </span>
          </button>
        </div>
      </header>

      {/* ============================================
          HERO SLIDER
          ============================================ */}
      <section className="hero-slider">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <h1 className="hero-slide-title">
                {slide.title}<br />
                <span className="title-line-2">{slide.subtitle}</span>
              </h1>
              <p className="hero-slide-desc">{slide.description}</p>
              <button className="hero-discover-btn" onClick={() => navigateTo('customizer', 'suits')}>
                <span className="discover-text">DISCOVER</span>
              </button>
            </div>
          </div>
        ))}
        <button className="slider-arrow prev" onClick={prevSlide}>‹</button>
        <button className="slider-arrow next" onClick={nextSlide}>›</button>
        <div className="slider-dots">
          {heroSlides.map((_, index) => (
            <button key={index} className={`slider-dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </section>

      {/* ============================================
          SERVICES CAROUSEL - ANIMATED SLIDER
          ============================================ */}
      <section className="services-section animate-on-scroll" id="services">
        <div className={`services-container ${isVisible.services ? 'visible' : ''}`}>

          {/* Carousel Wrapper */}
          <div className="services-carousel-wrapper">
            {/* Left Arrow */}
            <button className="services-arrow services-arrow-left" onClick={prevService}>
              ‹
            </button>

            {/* Carousel Viewport */}
            <div className="services-carousel-viewport">
              <div
                className="services-carousel-track"
                style={{
                  transform: `translateX(calc(-${currentServiceSlide * 20}% - ${currentServiceSlide * 0.4}rem))`,
                }}
              >
                {/* Duplicate items for infinite loop effect */}
                {[...services, ...services].map((service, i) => (
                  <div
                    key={i}
                    className={`service-card ${i === currentServiceSlide + 2 ? 'center' : ''}`}
                  >
                    <div className={`service-image ${service.shape}`}>
                      <img src={service.image} alt={service.title} />
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-subtitle">{service.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button className="services-arrow services-arrow-right" onClick={nextService}>
              ›
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="carousel-dots">
            {services.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${currentServiceSlide === i ? 'active' : ''}`}
                onClick={() => setCurrentServiceSlide(i)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ABOUT SPLIT SECTION */}
      <section className="about-split-section">
        <div className="about-text-side">
          <h2 className="about-title">Bespoke Suit & Dress<br />Making Professionals</h2>
          <p className="about-label">High Quality</p>
          <p className="about-description">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
          <button className="about-cta-btn" onClick={() => navigateTo('customizer', 'suits')}>DISCOVER MORE</button>
        </div>
        <div className="about-image-side">
          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800" alt="Tailoring" />
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="marquee-ticker">
        <div className="marquee-content">
          <span>Individuality of your style</span><span className="ticker-separator">•</span>
          <span>Weekend Special Sale 50%</span><span className="ticker-separator">•</span>
          <span>Individuality of your style</span><span className="ticker-separator">•</span>
          <span>Weekend Special Sale 50%</span><span className="ticker-separator">•</span>
          <span>Individuality of your style</span><span className="ticker-separator">•</span>
          <span>Weekend Special Sale 50%</span>
        </div>
      </div>

      {/* SKILLS SECTION */}
      <section className="skills-section animate-on-scroll" id="skills">
        <div className={`skills-container ${isVisible.skills ? 'visible' : ''}`}>
          <div className="skills-text">
            <h2 className="skills-title">Individuality of your design.<br />Our Numbers Speak About<br />Everything.</h2>
            <p className="skills-label">High Quality Tailor</p>
          </div>
          <div className="skills-bars">
            {skills.map((skill, i) => (
              <div key={i} className="skill-bar-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-value">{skill.value}%</span>
                </div>
                <div className="skill-bar-bg">
                  <div
                    className="skill-bar-fill"
                    style={{ width: isVisible.skills ? `${skill.value}%` : '0%' }}
                  >
                    <span className="skill-bar-scissor">✂</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - VIDEO STYLE */}
      <section className="testimonials-section-video">
        <div className="testimonials-video-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What People Say About Us</h2>
            <p className="testimonials-subtitle">High Quality Tailor</p>
          </div>

          <div className="testimonials-carousel-wrapper">
            <div
              className="testimonials-carousel-track"
              style={{
                transform: `translateX(calc(-${currentTestimonialSlide * 33.333}% - ${currentTestimonialSlide * 1.33}rem))`,
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <div key={i} className="testimonial-card-video">
                  <div className="testimonial-card-inner">
                    <p className="testimonial-quote-video">"{testimonial.text}"</p>
                    <p className="testimonial-name-video">{testimonial.name}</p>
                    <div className="testimonial-avatar-video">
                      <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="testimonials-dots-video">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot-video ${currentTestimonialSlide === i ? 'active' : ''}`}
                onClick={() => setCurrentTestimonialSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SPLIT SECTION */}
      <section className="cta-split-section">
        <div className="cta-image-side">
          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800" alt="Fashion" />
        </div>
        <div className="cta-text-side">
          <h2 className="cta-title">Exquisite Designs Crafted<br />by Experts</h2>
          <p className="cta-label">High Quality</p>
          <p className="cta-description">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.</p>
          <button className="cta-btn-primary" onClick={() => navigateTo('customizer', 'shirts')}>START DESIGNING</button>
        </div>
      </section>

      {/* PRODUCTS SHOWCASE */}
      <section className="products-showcase-section animate-on-scroll" id="products">
        <div className={`products-showcase-container ${isVisible.products ? 'visible' : ''}`}>
          <div className="section-header-center">
            <span className="section-label-gold">Our Collection</span>
            <h2 className="section-title-large">Design Your Perfect Fit</h2>
          </div>
          <div className="products-showcase-grid">
            <div className="showcase-item large" onClick={() => navigateTo('customizer', 'kurta')}>
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" alt="Anarkali Kurti" />
              <div className="showcase-overlay">
                <span className="showcase-tag">Most Popular</span>
                <h3>Anarkali Kurti</h3>
                <p>From $89.99</p>
              </div>
            </div>
            <div className="showcase-item" onClick={() => navigateTo('customizer', 'shirts')}>
              <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600" alt="Custom Shirts" />
              <div className="showcase-overlay"><h3>Custom Shirts</h3><p>From $49.99</p></div>
            </div>
            <div className="showcase-item" onClick={() => navigateTo('customizer', 'jackets')}>
              <img src="https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600" alt="Custom Jackets" />
              <div className="showcase-overlay"><h3>Custom Jackets</h3><p>From $169</p></div>
            </div>
            <div className="showcase-item" onClick={() => navigateTo('customizer', 'pants')}>
              <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600" alt="Custom Pants" />
              <div className="showcase-overlay"><h3>Custom Pants</h3><p>From $74</p></div>
            </div>
          </div>
        </div>
      </section>
      {/* BRAND LOGOS MARQUEE - Infinite Scroll */}
      <section className="brand-marquee-section">
        <div className="brand-marquee-track">
          {/* First set of logos */}
          <div className="brand-marquee-content">
            <div className="brand-item">
              <svg viewBox="0 0 60 50" className="brand-svg">
                <path d="M5 5 L20 45 L30 20 L40 45 L55 5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="55" cy="8" r="4" fill="currentColor" />
              </svg>
            </div>

            <div className="brand-item brand-fc">
              <span className="fc-script">fc</span>
              <span className="fc-text">COMPANY<br />NAME<br />HANDWRITING</span>
            </div>

            <div className="brand-item">
              <span className="brand-text-tailor">TAILOR</span>
            </div>

            <div className="brand-item">
              <span className="brand-text-vogue">Vogue</span>
            </div>

            <div className="brand-item">
              <svg viewBox="0 0 80 50" className="brand-svg brand-h">
                <path d="M10 45 Q30 5 45 30 Q60 55 75 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="brand-item">
              <svg viewBox="0 0 50 50" className="brand-svg brand-button">
                <circle cx="25" cy="25" r="23" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="25" cy="25" r="21" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="25" cy="25" r="19" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="17" cy="17" r="3.5" fill="currentColor" />
                <circle cx="33" cy="17" r="3.5" fill="currentColor" />
                <circle cx="17" cy="33" r="3.5" fill="currentColor" />
                <circle cx="33" cy="33" r="3.5" fill="currentColor" />
              </svg>
            </div>

            <div className="brand-item">
              <span className="brand-text-hazel">HAZEL</span>
            </div>
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="brand-marquee-content">
            <div className="brand-item">
              <svg viewBox="0 0 60 50" className="brand-svg">
                <path d="M5 5 L20 45 L30 20 L40 45 L55 5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="55" cy="8" r="4" fill="currentColor" />
              </svg>
            </div>

            <div className="brand-item brand-fc">
              <span className="fc-script">fc</span>
              <span className="fc-text">COMPANY<br />NAME<br />HANDWRITING</span>
            </div>

            <div className="brand-item">
              <span className="brand-text-tailor">TAILOR</span>
            </div>

            <div className="brand-item">
              <span className="brand-text-vogue">Vogue</span>
            </div>

            <div className="brand-item">
              <svg viewBox="0 0 80 50" className="brand-svg brand-h">
                <path d="M10 45 Q30 5 45 30 Q60 55 75 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="brand-item">
              <svg viewBox="0 0 50 50" className="brand-svg brand-button">
                <circle cx="25" cy="25" r="23" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="25" cy="25" r="21" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="25" cy="25" r="19" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="17" cy="17" r="3.5" fill="currentColor" />
                <circle cx="33" cy="17" r="3.5" fill="currentColor" />
                <circle cx="17" cy="33" r="3.5" fill="currentColor" />
                <circle cx="33" cy="33" r="3.5" fill="currentColor" />
              </svg>
            </div>

            <div className="brand-item">
              <span className="brand-text-hazel">HAZEL</span>
            </div>
          </div>
        </div>
      </section>



      <CartDrawer />
    </div>
  );
}

// ============================================
// PRODUCT CUSTOMIZER
// ============================================
function ProductCustomizer({ productType, navigateTo }) {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState(fabrics[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyleCategory, setSelectedStyleCategory] = useState(
    productType === 'kurta' ? 'neckFront' : 'sleeve'
  );
  const [selectedStyles, setSelectedStyles] = useState(
    productType === 'kurta'
      ? {
        neckFront: kurtaStyleOptions.neckFront[0],
        neckBack: kurtaStyleOptions.neckBack[0],
        sleeve: kurtaStyleOptions.sleeve[0],
        bottom: kurtaStyleOptions.bottom[0],
      }
      : {
        sleeve: styleOptions.sleeve[0],
        front: styleOptions.front[0],
        back: styleOptions.back[0],
        bottom: styleOptions.bottom[0],
        collar: styleOptions.collar[0],
        cuffs: styleOptions.cuffs[0],
        pockets: styleOptions.pockets[0],
      }
  );
  const [selectedExtras, setSelectedExtras] = useState({});

  // Color Contrast state
  const [contrastCategory, setContrastCategory] = useState('contrast');
  const [selectedContrasts, setSelectedContrasts] = useState({});
  const [contrastFabrics, setContrastFabrics] = useState({});

  // Button state
  const [buttonCategory, setButtonCategory] = useState('regular');
  const [selectedButton, setSelectedButton] = useState(buttonOptions.regular[0]);
  const [threadType, setThreadType] = useState('tone');
  const [selectedThread, setSelectedThread] = useState(threadColors[0]);
  const [selectedButtonHole, setSelectedButtonHole] = useState(buttonHoleStyles[0]);

  // Monogram state
  const [monogramPosition, setMonogramPosition] = useState(monogramPositions[0]);
  const [monogramText, setMonogramText] = useState('');
  const [monogramFont, setMonogramFont] = useState(monogramFonts[0]);
  const [monogramColor, setMonogramColor] = useState(threadColors[0]);

  // Measurement state
  const [measurementStep, setMeasurementStep] = useState('choice'); // choice, standard, body
  const [measurementUnit, setMeasurementUnit] = useState('inch');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedFit, setSelectedFit] = useState('standard');
  const [bodyMeasures, setBodyMeasures] = useState({});
  const [quantity, setQuantity] = useState(1);
  // Direct fabric selection for each part - Body, Sleeves, Collar
  const [partFabrics, setPartFabrics] = useState({
    body: fabrics[0],     // Default to first fabric (White)
    sleeve: fabrics[0],   // Default to first fabric
    collar: fabrics[0],   // Default to first fabric
    skirt: fabrics[0]     // Default to first fabric
  });

  const [activePart, setActivePart] = useState('body'); // 'body', 'sleeve', 'collar', 'skirt'

  // ADD these helper functions after state declarations:
  const getPartSwatchStyle = (part) => {
    const fabric = partFabrics[part] || partFabrics.body;
    if (!fabric) return { backgroundColor: '#fff' };
    if (fabric.image) {
      return { backgroundImage: `url(${fabric.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (fabric.pattern === 'check') {
      return { background: `repeating-conic-gradient(${fabric.colors[0]} 0% 25%, ${fabric.colors[1]} 0% 50%) 50% / 8px 8px` };
    }
    return { backgroundColor: fabric.color || '#fff' };
  };

  const handleFabricSelect = (fabric) => {
    if (productType === 'kurta' && activePart === 'all') {
      setPartFabrics({
        body: fabric,
        sleeve: fabric,
        collar: fabric,
        skirt: fabric
      });
    } else {
      setPartFabrics(prev => ({ ...prev, [activePart]: fabric }));
    }
  };

  const product = productCategories[productType] || productCategories.shirts;
  const steps = ['Fabric', 'Style', 'Color Contrast', 'Measurements'];

  const filteredFabrics = selectedCategory === 'all'
    ? fabrics
    : fabrics.filter(f => f.category === selectedCategory);

  const calculatePrice = useCallback(() => {
    let total = selectedFabric?.price || 49.99;
    Object.values(selectedStyles).forEach(s => { if (s?.price) total += s.price; });
    Object.values(selectedExtras).forEach(e => { if (e) total += 5; });
    if (selectedButton?.price) total += selectedButton.price;
    // Add contrast fabric prices
    Object.entries(selectedContrasts).forEach(([key, enabled]) => {
      if (enabled) {
        const opt = contrastOptions.find(o => o.id === key);
        if (opt?.price) total += opt.price;
      }
    });
    return total * quantity;
  }, [selectedFabric, selectedStyles, selectedExtras, selectedButton, selectedContrasts, quantity]);

  const handleAddToCart = () => {
    addToCart({
      productType,
      name: product.name,
      fabricName: selectedFabric?.name,
      fabricColor: selectedFabric?.color,
      fabricPattern: selectedFabric?.pattern,
      fabricPatternColors: selectedFabric?.colors,
      fabricApplication: selectedFabric?.pattern ? fabricApplication : null,
      partFabrics: selectedFabric?.pattern ? {
        body: partFabrics.body ? { id: partFabrics.body.id, name: partFabrics.body.name } : null,
        sleeve: partFabrics.sleeve ? { id: partFabrics.sleeve.id, name: partFabrics.sleeve.name } : null,
        collar: partFabrics.collar ? { id: partFabrics.collar.id, name: partFabrics.collar.name } : null,
      } : null,
      price: calculatePrice() / quantity,
      quantity,
      monogram: monogramPosition.id !== 'none' ? { text: monogramText, position: monogramPosition.name } : null
    });
  };

  return (
    <div className="customizer-page">
      <div className="customizer-container">
        <div className="preview-panel">
          <div className="preview-header">
            <button className="back-btn" onClick={() => navigateTo('home')}>← Back</button>
            <div className="product-price-header">
              <span className="product-name">{product.name}</span>
              <span className="product-total">${calculatePrice().toFixed(2)}</span>
            </div>
          </div>
          <div className="preview-3d-area">
            {productType === 'kurta' ? (
              <KurtaPreview3D
                partFabrics={partFabrics}
                selectedStyles={selectedStyles}
              />
            ) : (
              <ShirtPreview3D
                partFabrics={partFabrics}
                selectedStyles={selectedStyles}
                selectedContrasts={selectedContrasts}
                contrastFabrics={contrastFabrics}
                buttonColor={selectedButton}
                monogram={{
                  position: monogramPosition?.id,
                  text: monogramText,
                  font: monogramFont?.id,
                  color: monogramColor?.color
                }}
              />
            )}
          </div>

        </div>

        <div className="customization-panel">
          <div className="steps-nav">
            {steps.map((step, i) => (
              <button key={step} className={`step-nav-btn ${currentStep === i + 1 ? 'active' : ''} ${currentStep > i + 1 ? 'completed' : ''}`} onClick={() => setCurrentStep(i + 1)}>
                <span className="step-number">{currentStep > i + 1 ? '✓' : i + 1}</span>
                <span className="step-name">{step}</span>
              </button>
            ))}
          </div>

          <div className="step-content">
            {currentStep === 1 && (
              <div className="fabric-step">
                <div className="step-header">
                  <h2>Choose Your Fabrics</h2>
                  <p>Select fabric for body, sleeves, and collar</p>
                </div>

                <div className="fabric-layout">
                  <div className="fabric-sidebar">
                    {fabricCategories.map(cat => (
                      <button
                        key={cat.id}
                        className={`fabric-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <span className="cat-name">{cat.name}</span>
                        {cat.price && <span className="cat-price">${cat.price.toFixed(2)}</span>}
                      </button>
                    ))}
                  </div>

                  <div className="fabric-grid-container">
                    {/* Part Selection Dropdown */}
                    <div className="part-selector-row">
                      <label className="part-selector-label">Apply to:</label>
                      <div className="part-selector-wrapper">
                        <select
                          className="part-selector-dropdown"
                          value={activePart}
                          onChange={(e) => setActivePart(e.target.value)}
                        >
                          {productType === 'kurta' ? (
                            <>
                              <option value="all">Whole Garment</option>
                              <option value="body">Bodice</option>
                              <option value="skirt">Skirt</option>
                              <option value="sleeve">Sleeves</option>
                            </>
                          ) : (
                            <>
                              <option value="body">Body</option>
                              <option value="sleeve">Sleeves</option>
                              <option value="collar">Collar</option>
                            </>
                          )}
                        </select>
                        <div className="part-selector-swatch" style={getPartSwatchStyle(activePart)} />
                      </div>
                      <span className="part-current-fabric">{partFabrics[activePart]?.name || 'Not selected'}</span>
                    </div>

                    {/* Fabric Grid */}
                    <div className="fabrics-grid">
                      {filteredFabrics.map(fabric => {
                        const isSelected = partFabrics[activePart]?.id === fabric.id;

                        // Determine swatch style based on fabric type
                        let swatchStyle = {};
                        if (fabric.image) {
                          swatchStyle = { backgroundImage: `url(${fabric.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
                        } else if (fabric.pattern === 'check') {
                          swatchStyle = { background: `repeating-conic-gradient(${fabric.colors[0]} 0% 25%, ${fabric.colors[1]} 0% 50%) 50% / 16px 16px` };
                        } else {
                          swatchStyle = { backgroundColor: fabric.color };
                        }

                        return (
                          <div
                            key={fabric.id}
                            className={`fabric-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleFabricSelect(fabric)}
                          >
                            {fabric.promo && <span className="promo-badge">PROMO</span>}
                            <div
                              className={`fabric-swatch ${fabric.pattern === 'check' ? 'fabric-swatch-check' : ''} ${fabric.image ? 'fabric-swatch-image' : ''}`}
                              style={swatchStyle}
                            >
                              {isSelected && <div className="fabric-check">✓</div>}
                            </div>
                            <div className="fabric-label">
                              <span className="fabric-name">{fabric.name.toUpperCase()}</span>
                              <span className="fabric-price">${fabric.price.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Fabrics Summary */}
                    <div className="selected-fabrics-summary">
                      <h4>Your Selection:</h4>
                      <div className="summary-items">
                        <div className="summary-item">
                          <span className="summary-label">Body:</span>
                          <span className="summary-value">{partFabrics.body?.name || 'Not selected'}</span>
                          <div className="summary-swatch" style={getPartSwatchStyle('body')} />
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Sleeves:</span>
                          <span className="summary-value">{partFabrics.sleeve?.name || 'Not selected'}</span>
                          <div className="summary-swatch" style={getPartSwatchStyle('sleeve')} />
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Collar:</span>
                          <span className="summary-value">{partFabrics.collar?.name || 'Not selected'}</span>
                          <div className="summary-swatch" style={getPartSwatchStyle('collar')} />
                        </div>
                      </div>
                    </div>

                    <div className="trustpilot-badge">
                      <span className="tp-star">★</span> Trustpilot
                      <div className="tp-stars">★★★★★</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: STYLE */}
            {currentStep === 2 && (
              <div className="style-step">
                <div className="step-header"><h2>Customize Style</h2><p>Define every detail of your {productType === 'kurta' ? 'kurta' : 'shirt'}</p></div>
                <div className="style-layout">
                  <div className="style-sidebar">
                    <div className="style-sidebar-section">
                      <span className="sidebar-section-title">{productType === 'kurta' ? 'KURTA' : 'SHIRT'}</span>
                      {(productType === 'kurta' ? kurtaStyleCategories : styleCategories).map(cat => (
                        <button key={cat.id} className={`style-category-btn ${selectedStyleCategory === cat.id ? 'active' : ''}`} onClick={() => setSelectedStyleCategory(cat.id)}>
                          <span className="style-indicator">{selectedStyleCategory === cat.id ? '●' : ''}</span>
                          {cat.name.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="style-content">
                    <h3 className="style-section-title">
                      ▶ {(productType === 'kurta' ? kurtaStyleCategories : styleCategories).findIndex(c => c.id === selectedStyleCategory) + 1}. CHOOSE YOUR {selectedStyleCategory.toUpperCase()} STYLE
                    </h3>
                    <div className="style-options-grid">
                      {(productType === 'kurta' ? kurtaStyleOptions : styleOptions)[selectedStyleCategory]?.map(option => (
                        <div key={option.id} className={`style-option-card ${selectedStyles[selectedStyleCategory]?.id === option.id ? 'selected' : ''}`} onClick={() => setSelectedStyles(prev => ({ ...prev, [selectedStyleCategory]: option }))}>
                          <div className="style-option-icon" dangerouslySetInnerHTML={{ __html: styleIcons[option.id] || '' }} />
                          {selectedStyles[selectedStyleCategory]?.id === option.id && <span className="style-check">✓</span>}
                          <span className="style-option-name">{option.name.toUpperCase()}</span>
                          {option.price > 0 && <span className="style-option-price">+${option.price}</span>}
                        </div>
                      ))}
                    </div>
                    {extraOptions[selectedStyleCategory] && (
                      <div className="style-extras">
                        {extraOptions[selectedStyleCategory].map(extra => (
                          <label key={extra.id} className="extra-option">
                            <input type="checkbox" checked={!!selectedExtras[extra.id]} onChange={(e) => setSelectedExtras(prev => ({ ...prev, [extra.id]: e.target.checked }))} />
                            <span className="extra-checkbox">▶</span>
                            <span className="extra-name">{extra.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COLOR CONTRAST (includes Contrast, Buttons, Monogram) */}
            {currentStep === 3 && (
              <div className="contrast-step">
                <div className="step-header"><h2>Color Contrast</h2><p>Add personal touches to your shirt</p></div>
                <div className="contrast-layout">
                  <div className="contrast-sidebar">
                    <button className={`contrast-category-btn ${contrastCategory === 'contrast' ? 'active' : ''}`} onClick={() => setContrastCategory('contrast')}>
                      <span className="style-indicator">{contrastCategory === 'contrast' ? '●' : ''}</span>CONTRAST
                    </button>
                    <button className={`contrast-category-btn ${contrastCategory === 'buttons' ? 'active' : ''}`} onClick={() => setContrastCategory('buttons')}>
                      <span className="style-indicator">{contrastCategory === 'buttons' ? '●' : ''}</span>BUTTONS
                    </button>
                    <button className={`contrast-category-btn ${contrastCategory === 'monogram' ? 'active' : ''}`} onClick={() => setContrastCategory('monogram')}>
                      <span className="style-indicator">{contrastCategory === 'monogram' ? '●' : ''}</span>MONOGRAM
                    </button>
                  </div>

                  <div className="contrast-content">
                    {/* CONTRAST FABRIC */}
                    {contrastCategory === 'contrast' && (
                      <div className="contrast-section">
                        <h3 className="section-title">▶ 1. CHOOSE YOUR CONTRAST FABRIC</h3>
                        <div className="contrast-options-list">
                          {contrastOptions.map(opt => (
                            <div key={opt.id} className="contrast-option-row">
                              <label className="contrast-checkbox">
                                <input type="checkbox" checked={!!selectedContrasts[opt.id]} onChange={(e) => {
                                  setSelectedContrasts(prev => ({ ...prev, [opt.id]: e.target.checked }));
                                  // Auto-select first different fabric when enabling
                                  if (e.target.checked && !contrastFabrics[opt.id]) {
                                    const differentFab = fabrics.find(f => f.color !== selectedFabric?.color) || fabrics[1];
                                    setContrastFabrics(prev => ({ ...prev, [opt.id]: differentFab }));
                                  }
                                  // Clear fabric when disabling
                                  if (!e.target.checked) {
                                    setContrastFabrics(prev => ({ ...prev, [opt.id]: null }));
                                  }
                                }} />
                                <span className="checkmark"></span>
                              </label>
                              <span className="contrast-name">{opt.name}</span>
                              {opt.price > 0 && <span className="contrast-price">+ ${opt.price.toFixed(2)}</span>}
                              <div className="contrast-fabric-picker">
                                <div className="mini-swatch" style={{ backgroundColor: contrastFabrics[opt.id]?.color || '#F5F5DC' }} />
                                <select
                                  value={contrastFabrics[opt.id]?.id || fabrics[0].id}
                                  onChange={(e) => {
                                    const fab = fabrics.find(f => f.id === e.target.value);
                                    setContrastFabrics(prev => ({ ...prev, [opt.id]: fab }));
                                  }}
                                  disabled={!selectedContrasts[opt.id]}
                                >
                                  {fabrics.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BUTTONS */}
                    {contrastCategory === 'buttons' && (
                      <div className="buttons-section">
                        <h3 className="section-title">▶ 2.1 CHOOSE YOUR BUTTON COLOR</h3>

                        <div className="button-type-label">REGULAR BUTTON</div>
                        <div className="button-colors-grid">
                          {buttonOptions.regular.map(btn => (
                            <button key={btn.id} className={`button-color-btn ${selectedButton?.id === btn.id ? 'selected' : ''}`} onClick={() => { setSelectedButton(btn); setButtonCategory('regular'); }} style={{ backgroundColor: btn.color }} title={btn.name}>
                              {selectedButton?.id === btn.id && <span className="btn-check">✓</span>}
                            </button>
                          ))}
                        </div>

                        <div className="button-type-label">MOTHER OF PEARL <span className="price-tag">+ $1.99</span></div>
                        <div className="button-colors-grid">
                          {buttonOptions.motherOfPearl.map(btn => (
                            <button key={btn.id} className={`button-color-btn mop ${selectedButton?.id === btn.id ? 'selected' : ''}`} onClick={() => { setSelectedButton(btn); setButtonCategory('mop'); }} style={{ backgroundColor: btn.color }} title={btn.name}>
                              {selectedButton?.id === btn.id && <span className="btn-check">✓</span>}
                            </button>
                          ))}
                        </div>

                        <div className="button-type-label">TRENDY BUTTON <span className="price-tag">+ $1.99</span></div>
                        <div className="button-colors-grid">
                          {buttonOptions.trendy.map(btn => (
                            <button key={btn.id} className={`button-color-btn trendy ${selectedButton?.id === btn.id ? 'selected' : ''}`} onClick={() => { setSelectedButton(btn); setButtonCategory('trendy'); }} style={{ backgroundColor: btn.color, borderColor: btn.border }} title={btn.name}>
                              {selectedButton?.id === btn.id && <span className="btn-check">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MONOGRAM */}
                    {contrastCategory === 'monogram' && (
                      <div className="monogram-section">
                        <h3 className="section-title">▶ 3. MONOGRAM/INITIALS</h3>
                        <h4 className="subsection-title">3.1 CHOOSE YOUR MONOGRAM POSITION</h4>
                        <div className="monogram-positions-grid">
                          {monogramPositions.map(pos => (
                            <button key={pos.id} className={`monogram-position-btn ${monogramPosition?.id === pos.id ? 'selected' : ''}`} onClick={() => setMonogramPosition(pos)}>
                              {pos.name.toUpperCase()}
                              {monogramPosition?.id === pos.id && <span className="check">✓</span>}
                            </button>
                          ))}
                        </div>

                        {monogramPosition.id !== 'none' && (
                          <>
                            <h4 className="subsection-title mt-4">3.2 ENTER YOUR INITIALS</h4>
                            <input type="text" className="monogram-input" maxLength={4} value={monogramText} onChange={(e) => setMonogramText(e.target.value.toUpperCase())} placeholder="Enter initials (max 4)" />

                            <h4 className="subsection-title mt-4">3.3 CHOOSE FONT STYLE</h4>
                            <div className="font-options">
                              {monogramFonts.map(font => (
                                <button
                                  key={font.id}
                                  className={`font-btn ${monogramFont?.id === font.id ? 'selected' : ''}`}
                                  onClick={() => setMonogramFont(font)}
                                  style={{
                                    fontFamily: font.id === 'block' ? 'Arial Black, sans-serif' :
                                      font.id === 'script' ? 'Brush Script MT, cursive' :
                                        'Old English Text MT, serif',
                                    fontStyle: font.id === 'script' ? 'italic' : 'normal'
                                  }}
                                >
                                  {font.name}
                                  {monogramFont?.id === font.id && <span className="font-check">✓</span>}
                                </button>
                              ))}
                            </div>

                            <h4 className="subsection-title mt-4">3.4 CHOOSE THREAD COLOR</h4>
                            <div className="thread-colors">
                              {threadColors.map(thr => (
                                <button key={thr.id} className={`thread-color-btn ${monogramColor?.id === thr.id ? 'selected' : ''}`} onClick={() => setMonogramColor(thr)} style={{ backgroundColor: thr.color }} title={thr.name} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MEASUREMENTS */}
            {currentStep === 4 && (
              <div className="measurements-step">
                {measurementStep === 'choice' && (
                  <div className="measurement-choice">
                    <div className="step-header"><h2>Great Choice!</h2><p>Please select your measurement option</p></div>
                    <div className="measurement-cards">
                      <div className="measurement-card" onClick={() => setMeasurementStep('standard')}>
                        <div className="card-icon">📏</div>
                        <h3>STANDARD SIZES</h3>
                        <div className="size-icons">
                          <span className="size-box">S</span>
                          <span className="size-box">M</span>
                          <span className="size-box">L</span>
                        </div>
                        <p>Standard sizes provide an equally amazing tailored fit. Select from an array of sizes from our standard size chart.</p>
                      </div>
                      <div className="measurement-card" onClick={() => setMeasurementStep('body')}>
                        <div className="card-icon">📐</div>
                        <h3>BODY SIZE</h3>
                        <div className="tape-icon">🎗️</div>
                        <p>Part of the tailor-made experience is getting yourself measured up. With our easy-to-follow video guide, get measured in no time!</p>
                      </div>
                    </div>
                  </div>
                )}

                {measurementStep === 'standard' && (
                  <div className="standard-sizes">
                    <button className="back-link" onClick={() => setMeasurementStep('choice')}>← Back to options</button>
                    <div className="step-header"><h2>Standard Sizes</h2></div>

                    <div className="unit-toggle">
                      <span>▶ Enter Your Measurement:</span>
                      <button className={`unit-btn ${measurementUnit === 'inch' ? 'active' : ''}`} onClick={() => setMeasurementUnit('inch')}>Inch</button>
                      <button className={`unit-btn ${measurementUnit === 'cm' ? 'active' : ''}`} onClick={() => setMeasurementUnit('cm')}>cm</button>
                    </div>

                    <div className="size-chart-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Size</th>
                            {standardSizes.map(s => <th key={s}>{s}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Neck</td>
                            <td>15</td><td>16</td><td>16.5</td><td>17</td><td>18</td><td>19</td><td>20</td>
                          </tr>
                          <tr>
                            <td>Chest</td>
                            <td>41.75</td><td>44.5</td><td>47.5</td><td>49.5</td><td>52</td><td>55</td><td>58</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="size-quantity-row">
                      <div className="size-select">
                        <span>▶ Select Your Size:</span>
                        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                          {standardSizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="quantity-select">
                        <span>▶ Quantity:</span>
                        <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <button className="add-sizes-btn">ADD OTHER SIZES</button>
                    </div>

                    <p className="save-note">The 'Save Design' option is available on the Checkout page.</p>
                  </div>
                )}

                {measurementStep === 'body' && (
                  <div className="body-size">
                    <button className="back-link" onClick={() => setMeasurementStep('choice')}>← Back to options</button>
                    <div className="step-header"><h2>Your Body Size</h2></div>

                    <div className="unit-toggle">
                      <span>▶ Enter Your Measurement:</span>
                      <button className={`unit-btn ${measurementUnit === 'inch' ? 'active' : ''}`} onClick={() => setMeasurementUnit('inch')}>Inch</button>
                      <button className={`unit-btn ${measurementUnit === 'cm' ? 'active' : ''}`} onClick={() => setMeasurementUnit('cm')}>cm</button>
                    </div>

                    <div className="fit-toggle">
                      <span>▶ Select Your Fit:</span>
                      <button className={`fit-btn ${selectedFit === 'standard' ? 'active' : ''}`} onClick={() => setSelectedFit('standard')}>Signature Standard Fit</button>
                      <button className={`fit-btn ${selectedFit === 'slim' ? 'active' : ''}`} onClick={() => setSelectedFit('slim')}>Euro Slim Fit</button>
                    </div>

                    <div className="body-measurements-grid">
                      {bodyMeasurements.map(m => (
                        <div key={m.id} className="measurement-input-group">
                          <label>{m.name.toUpperCase()}</label>
                          <input type="text" placeholder={measurementUnit === 'inch' ? 'Inch' : 'cm'} value={bodyMeasures[m.id] || ''} onChange={(e) => setBodyMeasures(prev => ({ ...prev, [m.id]: e.target.value }))} />
                        </div>
                      ))}
                    </div>

                    <div className="quantity-row">
                      <span>▶ Quantity:</span>
                      <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    <p className="save-note">The 'Save Design' option is available on the Checkout page.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="step-actions">
            {currentStep > 1 && <button className="step-btn secondary" onClick={() => setCurrentStep(p => p - 1)}>← Previous</button>}
            {currentStep < steps.length ? (
              <button className="step-btn primary" onClick={() => setCurrentStep(p => p + 1)}>Next →</button>
            ) : (
              <button className="step-btn primary add-to-cart" onClick={handleAddToCart} disabled={measurementStep === 'choice'}>
                Add to Bag — ${calculatePrice().toFixed(2)}
              </button>
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
function AboutPage() {
  return <div className="page"><div className="page-hero"><h1>Our Story</h1></div><div className="page-content"><p>Founded in 1983, Maison has been at the forefront of custom tailoring.</p></div></div>;
}

function ContactPage() {
  return <div className="page"><div className="page-hero"><h1>Contact Us</h1></div><div className="page-content"><p>Email: info@maison-bespoke.com</p></div></div>;
}

// ============================================
// MAIN APP
// ============================================

// ... all your other components above (Header, Footer, HomePage, etc.) ...

// ============================================
// PASTE IntroAnimation HERE - BEFORE App()
// ============================================
// ============================================
// UPDATED IntroAnimation - SLOWER SCISSORS
// ============================================
// Paste this BEFORE export default function App()

function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState('logo');
  const [scissorPosition, setScissorPosition] = useState(0);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setPhase('cutting');
    }, 1500);
    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (phase === 'cutting') {
      let position = 0;
      const interval = setInterval(() => {
        position += 1.0;  // CHANGED: Was 2, now 0.5 (4x slower)
        setScissorPosition(position);
        if (position >= 100) {
          clearInterval(interval);
          setPhase('reveal');
        }
      }, 20);  // Runs every 20ms
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      const revealTimer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 1200);
      return () => clearTimeout(revealTimer);
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="intro-animation">
      <div className={`intro-logo-container ${phase !== 'logo' ? 'fade-out' : ''}`}>
        <h1 className="intro-logo">MAISON</h1>
        <p className="intro-tagline">Bespoke Tailoring</p>
      </div>

      {(phase === 'cutting' || phase === 'reveal') && (
        <div className="scissors-container">
          <div className="cutting-line">
            <div className="cutting-line-cut" style={{ width: `${scissorPosition}%` }} />
            <div className="cutting-line-uncut" style={{ left: `${scissorPosition}%`, width: `${100 - scissorPosition}%` }} />
          </div>
          <div
            className={`scissors ${phase === 'reveal' ? 'scissors-done' : ''}`}
            style={{ left: `${scissorPosition}%` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
        </div>
      )}

      {phase === 'reveal' && (
        <>
          <div className="curtain curtain-left" />
          <div className="curtain curtain-right" />
        </>
      )}
    </div>
  );
}
// ============================================
// SCROLL TO TOP BUTTON - Floating
// ============================================
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <div className="scroll-top-circle">
        <span className="scroll-top-dot"></span>
      </div>
      <span className="scroll-top-text">Top</span>
    </button>
  );
}
// ============================================
// THEN MODIFY YOUR App() BELOW
// ============================================
// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [productType, setProductType] = useState('shirts');
  const [showIntro, setShowIntro] = useState(true);

  const navigateTo = (page, product = null) => {
    setCurrentPage(page);
    if (product) setProductType(product);
    window.scrollTo(0, 0);
  };

  // Show intro animation instead of loading screen
  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <UserProvider>
      <CartProvider>
        <div className="app">
          <Header navigateTo={navigateTo} currentPage={currentPage} />
          <main className={currentPage === 'home' ? '' : 'main-content'}>
            {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
            {currentPage === 'customizer' && <ProductCustomizer productType={productType} navigateTo={navigateTo} />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'contact' && <ContactPage />}
          </main>
          <Footer navigateTo={navigateTo} />
          <ScrollToTopButton />
        </div>
      </CartProvider>
    </UserProvider>
  );
}