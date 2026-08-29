# 🌐 3SGates — Global Community Gateway & Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: Proprietary](https://img.shields.io/badge/Powered%20By-AndamanFlow%20Systems-00A3FF?style=for-the-badge)](https://andamanflow.systems/)

> **3SGates** is a modern, high-performance community portal and digital gateway engineered to connect global communities, diaspora members, entrepreneurs, artists, and job seekers with verified opportunities, knowledge, and meaningful social impact.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
- [Trilingual Localization](#-trilingual-localization)
- [Admin Management Panel](#-admin-management-panel)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Database & Storage Architecture](#-database--storage-architecture)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [Credits & Attribution](#-credits--attribution)

---

## 🌟 Overview

3SGates serves as an inclusive, feature-rich digital bridge designed to empower communities abroad and in Southeast Asia. The platform seamlessly integrates marketplace commerce, commercial real estate, travel accommodations, cultural arts, verified employment, local cuisine, and humanitarian aid into a unified dark-mode web application.

---

## 🚀 Key Features & Modules

### 1. 🏠 Home Portal (`/`)
- **Interactive Hero Slider**: Dynamic banner system with smooth auto-slide rotation, responsive touch support, and call-to-action buttons.
- **Quick Access Grid**: Instant shortcuts to all 8 core services with intuitive category badges.
- **Latest News & Updates**: Real-time regional announcements and policy updates.
- **Featured Marketplace & Art Showcases**: Highlighted community craft items and featured artistic releases.
- **Vision & Mission**: Interactive accordion outlining community goals and core principles.
- **Global Announcement Bar**: Dismissible top notification banner with promotional badges.

### 2. 🛍️ Community Marketplace (`/shop`)
- Verified marketplace for cultural crafts, traditional apparel, and specialty products.
- Instant search and category filtering with price sorting.
- Product modal with comprehensive details, seller information, and direct order channels.

### 3. 🏢 Business Directory & Rentals (`/rent`)
- Commercial real estate listings for community entrepreneurs (offices, retail units, booths, warehouses).
- Filter by category, price ranges, and lease terms.
- Direct contact integrations for landlords and property managers.

### 4. 🏨 Stay & Accommodations Directory (`/stay`)
- Curated lodging guide including hotels, serviced apartments, and guesthouses.
- Multi-image room previews with detailed amenities (Wi-Fi, AC, pool, parking).
- Location map badges, direct booking links, and contact channels.

### 5. 🎨 Cultural Art Gallery (`/gallery`)
- Exhibition space celebrating both established and emerging artists.
- Responsive masonry grid layout.
- High-definition lightbox viewer with artwork dimensions, medium details, and artist biographies.

### 6. 📰 Regional News & Stories (`/news`)
- Timely journalism covering:
  - **Regional Thailand**: Immigration, legal updates, and regional developments.
  - **Communities Abroad**: Diaspora accomplishments, cultural celebrations, and global stories.
  - **Local Community**: Education programs, social enterprises, and community events.
- Category filters and reader-friendly modal views.

### 7. 🤝 Humanitarian Donations (`/donate`)
- Transparent fundraising campaigns supporting:
  - Displaced family relief and emergency healthcare.
  - Youth education scholarships and vocational training.
  - Community clean-up and disaster response initiatives.
- Instant PromptPay QR code generation and direct bank transfer instructions.

### 8. 💼 Job Opportunities (`/jobs`)
- Verified job listings for professionals, skilled technicians, and community members and remotely.
- Filtering by employment type (Full-time, Part-time, Remote, Contract).
- Direct application workflows via email and telephone.

### 9. 🍜 Regional Food Guide (`/food`)
- Culinary guide featuring authentic regional restaurants, street food stalls, and cafes.
- Filtering by cuisine style (Thai, Seafood & BBQ, Shan & Northern, Traditional Cuisine, etc.).
- Operating hours, contact numbers, price ratings, and physical addresses.

---

## 🌍 Trilingual Localization

3SGates features complete native localization across 3 languages:

| Code | Language | Native Label |
| :--- | :--- | :--- |
| `en` | **English** | `English` |
| `th` | **Thai** | `ภาษาไทย` |
| `mm` | **Burmese** | `မြန်မာ` |

- **Native Dropdown Selector**: Accessible from both desktop navigation and mobile top bar.
- **Downward Slide Animation**: Polished glassmorphic menu with native scripts for instant recognition.
- **Persistence**: Selected language is synchronized with `localStorage` and persists across user sessions.
- **Deep Translation Coverage**: Managed via [`LanguageContext.tsx`](src/contexts/LanguageContext.tsx) covering all page copy, categories, modals, notifications, and navigation labels.

---

## 🛡️ Admin Management Panel

The platform features an administrative portal accessible via a secure custom pathway:

```
Path: /3sgsec_madmin
```

### Admin Capabilities:
- **📊 Analytics Dashboard**: Live metrics for total products, active rentals, stays, job listings, art items, and news posts.
- **📢 Announcement Banners**: Create, edit, publish, or unpublish top header alert banners.
- **📦 Content Management**: Full CRUD capabilities for:
  - Shop Products (`/3sgsec_madmin/shop`)
  - Rentals & Business Listings (`/3sgsec_madmin/rent`)
  - Accommodations (`/3sgsec_madmin/stay`)
  - Art Gallery (`/3sgsec_madmin/gallery`)
  - Job Listings (`/3sgsec_madmin/jobs`)
  - News Articles (`/3sgsec_madmin/news`)
  - Food Places (`/3sgsec_madmin/food`)
  - Donation Initiatives (`/3sgsec_madmin/donate`)
- **👥 User Administration**: Manage administrator credentials and roles (`/3sgsec_madmin/users`).
- **🗄️ Database Inspector**: Verify live database connections, inspect table row counts, and trigger seed resets (`/3sgsec_madmin/database`).
- **⚙️ Site Settings**: Global platform preferences and contact information.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Server & Client Components) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI & Styling** | Vanilla CSS Design System with Glassmorphism, CSS Variables, and Mobile-first Media Queries |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Cloud Database** | [Supabase](https://supabase.com/) (PostgreSQL REST API) |
| **Cloud Storage** | Supabase Storage Buckets (Multi-image upload for stays and listings) |
| **Fallback DB** | In-Memory Local Database Engine (`src/lib/db.ts`) with automatic seed hydration |

---

## 📁 Project Architecture

```
3sgate/
├── public/                     # Static public assets (logos, icons, images)
│   ├── andamanflow-logo.png    # AndamanFlow Systems signature brand asset
│   ├── logo.png                # 3SGates brand logo
│   └── promptpay-qr.jpg        # Donation QR code template
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── 3sgsec_madmin/      # Custom Admin Module
│   │   │   ├── banners/        # Header banner management
│   │   │   ├── database/       # DB status & synchronization
│   │   │   ├── donate/         # Donation campaign administration
│   │   │   ├── food/           # Restaurant directory administration
│   │   │   ├── gallery/        # Art catalog administration
│   │   │   ├── jobs/           # Job board administration
│   │   │   ├── login/          # Secure admin login authentication
│   │   │   ├── news/           # News publishing & draft management
│   │   │   ├── rent/           # Commercial listings management
│   │   │   ├── settings/       # Site-wide settings
│   │   │   ├── shop/           # Marketplace inventory management
│   │   │   ├── stay/           # Accommodation & room management
│   │   │   └── users/          # Admin account management
│   │   ├── donate/             # Public Donations page
│   │   ├── food/               # Public Food Guide directory
│   │   ├── gallery/            # Public Art Gallery showcase
│   │   ├── jobs/               # Public Job listings board
│   │   ├── news/               # Public News portal
│   │   ├── rent/               # Public Business Directory / Rentals
│   │   ├── shop/               # Public Marketplace
│   │   ├── stay/               # Public Accommodations directory
│   │   ├── globals.css         # Core CSS design system and responsive tokens
│   │   ├── layout.tsx          # Root HTML layout, SEO metadata, LanguageProvider
│   │   └── page.tsx            # Main homepage
│   ├── components/
│   │   ├── admin/              # Admin components (Sidebar, ImageUploadInput, MultiImageUploadInput)
│   │   ├── home/               # Homepage widgets (HeroSlider, QuickAccess, LatestNews, etc.)
│   │   ├── AdBanner.tsx        # Global promotional alert banner
│   │   ├── Footer.tsx          # Site footer with AndamanFlow Systems glowing pill button
│   │   ├── Logo.tsx            # Dynamic vector/image brand component
│   │   └── Navbar.tsx          # Responsive navbar with search and language dropdown
│   ├── contexts/
│   │   └── LanguageContext.tsx # Trilingual dictionary and localization state engine
│   └── lib/
│       ├── auth.ts             # Admin session and credential handling
│       ├── db.ts               # In-memory mock database & seed dataset
│       ├── supabase.ts         # Supabase client initializer
│       ├── supabase-db.ts      # Cloud database adapters and queries
│       └── supabase-storage.ts # Media file uploads to Supabase storage
├── .env.local                  # Environment credentials
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and npm scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🗄️ Database & Storage Architecture

3SGates is built with a resilient **hybrid data layer**:

1. **Supabase Cloud Database**:
   - When configured with valid credentials in `.env.local`, the application queries live PostgreSQL tables via `@supabase/supabase-js`.
   - Supports image uploads directly to Supabase Storage.
2. **In-Memory Fallback Engine**:
   - If Supabase credentials are missing or the service is temporarily unreachable, the application automatically falls back to [`src/lib/db.ts`](src/lib/db.ts).
   - Pre-loaded with comprehensive seed data across all 8 modules to ensure zero downtime during development and demonstration.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project12-3sgates/3sgate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```bash
   cp .env.local.example .env.local  # or edit .env.local directly
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root of the `3sgate` directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note**: If environment variables are omitted, the application will seamlessly operate using the integrated mock database engine with full functionality.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack hot-reloading |
| `npm run build` | Compiles the production build, runs TypeScript validation, and pre-renders static routes |
| `npm run start` | Launches the compiled Next.js production server |
| `npm run lint` | Runs ESLint to check for code quality and style issues |

---

## 🤝 Credits & Attribution

Designed and engineered with pride by **AndamanFlow Systems**:

- **Website**: [https://andamanflow.systems/](https://andamanflow.systems/)
- **Branding**: Official AndamanFlow signature electric blue (`#00A3FF`) glowing integration.
- **Copyright**: &copy; 2026 **3SGates**. All rights reserved.