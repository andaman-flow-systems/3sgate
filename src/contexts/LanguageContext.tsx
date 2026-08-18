'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'mm';

// ─── Complete Bilingual Translation Strings ───────────────────────────────────
const translations = {
  en: {
    // ── Global / Common ──
    siteName: '3SGates',
    siteTagline: 'Connecting Communities. Creating Opportunities.',
    siteDescription: 'A trusted gateway that connects Myanmar communities with opportunities, knowledge, businesses, and meaningful social impact.',
    search: 'Search',
    searchPlaceholderGlobal: 'Search products, news, jobs, places…',
    viewAll: 'View All',
    exploreNow: 'EXPLORE NOW',
    learnMore: 'LEARN MORE',
    contactUs: 'Contact Us',
    contactUsFacebook: 'Contact Us on Facebook',
    close: 'Close',
    back: 'Back',
    all: 'All',
    filter: 'Filter',
    clearFilters: 'Clear filters',
    loading: 'Loading from database…',
    noResults: 'No results found.',
    noResultsHint: 'Try adjusting your search query or filters.',
    actions: 'Actions',
    thb: '฿',
    perMonth: '/mo',
    perNight: '/night',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    available: 'Available',
    rented: 'Rented',
    viewDetails: 'View Details →',
    visitWebsite: 'Visit Website',
    copy: 'Copy',
    copied: 'Copied ✓',
    rating: 'Rating',
    location: 'Location',
    price: 'Price',
    category: 'Category',
    date: 'Date',

    // ── Navbar ──
    home: 'HOME',
    shop: 'SHOP',
    businessDirectory: 'BUSINESS DIRECTORY',
    gallery: 'GALLERY',
    donate: 'DONATE',
    jobs: 'JOBS',
    foodGuide: 'FOOD GUIDE',
    stay: 'STAY',
    langButton: 'မြန်မာ',
    langLabel: 'EN',

    // ── Home Hero Slides ──
    slide1Headline: 'Connecting Communities.',
    slide1Highlight: 'Creating Opportunities.',
    slide1Sub: 'A trusted platform that connects businesses, communities, creators, job seekers, and social initiatives to create meaningful opportunities and positive social impact.',
    slide2Headline: 'Supporting Myanmar',
    slide2Highlight: 'Communities Abroad.',
    slide2Sub: 'Your trusted source for news, jobs, art, and community support for Myanmar people living in Thailand and around the world.',
    slide3Headline: 'Empowering Artists &',
    slide3Highlight: 'Creative Voices.',
    slide3Sub: 'Showcase and discover artwork from talented Myanmar artists and support the next generation of creative minds.',

    // ── Home Quick Access ──
    qaShop: 'SHOP',
    qaShopSub: 'Online Shop',
    qaDirectory: 'DIRECTORY',
    qaDirectorySub: 'Business Directory',
    qaNews: 'NEWS',
    qaNewsSub: 'Latest News',
    qaArt: 'ART',
    qaArtSub: 'Creative Works',
    qaDonate: 'DONATE',
    qaDonateSub: 'Make Impact',
    qaJobs: 'JOBS',
    qaJobsSub: 'Find Jobs',
    qaFood: 'FOOD',
    qaFoodSub: 'Food & Places',
    qaStay: 'STAY',
    qaStaySub: 'Hotels & Rooms',

    // ── Home Vision & Mission ──
    visionTitle: 'Vision',
    visionText: 'To become a trusted gateway that connects communities with opportunities, knowledge, businesses, and meaningful social impact.',
    missionTitle: 'Mission',
    missionText: 'To empower communities by connecting people with information, businesses, jobs, creativity, and opportunities that create positive social impact.',

    // ── Home Sections ──
    latestNews: 'LATEST NEWS',
    featuredArtwork: 'FEATURED ARTWORK',
    featuredShops: 'FEATURED SHOPS',
    artist: 'Artist',

    // ── Shop Page ──
    shopHeroTitle: 'Our Shop Marketplace',
    shopHeroSub: 'Discover unique products from our Myanmar community marketplace. All prices in Thai Baht (THB).',
    shopSearchPlaceholder: 'Search products by name or category…',
    shopBuyInquireFacebook: 'Buy / Inquire on Facebook Page',
    shopNoProducts: 'No products found matching your search.',

    // ── Business Directory (Rent) Page ──
    rentHeroTitle: 'Business & Rental Directory',
    rentHeroSub: 'Commercial spaces, offices, shops, and properties for the Myanmar community in Thailand and beyond.',
    rentSearchPlaceholder: 'Search spaces by name, location, or features…',
    rentTabAll: 'All Spaces',
    rentTabAvailable: 'Available Now',
    rentTabRented: 'Currently Rented',
    rentContactOwner: 'Contact / Inquire on Facebook',
    rentNoSpaces: 'No rental spaces found matching your search.',
    rentSize: 'Size',
    rentStatusAvailable: '✓ Available for Rent',
    rentStatusRented: '✕ Currently Rented',

    // ── Art Gallery Page ──
    galleryHeroTitle: 'Art Gallery',
    galleryHeroSub: 'Showcasing artwork from established and emerging Myanmar artists.',
    galleryBuyInquire: 'Inquire / Buy on Facebook',
    galleryForSale: 'For Sale',
    galleryNotForSale: 'Exhibition Only',
    galleryNoArtworks: 'No artwork found in the gallery.',

    // ── Donate Page ──
    donateHeroTitle: 'Support Meaningful Causes',
    donateHeroSub: '100% of community donations go directly to emergency relief, education scholarships, and supporting displaced Myanmar families.',
    donateTabSupportPlatform: 'Support Platform',
    donateTabSupportPlatformSub: 'Help keep 3SGate online & free',
    donateTabSupportPlatformDesc: 'Your contribution supports the development, hosting, and maintenance of the 3SGate platform — keeping this community resource free and accessible for everyone.',
    donateTabRefugee: 'Refugee Support',
    donateTabRefugeeSub: 'Emergency aid for displaced families',
    donateTabRefugeeDesc: 'Provide essential relief to Myanmar refugees in border areas — food, clean water, temporary shelter, and medical care for the most vulnerable families.',
    donateTabScholarship: 'Student Scholarships',
    donateTabScholarshipSub: 'Invest in the next generation',
    donateTabScholarshipDesc: 'Fund education for children and students who have lost access to schooling. Every contribution helps a young person build a brighter future.',
    donateSelectAmount: 'Select Donation Amount (THB ฿)',
    donateCustomAmount: 'Custom Amount (฿)',
    donateYourName: 'Your Name or Alias (Optional)',
    donateYourNamePlaceholder: 'e.g. Anonymous or Daw Khin Khin',
    donateMessage: 'Encouraging Message (Optional)',
    donateMessagePlaceholder: 'Leave a warm message of hope…',
    donateProceedBtn: 'Proceed to Donation →',
    donateStep1Title: 'Step 1: Choose Amount & Cause',
    donateStep2Title: 'Step 2: Bank Transfer & PromptPay QR',
    donateStep3Title: 'Thank You for Your Generosity!',
    donateTransferInstructions: 'Transfer via Thai Bank Account or scan the PromptPay QR below:',
    donateBankName: 'Bank Name',
    donateAccountNo: 'Account Number',
    donateAccountName: 'Account Name',
    donateConfirmSentBtn: 'I Have Completed the Transfer ✓',

    // ── Jobs Page ──
    jobsHeroTitle: 'Job Opportunities',
    jobsHeroSub: 'Find verified job openings for Myanmar professionals, skilled workers, and community members in Thailand and remotely.',
    jobsSearchPlaceholder: 'Search jobs by title, company, skills…',
    jobsAllTypes: 'All Job Types',
    jobsFullTime: 'Full Time',
    jobsPartTime: 'Part Time',
    jobsContract: 'Contract',
    jobsFreelance: 'Freelance',
    jobsRecruitmentAgent: 'Recruitment Agency',
    jobsDirectEmployer: 'Direct Employer',
    jobsApplyEmail: 'Apply via Email',
    jobsSalary: 'Salary',
    jobsRequirements: 'Requirements & Qualifications',
    jobsNoJobs: 'No job listings found matching your search.',

    // ── Food Guide Page ──
    foodHeroTitle: 'Myanmar & Regional Food Guide',
    foodHeroSub: 'Discover authentic Myanmar restaurants, Shan cuisine, street food, and cafés in Thailand.',
    foodSearchPlaceholder: 'Search restaurants, cuisines, locations…',
    foodAllCategories: 'All Cuisines',
    foodOpenHours: 'Open Hours',
    foodPhone: 'Phone',
    foodCallNow: 'Call Restaurant',
    foodNoPlaces: 'No food places found matching your search.',

    // ── News Page ──
    newsHeroTitle: 'Community News & Stories',
    newsHeroSub: 'Stay informed with the latest updates from Myanmar, Thailand border communities, and the diaspora abroad.',
    newsAllCategories: 'All News',
    newsCatThailand: 'Myanmar-Thailand',
    newsCatAbroad: 'Myanmar Abroad',
    newsCatLocal: 'Myanmar Local',
    newsPublishedOn: 'Published on',
    newsBy: 'By',
    newsReadFullArticle: 'Read Full Article →',
    newsBackToList: '← Back to News',
    newsNoPosts: 'No news articles found in this category.',

    // ── Stay Page ──
    stayPageTitle: 'Accommodation Directory',
    stayPageSubtitle: 'Find hotels, apartments, guesthouses and more for your stay in Myanmar.',
    staySearchPlaceholder: 'Search by name or location…',
    stayAllTypes: 'All Types',
    stayNoListings: 'No accommodation listings found.',
    stayNoListingsHint: 'Try adjusting your search or filter.',
    stayPhotos: 'photos',
    stayStarsLabel: 'stars',

    // ── Accommodation Types ──
    hotels: 'Hotels',
    apartments: 'Apartments',
    hostels: 'Hostels',
    guesthouses: 'Guesthouses',
    sharedRooms: 'Shared Rooms',
    villasHouses: 'Villas & Houses',
    camping: 'Camping',
    shortTermRentals: 'Short-Term Rentals',
    longTermRentals: 'Long-Term Rentals',

    // ── Footer ──
    footerPages: 'Pages',
    footerCommunity: 'Community',
    footerContact: 'Contact',
    footerOnlineShop: 'Online Shop',
    footerBusinessDirectory: 'Business Directory',
    footerNews: 'News',
    footerArtGallery: 'Art Gallery',
    footerDonations: 'Donations',
    footerJobs: 'Jobs',
    footerFoodGuide: 'Food Guide',
    footerStay: 'Stay Directory',
    footerMyanmarInThailand: 'Myanmar in Thailand',
    footerMyanmarAbroad: 'Myanmar Abroad',
    footerRefugeeSupport: 'Refugee Support',
    footerScholarships: 'Scholarships',
    footerCulturalEvents: 'Cultural Events',
    footerPoweredBy: 'Powered by AndamanFlow Systems',
    footerAllRightsReserved: 'All rights reserved.',
  },

  mm: {
    // ── Global / Common ──
    siteName: '3SGates',
    siteTagline: 'လူမှုအသိုက်အဝန်းများကို ချိတ်ဆက်ခြင်း။ အခွင့်အလမ်းများ ဖန်တီးပေးခြင်း။',
    siteDescription: 'မြန်မာပြည်သူများနှင့် လူမှုအသိုက်အဝန်းများကို အခွင့်အလမ်းများ၊ ဗဟုသုတများ၊ စီးပွားရေးလုပ်ငန်းများနှင့် အကျိုးသက်ရောက်မှုရှိသော လူမှုကူညီရေးလုပ်ငန်းများဖြင့် ယုံကြည်စိတ်ချစွာ ချိတ်ဆက်ပေးသော တံခါးပေါက်။',
    search: 'ရှာဖွေရန်',
    searchPlaceholderGlobal: 'ပစ္စည်းများ၊ သတင်းများ၊ အလုပ်အကိုင်များနှင့် နေရာများ ရှာရန်…',
    viewAll: 'အားလုံးကြည့်ရန်',
    exploreNow: 'လေ့လာကြည့်ရှုရန်',
    learnMore: 'အသေးစိတ်သိရှိရန်',
    contactUs: 'ဆက်သွယ်ရန်',
    contactUsFacebook: 'Facebook မှ ဆက်သွယ်ရန်',
    close: 'ပိတ်ရန်',
    back: 'ပြန်သွားရန်',
    all: 'အားလုံး',
    filter: 'စစ်ထုတ်ရန်',
    clearFilters: 'စစ်ထုတ်မှု ရှင်းလင်းရန်',
    loading: 'ဒေတာဘေ့စ်မှ ဖတ်ယူနေသည်…',
    noResults: 'ရှာဖွေမှုရလဒ် မရှိပါ။',
    noResultsHint: 'ရှာဖွေလိုသော စကားလုံး သို့မဟုတ် စစ်ထုတ်မှုကို ပြောင်းလဲကြည့်ပါ။',
    actions: 'လုပ်ဆောင်ချက်များ',
    thb: '฿',
    perMonth: '/လ',
    perNight: '/ည',
    inStock: 'ပစ္စည်းရှိပါသည်',
    outOfStock: 'ပစ္စည်းကုန်နေပါသည်',
    available: 'ငှားရန်ရှိသည်',
    rented: 'ငှားပြီးပါပြီ',
    viewDetails: 'အသေးစိတ်ကြည့်ရန် →',
    visitWebsite: 'ဝဘ်ဆိုဒ်သို့ သွားရန်',
    copy: 'ကူးယူရန်',
    copied: 'ကူးယူပြီးပါပြီ ✓',
    rating: 'အဆင့်သတ်မှတ်ချက်',
    location: 'တည်နေရာ',
    price: 'စျေးနှုန်း',
    category: 'အမျိုးအစား',
    date: 'ရက်စွဲ',

    // ── Navbar ──
    home: 'ပင်မစာမျက်နှာ',
    shop: 'ဆိုင်ခန်းများ',
    businessDirectory: 'စီးပွားရေးလမ်းညွှန်',
    gallery: 'အနုပညာပြခန်း',
    donate: 'လှူဒါန်းရန်',
    jobs: 'အလုပ်အကိုင်',
    foodGuide: 'အစားအသောက်လမ်းညွှန်',
    stay: 'တည်းခိုရန်နေရာများ',
    langButton: 'English',
    langLabel: 'MM',

    // ── Home Hero Slides ──
    slide1Headline: 'လူမှုအသိုက်အဝန်းများကို ချိတ်ဆက်ခြင်း။',
    slide1Highlight: 'အခွင့်အလမ်းများ ဖန်တီးပေးခြင်း။',
    slide1Sub: 'စီးပွားရေးလုပ်ငန်းများ၊ လူမှုအသိုင်းအဝိုင်းများ၊ ဖန်တီးရှင်များ၊ အလုပ်ရှာဖွေသူများနှင့် လူမှုဖွံ့ဖြိုးရေးလုပ်ငန်းများကို အဓိပ္ပာယ်ရှိသော အခွင့်အလမ်းများနှင့် ချိတ်ဆက်ပေးသော ယုံကြည်စိတ်ချရသည့် ပလက်ဖောင်း။',
    slide2Headline: 'ထိုင်းနိုင်ငံနှင့် ပြည်ပရောက်',
    slide2Highlight: 'မြန်မာလူထုကို ကူညီပံ့ပိုးပေးခြင်း။',
    slide2Sub: 'ထိုင်းနိုင်ငံနှင့် ကမ္ဘာအရပ်ရပ်ရှိ မြန်မာပြည်သူများအတွက် သတင်းအချက်အလက်၊ အလုပ်အကိုင်၊ အနုပညာနှင့် လူမှုကူညီစောင့်ရှောက်ရေး အရင်းအမြစ်။',
    slide3Headline: 'မြန်မာအနုပညာရှင်များနှင့်',
    slide3Highlight: 'ဖန်တီးရှင်များကို စွမ်းဆောင်ရည်မြှင့်တင်ခြင်း။',
    slide3Sub: 'ပါရမီရှင် မြန်မာအနုပညာရှင်များ၏ လက်ရာများကို ရှာဖွေဖော်ထုတ်ပြသပြီး မျိုးဆက်သစ် ဖန်တီးရှင်များကို အားပေးကူညီကြပါစို့။',

    // ── Home Quick Access ──
    qaShop: 'ဆိုင်များ',
    qaShopSub: 'အွန်လိုင်းစျေးဆိုင်',
    qaDirectory: 'စီးပွားရေး',
    qaDirectorySub: 'လုပ်ငန်းနှင့် ငှားရမ်းမှုများ',
    qaNews: 'သတင်းများ',
    qaNewsSub: 'နောက်ဆုံးရသတင်း',
    qaArt: 'အနုပညာ',
    qaArtSub: 'ဖန်တီးမှုလက်ရာများ',
    qaDonate: 'လှူဒါန်းရန်',
    qaDonateSub: 'လူမှုအကျိုးပြုလုပ်ငန်း',
    qaJobs: 'အလုပ်များ',
    qaJobsSub: 'အလုပ်အကိုင်ရှာဖွေရန်',
    qaFood: 'အစားအသောက်',
    qaFoodSub: 'ဆိုင်များနှင့် နေရာများ',
    qaStay: 'တည်းခိုရန်',
    qaStaySub: 'ဟိုတယ်နှင့် အခန်းများ',

    // ── Home Vision & Mission ──
    visionTitle: 'မျှော်မှန်းချက် (Vision)',
    visionText: 'လူမှုအသိုက်အဝန်းများကို အခွင့်အလမ်းများ၊ အသိပညာ၊ စီးပွားရေးလုပ်ငန်းများနှင့် အဓိပ္ပာယ်ရှိသော လူမှုအကျိုးပြုလုပ်ငန်းများဖြင့် ချိတ်ဆက်ပေးသည့် ယုံကြည်အားထားရသော တံခါးပေါက်တစ်ခု ဖြစ်လာစေရန်။',
    missionTitle: 'ရည်မှန်းချက် (Mission)',
    missionText: 'သတင်းအချက်အလက်၊ စီးပွားရေး၊ အလုပ်အကိုင်၊ ဖန်တီးနိုင်စွမ်းနှင့် အခွင့်အလမ်းများကို ဆက်သွယ်ပေးခြင်းဖြင့် အပြုသဘောဆောင်သော လူမှုအကျိုးသက်ရောက်မှုများ ဖန်တီးပေးရန်။',

    // ── Home Sections ──
    latestNews: 'နောက်ဆုံးရသတင်းများ',
    featuredArtwork: 'ရွေးချယ်ထားသော အနုပညာလက်ရာများ',
    featuredShops: 'လူကြိုက်များသော ဆိုင်ခန်းများ',
    artist: 'အနုပညာရှင်',

    // ── Shop Page ──
    shopHeroTitle: 'ကျွန်ုပ်တို့၏ အွန်လိုင်းစျေးဆိုင်',
    shopHeroSub: 'မြန်မာလူမှုအသိုက်အဝန်း စျေးကွက်မှ ထူးခြားသော ကုန်ပစ္စည်းများကို ရှာဖွေဝယ်ယူပါ။ စျေးနှုန်းအားလုံး ထိုင်းဘတ်ငွေ (THB) ဖြင့် ဖြစ်ပါသည်။',
    shopSearchPlaceholder: 'ပစ္စည်းအမည် သို့မဟုတ် အမျိုးအစားဖြင့် ရှာရန်…',
    shopBuyInquireFacebook: 'Facebook စာမျက်နှာမှတစ်ဆင့် ဝယ်ယူ/မေးမြန်းရန်',
    shopNoProducts: 'သင်ရှာဖွေသော ကုန်ပစ္စည်း မတွေ့ရှိပါ။',

    // ── Business Directory (Rent) Page ──
    rentHeroTitle: 'စီးပွားရေးနှင့် နေရာငှားရမ်းခြင်း လမ်းညွှန်',
    rentHeroSub: 'ထိုင်းနိုင်ငံနှင့် အခြားဒေသများရှိ မြန်မာစီးပွားရေးလုပ်ငန်းများအတွက် ဆိုင်ခန်းများ၊ ရုံးခန်းများနှင့် နေရာများ။',
    rentSearchPlaceholder: 'နာမည်၊ တည်နေရာ သို့မဟုတ် အချက်အလက်ဖြင့် ရှာရန်…',
    rentTabAll: 'နေရာအားလုံး',
    rentTabAvailable: 'ယခုငှားရန်ရှိသည်',
    rentTabRented: 'ငှားရမ်းပြီးပါပြီ',
    rentContactOwner: 'Facebook မှတစ်ဆင့် မေးမြန်း/ဆက်သွယ်ရန်',
    rentNoSpaces: 'သင်ရှာဖွေသော ငှားရမ်းရန်နေရာ မတွေ့ရှိပါ။',
    rentSize: 'အကျယ်အဝန်း',
    rentStatusAvailable: '✓ ငှားရမ်းရန် အဆင်သင့်ရှိသည်',
    rentStatusRented: '✕ ငှားရမ်းပြီးပါပြီ',

    // ── Art Gallery Page ──
    galleryHeroTitle: 'အနုပညာပြခန်း',
    galleryHeroSub: 'ဝါရင့်နှင့် မျိုးဆက်သစ် မြန်မာအနုပညာရှင်များ၏ လက်ရာမွန်များကို ဂုဏ်ပြုပြသခြင်း။',
    galleryBuyInquire: 'Facebook မှတစ်ဆင့် မေးမြန်း/ဝယ်ယူရန်',
    galleryForSale: 'ဝယ်ယူနိုင်ပါသည်',
    galleryNotForSale: 'ပြသရန်သာဖြစ်ပါသည်',
    galleryNoArtworks: 'ပြခန်းတွင် လက်ရာများ မရှိသေးပါ။',

    // ── Donate Page ──
    donateHeroTitle: 'အဓိပ္ပာယ်ရှိသော လူမှုကူညီရေးလုပ်ငန်းများသို့ လှူဒါန်းပါ',
    donateHeroSub: 'သင်၏ လှူဒါန်းငွေ ၁၀၀% သည် အရေးပေါ် အကူအညီများ၊ ပညာသင်ဆုများနှင့် စစ်ဘေးရှောင် မြန်မာမိသားစုများထံသို့ တိုက်ရိုက် ရောက်ရှိပါမည်။',
    donateTabSupportPlatform: 'ပလက်ဖောင်းကို ထောက်ပံ့ရန်',
    donateTabSupportPlatformSub: '3SGate ဝဘ်ဆိုဒ် အခမဲ့ ဆက်လက်လည်ပတ်နိုင်စေရန်',
    donateTabSupportPlatformDesc: 'သင်၏ ထောက်ပံ့မှုသည် 3SGate ပလက်ဖောင်း ဖွံ့ဖြိုးတိုးတက်ရေး၊ ဝဘ်ဆာဗာထိန်းသိမ်းရေးနှင့် လူတိုင်းအခမဲ့ အသုံးပြုနိုင်စေရန် ကူညီပေးပါသည်။',
    donateTabRefugee: 'စစ်ဘေးရှောင်များ ကူညီရေး',
    donateTabRefugeeSub: 'နယ်စပ်ဒေသရှိ ဒုက္ခသည်မိသားစုများအတွက် အရေးပေါ်အကူအညီ',
    donateTabRefugeeDesc: 'နယ်စပ်ဒေသများရှိ ထိခိုက်လွယ်ဆုံး မြန်မာစစ်ဘေးရှောင်မိသားစုများအတွက် အစားအစာ၊ သန့်ရှင်းသောသောက်သုံးရေ၊ ယာယီခိုလှုံရာနှင့် ဆေးဝါးများ ထောက်ပံ့ပေးပါသည်။',
    donateTabScholarship: 'ကျောင်းသား/သူများ ပညာသင်ဆု',
    donateTabScholarshipSub: 'မျိုးဆက်သစ်များ၏ အနာဂတ်အတွက် ရင်းနှီးမြှုပ်နှံပါ',
    donateTabScholarshipDesc: 'ပညာသင်ကြားခွင့် ဆုံးရှုံးနေရသော ကလေးငယ်များနှင့် လူငယ်များအတွက် ပညာသင်ဆုများ ထောက်ပံ့ပေးပြီး တောက်ပသောအနာဂတ်ကို ဖန်တီးပေးပါ။',
    donateSelectAmount: 'လှူဒါန်းလိုသော ပမာဏကို ရွေးချယ်ပါ (THB ฿)',
    donateCustomAmount: 'စိတ်ကြိုက်ပမာဏ (฿)',
    donateYourName: 'သင့်အမည် သို့မဟုတ် အမည်ဝှက် (မထည့်လည်းရပါသည်)',
    donateYourNamePlaceholder: 'ဥပမာ - အမည်မဖော်လိုသူ သို့မဟုတ် ဒေါ်ခင်ခင်',
    donateMessage: 'အားပေးစကား (မထည့်လည်းရပါသည်)',
    donateMessagePlaceholder: 'နွေးထွေးသော အားပေးစကား ရေးသားရန်…',
    donateProceedBtn: 'ငွေလွှဲရန် အဆင့်သို့ ဆက်သွားရန် →',
    donateStep1Title: 'အဆင့် ၁ - လှူဒါန်းမည့် ပမာဏနှင့် ကဏ္ဍ ရွေးချယ်ပါ',
    donateStep2Title: 'အဆင့် ၂ - ဘဏ်အကောင့် သို့မဟုတ် PromptPay QR ဖြင့် လွှဲပါ',
    donateStep3Title: 'သင်၏ ရက်ရောသော လှူဒါန်းမှုအတွက် ကျေးဇူးတင်ရှိပါသည်!',
    donateTransferInstructions: 'ထိုင်းဘဏ်အကောင့် သို့မဟုတ် အောက်ပါ PromptPay QR ကို စကင်ဖတ်၍ လွှဲပြောင်းနိုင်ပါသည် -',
    donateBankName: 'ဘဏ်အမည်',
    donateAccountNo: 'အကောင့်နံပါတ်',
    donateAccountName: 'အကောင့်အမည်',
    donateConfirmSentBtn: 'ငွေလွှဲပြောင်းပြီးပါပြီ ✓',

    // ── Jobs Page ──
    jobsHeroTitle: 'အလုပ်အကိုင် အခွင့်အလမ်းများ',
    jobsHeroSub: 'ထိုင်းနိုင်ငံနှင့် အဝေးရောက် မြန်မာပညာရှင်များ၊ ကျွမ်းကျင်လုပ်သားများနှင့် လူထုအတွက် စိစစ်ထားသော အလုပ်အကိုင်များ။',
    jobsSearchPlaceholder: 'ရာထူး၊ ကုမ္ပဏီ သို့မဟုတ် ကျွမ်းကျင်မှုဖြင့် ရှာရန်…',
    jobsAllTypes: 'အလုပ်အမျိုးအစား အားလုံး',
    jobsFullTime: 'အချိန်ပြည့် (Full Time)',
    jobsPartTime: 'အချိန်ပိုင်း (Part Time)',
    jobsContract: 'စာချုပ်ချုပ်ဆို (Contract)',
    jobsFreelance: 'အလွတ်တန်း (Freelance)',
    jobsRecruitmentAgent: 'အလုပ်အကိုင်ရှာဖွေရေး အေဂျင်စီ',
    jobsDirectEmployer: 'တိုက်ရိုက်အလုပ်ရှင်',
    jobsApplyEmail: 'အီးမေးလ်ဖြင့် လျှောက်ထားရန်',
    jobsSalary: 'လစာ / အခကြေးငွေ',
    jobsRequirements: 'လိုအပ်သော အရည်အချင်းများနှင့် သတ်မှတ်ချက်များ',
    jobsNoJobs: 'သင်ရှာဖွေသော အလုပ်အကိုင် မတွေ့ရှိပါ။',

    // ── Food Guide Page ──
    foodHeroTitle: 'မြန်မာနှင့် ဒေသန္တရ အစားအသောက်လမ်းညွှန်',
    foodHeroSub: 'ထိုင်းနိုင်ငံရောက် မြန်မာစစ်စစ် စားသောက်ဆိုင်များ၊ ရှမ်းအစားအစာ၊ လမ်းဘေးအစားအစာများနှင့် ကော်ဖီဆိုင်များ။',
    foodSearchPlaceholder: 'ဆိုင်အမည်၊ အစားအစာအမျိုးအစား၊ တည်နေရာ ရှာရန်…',
    foodAllCategories: 'အစားအစာအားလုံး',
    foodOpenHours: 'ဖွင့်ချိန်',
    foodPhone: 'ဖုန်းနံပါတ်',
    foodCallNow: 'ဆိုင်သို့ တိုက်ရိုက်ဖုန်းခေါ်ရန်',
    foodNoPlaces: 'သင်ရှာဖွေသော စားသောက်ဆိုင် မတွေ့ရှိပါ။',

    // ── News Page ──
    newsHeroTitle: 'သတင်းများနှင့် အသိုက်အဝန်းဆောင်းပါးများ',
    newsHeroSub: 'မြန်မာနိုင်ငံ၊ ထိုင်း-မြန်မာနယ်စပ်နှင့် ပြည်ပရောက် မြန်မာပြည်သူများအတွက် နောက်ဆုံးရ သတင်းအချက်အလက်များ။',
    newsAllCategories: 'သတင်းအားလုံး',
    newsCatThailand: 'မြန်မာ-ထိုင်း သတင်း',
    newsCatAbroad: 'ပြည်ပရောက် မြန်မာသတင်း',
    newsCatLocal: 'မြန်မာပြည်တွင်း သတင်း',
    newsPublishedOn: 'ဖော်ပြသည့်ရက်စွဲ',
    newsBy: 'ရေးသားသူ',
    newsReadFullArticle: 'ဆောင်းပါး အပြည့်အစုံဖတ်ရန် →',
    newsBackToList: '← သတင်းများသို့ ပြန်သွားရန်',
    newsNoPosts: 'ဤကဏ္ဍတွင် သတင်းဆောင်းပါး မရှိသေးပါ။',

    // ── Stay Page ──
    stayPageTitle: 'တည်းခိုခန်းလမ်းညွှန်',
    stayPageSubtitle: 'မြန်မာပြည်နှင့် အခြားဒေသများရှိ ဟိုတယ်၊ တိုက်ခန်း၊ အင်ဒိုပန်း နှင့် အခြားတည်းခိုခန်းများ ရှာဖွေပါ။',
    staySearchPlaceholder: 'နာမည် သို့မဟုတ် တည်နေရာ ရှာရန်…',
    stayAllTypes: 'အမျိုးအစားအားလုံး',
    stayNoListings: 'တည်းခိုခန်းများ မတွေ့ရှိပါ။',
    stayNoListingsHint: 'ရှာဖွေမှု သို့မဟုတ် စစ်ထုတ်မှု ပြောင်းလဲကြည့်ပါ။',
    stayPhotos: 'ပုံများ',
    stayStarsLabel: 'ကြယ်',

    // ── Accommodation Types ──
    hotels: 'ဟိုတယ်များ',
    apartments: 'တိုက်ခန်းများ',
    hostels: 'ဟော်စတယ်များ',
    guesthouses: 'ဧည့်ရိပ်သာများ',
    sharedRooms: 'မျှဝေသုံး အခန်းများ',
    villasHouses: 'ဗီလာနှင့် အိမ်များ',
    camping: 'စခန်းချ တဲများ',
    shortTermRentals: 'အချိန်တိုငှားရန်',
    longTermRentals: 'အချိန်ရှည်ငှားရန်',

    // ── Footer ──
    footerPages: 'စာမျက်နှာများ',
    footerCommunity: 'လူမှုအသိုက်အဝန်း',
    footerContact: 'ဆက်သွယ်ရန်',
    footerOnlineShop: 'အွန်လိုင်းဆိုင်',
    footerBusinessDirectory: 'စီးပွားရေးလမ်းညွှန်',
    footerNews: 'သတင်းများ',
    footerArtGallery: 'အနုပညာပြခန်း',
    footerDonations: 'လှူဒါန်းရန်',
    footerJobs: 'အလုပ်အကိုင်',
    footerFoodGuide: 'အစားအသောက်လမ်းညွှန်',
    footerStay: 'တည်းခိုရန်နေရာများ',
    footerMyanmarInThailand: 'ထိုင်းရောက် မြန်မာများ',
    footerMyanmarAbroad: 'ပြည်ပရောက် မြန်မာများ',
    footerRefugeeSupport: 'စစ်ဘေးရှောင်များ ကူညီရေး',
    footerScholarships: 'ပညာသင်ဆုများ',
    footerCulturalEvents: 'ယဉ်ကျေးမှုပွဲတော်များ',
    footerPoweredBy: 'AndamanFlow Systems မှ ဝန်ဆောင်မှုပေးပါသည်',
    footerAllRightsReserved: 'မူပိုင်ခွင့်များ ရယူထားပြီး ဖြစ်ပါသည်။',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

// ─── Context ───────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key],
  toggleLanguage: () => {},
});

const STORAGE_KEY = '3sgate-lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === 'en' || stored === 'mm') {
        setLanguageState(stored);
      }
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => {
      const next = prev === 'en' ? 'mm' : 'en';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const dict = translations[language] as Record<string, string> | undefined;
    if (dict && dict[key]) return dict[key];
    const fallback = translations.en as Record<string, string>;
    return fallback[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
