// Marketplace catalogue: the kitchens customers can browse, their menus, plans
// and public reviews. This is shop inventory, shared by everyone, and it is the
// only thing that should live here.
//
// Anything belonging to a person -- their orders, addresses, subscriptions, or a
// kitchen's own stats, menu and documents -- is per-account and lives in
// src/lib/accountStore.js. Do not add that kind of seed data back to this file:
// it is what made every new account open onto somebody else's records.
// Central mock dataset for the whole app. Swap the api/* functions for real
// network calls later — every screen only ever imports from api/, not here.

export { AREA_NAMES as AREAS } from './config/locations.js'

export const CUISINE_TAGS = ['Gujarati', 'Kathiawadi', 'Punjabi', 'North Indian', 'South Indian', 'Rajasthani', 'Jain', 'Maharashtrian']

export const providers = [
  {
    id: 'p1', name: 'Ba Ni Rasoi', area: 'Alkapuri', pincode: '390007',
    lat: 22.3105, lng: 73.1732, radiusKm: 6,
    rating: 4.7, reviewCount: 84, priceRange: [90, 130], distance: 1.2,
    cuisineTags: ['Gujarati', 'Kathiawadi'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800'],
    tagline: 'Everyday Gujarati thali, rotli straight off the tawa',
    since: 2021, kitchenAddress: 'Near Jetalpur Road, Alkapuri',
  },
  {
    id: 'p2', name: 'Shreeji Tiffin Seva', area: 'Sayajigunj', pincode: '390005',
    lat: 22.3115, lng: 73.1836, radiusKm: 5,
    rating: 4.8, reviewCount: 126, priceRange: [85, 120], distance: 2.1,
    cuisineTags: ['Gujarati', 'Jain'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'],
    tagline: 'Jain-friendly thali, no onion no garlic, unlimited rotli',
    since: 2019, kitchenAddress: 'Opp. Sayaji Garden, Sayajigunj',
  },
  {
    id: 'p3', name: 'Kathiyawadi Chulo', area: 'Gotri', pincode: '390021',
    lat: 22.3162, lng: 73.1352, radiusKm: 7,
    rating: 4.6, reviewCount: 58, priceRange: [100, 150], distance: 3.4,
    cuisineTags: ['Kathiawadi', 'Gujarati'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800'],
    tagline: 'Sev tameta, bajri rotlo and white butter, the Saurashtra way',
    since: 2022, kitchenAddress: 'Gotri Main Road, near Sunpharma Circle',
  },
  {
    id: 'p4', name: 'Annapurna Ghar Nu Bhojan', area: 'Manjalpur', pincode: '390011',
    lat: 22.2731, lng: 73.1938, radiusKm: 5,
    rating: 4.5, reviewCount: 71, priceRange: [80, 115], distance: 2.8,
    cuisineTags: ['Gujarati', 'North Indian'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch'],
    photos: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
    tagline: 'Simple, low-oil home cooking for working days',
    since: 2020, kitchenAddress: 'Manjalpur Naka, near Water Tank',
  },
  {
    id: 'p5', name: 'Punjab Da Tiffin', area: 'Fatehgunj', pincode: '390002',
    lat: 22.3213, lng: 73.1869, radiusKm: 6,
    rating: 4.4, reviewCount: 43, priceRange: [110, 160], distance: 1.9,
    cuisineTags: ['Punjabi', 'North Indian'], dietType: 'both', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'],
    tagline: 'Dal makhani, rajma chawal and tandoori roti on request',
    since: 2021, kitchenAddress: 'Fatehgunj Main Road, near Circle',
  },
  {
    id: 'p6', name: 'Maa Amba Tiffin', area: 'Karelibaug', pincode: '390018',
    lat: 22.3255, lng: 73.2107, radiusKm: 5,
    rating: 4.6, reviewCount: 62, priceRange: [85, 125], distance: 3.1,
    cuisineTags: ['Gujarati'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'],
    tagline: 'Two sabzi, dal bhaat and chaas with every tiffin',
    since: 2018, kitchenAddress: 'Karelibaug, near VIP Road',
  },
  {
    id: 'p7', name: 'Satvik Jain Rasoi', area: 'Akota', pincode: '390020',
    lat: 22.2937, lng: 73.1701, radiusKm: 6,
    rating: 4.9, reviewCount: 97, priceRange: [95, 140], distance: 2.2,
    cuisineTags: ['Jain', 'Gujarati'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800'],
    tagline: 'Strictly Jain kitchen, no root vegetables, sunset delivery option',
    since: 2017, kitchenAddress: 'Akota Garden Road, Akota',
  },
  {
    id: 'p8', name: 'Dakshin Ruchi', area: 'Subhanpura', pincode: '390023',
    lat: 22.3283, lng: 73.1587, radiusKm: 7,
    rating: 4.5, reviewCount: 39, priceRange: [90, 130], distance: 3.8,
    cuisineTags: ['South Indian'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1630383249896-424e482df921?w=800', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
    tagline: 'Sambar, rasam, poriyal and rice, cooked by a Chennai family',
    since: 2022, kitchenAddress: 'Subhanpura, near Rajpath Club',
  },
  {
    id: 'p9', name: 'Sharda Tiffin Service', area: 'Nizampura', pincode: '390002',
    lat: 22.3388, lng: 73.1830, radiusKm: 5,
    rating: 4.3, reviewCount: 28, priceRange: [75, 110], distance: 4.2,
    cuisineTags: ['Gujarati', 'North Indian'], dietType: 'veg', verified: false,
    deliveryTime: ['lunch'],
    photos: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'],
    tagline: 'Budget student tiffin, delivered near the university',
    since: 2023, kitchenAddress: 'Nizampura, near Gujarat Refinery Road',
  },
  {
    id: 'p10', name: 'Rasoi Ghar Waghodia', area: 'Waghodia Road', pincode: '390019',
    lat: 22.3126, lng: 73.2371, radiusKm: 8,
    rating: 4.4, reviewCount: 34, priceRange: [85, 125], distance: 5.6,
    cuisineTags: ['Gujarati', 'Rajasthani'], dietType: 'veg', verified: true,
    deliveryTime: ['lunch', 'dinner'],
    photos: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800'],
    tagline: 'Gujarati and Marwari home food for the east-side estates',
    since: 2021, kitchenAddress: 'Waghodia Road, near Ajwa Crossing',
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





export const reviews = [
  { id: 'r1', providerId: 'p1', customerName: 'Ankit Sharma', rating: 5, comment: 'Tastes exactly like home food. The rajma chawal is my favorite!', date: '2026-08-20', photo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300' },
  { id: 'r2', providerId: 'p1', customerName: 'Priya Mehta', rating: 4, comment: 'Consistent quality, delivery is always on time.', date: '2026-08-15' },
  { id: 'r3', providerId: 'p1', customerName: 'Rohan Gupta', rating: 5, comment: 'Best tiffin service in Alkapuri, hands down.', date: '2026-08-10', photo: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300' },
  { id: 'r4', providerId: 'p2', customerName: 'Meera Shah', rating: 5, comment: 'Unlimited rotli and the kadhi is perfect. Highly recommend for Gujaratis staying away from home.', date: '2026-08-18' },
  { id: 'r5', providerId: 'p2', customerName: 'Kunal Desai', rating: 5, comment: 'Undhiyu on weekends is a treat!', date: '2026-08-12', photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'r6', providerId: 'p3', customerName: 'Lakshmi Iyer', rating: 4, comment: 'Good sambar, wish portions were a bit bigger.', date: '2026-08-14' },
  { id: 'r7', providerId: 'p5', customerName: 'Sanjana Patil', rating: 5, comment: 'Just like Aaicha jevan. Thank you!', date: '2026-08-11' },
  { id: 'r8', providerId: 'p8', customerName: 'Nikita Jain', rating: 5, comment: 'Genuinely Jain-friendly, no compromises. Very trustworthy.', date: '2026-08-09' },
]




