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

export type AccommodationType =
  | 'Hotels'
  | 'Apartments'
  | 'Hostels'
  | 'Guesthouses'
  | 'Shared Rooms'
  | 'Villas & Houses'
  | 'Camping'
  | 'Short-Term Rentals'
  | 'Long-Term Rentals';

export interface StayListing {
  id: string;
  title: string;
  companyName: string;
  accommodationType: AccommodationType;
  images: string[];          // max 3
  location: string;
  contactEmail?: string;
  description: string;
  size?: string;
  price?: number;
  rating?: number;           // 0–5
  externalUrl?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  createdAt: string;
}

export type EducationCategory =
  | 'Schools'
  | 'Learning Centers'
  | 'Online Learning'
  | 'Makerspaces'
  | 'Courses'
  | 'Workshops'
  | 'Seminars / Talks'
  | 'Events';

export interface EducationPost {
  id: string;
  title: string;
  institution: string;         // Company / Organization Name
  category: EducationCategory;
  images: string[];            // Up to 3 images
  description: string;
  location: string;
  contactEmail?: string;
  websiteUrl?: string;         // Website / Page URL
  facebookUrl?: string;
  size?: string;               // Free-text: Small / Medium / International / etc.
  fee: string;                 // Price text
  currency?: 'MMK' | 'THB' | 'USD';
  rating?: number;             // 1–5 stars
  deadline?: string;
  status: 'published' | 'draft';
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
  stays:      '3sg_stays',
  education:  '3sg_education',
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

// ─── Stays ─────────────────────────────────────────────────────────────────────
export const staysDB = {
  getAll: () => getAll<StayListing>(KEYS.stays),
  getById: (id: string) => findById<StayListing>(KEYS.stays, id),
  create: (data: Omit<StayListing, 'id' | 'createdAt'>) => createRecord<StayListing>(KEYS.stays, data),
  update: (id: string, data: Partial<StayListing>) => updateRecord<StayListing>(KEYS.stays, id, data),
  delete: (id: string) => deleteRecord<StayListing>(KEYS.stays, id),
};

function normalizeEdu(e: any): EducationPost {
  return {
    ...e,
    images: Array.isArray(e.images) ? e.images.filter(Boolean) : (e.image ? [e.image] : []),
    category: e.category || 'Schools',
    fee: e.fee || 'Free',
    currency: e.currency || 'THB',
  };
}

// ─── Education ─────────────────────────────────────────────────────────────────
export const educationDB = {
  getAll: () => getAll<any>(KEYS.education).map(normalizeEdu),
  getById: (id: string) => {
    const item = findById<any>(KEYS.education, id);
    return item ? normalizeEdu(item) : null;
  },
  getPublished: () => getAll<any>(KEYS.education).map(normalizeEdu).filter((e) => e.status === 'published'),
  create: (data: Omit<EducationPost, 'id' | 'createdAt'>) => createRecord<EducationPost>(KEYS.education, data),
  update: (id: string, data: Partial<EducationPost>) => updateRecord<EducationPost>(KEYS.education, id, data),
  delete: (id: string) => deleteRecord<EducationPost>(KEYS.education, id),
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
    contactEmail: 'admin.3sgates2026@gmail.com',
    maintenanceMode: false,
  };
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
export const statsDB = {
  getAll: () => getAll<VisitorStat>(KEYS.stats),
  
  recordPageView: () => {
    if (typeof window === 'undefined') return;
    const todayStr = new Date().toISOString().split('T')[0];
    let all = getAll<VisitorStat>(KEYS.stats);
    
    if (!all || all.length === 0) {
      const stats: VisitorStat[] = [];
      const baseDate = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - i);
        stats.push({
          date: d.toISOString().split('T')[0],
          visitors: Math.floor(Math.random() * 40) + 120,
          pageViews: Math.floor(Math.random() * 150) + 380,
        });
      }
      setAll(KEYS.stats, stats);
      all = stats;
    }

    const todayIndex = all.findIndex((s) => s.date === todayStr);
    const isNewSession = !sessionStorage.getItem('3s_visited_today');
    if (isNewSession) {
      sessionStorage.setItem('3s_visited_today', 'true');
    }

    if (todayIndex >= 0) {
      all[todayIndex].pageViews += 1;
      if (isNewSession) all[todayIndex].visitors += 1;
    } else {
      all.push({
        date: todayStr,
        visitors: 1,
        pageViews: 1,
      });
    }

    if (all.length > 30) all = all.slice(-30);
    setAll(KEYS.stats, all);
  },

  getChartData: (): VisitorStat[] => {
    if (typeof window === 'undefined') return [];
    let all = getAll<VisitorStat>(KEYS.stats);
    if (!all || all.length === 0) {
      statsDB.recordPageView();
      all = getAll<VisitorStat>(KEYS.stats);
    }
    
    const result: VisitorStat[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = all.find((s) => s.date === dateStr);
      result.push(found ? { ...found } : { date: dateStr, visitors: 0, pageViews: 0 });
    }
    return result;
  },

  getSummary: () => {
    const chartData = statsDB.getChartData();
    const today = chartData[chartData.length - 1] ?? { visitors: 0, pageViews: 0 };
    const yesterday = chartData[chartData.length - 2] ?? { visitors: 0, pageViews: 0 };
    
    const weekTotalViews = chartData.reduce((sum, item) => sum + item.pageViews, 0);
    const weekTotalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);

    const visitorGrowth = yesterday.visitors > 0
      ? (((today.visitors - yesterday.visitors) / yesterday.visitors) * 100).toFixed(1)
      : '0.0';

    const pageViewGrowth = yesterday.pageViews > 0
      ? (((today.pageViews - yesterday.pageViews) / yesterday.pageViews) * 100).toFixed(1)
      : '0.0';

    return {
      todayVisitors: today.visitors,
      todayPageViews: today.pageViews,
      yesterdayVisitors: yesterday.visitors,
      weekPageViews: weekTotalViews,
      weekVisitors: weekTotalVisitors,
      visitorGrowth: parseFloat(visitorGrowth),
      pageViewGrowth: parseFloat(pageViewGrowth),
    };
  },
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
export function getDashboardStats() {
  const summary = statsDB.getSummary();
  return {
    totalPosts: getAll(KEYS.news).length + getAll(KEYS.gallery).length,
    newsPosts:  getAll(KEYS.news).length,
    galleryItems: getAll(KEYS.gallery).length,
    jobListings: getAll(KEYS.jobs).length,
    rentListings: getAll(KEYS.rentals).length,
    foodPlaces: getAll(KEYS.food).length,
    educationPosts: getAll(KEYS.education).length,
    todayVisitors: summary.todayVisitors,
    todayPageViews: summary.todayPageViews,
    weekPageViews: summary.weekPageViews,
    weekVisitors: summary.weekVisitors,
    visitorGrowth: summary.visitorGrowth,
    pageViewGrowth: summary.pageViewGrowth,
    activeBanners: getAll<Banner>(KEYS.banners).filter((b) => b.isActive).length,
  };
}

// ─── EduHub Sample Seed Listings ──────────────────────────────────────────────
export const SAMPLE_EDUCATION_POSTS: EducationPost[] = [
  {
    id: 'edu-1',
    title: 'Chiang Mai International School',
    institution: 'CMIS International Education',
    category: 'Schools',
    images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    ],
    description: 'A fully accredited international school offering IB curriculum from Kindergarten to Grade 12. Multilingual faculty, modern facilities, science labs, and arts programs.',
    location: 'Chiang Mai, Thailand',
    contactEmail: 'admissions@cmis.ac.th',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'Large',
    fee: '฿280,000',
    currency: 'THB',
    rating: 4.8,
    deadline: 'Open Enrollment',
    status: 'published',
    createdAt: '2024-05-15T00:00:00Z',
  },
  {
    id: 'edu-2',
    title: 'TechBridge Full-Stack & AI Bootcamp',
    institution: 'TechBridge Digital Academy',
    category: 'Online Learning',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    ],
    description: 'An intensive 16-week online coding bootcamp. Learn HTML, CSS, JavaScript, React, Next.js, and AI integration. Certificate upon completion.',
    location: 'Online (Flexible Schedule)',
    contactEmail: 'academy@techbridge.org',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'International',
    fee: 'Free / Sponsored',
    currency: 'USD',
    rating: 4.7,
    deadline: '15 June 2026',
    status: 'published',
    createdAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 'edu-3',
    title: 'ASEAN Business Communication Language Center',
    institution: 'ASEAN Language & Culture Center',
    category: 'Learning Centers',
    images: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80',
    ],
    description: 'Business Thai & English language courses for working professionals. Evening and weekend schedules with native bilingual instructors.',
    location: 'Chiang Mai & Online',
    contactEmail: 'languages@aseancc.org',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'Medium',
    fee: '฿1,500',
    currency: 'THB',
    rating: 4.6,
    deadline: 'Open Enrollment',
    status: 'published',
    createdAt: '2024-05-08T00:00:00Z',
  },
  {
    id: 'edu-4',
    title: 'Culinary Arts & Hospitality Management Certification',
    institution: 'Mahanakhon Hospitality Institute',
    category: 'Courses',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80',
    ],
    description: 'Hands-on 3-month certified training in culinary arts, food hygiene, beverage management, and customer relations. Paid internship placement support included.',
    location: 'Bangkok, Thailand',
    contactEmail: 'training@hospitality-inst.org',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'Local',
    fee: '฿3,500',
    currency: 'THB',
    rating: 4.5,
    deadline: '20 July 2026',
    status: 'published',
    createdAt: '2024-05-02T00:00:00Z',
  },
  {
    id: 'edu-5',
    title: 'Digital Marketing & Social Commerce Masterclass',
    institution: 'Creator & Enterprise Network',
    category: 'Workshops',
    images: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    ],
    description: 'Weekend intensive workshop covering TikTok Shop marketing, Facebook Page Ads, content strategy, and financial tracking for online sellers and micro-business owners.',
    location: 'Online Live Zoom Workshop',
    contactEmail: 'workshops@creatornetwork.org',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'Small',
    fee: 'Free',
    currency: 'THB',
    rating: 4.9,
    deadline: '10 June 2026',
    status: 'published',
    createdAt: '2024-04-25T00:00:00Z',
  },
  {
    id: 'edu-6',
    title: 'AI & Future Tech Seminar Series 2026',
    institution: 'ASEAN Tech Talks Foundation',
    category: 'Seminars / Talks',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
    ],
    description: 'Monthly expert-led seminar series exploring AI trends, robotics, blockchain, and digital policy with leading regional and international speakers.',
    location: 'Bangkok & Online',
    contactEmail: 'talks@aseantech.org',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'International',
    fee: 'Free',
    currency: 'USD',
    rating: 4.7,
    deadline: 'Monthly',
    status: 'published',
    createdAt: '2024-04-20T00:00:00Z',
  },
  {
    id: 'edu-7',
    title: 'Lanna Makerspace — Design, Code & Build Lab',
    institution: 'Lanna Creative Hub',
    category: 'Makerspaces',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    ],
    description: 'Open access makerspace with 3D printers, laser cutters, electronics lab, robotics kits, and co-working space for students, makers, and entrepreneurs.',
    location: 'Chiang Mai, Thailand',
    contactEmail: 'hello@lannahub.co',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'Local',
    fee: '฿500',
    currency: 'THB',
    rating: 4.8,
    deadline: 'Open',
    status: 'published',
    createdAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'edu-8',
    title: 'Regional Education & Skills Expo 2026',
    institution: 'Southeast Asia Education Council',
    category: 'Events',
    images: [
      'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=600&q=80',
      'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=600&q=80',
    ],
    description: 'The region\'s largest annual education fair connecting students, families, and professionals with 200+ schools, universities, and training providers from 15 countries.',
    location: 'Bangkok, Thailand',
    contactEmail: 'expo@saec.org',
    websiteUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    facebookUrl: 'https://www.facebook.com/share/1BZMe1KVPk/',
    size: 'International',
    fee: 'Free Entry',
    currency: 'THB',
    rating: 4.9,
    deadline: '15 October 2026',
    status: 'published',
    createdAt: '2024-04-10T00:00:00Z',
  },
];

// ─── Seed Data ─────────────────────────────────────────────────────────────────
export function seedIfEmpty(): void {
  if (typeof window === 'undefined') return;

  // Migration: Ensure EduHub directory uses the 8 modern categories & multi-image schema
  if (localStorage.getItem('3sg_eduhub_v2') !== 'true') {
    setAll(KEYS.education, SAMPLE_EDUCATION_POSTS);
    localStorage.setItem('3sg_eduhub_v2', 'true');
  }

  if (localStorage.getItem(KEYS.seeded) === 'true') return;

  // Users
  setAll(KEYS.users, [{
    id: 'admin-001',
    username: '0idadmin',
    passwordHash: btoa('Suser@3sgates#01l'),
    role: 'super-admin',
    displayName: 'Administrator',
    createdAt: '2024-01-01T00:00:00Z',
  }] as AdminUser[]);

  // Banners (no emojis — professional text)
  setAll(KEYS.banners, [
    { id: 'b1', text: 'Welcome to 3SGate — Connecting Communities, Creating Opportunities', link: '/', type: 'announcement', color: 'gold', isActive: true, createdAt: '2024-05-01T00:00:00Z' },
    { id: 'b2', text: 'New Shop Spaces Available — Rent Your Space Today', link: '/rent', type: 'promo', color: 'blue', isActive: true, createdAt: '2024-05-05T00:00:00Z' },
    { id: 'b3', text: 'Support Displaced Communities — Donate Now', link: '/donate', type: 'ad', color: 'red', isActive: true, createdAt: '2024-05-08T00:00:00Z' },
  ] as Banner[]);

  // News (8 articles)
  setAll(KEYS.news, [
    { id: 'n1', title: 'Global Tech & Innovation Summit 2026 Announced', content: 'Leaders and innovators from around the world will gather at the upcoming Global Tech Summit. The conference will highlight advancements in artificial intelligence, digital economy, cross-border commerce, and sustainable technology solutions for developing communities.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', author: 'Editorial Team', publishedAt: '2024-05-12T08:00:00Z', status: 'published', createdAt: '2024-05-12T00:00:00Z' },
    { id: 'n2', title: 'International Cross-Border Trade & Remote Work Trends', content: 'New economic insights showcase the rapid growth of remote work, cross-border freelance collaboration, and streamlined digital business registrations across Southeast Asia and global markets. Discover how professionals are expanding their reach worldwide.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', author: 'Editorial Team', publishedAt: '2024-05-10T08:00:00Z', status: 'published', createdAt: '2024-05-10T00:00:00Z' },
    { id: 'n3', title: 'Global Relief Support & Humanitarian Initiatives', content: 'International humanitarian organisations are expanding relief programmes, emergency food packages, and medical aid across vulnerable communities worldwide. Ongoing global solidarity and donor support remain essential.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', author: 'Admin', publishedAt: '2024-05-08T08:00:00Z', status: 'published', createdAt: '2024-05-08T00:00:00Z' },
    { id: 'n4', title: 'Community Green Energy & Sustainability Project', content: 'A collaborative community initiative has launched modern solar and urban greening projects, engaging over 500 local volunteers and international partners in building sustainable, climate-resilient neighborhoods.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1542601906897-93a9e6b5b6a5?w=600&q=80', author: 'Admin', publishedAt: '2024-05-05T08:00:00Z', status: 'published', createdAt: '2024-05-05T00:00:00Z' },
    { id: 'n5', title: 'Global Youth Education & Scholarship Opportunities', content: 'International educational foundations have announced new scholarships and vocational fellowships for youth worldwide. Programmes include coding bootcamps, language learning, and leadership grants.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80', author: 'Admin', publishedAt: '2024-05-03T08:00:00Z', status: 'published', createdAt: '2024-05-03T00:00:00Z' },
    { id: 'n6', title: 'Celebrating Cultural Diversity & Global Arts Festivals', content: 'Communities around the world gathered to celebrate cultural events, traditional art exhibitions, and music festivals. The events highlighted shared creative heritage and global cultural appreciation.', category: 'myanmar-news', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80', author: 'Admin', publishedAt: '2024-01-04T08:00:00Z', status: 'published', createdAt: '2024-01-04T00:00:00Z' },
    { id: 'n7', title: 'Emergency Climate Relief Fund for Displaced Families', content: 'Following severe seasonal weather, community aid networks and international charities have mobilized emergency relief for displaced families. Clean water, food, and temporary shelter are actively being distributed.', category: 'myanmar-thailand', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80', author: 'Admin', publishedAt: '2024-04-28T08:00:00Z', status: 'published', createdAt: '2024-04-28T00:00:00Z' },
    { id: 'n8', title: 'World Refugee Day: Celebrating Community Resilience & Hope', content: 'On World Refugee Day, we honor stories of resilience from individuals and families rebuilding their lives abroad through education, entrepreneurship, and community solidarity.', category: 'myanmar-abroad', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&q=80', author: 'Admin', publishedAt: '2024-04-20T08:00:00Z', status: 'published', createdAt: '2024-04-20T00:00:00Z' },
  ] as NewsPost[]);

  // Gallery (10 artworks — THB prices)
  setAll(KEYS.gallery, [
    { id: 'g1', title: 'Golden Sunset Horizons', artist: 'Kaung Htet', image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&q=80', description: 'Oil painting depicting a golden sunset over historic architectural silhouettes. Rich warm tones and textured brushwork.', category: 'Painting', forSale: true, price: 8500, createdAt: '2024-05-01T00:00:00Z' },
    { id: 'g2', title: 'Freedom', artist: 'Elena Rostova', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', description: 'An abstract digital artwork expressing hope and liberation through bold strokes and vivid colour composition.', category: 'Digital Art', forSale: false, createdAt: '2024-04-20T00:00:00Z' },
    { id: 'g3', title: 'Portrait of Resilience', artist: 'Zar Win', image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80', description: 'A moving portrait capturing the quiet strength and dignity of an elder woman.', category: 'Portrait', forSale: true, price: 6200, createdAt: '2024-04-15T00:00:00Z' },
    { id: 'g4', title: 'Golden Temple at Dawn', artist: 'Liam Chen', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', description: 'Fine art photograph of sacred temple architecture bathed in the first light of dawn. Printed on premium canvas.', category: 'Photography', forSale: true, price: 4100, createdAt: '2024-04-10T00:00:00Z' },
    { id: 'g5', title: 'Life Along the River', artist: 'Marcus Vance', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', description: 'Documentary photograph capturing traditional riverside life and morning mist. Archival quality print.', category: 'Photography', forSale: false, createdAt: '2024-03-28T00:00:00Z' },
    { id: 'g6', title: 'Unity', artist: 'Sophia Thorne', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', description: 'A large-format acrylic painting on canvas symbolising people united in hope and global solidarity.', category: 'Painting', forSale: true, price: 11000, createdAt: '2024-03-15T00:00:00Z' },
    { id: 'g7', title: 'Market Colours', artist: 'Maya Patel', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Vibrant watercolour of a bustling international street market, filled with colour, people, and daily life.', category: 'Watercolour', forSale: true, price: 5500, createdAt: '2024-03-10T00:00:00Z' },
    { id: 'g8', title: 'Lotus in Stillness', artist: 'Hana Tanaka', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=600&q=80', description: 'A serene ink-wash painting of lotus flowers reflecting balance, calm, and mindfulness.', category: 'Ink Art', forSale: true, price: 3800, createdAt: '2024-02-25T00:00:00Z' },
    { id: 'g9', title: 'Morning Contemplation', artist: 'Julian Cruz', image: 'https://images.unsplash.com/photo-1567900988803-5bcad34dfc95?w=600&q=80', description: 'Atmospheric street portrait capturing the gentle morning mist and warm sunlight across historic city streets.', category: 'Portrait', forSale: false, createdAt: '2024-02-10T00:00:00Z' },
    { id: 'g10', title: 'Emerald Forest at Dusk', artist: 'Win Naing', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', description: 'A sweeping landscape of lush ancient forest bathed in the golden light of dusk. Oil on linen, 120x80cm.', category: 'Landscape', forSale: true, price: 9200, createdAt: '2024-01-20T00:00:00Z' },
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
    { id: 'p5', name: 'Artisan Lacquerware Bowl', price: 750, category: 'Crafts', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80', description: 'Handcrafted artisan lacquerware bowl created using centuries-old natural lacquer techniques.', inStock: true, createdAt: '2024-04-10T00:00:00Z' },
    { id: 'p6', name: 'Handwoven Silk Scarf', price: 650, category: 'Clothing', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', description: 'Authentic handwoven artisan scarf, beautifully crafted from pure silk with traditional geometric patterns.', inStock: true, createdAt: '2024-04-05T00:00:00Z' },
    { id: 'p7', name: 'Portable Bluetooth Speaker', price: 1190, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', description: 'Compact waterproof Bluetooth speaker with 360-degree sound and 20-hour play time.', inStock: true, createdAt: '2024-04-01T00:00:00Z' },
    { id: 'p8', name: 'Carved Teak Sculpture', price: 490, category: 'Crafts', image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80', description: 'Hand-carved teak wood decorative art piece — a timeless artisan craft and elegant home accent.', inStock: true, createdAt: '2024-03-28T00:00:00Z' },
    { id: 'p9', name: 'Embroidered Shoulder Bag', price: 820, category: 'Fashion', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80', description: 'Beautifully embroidered bag made by local artisans. Every piece is unique.', inStock: true, createdAt: '2024-03-20T00:00:00Z' },
    { id: 'p10', name: "Men's Linen Shirt", price: 590, category: 'Clothing', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', description: 'Breathable 100% linen shirt, perfectly suited for the tropical climate of Southeast Asia.', inStock: true, createdAt: '2024-03-15T00:00:00Z' },
    { id: 'p11', name: 'Ceramic Tea Set', price: 1100, category: 'Crafts', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', description: 'Elegant hand-painted ceramic tea set (5 pieces), inspired by traditional floral patterns.', inStock: false, createdAt: '2024-03-10T00:00:00Z' },
    { id: 'p12', name: 'Insulated Water Bottle', price: 380, category: 'Accessories', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', description: 'Double-wall insulated stainless steel bottle — keeps drinks cold for 24 hrs, hot for 12 hrs. 500ml.', inStock: true, createdAt: '2024-03-05T00:00:00Z' },
  ] as Product[]);

  // Rentals (6 spaces — THB prices)
  setAll(KEYS.rentals, [
    { id: 'r1', name: 'Shop Space A1', location: 'Chiang Mai Central Market', price: 4500, size: '20 sqm', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80', description: 'Prime location shop space at the entrance of Chiang Mai Central Market. High foot traffic. Ideal for retail or fashion.', isAvailable: false, renterName: 'Urban Style Boutique', ownerUrl: 'https://www.facebook.com/share/1BZMe1KVPk/', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'r2', name: 'Shop Space A2', location: 'Chiang Mai Central Market', price: 4500, size: '20 sqm', image: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=600&q=80', description: 'Available space adjacent to main entrance. Comes with basic shelving and overhead lighting.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1BZMe1KVPk/', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'r3', name: 'Corner Space B1', location: 'Bangkok Community Plaza', price: 6200, size: '30 sqm', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80', description: 'Large corner shop space with maximum visibility in the community plaza in Bangkok.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1BZMe1KVPk/', createdAt: '2024-04-20T00:00:00Z' },
    { id: 'r4', name: 'Shop Space C3', location: 'Chiang Rai Weekend Market', price: 3000, size: '15 sqm', image: 'https://images.unsplash.com/photo-1572032023143-82929e48e636?w=600&q=80', description: 'Affordable space in the growing Chiang Rai weekend market. Popular with crafts, clothing, and food sellers.', isAvailable: false, renterName: 'Lanna Craft & Fashion', ownerUrl: 'https://www.facebook.com/share/1BZMe1KVPk/', createdAt: '2024-04-15T00:00:00Z' },
    { id: 'r5', name: 'Food Court Stall D2', location: 'Riverside Night Market', price: 2500, size: '10 sqm', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', description: 'Compact food court stall in the bustling riverside night market. Running water and electricity included.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1BZMe1KVPk/', createdAt: '2024-04-08T00:00:00Z' },
    { id: 'r6', name: 'Showroom Space E1', location: 'Chiang Mai Central Market', price: 9800, size: '60 sqm', image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=600&q=80', description: 'Spacious showroom ideal for furniture, clothing wholesale, or multi-product displays. CCTV and storage room included.', isAvailable: true, ownerUrl: 'https://www.facebook.com/share/1BZMe1KVPk/', createdAt: '2024-04-01T00:00:00Z' },
  ] as RentalSpace[]);

  // Jobs (8 listings — THB salary)
  setAll(KEYS.jobs, [
    { id: 'j1', title: 'Restaurant Server', company: 'Thai Garden Restaurant', location: 'Chiang Mai', type: 'full-time', salary: '12,000 – 15,000 THB / month', description: 'We are looking for friendly, hardworking restaurant servers to join our team. Tips and meals included.', requirements: ['English or Thai language skills', 'Customer service attitude', 'Ability to work evening shifts'], contactEmail: 'hr@thaigarden.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-05-10T00:00:00Z' },
    { id: 'j2', title: 'Construction Worker', company: 'Build Thai Co., Ltd.', location: 'Bangkok', type: 'contract', salary: '400 – 600 THB / day', description: 'Construction workers needed for infrastructure and residential projects across Bangkok. Safety gear fully provided.', requirements: ['Physical fitness', 'Prior construction experience preferred', 'Safety awareness training'], contactEmail: 'jobs@buildthai.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-05-08T00:00:00Z' },
    { id: 'j3', title: 'Domestic Helper', company: 'Happy Home Agency', location: 'Multiple Locations, Thailand', type: 'full-time', salary: '10,000 – 12,000 THB / month + accommodation', description: 'Domestic helper positions available across Thailand. Accommodation and two daily meals are provided by the employer.', requirements: ['Basic Thai or English communication', 'Cooking skills', 'Trustworthy and responsible character'], contactEmail: 'happyhome@agency.co.th', isRecruitmentAgent: true, status: 'active', createdAt: '2024-05-05T00:00:00Z' },
    { id: 'j4', title: 'Factory Production Worker', company: 'Thai Manufacturing Ltd.', location: 'Samut Prakan, Bangkok', type: 'full-time', salary: '11,000 – 14,000 THB / month', description: 'Production line workers needed for garment and electronics manufacturing. Full on-the-job training is provided.', requirements: ['Physical fitness', 'Attention to detail', 'Willingness to work rotating shift schedules'], contactEmail: 'recruit@thaimfg.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'j5', title: 'Cook and Kitchen Assistant', company: 'Community Food Court', location: 'Chiang Rai', type: 'full-time', salary: '11,000 – 13,000 THB / month', description: 'Experienced cook needed for our growing food court. Must have knowledge of traditional regional dishes.', requirements: ['Cooking experience required', 'Basic food handling hygiene knowledge', 'Works well in a team'], contactEmail: 'hire@cityfoodcourt.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-04-28T00:00:00Z' },
    { id: 'j6', title: 'Retail Shop Assistant', company: 'Style Boutique', location: 'Chiang Mai', type: 'part-time', salary: '350 – 450 THB / day', description: 'Part-time shop assistant needed for our clothing boutique at Chiang Mai weekend market.', requirements: ['Friendly and polite customer manner', 'Basic Thai language ability', 'Interest in fashion and retail'], contactEmail: 'boutique@styleboutique.com', isRecruitmentAgent: false, status: 'active', createdAt: '2024-04-22T00:00:00Z' },
    { id: 'j7', title: 'Overseas Factory Worker — Japan', company: 'Global Labour Solutions', location: 'Osaka, Japan', type: 'contract', salary: '¥180,000 – ¥220,000 / month', description: 'Factory positions in Japan available through a licensed recruitment agent. 2-year contracts. Flights and accommodation included. Apply through official channels only.', requirements: ['Age 20–45', 'Medical clearance certificate', 'JLPT N4 or above preferred', 'Registered with Ministry of Labour'], contactEmail: 'japan@globallabour.com', isRecruitmentAgent: true, status: 'active', createdAt: '2024-04-15T00:00:00Z' },
    { id: 'j8', title: 'Security Guard', company: 'SafeGuard Services Co., Ltd.', location: 'Bangkok', type: 'full-time', salary: '12,000 – 14,000 THB / month', description: 'Security guards required for shopping malls and commercial buildings across Bangkok. Full uniform and training provided.', requirements: ['Good physical health', 'Reliable and punctual', 'Prior security or military experience is a plus'], contactEmail: 'jobs@safeguard.co.th', isRecruitmentAgent: false, status: 'active', createdAt: '2024-04-08T00:00:00Z' },
  ] as JobListing[]);

  // Food (10 top curated places)
  setAll(KEYS.food, [
    { id: 'f1', name: 'Siam Thai Bistro', category: 'Thai Cuisine', location: 'Bangkok', address: '45 Sukhumvit Soi 11, Wattana, Bangkok 10110', phone: '+66 2 345 6789', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', description: 'Award-winning authentic Thai restaurant famous for rich Tom Yum Goong, Pad Thai, Green Curry, and spicy Som Tum made with fresh ingredients.', priceRange: '$$', rating: 4.9, openHours: '11:00 – 23:00', createdAt: '2024-05-01T00:00:00Z' },
    { id: 'f2', name: 'Andaman Seafood & BBQ Grill', category: 'Seafood & BBQ', location: 'Phuket', address: '88 Beach Road, Patong, Kathu, Phuket 83150', phone: '+66 76 987 654', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80', description: 'Fresh oceanfront seafood and charcoal BBQ. Serving giant grilled river prawns, steamed lime fish, and spicy seafood dipping sauces.', priceRange: '$$$', rating: 4.8, openHours: '16:00 – 24:00', createdAt: '2024-04-25T00:00:00Z' },
    { id: 'f3', name: 'Shan & Northern Noodle House', category: 'Shan & Northern', location: 'Chiang Mai', address: '45 Wualai Rd, Haiya, Mueang, Chiang Mai 50100', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', description: 'Famous for authentic Khao Soi, northern rice noodles, crispy pork belly, and golden chickpea tofu salad. A favorite since 2015.', priceRange: '$', rating: 4.7, openHours: '07:00 – 16:00', createdAt: '2024-04-20T00:00:00Z' },
    { id: 'f4', name: 'Sakura Ramen & Izakaya', category: 'Asian & Japanese', location: 'Bangkok', address: '12 Thonglor Soi 10, Sukhumvit 55, Bangkok 10110', phone: '+66 2 111 2233', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', description: 'Rich 18-hour Tonkotsu pork bone ramen broth, fresh sashimi platters, and grilled yakitori skewers paired with Japanese beverages.', priceRange: '$$', rating: 4.8, openHours: '12:00 – 23:30', createdAt: '2024-04-18T00:00:00Z' },
    { id: 'f5', name: 'Heritage Noodle House', category: 'Traditional Cuisine', location: 'Chiang Mai', address: '123 Nimman Rd, Suthep, Mueang, Chiang Mai 50200', phone: '+66 53 123 456', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', description: 'Traditional home-style noodle cuisine with rich aromatic herbal broths, fresh tea leaf salads, handmade noodles, and slow-simmered curries.', priceRange: '$', rating: 4.8, openHours: '10:00 – 22:00', createdAt: '2024-04-15T00:00:00Z' },
    { id: 'f6', name: 'Nimman Roastery & Café', category: 'Cafés & Drinks', location: 'Chiang Mai', address: 'Nimmanhemin Rd, Soi 3, Su Thep, Chiang Mai 50200', phone: '+66 53 456 789', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', description: 'Specialty coffee roastery offering single-origin drip coffee, iced matcha lattes, artisan pastries, and high-speed Wi-Fi in a lush garden setting.', priceRange: '$', rating: 4.6, openHours: '08:00 – 20:00', createdAt: '2024-04-10T00:00:00Z' },
    { id: 'f7', name: 'Yaowarat Street Food Night Market', category: 'Street Food', location: 'Bangkok', address: 'Yaowarat Rd, Samphanthawong, Bangkok 10100', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', description: 'Legendary Bangkok Chinatown street food hub. Crispy pork belly noodles, grilled seafood, coconut ice cream, and sizzling wok stir-fries.', priceRange: '$', rating: 4.9, openHours: '17:00 – 01:00', createdAt: '2024-04-05T00:00:00Z' },
    { id: 'f8', name: 'Sweet Mango & Sticky Rice', category: 'Desserts & Bakery', location: 'Bangkok', address: '200 Silom Rd, Suriyawong, Bang Rak, Bangkok 10500', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80', description: 'Famous dessert shop renowned for ripe Nam Dok Mai mangoes served with warm sweet coconut sticky rice and crunchy mung beans.', priceRange: '$', rating: 4.9, openHours: '09:00 – 22:00', createdAt: '2024-03-28T00:00:00Z' },
    { id: 'f9', name: 'Silk Route Fusion Bistro', category: 'Regional Fusion', location: 'Bangkok', address: '12 Asia Avenue, Sukhumvit, Bangkok 10110', image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80', description: 'A vibrant international fusion bistro blending Asian culinary heritage, specialty roasted teas, warm artisanal flatbreads, and slow-cooked spiced curries.', priceRange: '$', rating: 4.5, openHours: '08:00 – 21:00', createdAt: '2024-03-20T00:00:00Z' },
    { id: 'f10', name: 'Bangkok Riverside Thai Dining', category: 'Thai Cuisine', location: 'Bangkok', address: '256 Charoen Nakhon Rd, Khlong San, Bangkok 10600', phone: '+66 2 888 9999', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', description: 'Stunning Chao Phraya riverfront dining featuring Royal Thai cuisine, fresh crab curries, and sunset cocktail views.', priceRange: '$$$', rating: 4.9, openHours: '16:30 – 23:30', createdAt: '2024-03-15T00:00:00Z' },
  ] as FoodPlace[]);

  // Education — EduHub Directory
  setAll(KEYS.education, SAMPLE_EDUCATION_POSTS);

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
