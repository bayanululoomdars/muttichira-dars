/**
 * DEMO SEED SCRIPT
 * Adds demo gallery items (images + videos), news, and admissions
 * Run: node seed_demo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  }
};

// ─── Models ───────────────────────────────────────────────────────────────────
const GalleryItem = require('./models/GalleryItem');
const News = require('./models/News');
const Admission = require('./models/Admission');

// ─── Demo Gallery Data ─────────────────────────────────────────────────────────
const galleryItems = [
  {
    title: 'Annual Day Celebration 2025',
    category: 'Programme',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    description: 'Students and teachers celebrating the annual day with great enthusiasm.',
    hashtags: ['annualday', 'celebration', 'bayanul']
  },
  {
    title: 'Quran Recitation Competition',
    category: 'Programme',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800&q=80',
    description: 'Inter-class Quran recitation competition held at the masjid hall.',
    hashtags: ['quran', 'competition', 'islamic']
  },
  {
    title: 'New Classroom Inauguration',
    category: 'Collections',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    description: 'Inauguration of the newly constructed classroom block at Bayanul Uloom Dars.',
    hashtags: ['classroom', 'inauguration', 'newbuilding']
  },
  {
    title: 'Students Library Section',
    category: 'Collections',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    description: 'Our well-stocked Islamic library available to all students.',
    hashtags: ['library', 'books', 'islamic']
  },
  {
    title: 'Friday Bayan 2025',
    category: 'Programme',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1567604099997-fb7cefb30f1b?w=800&q=80',
    description: 'Weekly Friday Bayan program conducted by Sheikhuna Ibrahim Baqavi.',
    hashtags: ['fridaybayan', 'sheikhuna', 'programme']
  },
  {
    title: 'Islamic Calligraphy Design',
    category: 'Design',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    description: 'Beautiful Islamic calligraphy created by students of the design department.',
    hashtags: ['calligraphy', 'design', 'art']
  },
  {
    title: 'Campus Walk Tour',
    category: 'Programme',
    mediaType: 'video',
    imageUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A walk-through video tour of our Bayanul Uloom Dars campus.',
    hashtags: ['campus', 'tour', 'video']
  },
  {
    title: 'Graduation Ceremony Highlights',
    category: 'Programme',
    mediaType: 'video',
    imageUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    description: 'Highlights from the graduation ceremony of batch 2024-25.',
    hashtags: ['graduation', 'ceremony', 'highlights']
  }
];

// ─── Demo News Data ────────────────────────────────────────────────────────────
const newsItems = [
  {
    title: 'Admissions Now Open for 2025–2026 Academic Year',
    description: 'Bayanul Uloom Dars, Muttichira is pleased to announce that admissions are now open for the academic year 2025–2026. Students wishing to enroll in our traditional Islamic education program (Dars) can now submit their applications online. The dars follows a comprehensive curriculum covering Quran, Hadith, Fiqh, and Arabic language. Seats are limited — apply early to secure your place. For enquiries, contact us at 9526919218.',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80'
  },
  {
    title: 'Annual Isthifadah Workshop Conducted Successfully',
    description: 'The annual Isthifadah Workshop was successfully conducted at Shuhada Masjid Muttichira. The event brought together scholars, ustads, and students for a day of learning and spiritual reflection. Key topics discussed included contemporary challenges facing Islamic education, effective teaching methods, and student welfare. The program was well-attended by parents, students, and members of the public.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80'
  },
  {
    title: 'New Library Books Donated by Alumni',
    description: 'The Bayanul Uloom Dars library has received a generous donation of over 200 Islamic books from our alumni network. The collection includes rare classical texts in Arabic, Urdu, and Malayalam covering various Islamic sciences. The library is now open to students during all study hours. Alumni interested in donating additional books can contact the administration.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
  },
  {
    title: 'Quran Memorization Achievement: 12 Students Complete Hifz',
    description: 'With the grace of Allah, 12 students of Bayanul Uloom Dars have successfully completed the memorization of the entire Holy Quran (Hifz). A special ceremony was held to honor these students in the presence of Sheikhuna Ibrahim Baqavi Al Haithami and their families. We congratulate all the students and their parents for this remarkable achievement.',
    imageUrl: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800&q=80'
  },
  {
    title: 'Friday Bayan Series – July 2025 Schedule',
    description: 'The monthly schedule for our Friday Bayan program is now available. Every Friday after Jumah prayer, our respected Sheikhuna Ibrahim Baqavi will deliver an enlightening talk on various topics of Islamic jurisprudence and spirituality. The series for July will focus on "Strengthening Family Bonds in the Light of Islam." All community members are warmly invited to attend.',
    imageUrl: 'https://images.unsplash.com/photo-1567604099997-fb7cefb30f1b?w=800&q=80'
  }
];

// ─── Demo Admissions ────────────────────────────────────────────────────────────
const admissions = [
  {
    name: 'Muhammad Rashid',
    fatherName: 'Abdul Kareem',
    motherName: 'Fathima Beevi',
    phone: '9876543210',
    email: 'rashid@example.com',
    houseName: 'Kareem Manzil',
    homePhone: '04933-223344',
    place: 'Muttichira',
    postOffice: 'Thalappara',
    district: 'Malappuram',
    pincode: '676311',
    dob: '2012-03-15',
    bloodGroup: 'B+',
    educationReligious: 'Passed Ibtidai from Noor Madrasa',
    educationSecular: 'Class 7, GHSS Muttichira',
    guardianName: 'Abdul Kareem',
    relationship: 'Father',
    guardianPhone: '9876543210',
    imageUrl: 'https://randomuser.me/api/portraits/boys/11.jpg'
  },
  {
    name: 'Ibrahim Siddiq',
    fatherName: 'Noushad Ali',
    motherName: 'Ayisha Banu',
    phone: '8765432109',
    email: 'ibrahim@example.com',
    houseName: 'Al Noor Villa',
    homePhone: '04933-334455',
    place: 'Wandoor',
    postOffice: 'Wandoor',
    district: 'Malappuram',
    pincode: '679328',
    dob: '2011-08-22',
    bloodGroup: 'O+',
    educationReligious: 'Completed Thanawi at Darul Uloom',
    educationSecular: 'Class 8, Govt. High School Wandoor',
    guardianName: 'Noushad Ali',
    relationship: 'Father',
    guardianPhone: '8765432109',
    imageUrl: 'https://randomuser.me/api/portraits/boys/12.jpg'
  },
  {
    name: 'Yusuf Fahad',
    fatherName: 'Muhammed Shafi',
    motherName: 'Zainab Fathima',
    phone: '7654321098',
    email: 'yusuf@example.com',
    houseName: 'Shafi House',
    homePhone: '04931-123456',
    place: 'Perinthalmanna',
    postOffice: 'Perinthalmanna',
    district: 'Malappuram',
    pincode: '679322',
    dob: '2013-01-10',
    bloodGroup: 'A+',
    educationReligious: 'Ibtidai level completed',
    educationSecular: 'Class 6, MHSS Perinthalmanna',
    guardianName: 'Muhammed Shafi',
    relationship: 'Father',
    guardianPhone: '7654321098',
    imageUrl: 'https://randomuser.me/api/portraits/boys/13.jpg'
  },
  {
    name: 'Hamdan Abdul Aziz',
    fatherName: 'Abdul Aziz',
    motherName: 'Mariyam Kunhi',
    phone: '6543210987',
    email: 'hamdan@example.com',
    houseName: 'Aziz Cottage',
    homePhone: '',
    place: 'Tirur',
    postOffice: 'Tirur',
    district: 'Malappuram',
    pincode: '676101',
    dob: '2012-11-05',
    bloodGroup: 'AB+',
    educationReligious: 'Studying at Jamia',
    educationSecular: 'Class 7, NSS School Tirur',
    guardianName: 'Abdul Aziz',
    relationship: 'Father',
    guardianPhone: '6543210987',
    imageUrl: ''
  },
  {
    name: 'Salman Farooq',
    fatherName: 'Farooq Umar',
    motherName: 'Hafsa Beevi',
    phone: '5432109876',
    email: '',
    houseName: 'Farooq Nivas',
    homePhone: '04923-445566',
    place: 'Kondotty',
    postOffice: 'Kondotty',
    district: 'Malappuram',
    pincode: '673638',
    dob: '2014-06-18',
    bloodGroup: 'O-',
    educationReligious: 'Beginner level',
    educationSecular: 'Class 5, GHSS Kondotty',
    guardianName: 'Hafsa Beevi',
    relationship: 'Mother',
    guardianPhone: '5432109876',
    imageUrl: ''
  }
];

// ─── Main Seed Function ────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  console.log('\n🌱 Seeding demo data...\n');

  // ── Gallery ──
  let galleryAdded = 0;
  for (const item of galleryItems) {
    try {
      const g = new GalleryItem(item);
      await g.save();
      galleryAdded++;
      console.log(`  📸 Gallery: "${item.title}" [${item.mediaType}]`);
    } catch (e) {
      console.log(`  ⚠️  Gallery skip: ${item.title} - ${e.message}`);
    }
  }

  // ── News ──
  let newsAdded = 0;
  for (const item of newsItems) {
    try {
      const n = new News(item);
      await n.save();
      newsAdded++;
      console.log(`  📰 News: "${item.title}"`);
    } catch (e) {
      console.log(`  ⚠️  News skip: ${item.title} - ${e.message}`);
    }
  }

  // ── Admissions ──
  let admissionsAdded = 0;
  for (const item of admissions) {
    try {
      const a = new Admission(item);
      await a.save();
      admissionsAdded++;
      console.log(`  🎓 Admission: "${item.name}" (${item.phone})`);
    } catch (e) {
      console.log(`  ⚠️  Admission skip: ${item.name} - ${e.message}`);
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Gallery items added: ${galleryAdded}/${galleryItems.length}`);
  console.log(`   News added: ${newsAdded}/${newsItems.length}`);
  console.log(`   Admissions added: ${admissionsAdded}/${admissions.length}`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
