// Central mock dataset for the whole app. Swap the api/* functions for real
// network calls later — every screen only ever imports from api/, not here.

export const AREAS = [
  'Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Andheri West',
  'Bandra', 'Powai', 'Baner', 'Kothrud', 'Gachibowli',
]

export const CUISINE_TAGS = ['Gujarati', 'Punjabi', 'South Indian', 'Maharashtrian', 'Rajasthani', 'Bengali', 'North Indian', 'Jain']

export const providers = [
  {
    id: 'p1', name: 'Maa Ka Swaad Tiffins', area: 'Koramangala', pincode: '560034',
    rating: 4.7, reviewCount: 214, priceRange: [110, 160], distance: 1.2,
    cuisineTags: ['Punjabi', 'North Indian'], dietType: 'both', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800'],
    tagline: 'Punjabi home food, just like ghar ka khana',
    since: 2019, kitchenAddress: 'BTM 2nd Stage, Koramangala',
  },
  {
    id: 'p2', name: 'Shree Gujarati Rasoi', area: 'HSR Layout', pincode: '560102',
    rating: 4.9, reviewCount: 342, priceRange: [100, 150], distance: 2.4,
    cuisineTags: ['Gujarati', 'Jain'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'],
    tagline: 'Authentic Gujarati thali with unlimited rotli',
    since: 2017, kitchenAddress: 'Sector 2, HSR Layout',
  },
  {
    id: 'p3', name: 'Anna Poorna Meals', area: 'Indiranagar', pincode: '560038',
    rating: 4.5, reviewCount: 178, priceRange: [90, 140], distance: 0.8,
    cuisineTags: ['South Indian'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch'],
    photos: ['https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800'],
    tagline: 'Traditional South Indian meals on banana leaf style plates',
    since: 2020, kitchenAddress: '100ft Road, Indiranagar',
  },
  {
    id: 'p4', name: 'Punjabi Dhaba Tiffin', area: 'Whitefield', pincode: '560066',
    rating: 4.3, reviewCount: 96, priceRange: [130, 190], distance: 3.6,
    cuisineTags: ['Punjabi', 'North Indian'], dietType: 'both', verified: false,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800'],
    tagline: 'Butter-loaded dhaba style food, home delivered',
    since: 2022, kitchenAddress: 'ITPL Main Road, Whitefield',
  },
  {
    id: 'p5', name: "Aai's Kitchen", area: 'Powai', pincode: '400076',
    rating: 4.8, reviewCount: 401, priceRange: [120, 170], distance: 1.9,
    cuisineTags: ['Maharashtrian'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'],
    tagline: 'Simple Maharashtrian ghar ka jevan, made with love',
    since: 2015, kitchenAddress: 'Hiranandani Gardens, Powai',
  },
  {
    id: 'p6', name: 'Rajwadi Rasoi', area: 'Bandra', pincode: '400050',
    rating: 4.6, reviewCount: 152, priceRange: [140, 200], distance: 2.1,
    cuisineTags: ['Rajasthani'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800'],
    tagline: 'Royal Rajasthani thali, dal baati on weekends',
    since: 2018, kitchenAddress: 'Linking Road, Bandra West',
  },
  {
    id: 'p7', name: 'Kolkata Bhog', area: 'Andheri West', pincode: '400058',
    rating: 4.4, reviewCount: 88, priceRange: [130, 180], distance: 4.2,
    cuisineTags: ['Bengali'], dietType: 'both', verified: true,
    deliveryTime: ['dinner'],
    photos: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
    tagline: 'Fish curry, machher jhol & more — straight from Kolkata',
    since: 2021, kitchenAddress: 'Versova, Andheri West',
  },
  {
    id: 'p8', name: 'Jain Bhojanalay', area: 'Baner', pincode: '411045',
    rating: 4.9, reviewCount: 267, priceRange: [110, 150], distance: 1.5,
    cuisineTags: ['Jain', 'Gujarati'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800'],
    tagline: '100% Jain — no onion, no garlic, no root vegetables',
    since: 2016, kitchenAddress: 'Baner Road, Pune',
  },
  {
    id: 'p9', name: 'Southern Spice Tiffins', area: 'Gachibowli', pincode: '500032',
    rating: 4.2, reviewCount: 64, priceRange: [90, 130], distance: 2.8,
    cuisineTags: ['South Indian'], dietType: 'both', verified: false,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800'],
    tagline: 'Andhra style meals with extra spice on request',
    since: 2023, kitchenAddress: 'DLF Cyber City, Gachibowli',
  },
  {
    id: 'p10', name: 'Kothrud Ghar Bhojan', area: 'Kothrud', pincode: '411038',
    rating: 4.6, reviewCount: 133, priceRange: [100, 145], distance: 0.6,
    cuisineTags: ['Maharashtrian', 'North Indian'], dietType: 'both', verified: true,
    deliveryTime: ['lunch'],
    photos: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800'],
    tagline: 'Fresh, mild, and home-cooked — delivered hot',
    since: 2020, kitchenAddress: 'Paud Road, Kothrud',
  },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function buildWeeklyMenu(seed) {
  const menu = {}
  DAYS.forEach((day, i) => {
    menu[day] = {
      lunch: seed.lunch[i % seed.lunch.length],
      dinner: seed.dinner[i % seed.dinner.length],
    }
  })
  return menu
}

export const menus = {
  p1: buildWeeklyMenu({
    lunch: [
      { items: ['Rajma', 'Jeera Rice', 'Roti (4)', 'Salad', 'Pickle'], veg: true, calories: 620 },
      { items: ['Kadhi Pakora', 'Steamed Rice', 'Roti (4)', 'Papad'], veg: true, calories: 580 },
      { items: ['Chole', 'Bhature (2)', 'Onion Salad'], veg: true, calories: 710 },
    ],
    dinner: [
      { items: ['Paneer Butter Masala', 'Roti (3)', 'Dal Fry', 'Rice'], veg: true, calories: 690 },
      { items: ['Mix Veg', 'Roti (3)', 'Curd', 'Rice'], veg: true, calories: 560 },
    ],
  }),
  p2: buildWeeklyMenu({
    lunch: [
      { items: ['Gujarati Kadhi', 'Rotli (4)', 'Sev Tameta Sabzi', 'Rice', 'Khichdi'], veg: true, calories: 610 },
      { items: ['Dal Dhokli', 'Bhindi Sabzi', 'Rotli (4)', 'Chaas'], veg: true, calories: 640 },
    ],
    dinner: [
      { items: ['Undhiyu', 'Puri (3)', 'Rice', 'Shrikhand'], veg: true, calories: 720 },
      { items: ['Aloo Tamatar', 'Rotli (4)', 'Khichdi', 'Chaas'], veg: true, calories: 590 },
    ],
  }),
  p3: buildWeeklyMenu({
    lunch: [
      { items: ['Sambar', 'Rice', 'Poriyal', 'Rasam', 'Papad'], veg: true, calories: 540 },
      { items: ['Curd Rice', 'Lemon Rice', 'Vada (2)'], veg: true, calories: 520 },
    ],
    dinner: [
      { items: ['Idli (4)', 'Sambar', 'Coconut Chutney'], veg: true, calories: 420 },
    ],
  }),
  p4: buildWeeklyMenu({
    lunch: [
      { items: ['Dal Makhani', 'Butter Naan (2)', 'Jeera Rice', 'Salad'], veg: true, calories: 780 },
      { items: ['Chicken Curry', 'Tandoori Roti (3)', 'Rice'], veg: false, calories: 820 },
    ],
    dinner: [
      { items: ['Kadhai Paneer', 'Roti (3)', 'Rice', 'Salad'], veg: true, calories: 700 },
      { items: ['Butter Chicken', 'Naan (2)', 'Rice'], veg: false, calories: 850 },
    ],
  }),
  p5: buildWeeklyMenu({
    lunch: [
      { items: ['Varan Bhaat', 'Bhaji', 'Chapati (3)', 'Koshimbir'], veg: true, calories: 560 },
      { items: ['Puran Poli', 'Amti', 'Rice'], veg: true, calories: 650 },
    ],
    dinner: [
      { items: ['Pithla Bhakri', 'Thecha', 'Rice'], veg: true, calories: 520 },
    ],
  }),
  p6: buildWeeklyMenu({
    lunch: [
      { items: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Rice'], veg: true, calories: 800 },
      { items: ['Ker Sangri', 'Bajra Roti (3)', 'Chaas'], veg: true, calories: 610 },
    ],
    dinner: [
      { items: ['Gatte ki Sabzi', 'Roti (3)', 'Rice', 'Papad'], veg: true, calories: 600 },
    ],
  }),
  p7: buildWeeklyMenu({
    lunch: [
      { items: ['Machher Jhol', 'Rice', 'Aloo Bhaja'], veg: false, calories: 640 },
      { items: ['Chingri Malai Curry', 'Rice'], veg: false, calories: 700 },
    ],
    dinner: [
      { items: ['Aloo Posto', 'Rice', 'Dal'], veg: true, calories: 540 },
    ],
  }),
  p8: buildWeeklyMenu({
    lunch: [
      { items: ['Jain Dal', 'Rotli (4)', 'Sev Bhaji (no onion garlic)', 'Rice'], veg: true, calories: 580 },
    ],
    dinner: [
      { items: ['Jain Kadhi', 'Khichdi', 'Rotli (3)'], veg: true, calories: 540 },
    ],
  }),
  p9: buildWeeklyMenu({
    lunch: [
      { items: ['Gongura Pachadi', 'Rice', 'Sambar', 'Papad'], veg: true, calories: 560 },
      { items: ['Chicken Curry Andhra style', 'Rice'], veg: false, calories: 720 },
    ],
    dinner: [
      { items: ['Pesarattu', 'Chutney', 'Sambar'], veg: true, calories: 450 },
    ],
  }),
  p10: buildWeeklyMenu({
    lunch: [
      { items: ['Bhaji Chapati', 'Varan Bhaat', 'Koshimbir'], veg: true, calories: 570 },
    ],
    dinner: [
      { items: ['Matki Usal', 'Bhakri', 'Rice'], veg: true, calories: 520 },
    ],
  }),
}

export function makePlansFor(providerId) {
  const base = providers.find(p => p.id === providerId)?.priceRange?.[0] ?? 100
  return [
    { id: `${providerId}-daily`, type: 'One-Time', duration: '1 day', price: base + 30, mealsPerDay: 1, description: 'Try before you subscribe' },
    { id: `${providerId}-weekly`, type: 'Weekly', duration: '7 days', price: (base + 10) * 7, mealsPerDay: 1, description: '7 lunches or dinners, cancel anytime', popular: true },
    { id: `${providerId}-monthly`, type: 'Monthly', duration: '26 days', price: base * 26, mealsPerDay: 1, description: 'Best value, skip up to 4 days/month' },
    { id: `${providerId}-monthly-2meal`, type: 'Monthly (2 meals)', duration: '26 days', price: (base * 2 - 10) * 26, mealsPerDay: 2, description: 'Lunch + Dinner every day' },
  ]
}

export const subscriptionPlans = providers.reduce((acc, p) => {
  acc[p.id] = makePlansFor(p.id)
  return acc
}, {})

export const savedAddresses = [
  { id: 'a1', label: 'Home', line: '204, Sunrise Apartments, 5th Cross', area: 'Koramangala', pincode: '560034', isDefault: true },
  { id: 'a2', label: 'Work', line: 'WeWork, 3rd Floor, Prestige Tech Park', area: 'HSR Layout', pincode: '560102', isDefault: false },
]

export const paymentMethods = [
  { id: 'pm1', type: 'UPI', label: 'vraj@okhdfcbank', isDefault: true },
  { id: 'pm2', type: 'Card', label: 'Visa •••• 4821', isDefault: false },
  { id: 'pm3', type: 'Wallet', label: 'Tiffinly Wallet', balance: 340, isDefault: false },
]

export const orders = [
  { id: 'ORD1001', providerId: 'p1', providerName: 'Maa Ka Swaad Tiffins', date: '2026-08-27', meal: 'lunch', status: 'out_for_delivery', items: ['Rajma', 'Jeera Rice', 'Roti (4)'], amount: 140 },
  { id: 'ORD1002', providerId: 'p2', providerName: 'Shree Gujarati Rasoi', date: '2026-08-27', meal: 'dinner', status: 'upcoming', items: ['Undhiyu', 'Puri (3)', 'Rice'], amount: 150 },
  { id: 'ORD0998', providerId: 'p1', providerName: 'Maa Ka Swaad Tiffins', date: '2026-08-26', meal: 'lunch', status: 'delivered', items: ['Kadhi Pakora', 'Steamed Rice'], amount: 130 },
  { id: 'ORD0991', providerId: 'p3', providerName: 'Anna Poorna Meals', date: '2026-08-25', meal: 'lunch', status: 'delivered', items: ['Sambar', 'Rice', 'Poriyal'], amount: 110 },
  { id: 'ORD0980', providerId: 'p1', providerName: 'Maa Ka Swaad Tiffins', date: '2026-08-24', meal: 'lunch', status: 'skipped', items: ['Chole', 'Bhature (2)'], amount: 0 },
  { id: 'ORD0972', providerId: 'p5', providerName: "Aai's Kitchen", date: '2026-08-22', meal: 'dinner', status: 'delivered', items: ['Pithla Bhakri', 'Thecha'], amount: 120 },
]

export const subscriptions = [
  {
    id: 'SUB01', providerId: 'p1', providerName: 'Maa Ka Swaad Tiffins', planType: 'Monthly', meal: 'lunch',
    startDate: '2026-08-01', endDate: '2026-08-26', daysLeft: 5, status: 'active',
    skippedDates: ['2026-08-24'], pausedUntil: null,
  },
  {
    id: 'SUB02', providerId: 'p2', providerName: 'Shree Gujarati Rasoi', planType: 'Weekly', meal: 'dinner',
    startDate: '2026-08-21', endDate: '2026-08-27', daysLeft: 0, status: 'expiring',
    skippedDates: [], pausedUntil: null,
  },
]

export const reviews = [
  { id: 'r1', providerId: 'p1', customerName: 'Ankit Sharma', rating: 5, comment: 'Tastes exactly like home food. The rajma chawal is my favorite!', date: '2026-08-20', photo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300' },
  { id: 'r2', providerId: 'p1', customerName: 'Priya Mehta', rating: 4, comment: 'Consistent quality, delivery is always on time.', date: '2026-08-15' },
  { id: 'r3', providerId: 'p1', customerName: 'Rohan Gupta', rating: 5, comment: 'Best tiffin service in Koramangala, hands down.', date: '2026-08-10', photo: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300' },
  { id: 'r4', providerId: 'p2', customerName: 'Meera Shah', rating: 5, comment: 'Unlimited rotli and the kadhi is perfect. Highly recommend for Gujaratis staying away from home.', date: '2026-08-18' },
  { id: 'r5', providerId: 'p2', customerName: 'Kunal Desai', rating: 5, comment: 'Undhiyu on weekends is a treat!', date: '2026-08-12', photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'r6', providerId: 'p3', customerName: 'Lakshmi Iyer', rating: 4, comment: 'Good sambar, wish portions were a bit bigger.', date: '2026-08-14' },
  { id: 'r7', providerId: 'p5', customerName: 'Sanjana Patil', rating: 5, comment: 'Just like Aaicha jevan. Thank you!', date: '2026-08-11' },
  { id: 'r8', providerId: 'p8', customerName: 'Nikita Jain', rating: 5, comment: 'Genuinely Jain-friendly, no compromises. Very trustworthy.', date: '2026-08-09' },
]

export const providerStats = {
  todayOrders: 42,
  todayRevenue: 5320,
  weekRevenue: [3200, 4100, 3800, 4600, 5000, 5320, 4700],
  weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  activeSubscribers: 118,
  avgRating: 4.7,
  monthRevenue: 128400,
  monthOrders: 980,
}

export const providerOrders = [
  { id: 'PORD01', customerName: 'Ankit Sharma', address: 'BTM Layout, 2nd Stage, near Water Tank', meal: 'lunch', items: ['Rajma', 'Jeera Rice', 'Roti (4)'], instructions: 'Less spicy please', status: 'preparing' },
  { id: 'PORD02', customerName: 'Priya Mehta', address: '5th Block, Koramangala', meal: 'lunch', items: ['Rajma', 'Jeera Rice'], instructions: '', status: 'pending' },
  { id: 'PORD03', customerName: 'Rohan Gupta', address: 'Sony World Signal, Koramangala', meal: 'lunch', items: ['Kadhi Pakora', 'Rice'], instructions: 'Extra papad', status: 'out_for_delivery' },
  { id: 'PORD04', customerName: 'Divya Nair', address: 'Forum Mall Road, Koramangala', meal: 'dinner', items: ['Paneer Butter Masala', 'Roti (3)'], instructions: '', status: 'delivered' },
  { id: 'PORD05', customerName: 'Karthik R', address: 'Jyoti Nivas College Road', meal: 'dinner', items: ['Mix Veg', 'Roti (3)', 'Rice'], instructions: 'No onion', status: 'pending' },
]

export const holidays = [
  { date: '2026-08-30', note: 'Ganesh Chaturthi — kitchen closed' },
  { date: '2026-09-05', note: 'Family function, no deliveries' },
]

export const verificationDocs = [
  { id: 'doc1', name: 'FSSAI License', status: 'verified' },
  { id: 'doc2', name: 'Kitchen Photos', status: 'verified' },
  { id: 'doc3', name: 'Owner ID Proof', status: 'pending' },
]
