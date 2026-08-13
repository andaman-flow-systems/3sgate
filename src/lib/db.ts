// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
  createdAt: string;
}

export interface RentalSpace {
  id: string;
  name: string;
  location: string;
  price: number;
  size: string;
  image: string;
  description: string;
  isAvailable: boolean;
  renterName?: string;
  ownerUrl?: string;
  createdAt: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: 'myanmar-thailand' | 'myanmar-abroad' | 'myanmar-news';
  image: string;
  author: string;
  publishedAt: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  image: string;
  description: string;
  category: string;
  price?: number;
  forSale: boolean;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  type: 'support-me' | 'refugee' | 'scholarship';
  donorName: string;
  amount: number;
  message?: string;
  createdAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salary?: string;
  description: string;
  requirements: string[];
  contactEmail: string;
  isRecruitmentAgent: boolean;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface FoodPlace {
  id: string;
  name: string;
  category: string;
  location: string;
  address: string;
  phone?: string;
  image: string;
  description: string;
  priceRange: '$' | '$$' | '$$$';
  rating: number;
  openHours?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  text: string;
  link?: string;
  type: 'announcement' | 'promo' | 'ad';
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'super-admin' | 'admin' | 'editor';
  displayName: string;
  avatar?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  donationQR?: string;
  maintenanceMode: boolean;
}

export interface VisitorStat {
  date: string;
  visitors: number;
  pageViews: number;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  products:   '3sg_products',
  rentals:    '3sg_rentals',
  news:       '3sg_news',
  gallery:    '3sg_gallery',
  donations:  '3sg_donations',
  jobs:       '3sg_jobs',
  food:       '3sg_food',
  banners:    '3sg_banners',
  users:      '3sg_users',
  settings:   '3sg_settings',
  stats:      '3sg_stats',
  seeded:     '3sg_seeded',
} as const;

// ─── Core DB Helpers ───────────────────────────────────────────────────────────
function getAll<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setAll<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Generic CRUD ──────────────────────────────────────────────────────────────
function createRecord<T extends { id: string; createdAt: string }>(
  key: string,
  data: Omit<T, 'id' | 'createdAt'>
): T {
  const record = { ...data, id: generateId(), createdAt: new Date().toISOString() } as T;
  const all = getAll<T>(key);
  setAll(key, [...all, record]);
  return record;
}

function updateRecord<T extends { id: string }>(key: string, id: string, data: Partial<T>): T | null {
  const all = getAll<T>(key);
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data };
  setAll(key, all);
  return all[idx];
}

function deleteRecord<T extends { id: string }>(key: string, id: string): boolean {
  const all = getAll<T>(key);
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;
  setAll(key, filtered);
  return true;
}

function findById<T extends { id: string }>(key: string, id: string): T | null {
  return getAll<T>(key).find((r) => r.id === id) ?? null;
}

// ─── Products ──────────────────────────────────────────────────────────────────
export const productsDB = {
  getAll: () => getAll<Product>(KEYS.products),
  getById: (id: string) => findById<Product>(KEYS.products, id),
  create: (data: Omit<Product, 'id' | 'createdAt'>) => createRecord<Product>(KEYS.products, data),
  update: (id: string, data: Partial<Product>) => updateRecord<Product>(KEYS.products, id, data),
  delete: (id: string) => deleteRecord<Product>(KEYS.products, id),
};

// ─── Rentals ───────────────────────────────────────────────────────────────────
export const rentalsDB = {
  getAll: () => getAll<RentalSpace>(KEYS.rentals),
  getById: (id: string) => findById<RentalSpace>(KEYS.rentals, id),
  create: (data: Omit<RentalSpace, 'id' | 'createdAt'>) => createRecord<RentalSpace>(KEYS.rentals, data),
  update: (id: string, data: Partial<RentalSpace>) => updateRecord<RentalSpace>(KEYS.rentals, id, data),
  delete: (id: string) => deleteRecord<RentalSpace>(KEYS.rentals, id),
};

// ─── News ──────────────────────────────────────────────────────────────────────
export const newsDB = {
  getAll: () => getAll<NewsPost>(KEYS.news),
  getById: (id: string) => findById<NewsPost>(KEYS.news, id),
  getPublished: () => getAll<NewsPost>(KEYS.news).filter((n) => n.status === 'published'),
  create: (data: Omit<NewsPost, 'id' | 'createdAt'>) => createRecord<NewsPost>(KEYS.news, data),
  update: (id: string, data: Partial<NewsPost>) => updateRecord<NewsPost>(KEYS.news, id, data),
  delete: (id: string) => deleteRecord<NewsPost>(KEYS.news, id),
};

// ─── Gallery ───────────────────────────────────────────────────────────────────
export const galleryDB = {
  getAll: () => getAll<ArtworkItem>(KEYS.gallery),
  getById: (id: string) => findById<ArtworkItem>(KEYS.gallery, id),
  create: (data: Omit<ArtworkItem, 'id' | 'createdAt'>) => createRecord<ArtworkItem>(KEYS.gallery, data),
  update: (id: string, data: Partial<ArtworkItem>) => updateRecord<ArtworkItem>(KEYS.gallery, id, data),
  delete: (id: string) => deleteRecord<ArtworkItem>(KEYS.gallery, id),
};

// ─── Donations ─────────────────────────────────────────────────────────────────
export const donationsDB = {
  getAll: () => getAll<DonationRecord>(KEYS.donations),
  create: (data: Omit<DonationRecord, 'id' | 'createdAt'>) => createRecord<DonationRecord>(KEYS.donations, data),
  getTotalByType: (type: DonationRecord['type']) =>
    getAll<DonationRecord>(KEYS.donations)
      .filter((d) => d.type === type)
      .reduce((sum, d) => sum + d.amount, 0),
};

// ─── Jobs ──────────────────────────────────────────────────────────────────────
export const jobsDB = {
  getAll: () => getAll<JobListing>(KEYS.jobs),
  getById: (id: string) => findById<JobListing>(KEYS.jobs, id),
  getActive: () => getAll<JobListing>(KEYS.jobs).filter((j) => j.status === 'active'),
  create: (data: Omit<JobListing, 'id' | 'createdAt'>) => createRecord<JobListing>(KEYS.jobs, data),
  update: (id: string, data: Partial<JobListing>) => updateRecord<JobListing>(KEYS.jobs, id, data),
  delete: (id: string) => deleteRecord<JobListing>(KEYS.jobs, id),
};

// ─── Food ──────────────────────────────────────────────────────────────────────
export const foodDB = {
  getAll: () => getAll<FoodPlace>(KEYS.food),
  getById: (id: string) => findById<FoodPlace>(KEYS.food, id),
  create: (data: Omit<FoodPlace, 'id' | 'createdAt'>) => createRecord<FoodPlace>(KEYS.food, data),
  update: (id: string, data: Partial<FoodPlace>) => updateRecord<FoodPlace>(KEYS.food, id, data),
  delete: (id: string) => deleteRecord<FoodPlace>(KEYS.food, id),
};

// ─── Banners ───────────────────────────────────────────────────────────────────
export const bannersDB = {
  getAll: () => getAll<Banner>(KEYS.banners),
  getActive: () => getAll<Banner>(KEYS.banners).filter((b) => b.isActive),
  getById: (id: string) => findById<Banner>(KEYS.banners, id),
  create: (data: Omit<Banner, 'id' | 'createdAt'>) => createRecord<Banner>(KEYS.banners, data),
  update: (id: string, data: Partial<Banner>) => updateRecord<Banner>(KEYS.banners, id, data),
  delete: (id: string) => deleteRecord<Banner>(KEYS.banners, id),
};

// ─── Users ─────────────────────────────────────────────────────────────────────
export const usersDB = {
  getAll: () => getAll<AdminUser>(KEYS.users),
  getById: (id: string) => findById<AdminUser>(KEYS.users, id),
  findByUsername: (username: string) =>
    getAll<AdminUser>(KEYS.users).find((u) => u.username === username) ?? null,
  create: (data: Omit<AdminUser, 'id' | 'createdAt'>) => createRecord<AdminUser>(KEYS.users, data),
  update: (id: string, data: Partial<AdminUser>) => updateRecord<AdminUser>(KEYS.users, id, data),
  delete: (id: string) => deleteRecord<AdminUser>(KEYS.users, id),
};

// ─── Settings ──────────────────────────────────────────────────────────────────
export const settingsDB = {
  get: (): SiteSettings => {
    if (typeof window === 'undefined') return defaultSettings();
    try {
      const raw = localStorage.getItem(KEYS.settings);
      return raw ? JSON.parse(raw) : defaultSettings();
    } catch { return defaultSettings(); }
  },
  set: (data: Partial<SiteSettings>) => {
    if (typeof window === 'undefined') return;
    const current = settingsDB.get();
    localStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...data }));
  },
};

function defaultSettings(): SiteSettings {
  return {
    siteName: '3SGate',
    tagline: 'Social Enterprise Platform',
    contactEmail: 'contact@3sgate.com',
    maintenanceMode: false,
  };
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
export const statsDB = {
  getAll: () => getAll<VisitorStat>(KEYS.stats),
  getSummary: () => {
    const all = getAll<VisitorStat>(KEYS.stats);
    const today = all[all.length - 1];
    const weekTotal = all.slice(-7).reduce((s, d) => s + d.pageViews, 0);
    return {
      todayVisitors: today?.visitors ?? 0,
      weekPageViews: weekTotal,
    };
  },
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
export function getDashboardStats() {
  return {
    totalPosts: getAll(KEYS.news).length + getAll(KEYS.gallery).length,
    newsPosts:  getAll(KEYS.news).length,
    galleryItems: getAll(KEYS.gallery).length,
    jobListings: getAll(KEYS.jobs).length,
    todayVisitors: statsDB.getSummary().todayVisitors,
    weekPageViews: statsDB.getSummary().weekPageViews,
    activeBanners: getAll<Banner>(KEYS.banners).filter((b) => b.isActive).length,
  };
}

// ─── Seed Data ─────────────────────────────────────────────────────────────────
export function seedIfEmpty(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.seeded) === 'true') return;

  // Users
  setAll(KEYS.users, [{
    id: 'admin-001',
    username: 'admin',
    passwordHash: btoa('3sgate2024'),
    role: 'super-admin',
    displayName: 'Administrator',
    createdAt: '2024-01-01T00:00:00Z',
  }] as AdminUser[]);

  // Banners (no emojis — professional text)
  setAll(KEYS.banners, [
    { id: 'b1', text: 'Welcome to 3SGate — Connecting Communities, Creating Opportunities', link: '/', type: 'announcement', color: 'gold', isActive: true, createdAt: '2024-05-01T00:00:00Z' },
    { id: 'b2', text: 'New Shop Spaces Available — Rent Your Space Today', link: '/rent', type: 'promo', color: 'blue', isActive: true, createdAt: '2024-05-05T00:00:00Z' },
    { id: 'b3', text: 'Support Myanmar Refugees — Donate Now', link: '/donate', type: 'ad', color: 'red', isActive: true, createdAt: '2024-05-08T00:00:00Z' },
  ] as Banner[]);

  // News (8 articles)
  setAll(KEYS.news, [
    { id: 'n1', title: 'Important Update for Myanmar People in Thailand', content: 'The Thai government has announced new immigration policies affecting Myanmar nationals living and working in Thailand. All Myanmar citizens are urged to check their visa status and renew documentation before the deadline. Failure to comply may result in fines or deportation. The policy changes are expected to take effect in Q3 2024.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80', author: 'Admin', publishedAt: '2024-05-12T08:00:00Z', status: 'published', createdAt: '2024-05-12T00:00:00Z' },
    { id: 'n2', title: 'New Work Permit Regulations Announced', content: 'New work permit regulations have been issued for foreign nationals working in Thailand. Key changes include streamlined renewal processes, new document requirements, and updated fee structures. Myanmar workers are strongly encouraged to consult with official authorities to ensure full compliance.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', author: 'Admin', publishedAt: '2024-05-10T08:00:00Z', status: 'published', createdAt: '2024-05-10T00:00:00Z' },
    { id: 'n3', title: 'Relief Support for Myanmar Refugees in Border Areas', content: 'Humanitarian organisations are providing relief supplies and medical assistance to Myanmar refugees along the Thailand-Myanmar border. Emergency shelter, food packages, and medical care are being distributed. International NGOs are calling for continued donations and volunteer support.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', author: 'Admin', publishedAt: '2024-05-08T08:00:00Z', status: 'published', createdAt: '2024-05-08T00:00:00Z' },
    { id: 'n4', title: 'Myanmar Community Clean-Up Event in Chiang Mai', content: 'The Myanmar community in Chiang Mai organised a successful community clean-up event, bringing together over 200 volunteers to clean public parks and streets. The event was praised by local authorities and has strengthened bonds between the Myanmar and Thai communities.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1542601906897-93a9e6b5b6a5?w=600&q=80', author: 'Admin', publishedAt: '2024-05-05T08:00:00Z', status: 'published', createdAt: '2024-05-05T00:00:00Z' },
    { id: 'n5', title: 'Education Support Programs for Myanmar Youth in Thailand', content: 'Several NGOs and social enterprises have launched new education programmes to support Myanmar youth in Thailand. The programmes include Thai language classes, vocational training, and scholarship opportunities for outstanding students. Applications are now open.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', author: 'Admin', publishedAt: '2024-05-03T08:00:00Z', status: 'published', createdAt: '2024-05-03T00:00:00Z' },
    { id: 'n6', title: 'Myanmar Independence Day Celebrations Abroad', content: 'Myanmar communities around the world gathered to celebrate Independence Day with cultural events, traditional food festivals, and community gatherings. The celebrations served as a powerful reminder of shared heritage and the importance of preserving Myanmar culture abroad.', category: 'myanmar-news', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80', author: 'Admin', publishedAt: '2024-01-04T08:00:00Z', status: 'published', createdAt: '2024-01-04T00:00:00Z' },
    { id: 'n7', title: 'Flood Relief Effort for Displaced Families in Chiang Rai', content: 'Following severe flooding in the Chiang Rai region, Myanmar community organisations have mobilised to provide emergency relief to displaced families. Food, clean water, and temporary shelter are being distributed. Donations can be made through 3SGate.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80', author: 'Admin', publishedAt: '2024-04-28T08:00:00Z', status: 'published', createdAt: '2024-04-28T00:00:00Z' },
    { id: 'n8', title: 'International Day of the Refugee — Myanmar Stories of Resilience', content: 'On International Refugee Day, we share the resilient stories of Myanmar families who have rebuilt their lives abroad. From education to business, these stories of strength and hope inspire our entire community and remind the world of the human cost of displacement.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&q=80', author: 'Admin', publishedAt: '2024-04-20T08:00:00Z', status: 'published', createdAt: '2024-04-20T00:00:00Z' },
  ] as NewsPost[]);

  // Gallery (10 artworks — THB prices)
  setAll(KEYS.gallery, [
    { id: 'g1', title: 'Sunset Over Bagan', artist: 'Kaung Htet', image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&q=80', description: 'Oil painting depicting a Myanmar sunset over the ancient pagodas of Bagan. Rich warm tones and textured brushwork.', category: 'Painting', forSale: true, price: 8500, createdAt: '2024-05-01T00:00:00Z' },
    { id: 'g2', title: 'Freedom', artist: 'May Thiri', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', description: 'An abstract digital artwork expressing hope and liberation through bold strokes and vivid colour composition.', category: 'Digital Art', forSale: false, createdAt: '2024-04-20T00:00:00Z' },
    { id: 'g3', title: 'Portrait of Resilience', artist: 'Zar Win', image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80', description: 'A moving portrait capturing the quiet strength of a Myanmar elder woman — painted from life in Mandalay.', category: 'Portrait', forSale: true, price: 6200, createdAt: '2024-04-15T00:00:00Z' },
    { id: 'g4', title: 'Shwedagon at Dawn', artist: 'Kyaw Zin', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', description: 'Fine art photograph of the Shwedagon Pagoda bathed in the first light of dawn. Printed on premium canvas.', category: 'Photography', forSale: true, price: 4100, createdAt: '2024-04-10T00:00:00Z' },
    { id: 'g5', title: 'Life on the Irrawaddy', artist: 'Aye Chan', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', description: 'Documentary photograph of the daily fishing life along the Irrawaddy River at sunrise. Archival quality print.', category: 'Photography', forSale: false, createdAt: '2024-03-28T00:00:00Z' },
    { id: 'g6', title: 'Unity', artist: 'Thida Win', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', description: 'A large-format acrylic painting on canvas symbolising Myanmar people united in hope and solidarity.', category: 'Painting', forSale: true, price: 11000, createdAt: '2024-03-15T00:00:00Z' },
    { id: 'g7', title: 'Market Colours', artist: 'Hnin Thazin', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Vibrant watercolour of a busy Myanmar street market, filled with colour, people, and the energy of daily life.', category: 'Watercolour', forSale: true, price: 5500, createdAt: '2024-03-10T00:00:00Z' },
    { id: 'g8', title: 'Lotus in Stillness', artist: 'Su Su Naing', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=600&q=80', description: 'A serene ink-wash painting of lotus flowers, reflecting the Buddhist concept of calm and impermanence.', category: 'Ink Art', forSale: true, price: 3800, createdAt: '2024-02-25T00:00:00Z' },
    { id: 'g9', title: 'The Young Monk', artist: 'Kyaw Kyaw', image: 'https://images.unsplash.com/photo-1567900988803-5bcad34dfc95?w=600&q=80', description: 'Candid portrait of a young novice monk walking through the early morning mist of Mandalay streets.', category: 'Portrait', forSale: false, createdAt: '2024-02-10T00:00:00Z' },
    { id: 'g10', title: 'Teak Forest at Dusk', artist: 'Win Naing', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', description: 'A sweeping landscape of Myanmar teak forest bathed in the golden light of dusk. Oil on linen, 120x80cm.', category: 'Landscape', forSale: true, price: 9200, createdAt: '2024-01-20T00:00:00Z' },
  ] as ArtworkItem[]);

  // Products (12 items — THB prices)
  setAll(KEYS.products, [
    { id: 'p13', name: 'iPhone 17', price: 29900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', description: 'Next-gen iPhone 17 with Super Retina XDR OLED display, A19 Bionic chip, advanced dual 48MP camera, dynamic island, and all-day battery life.', inStock: true, createdAt: '2024-05-15T00:00:00Z' },
    { id: 'p14', name: 'iPhone 17 Pro', price: 41900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', description: 'Flagship iPhone 17 Pro crafted from Grade 5 Titanium, 120Hz ProMotion display, A19 Pro chip, and periscope 5x optical zoom camera system.', inStock: true, createdAt: '2024-05-16T00:00:00Z' },
    { id: 'p15', name: 'iPhone 17 Pro Max', price: 48900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80', description: 'Ultimate iPhone 17 Pro Max featuring massive 6.9-inch Super Retina XDR display, Titanium design, A19 Pro performance, and longest battery life ever in an iPhone.', inStock: true, createdAt: '2024-05-17T00:00:00Z' },
    { id: 'p1', name: 'Smart Watch Pro', price: 1490, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', description: 'Stylish smartwatch with heart rate monitoring, GPS, and 7-day battery life. Water resistant.', inStock: true, createdAt: '2024-05-01T00:00:00Z' },
    { id: 'p2', name: 'Premium Backpack', price: 990, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', description: 'Durable and fashionable backpack with padded laptop compartment and ergonomic straps.', inStock: true, createdAt: '2024-04-25T00:00:00Z' },
    { id: 'p3', name: 'Wireless Headphones', price: 890, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', description: 'High-fidelity wireless headphones with active noise cancellation and 30-hour battery.', inStock: true, createdAt: '2024-04-20T00:00:00Z' },
    { id: 'p4', name: 'Leather Tote Bag', price: 1250, category: 'Fashion', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', description: 'Elegant handcrafted leather tote bag, ideal for work or weekend outings.', inStock: false, createdAt: '2024-04-15T00:00:00Z' },
    { id: 'p5', name: 'Myanmar Lacquerware Bowl', price: 750, category: 'Crafts', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80', description: 'Traditional Myanmar lacquerware handcrafted by master artisans in Bagan using centuries-old techniques.', inStock: true, createdAt: '2024-04-10T00:00:00Z' },
    { id: 'p6', name: 'Handwoven Silk Longyi', price: 650, category: 'Clothing', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', description: 'Authentic Myanmar longyi, beautifully handwoven from pure silk. Available in multiple patterns.', inStock: true, createdAt: '2024-04-05T00:00:00Z' },
    { id: 'p7', name: 'Portable Bluetooth Speaker', price: 1190, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', description: 'Compact waterproof Bluetooth speaker with 360-degree sound and 20-hour play time.', inStock: true, createdAt: '2024-04-01T00:00:00Z' },
    { id: 'p8', name: 'Carved Teak Elephant', price: 490, category: 'Crafts', image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80', description: 'Hand-carved teak wood elephant — a classic Myanmar souvenir and elegant home decoration.', inStock: true, createdAt: '2024-03-28T00:00:00Z' },
    { id: 'p9', name: 'Embroidered Shoulder Bag', price: 820, category: 'Fashion', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80', description: 'Beautifully embroidered bag made by Myanmar artisans. Every piece is unique.', inStock: true, createdAt: '2024-03-20T00:00:00Z' },
    { id: 'p10', name: "Men's Linen Shirt", price: 590, category: 'Clothing', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', description: 'Breathable 100% linen shirt, perfectly suited for the tropical climate of Southeast Asia.', inStock: true, createdAt: '2024-03-15T00:00:00Z' },
    { id: 'p11', name: 'Ceramic Tea Set', price: 1100, category: 'Crafts', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', description: 'Elegant hand-painted ceramic tea set (5 pieces), inspired by traditional Myanmar floral patterns.', inStock: false, createdAt: '2024-03-10T00:00:00Z' },
    { id: 'p12', name: 'Insulated Water Bottle', price: 380, category: 'Accessories', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', description: 'Double-wall insulated stainless steel bottle — keeps drinks cold for 24 hrs, hot for 12 hrs. 500ml.', inStock: true, createdAt: '2024-03-05T00:00:00Z' },
  ] as Product[]);

  // Rentals (6 spaces — THB prices)
  setAll(KEYS.rentals, [
    { id: 'r1', name: 'Shop Space A1', location: 'Chiang Mai Central Market', price: 4500, size: '20 sqm', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80', description: 'Prime location shop space at the entrance of Chiang Mai Central Market. High foot traffic. Ideal for retail or fashion.', isAvailable: false, renterName: 'Mg Mg Clothing', ownerUrl: 'https://www.facebook.com/share/1JAoQ7KMHx/', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'r2', name: 'Shop Space A2', location: 'Chiang Mai Central Market', price: 4500, size: '20 sqm', image: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=600&q=80', description: 'Available space adjacent to main entrance. Comes with basic shelving and overhead lighting.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1JAoQ7KMHx/', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'r3', name: 'Corner Space B1', location: 'Bangkok Myanmar Plaza', price: 6200, size: '30 sqm', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80', description: 'Large corner shop space with maximum visibility in the Myanmar community plaza in Bangkok.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1JAoQ7KMHx/', createdAt: '2024-04-20T00:00:00Z' },
    { id: 'r4', name: 'Shop Space C3', location: 'Chiang Rai Weekend Market', price: 3000, size: '15 sqm', image: 'https://images.unsplash.com/photo-1572032023143-82929e48e636?w=600&q=80', description: 'Affordable space in the growing Chiang Rai weekend market. Popular with crafts, clothing, and food sellers.', isAvailable: false, renterName: 'Daw Aye Fashion House', ownerUrl: 'https://www.facebook.com/share/1JAoQ7KMHx/', createdAt: '2024-04-15T00:00:00Z' },
    { id: 'r5', name: 'Food Court Stall D2', location: 'Mae Sot Border Market', price: 2500, size: '10 sqm', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', description: 'Compact food court stall in the busy Mae Sot border market. Running water and electricity included.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1JAoQ7KMHx/', createdAt: '2024-04-08T00:00:00Z' },
    { id: 'r6', name: 'Showroom Space E1', location: 'Chiang Mai Central Market', price: 9800, size: '60 sqm', image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=600&q=80', description: 'Spacious showroom ideal for furniture, clothing wholesale, or multi-product displays. CCTV and storage room included.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1JAoQ7KMHx/', createdAt: '2024-04-01T00:00:00Z' },
  ] as RentalSpace[]);

  // Jobs (8 listings — THB salary)
  setAll(KEYS.jobs, [
    { id: 'j1', title: 'Restaurant Server', company: 'Thai Garden Restaurant', location: 'Chiang Mai', type: 'full-time', salary: '12,000 – 15,000 THB / month', description: 'We are looking for friendly, hardworking restaurant servers to join our team. Tips and meals included.', requirements: ['Myanmar or Thai language skills', 'Customer service attitude', 'Ability to work evening shifts'], contactEmail: 'hr@thaigarden.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-05-10T00:00:00Z' },
    { id: 'j2', title: 'Construction Worker', company: 'Build Thai Co., Ltd.', location: 'Bangkok', type: 'contract', salary: '400 – 600 THB / day', description: 'Construction workers needed for infrastructure and residential projects across Bangkok. Safety gear fully provided.', requirements: ['Physical fitness', 'Prior construction experience preferred', 'Safety awareness training'], contactEmail: 'jobs@buildthai.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-05-08T00:00:00Z' },
    { id: 'j3', title: 'Domestic Helper', company: 'Happy Home Agency', location: 'Multiple Locations, Thailand', type: 'full-time', salary: '10,000 – 12,000 THB / month + accommodation', description: 'Domestic helper positions available across Thailand. Accommodation and two daily meals are provided by the employer.', requirements: ['Basic Thai or English communication', 'Cooking skills', 'Trustworthy and responsible character'], contactEmail: 'happyhome@agency.co.th', isRecruitmentAgent: true, status: 'active', createdAt: '2024-05-05T00:00:00Z' },
    { id: 'j4', title: 'Factory Production Worker', company: 'Thai Manufacturing Ltd.', location: 'Samut Prakan, Bangkok', type: 'full-time', salary: '11,000 – 14,000 THB / month', description: 'Production line workers needed for garment and electronics manufacturing. Full on-the-job training is provided.', requirements: ['Physical fitness', 'Attention to detail', 'Willingness to work rotating shift schedules'], contactEmail: 'recruit@thaimfg.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'j5', title: 'Cook and Kitchen Assistant', company: 'Myanmar Food Court', location: 'Chiang Rai', type: 'full-time', salary: '11,000 – 13,000 THB / month', description: 'Experienced Myanmar cook needed for our growing food court. Must have knowledge of traditional Myanmar dishes.', requirements: ['Myanmar cooking experience required', 'Basic food handling hygiene knowledge', 'Works well in a team'], contactEmail: 'hire@mmfoodcourt.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-04-28T00:00:00Z' },
    { id: 'j6', title: 'Retail Shop Assistant', company: 'Style Myanmar Boutique', location: 'Chiang Mai', type: 'part-time', salary: '350 – 450 THB / day', description: 'Part-time shop assistant needed for our Myanmar clothing boutique at Chiang Mai weekend market.', requirements: ['Friendly and polite customer manner', 'Basic Thai language ability', 'Interest in fashion and retail'], contactEmail: 'boutique@stylemm.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-04-22T00:00:00Z' },
    { id: 'j7', title: 'Overseas Factory Worker — Japan', company: 'Global Labour Solutions', location: 'Osaka, Japan', type: 'contract', salary: '¥180,000 – ¥220,000 / month', description: 'Factory positions in Japan available through a licensed recruitment agent. 2-year contracts. Flights and accommodation included. Apply through official channels only.', requirements: ['Age 20–45', 'Medical clearance certificate', 'JLPT N4 or above preferred', 'Registered with Ministry of Labour, Myanmar'], contactEmail: 'japan@globallabour.com', isRecruitmentAgent: true, status: 'active', createdAt: '2024-04-15T00:00:00Z' },
    { id: 'j8', title: 'Security Guard', company: 'SafeGuard Services Co., Ltd.', location: 'Bangkok', type: 'full-time', salary: '12,000 – 14,000 THB / month', description: 'Security guards required for shopping malls and commercial buildings across Bangkok. Full uniform and training provided.', requirements: ['Good physical health', 'Reliable and punctual', 'Prior security or military experience is a plus'], contactEmail: 'jobs@safeguard.co.th', isRecruitmentAgent: false, status: 'active', createdAt: '2024-04-08T00:00:00Z' },
  ] as JobListing[]);

  // Food (8 places)
  setAll(KEYS.food, [
    { id: 'f1', name: 'Myanmar Kitchen Chiang Mai', category: 'Myanmar Cuisine', location: 'Chiang Mai', address: '123 Nimman Rd, Suthep, Mueang, Chiang Mai 50200', phone: '+66 53 123 456', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Authentic Myanmar cuisine with traditional recipes from Mandalay and Yangon. Signature dishes: Mohinga, Laphet Thoke, Shan noodles.', priceRange: '$', rating: 4.8, openHours: '10:00 – 22:00', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'f2', name: 'Shan Noodle House', category: 'Shan Cuisine', location: 'Chiang Mai', address: '45 Wualai Rd, Haiya, Mueang, Chiang Mai 50100', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', description: 'Famous Shan-style rice noodles and golden tofu salad served fresh every morning. A local favourite since 2015.', priceRange: '$', rating: 4.6, openHours: '07:00 – 15:00', createdAt: '2024-04-20T00:00:00Z' },
    { id: 'f3', name: 'Golden Pagoda Restaurant', category: 'Myanmar Cuisine', location: 'Bangkok', address: '78 Sukhumvit Soi 3, Wattana, Bangkok 10110', phone: '+66 2 987 654', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', description: 'Upscale Myanmar fine dining in the heart of Bangkok. Extensive menu with both traditional and contemporary Myanmar cuisine.', priceRange: '$$', rating: 4.5, openHours: '11:00 – 23:00', createdAt: '2024-04-15T00:00:00Z' },
    { id: 'f4', name: 'Border Town Café', category: 'Myanmar-Thai Fusion', location: 'Mae Sot', address: '12 Asia Road, Mae Sot, Tak 63110', image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80', description: 'Relaxed café serving Myanmar-Thai fusion dishes and specialty coffee in the culturally rich border town of Mae Sot.', priceRange: '$', rating: 4.3, openHours: '08:00 – 21:00', createdAt: '2024-04-10T00:00:00Z' },
    { id: 'f5', name: 'Mandalay Street Kitchen', category: 'Street Food', location: 'Chiang Rai', address: '88 Banphaprakan Rd, Wiang, Mueang, Chiang Rai 57000', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Popular street kitchen serving Mandalay-style noodles, grilled meat skewers, and fresh tropical fruit juices every evening.', priceRange: '$', rating: 4.7, openHours: '16:00 – 23:00', createdAt: '2024-04-05T00:00:00Z' },
    { id: 'f6', name: 'The Irrawaddy Lounge', category: 'Café and Drinks', location: 'Chiang Mai', address: 'Nimmanhemin Rd, Soi 3, Su Thep, Chiang Mai 50200', phone: '+66 53 456 789', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', description: 'Cosy Myanmar-owned café offering traditional Myanmar tea, specialty coffee blends, homemade pastries, and free Wi-Fi.', priceRange: '$', rating: 4.4, openHours: '08:00 – 20:00', createdAt: '2024-03-28T00:00:00Z' },
    { id: 'f7', name: 'Yangon BBQ House', category: 'Barbecue', location: 'Bangkok', address: '15/4 Ram Intra Rd, Khan Na Yao, Bangkok 10230', phone: '+66 2 123 999', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80', description: 'All-you-can-eat Myanmar-style barbecue with fresh seafood, premium cuts, and traditional dipping sauces.', priceRange: '$$', rating: 4.6, openHours: '17:00 – 24:00', createdAt: '2024-03-20T00:00:00Z' },
    { id: 'f8', name: 'Moe Moe Htun Bakery', category: 'Bakery and Sweets', location: 'Mae Sai', address: '200 Phahonyothin Rd, Mae Sai, Chiang Rai 57130', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80', description: 'Beloved Myanmar bakery renowned for mont lone yay paw (sticky rice balls), semolina cake, and freshly baked daily pastries.', priceRange: '$', rating: 4.9, openHours: '06:00 – 18:00', createdAt: '2024-03-15T00:00:00Z' },
  ] as FoodPlace[]);

  // Stats (last 7 days)
  const stats: VisitorStat[] = [];
  const baseDate = new Date('2024-05-06');
  const baseVisitors = [450, 680, 720, 810, 950, 1100, 1520];
  const baseViews = [1200, 2100, 2450, 2800, 3200, 4100, 4845];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    stats.push({
      date: d.toISOString().split('T')[0],
      visitors: baseVisitors[i],
      pageViews: baseViews[i],
    });
  }
  setAll(KEYS.stats, stats);

  localStorage.setItem(KEYS.seeded, 'true');
}
