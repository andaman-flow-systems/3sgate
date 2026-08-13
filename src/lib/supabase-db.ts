/**
 * supabase-db.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Async Supabase-powered database operations that mirror the same shape as the
 * original db.ts (localStorage) but store data in the cloud.
 *
 * Column mapping: DB uses snake_case, TypeScript uses camelCase — conversion
 * is handled inside each function so callers never need to care.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { supabase } from './supabase';
import type {
  Product,
  RentalSpace,
  NewsPost,
  ArtworkItem,
  JobListing,
  FoodPlace,
  Banner,
  DonationRecord,
} from './db';

// ─── Helper: map DB row → TypeScript shape ─────────────────────────────────────

function toProduct(row: Record<string, unknown>): Product {
  return {
    id:          row.id as string,
    name:        row.name as string,
    price:       row.price as number,
    category:    row.category as string,
    image:       row.image as string,
    description: row.description as string,
    inStock:     row.in_stock as boolean,
    createdAt:   row.created_at as string,
  };
}

function toRental(row: Record<string, unknown>): RentalSpace {
  return {
    id:          row.id as string,
    name:        row.name as string,
    location:    row.location as string,
    price:       row.price as number,
    size:        row.size as string,
    image:       row.image as string,
    description: row.description as string,
    isAvailable: row.is_available as boolean,
    renterName:  row.renter_name as string | undefined,
    ownerUrl:    row.owner_url as string | undefined,
    createdAt:   row.created_at as string,
  };
}

function toJob(row: Record<string, unknown>): JobListing {
  return {
    id:                row.id as string,
    title:             row.title as string,
    company:           row.company as string,
    location:          row.location as string,
    type:              row.type as JobListing['type'],
    salary:            row.salary as string | undefined,
    description:       row.description as string,
    requirements:      row.requirements as string[],
    contactEmail:      row.contact_email as string,
    isRecruitmentAgent: row.is_recruitment_agent as boolean,
    status:            row.status as JobListing['status'],
    createdAt:         row.created_at as string,
  };
}

function toFood(row: Record<string, unknown>): FoodPlace {
  return {
    id:          row.id as string,
    name:        row.name as string,
    category:    row.category as string,
    location:    row.location as string,
    address:     row.address as string,
    phone:       row.phone as string | undefined,
    image:       row.image as string,
    description: row.description as string,
    priceRange:  row.price_range as FoodPlace['priceRange'],
    rating:      row.rating as number,
    openHours:   row.open_hours as string | undefined,
    createdAt:   row.created_at as string,
  };
}

function toNews(row: Record<string, unknown>): NewsPost {
  return {
    id:          row.id as string,
    title:       row.title as string,
    content:     row.content as string,
    category:    row.category as NewsPost['category'],
    image:       row.image as string,
    author:      row.author as string,
    publishedAt: row.published_at as string,
    status:      row.status as NewsPost['status'],
    createdAt:   row.created_at as string,
  };
}

function toGallery(row: Record<string, unknown>): ArtworkItem {
  return {
    id:          row.id as string,
    title:       row.title as string,
    artist:      row.artist as string,
    image:       row.image as string,
    description: row.description as string,
    category:    row.category as string,
    price:       row.price as number | undefined,
    forSale:     row.for_sale as boolean,
    createdAt:   row.created_at as string,
  };
}

function toBanner(row: Record<string, unknown>): Banner {
  return {
    id:        row.id as string,
    text:      row.text as string,
    link:      row.link as string | undefined,
    type:      row.type as Banner['type'],
    color:     row.color as string,
    isActive:  row.is_active as boolean,
    createdAt: row.created_at as string,
  };
}

function toDonation(row: Record<string, unknown>): DonationRecord {
  return {
    id:        row.id as string,
    type:      row.type as DonationRecord['type'],
    donorName: row.donor_name as string,
    amount:    row.amount as number,
    message:   row.message as string | undefined,
    createdAt: row.created_at as string,
  };
}

// ─── Products ──────────────────────────────────────────────────────────────────
export const sbProductsDB = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toProduct);
  },

  getById: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return toProduct(data);
  },

  create: async (p: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name:        p.name,
        price:       p.price,
        category:    p.category,
        image:       p.image,
        description: p.description,
        in_stock:    p.inStock,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toProduct(data);
  },

  update: async (id: string, p: Partial<Product>): Promise<Product> => {
    const patch: Record<string, unknown> = {};
    if (p.name        !== undefined) patch.name        = p.name;
    if (p.price       !== undefined) patch.price       = p.price;
    if (p.category    !== undefined) patch.category    = p.category;
    if (p.image       !== undefined) patch.image       = p.image;
    if (p.description !== undefined) patch.description = p.description;
    if (p.inStock     !== undefined) patch.in_stock    = p.inStock;

    const { data, error } = await supabase
      .from('products')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toProduct(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── Rentals ───────────────────────────────────────────────────────────────────
export const sbRentalsDB = {
  getAll: async (): Promise<RentalSpace[]> => {
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toRental);
  },

  create: async (r: Omit<RentalSpace, 'id' | 'createdAt'>): Promise<RentalSpace> => {
    const { data, error } = await supabase
      .from('rentals')
      .insert({
        name:         r.name,
        location:     r.location,
        price:        r.price,
        size:         r.size,
        image:        r.image,
        description:  r.description,
        is_available: r.isAvailable,
        renter_name:  r.renterName,
        owner_url:    r.ownerUrl,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toRental(data);
  },

  update: async (id: string, r: Partial<RentalSpace>): Promise<RentalSpace> => {
    const patch: Record<string, unknown> = {};
    if (r.name         !== undefined) patch.name         = r.name;
    if (r.location     !== undefined) patch.location     = r.location;
    if (r.price        !== undefined) patch.price        = r.price;
    if (r.size         !== undefined) patch.size         = r.size;
    if (r.image        !== undefined) patch.image        = r.image;
    if (r.description  !== undefined) patch.description  = r.description;
    if (r.isAvailable  !== undefined) patch.is_available = r.isAvailable;
    if (r.renterName   !== undefined) patch.renter_name  = r.renterName;
    if (r.ownerUrl     !== undefined) patch.owner_url    = r.ownerUrl;

    const { data, error } = await supabase
      .from('rentals')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toRental(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('rentals').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── Jobs ──────────────────────────────────────────────────────────────────────
export const sbJobsDB = {
  getAll: async (): Promise<JobListing[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toJob);
  },

  getActive: async (): Promise<JobListing[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toJob);
  },

  create: async (j: Omit<JobListing, 'id' | 'createdAt'>): Promise<JobListing> => {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title:               j.title,
        company:             j.company,
        location:            j.location,
        type:                j.type,
        salary:              j.salary,
        description:         j.description,
        requirements:        j.requirements,
        contact_email:       j.contactEmail,
        is_recruitment_agent: j.isRecruitmentAgent,
        status:              j.status,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toJob(data);
  },

  update: async (id: string, j: Partial<JobListing>): Promise<JobListing> => {
    const patch: Record<string, unknown> = {};
    if (j.title               !== undefined) patch.title                = j.title;
    if (j.company             !== undefined) patch.company              = j.company;
    if (j.location            !== undefined) patch.location             = j.location;
    if (j.type                !== undefined) patch.type                 = j.type;
    if (j.salary              !== undefined) patch.salary               = j.salary;
    if (j.description         !== undefined) patch.description          = j.description;
    if (j.requirements        !== undefined) patch.requirements         = j.requirements;
    if (j.contactEmail        !== undefined) patch.contact_email        = j.contactEmail;
    if (j.isRecruitmentAgent  !== undefined) patch.is_recruitment_agent = j.isRecruitmentAgent;
    if (j.status              !== undefined) patch.status               = j.status;

    const { data, error } = await supabase
      .from('jobs')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toJob(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── Food ──────────────────────────────────────────────────────────────────────
export const sbFoodDB = {
  getAll: async (): Promise<FoodPlace[]> => {
    const { data, error } = await supabase
      .from('food_places')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toFood);
  },

  create: async (f: Omit<FoodPlace, 'id' | 'createdAt'>): Promise<FoodPlace> => {
    const { data, error } = await supabase
      .from('food_places')
      .insert({
        name:        f.name,
        category:    f.category,
        location:    f.location,
        address:     f.address,
        phone:       f.phone,
        image:       f.image,
        description: f.description,
        price_range: f.priceRange,
        rating:      f.rating,
        open_hours:  f.openHours,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toFood(data);
  },

  update: async (id: string, f: Partial<FoodPlace>): Promise<FoodPlace> => {
    const patch: Record<string, unknown> = {};
    if (f.name        !== undefined) patch.name        = f.name;
    if (f.category    !== undefined) patch.category    = f.category;
    if (f.location    !== undefined) patch.location    = f.location;
    if (f.address     !== undefined) patch.address     = f.address;
    if (f.phone       !== undefined) patch.phone       = f.phone;
    if (f.image       !== undefined) patch.image       = f.image;
    if (f.description !== undefined) patch.description = f.description;
    if (f.priceRange  !== undefined) patch.price_range = f.priceRange;
    if (f.rating      !== undefined) patch.rating      = f.rating;
    if (f.openHours   !== undefined) patch.open_hours  = f.openHours;

    const { data, error } = await supabase
      .from('food_places')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toFood(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('food_places').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── News ──────────────────────────────────────────────────────────────────────
export const sbNewsDB = {
  getAll: async (): Promise<NewsPost[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toNews);
  },

  getPublished: async (): Promise<NewsPost[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toNews);
  },

  create: async (n: Omit<NewsPost, 'id' | 'createdAt'>): Promise<NewsPost> => {
    const { data, error } = await supabase
      .from('news')
      .insert({
        title:        n.title,
        content:      n.content,
        category:     n.category,
        image:        n.image,
        author:       n.author,
        published_at: n.publishedAt,
        status:       n.status,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toNews(data);
  },

  update: async (id: string, n: Partial<NewsPost>): Promise<NewsPost> => {
    const patch: Record<string, unknown> = {};
    if (n.title       !== undefined) patch.title        = n.title;
    if (n.content     !== undefined) patch.content      = n.content;
    if (n.category    !== undefined) patch.category     = n.category;
    if (n.image       !== undefined) patch.image        = n.image;
    if (n.author      !== undefined) patch.author       = n.author;
    if (n.publishedAt !== undefined) patch.published_at = n.publishedAt;
    if (n.status      !== undefined) patch.status       = n.status;

    const { data, error } = await supabase
      .from('news')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toNews(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── Gallery ───────────────────────────────────────────────────────────────────
export const sbGalleryDB = {
  getAll: async (): Promise<ArtworkItem[]> => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toGallery);
  },

  create: async (a: Omit<ArtworkItem, 'id' | 'createdAt'>): Promise<ArtworkItem> => {
    const { data, error } = await supabase
      .from('gallery')
      .insert({
        title:       a.title,
        artist:      a.artist,
        image:       a.image,
        description: a.description,
        category:    a.category,
        price:       a.price,
        for_sale:    a.forSale,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toGallery(data);
  },

  update: async (id: string, a: Partial<ArtworkItem>): Promise<ArtworkItem> => {
    const patch: Record<string, unknown> = {};
    if (a.title       !== undefined) patch.title       = a.title;
    if (a.artist      !== undefined) patch.artist      = a.artist;
    if (a.image       !== undefined) patch.image       = a.image;
    if (a.description !== undefined) patch.description = a.description;
    if (a.category    !== undefined) patch.category    = a.category;
    if (a.price       !== undefined) patch.price       = a.price;
    if (a.forSale     !== undefined) patch.for_sale    = a.forSale;

    const { data, error } = await supabase
      .from('gallery')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toGallery(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── Banners ───────────────────────────────────────────────────────────────────
export const sbBannersDB = {
  getAll: async (): Promise<Banner[]> => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toBanner);
  },

  getActive: async (): Promise<Banner[]> => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true);
    if (error) throw new Error(error.message);
    return (data ?? []).map(toBanner);
  },

  create: async (b: Omit<Banner, 'id' | 'createdAt'>): Promise<Banner> => {
    const { data, error } = await supabase
      .from('banners')
      .insert({
        text:      b.text,
        link:      b.link,
        type:      b.type,
        color:     b.color,
        is_active: b.isActive,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toBanner(data);
  },

  update: async (id: string, b: Partial<Banner>): Promise<Banner> => {
    const patch: Record<string, unknown> = {};
    if (b.text     !== undefined) patch.text      = b.text;
    if (b.link     !== undefined) patch.link      = b.link;
    if (b.type     !== undefined) patch.type      = b.type;
    if (b.color    !== undefined) patch.color     = b.color;
    if (b.isActive !== undefined) patch.is_active = b.isActive;

    const { data, error } = await supabase
      .from('banners')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toBanner(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },
};

// ─── Donations ─────────────────────────────────────────────────────────────────
export const sbDonationsDB = {
  getAll: async (): Promise<DonationRecord[]> => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toDonation);
  },

  create: async (d: Omit<DonationRecord, 'id' | 'createdAt'>): Promise<DonationRecord> => {
    const { data, error } = await supabase
      .from('donations')
      .insert({
        type:       d.type,
        donor_name: d.donorName,
        amount:     d.amount,
        message:    d.message,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toDonation(data);
  },

  getTotalByType: async (type: DonationRecord['type']): Promise<number> => {
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('type', type);
    if (error) throw new Error(error.message);
    return (data ?? []).reduce((sum, d) => sum + (d.amount as number), 0);
  },
};
