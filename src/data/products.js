import dealShampoo from '../assets/images/deal-shampoo.jpg';
import headphones from '../assets/images/headphones.jpg';
import heroProducts from '../assets/images/hero-products.jpg';
import review1 from '../assets/images/review-1.jpg';
import review2 from '../assets/images/review-2.jpg';
import review3 from '../assets/images/review-3.jpg';
import serum from '../assets/images/serum.jpg';
import shampoo from '../assets/images/shampoo.jpg';
import vase from '../assets/images/vase.jpg';

export const categories = [
  { slug: 'beauty-personal-care', name: 'Beauty & personal care' },
  { slug: 'home-living', name: 'Home & living' },
  { slug: 'electronics', name: 'Electronics' },
  { slug: 'fashion-accessories', name: 'Fashion & accessories' },
  { slug: 'health-wellness', name: 'Health & wellness' },
  { slug: 'baby-kids', name: 'Baby & kids' },
  { slug: 'sports-outdoors', name: 'Sports & outdoors' },
  { slug: 'grocery-essentials', name: 'Grocery & essentials' },
];

export const heroSlides = [
  {
    eyebrow: 'The winter edit',
    title: 'Little luxuries.\nLovely prices.',
    subtitle: 'Thoughtful finds for your everyday, now with a little more to love.',
    image: heroProducts,
  },
  {
    eyebrow: 'Fresh picks',
    title: 'Everyday upgrades\nfor brighter days.',
    subtitle: 'Warm textures, tidy essentials, and smart favourites for home and self-care.',
    image: shampoo,
  },
  {
    eyebrow: 'New season deal',
    title: 'A little more joy\nin every cart.',
    subtitle: 'Curated style and care picks designed to make your routine feel better.',
    image: headphones,
  },
];

export const productReviews = [
  {
    image: review1,
    quote: 'My new wash-day favourite.',
    author: 'Nadia',
    product: 'Botanic herbal repair',
  },
  {
    image: review2,
    quote: 'Great sound. Even better value.',
    author: 'Araf',
    product: 'Sonora wireless headphones',
  },
  {
    image: review3,
    quote: 'My evening ritual, upgraded.',
    author: 'Maya',
    product: 'Pure daily glow serum',
  },
];

const productBase = {
  categoryLabel: 'Beauty & personal care',
  subCategory: 'Haircare',
  brand: 'Botanic',
  inStock: true,
  stockLeft: 3,
  stockNote: 'In stock, ready to ship',
  sizes: ['300 ml', '500 ml', '750 ml'],
  details: {
    Size: '300 ml',
    'Hair type': 'Dry, damaged & colour-treated',
    'Key ingredients': 'Aloe vera, rosemary, oat milk, rice water',
    Scent: 'Citrus-herbal',
    'Made in': 'Bangladesh',
  },
  delivery: {
    eta: '2–4 working days',
    note: 'Free delivery on orders over ৳ 2,000. Easy 7-day returns.',
  },
};

export const products = [
  {
    ...productBase,
    id: 'botanic-herbal-repair-shampoo',
    slug: 'botanic-herbal-repair-shampoo',
    name: 'Botanic herbal repair shampoo',
    brand: 'Botanic',
    category: 'beauty-personal-care',
    categoryLabel: 'Beauty & personal care',
    subCategory: 'Haircare',
    tagline: 'A little care. A healthier hair day.',
    subtitle: 'Herbal Repair Shampoo · 300 ml',
    price: 690,
    oldPrice: 990,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 124,
    shortDescription: 'A gentle, botanical cleanse that leaves hair soft, glossy and beautifully manageable with a lightweight finish that feels fresh and clean.',
    image: shampoo,
    thumbnail: dealShampoo,
    thumbnailAlt: 'Botanic herbal repair shampoo',
    images: [shampoo, dealShampoo, shampoo, serum],
    highlights: [
      {
        title: 'A fresh start for your hair',
        text: 'This nourishing cleanse lifts away buildup without stripping moisture, leaving your strands smoother, softer and easier to style.',
      },
      {
        title: 'How to use',
        text: 'Apply to wet hair, massage through the scalp and lengths, then rinse thoroughly. Follow with the conditioner pair for a softer finish.',
      },
    ],
    howToUse: [
      'Wet your hair thoroughly before applying a small amount of shampoo.',
      'Work into a rich lather through the scalp and lengths, then rinse completely.',
      'Use 2–3 times per week for the best balance of softness and scalp freshness.',
    ],
    details: {
      Size: '300 ml',
      'Hair type': 'Dry, damaged & colour-treated',
      'Key ingredients': 'Aloe vera, rosemary, oat milk, rice water',
      Scent: 'Citrus-herbal',
      'Made in': 'Bangladesh',
    },
    delivery: {
      eta: '2–4 working days',
      note: 'Free delivery on orders over ৳ 2,000. Easy 7-day returns.',
    },
    reviews: [
      { name: 'Nadia H.', title: 'Beautifully soft hair', text: 'I have dry ends and this shampoo made my hair feel lighter and softer after just a few washes. The scent is fresh without being overpowering.', rating: 5, date: '2 days ago' },
      { name: 'Sadia R.', title: 'A new favourite', text: 'My scalp feels cleaner and my hair doesn’t get tangled as much anymore. It rinses well and the bottle lasts a long time.', rating: 5, date: '1 week ago' },
      { name: 'Rafi M.', title: 'Worth it', text: 'Gentle enough for my colour-treated hair and leaves that glossy finish I was missing. It feels a little luxurious without the cost.', rating: 4, date: '2 weeks ago' },
      { name: 'Moumita K.', title: 'Super gentle', text: 'Very easy to use and my hair feels hydrated instead of squeaky clean. I paired it with the conditioner and it worked beautifully.', rating: 5, date: '3 weeks ago' },
    ],
    relatedIds: ['pure-daily-glow-serum', 'everyday-ceramic-vase', 'sonora-wireless-headphones'],
    current: 690,
    old: 990,
    badge: 30,
    description: 'A gentle botanical cleanse that leaves hair soft, glossy and beautifully manageable.',
  },
  {
    id: 'pure-daily-glow-serum',
    slug: 'pure-daily-glow-serum',
    name: 'Pure daily glow serum',
    brand: 'Pure',
    category: 'beauty-personal-care',
    categoryLabel: 'Beauty & personal care',
    subCategory: 'Skincare',
    tagline: 'A little glow. A brighter everyday.',
    subtitle: 'Daily Glow Serum · 30 ml',
    price: 1250,
    oldPrice: 1550,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 98,
    shortDescription: 'A lightweight serum powered by hydration-loving botanicals that leave skin dewy, smooth and ready for the day ahead.',
    image: serum,
    thumbnail: serum,
    images: [serum, shampoo, dealShampoo, headphones],
    highlights: [
      {
        title: 'Hydration that lasts',
        text: 'Plumps the skin with a cushion of moisture while helping fine lines feel smoother and less visible over time.',
      },
      {
        title: 'Fast, fresh finish',
        text: 'The silky texture sinks in quickly and gives a healthy, natural glow without heaviness or residue.',
      },
    ],
    howToUse: [
      'Apply 2–3 drops on freshly cleansed skin before moisturiser or sunscreen.',
      'Press gently into the face and neck using upward motions.',
      'Use morning and night for visible hydration and a more luminous finish.',
    ],
    details: {
      Size: '30 ml',
      'Hair type': 'All skin types',
      'Key ingredients': 'Niacinamide, hyaluronic acid, vitamin E',
      Scent: 'Soft green tea',
      'Made in': 'South Korea',
    },
    delivery: {
      eta: '2–5 working days',
      note: 'Free delivery on orders over ৳ 2,000. Easy 7-day returns.',
    },
    reviews: [
      { name: 'Misha N.', title: 'My skin looks brighter', text: 'It wears well under makeup and feels light on the skin. My complexion looks more awake and dewy.', rating: 5, date: '3 days ago' },
      { name: 'Ayesha T.', title: 'Best serum I’ve tried', text: 'I’ve been using it for three weeks and my skin looks smoother even without foundation. Great texture and finish.', rating: 5, date: '1 week ago' },
      { name: 'Tanvir A.', title: 'Soft glow without grease', text: 'It hydrates without feeling sticky. It works well with my sunscreen and I love the fresh scent.', rating: 4, date: '2 weeks ago' },
    ],
    relatedIds: ['botanic-herbal-repair-shampoo', 'everyday-ceramic-vase', 'sonora-wireless-headphones'],
    current: 1250,
    old: 1550,
    badge: 25,
    description: 'A lightweight dew-boosting serum with skin-loving hydration and a fresh, healthy finish.',
    inStock: true,
    stockLeft: 5,
    stockNote: 'In stock, ready to ship',
    sizes: ['30 ml', '50 ml'],
  },
  {
    id: 'sonora-wireless-headphones',
    slug: 'sonora-wireless-headphones',
    name: 'Sonora wireless headphones',
    brand: 'Sonora',
    category: 'electronics',
    categoryLabel: 'Electronics',
    subCategory: 'Audio',
    tagline: 'A little sound. A bigger mood.',
    subtitle: 'Wireless Headphones · Black',
    price: 3490,
    oldPrice: 4990,
    discountPercent: 30,
    rating: 4.7,
    reviewCount: 310,
    shortDescription: 'Comfort-fit wireless sound with deep bass, all-day battery life and a sleek silhouette that stays easy on the ears.',
    image: headphones,
    thumbnail: headphones,
    images: [headphones, shampoo, serum, vase],
    highlights: [
      {
        title: 'All-day comfort',
        text: 'The soft cushioned fit makes it easy to wear through workdays, commutes and long-focus sessions without pressure.',
      },
      {
        title: 'Rich, balanced sound',
        text: 'Enjoy clear vocals, warm bass and just enough punch to make playlists, podcasts and calls feel full and immersive.',
      },
    ],
    howToUse: [
      'Charge fully before first use using the included USB-C cable.',
      'Connect through Bluetooth and press play on your preferred audio source.',
      'Use the fold-flat finish and quick controls to switch scenes and calls on the go.',
    ],
    details: {
      Size: 'One size',
      'Hair type': 'N/A',
      'Key ingredients': 'Bluetooth 5.3, 40-hour battery',
      Scent: 'None',
      'Made in': 'China',
    },
    delivery: {
      eta: '3–5 working days',
      note: 'Free delivery on orders over ৳ 2,000. Easy 7-day returns.',
    },
    reviews: [
      { name: 'Sazzad I.', title: 'Excellent sound for the price', text: 'The bass is rich and the headphones are really comfortable for long sessions. It feels premium without overdoing it.', rating: 5, date: '4 days ago' },
      { name: 'Amina S.', title: 'Clean design', text: 'It pairs quickly and the sound is crisp for music and podcasts. I also like how compact it folds away for travel.', rating: 4, date: '1 week ago' },
      { name: 'Imran P.', title: 'Solid battery life', text: 'I wore these for a whole week without recharging and the sound stayed consistent. Very happy with the purchase.', rating: 5, date: '2 weeks ago' },
    ],
    relatedIds: ['botanic-herbal-repair-shampoo', 'pure-daily-glow-serum', 'everyday-ceramic-vase'],
    current: 3490,
    old: 4990,
    badge: 30,
    description: 'Comfort-fit wireless sound with rich bass, all-day battery life, and a sleek minimalist frame.',
    inStock: true,
    stockLeft: 8,
    stockNote: 'In stock, ready to ship',
    sizes: ['Black', 'Stone', 'Sand'],
  },
  {
    id: 'everyday-ceramic-vase',
    slug: 'everyday-ceramic-vase',
    name: 'Everyday ceramic vase',
    brand: 'Studio M',
    category: 'home-living',
    categoryLabel: 'Home & living',
    subCategory: 'Decor',
    tagline: 'A little calm. A room worth staying in.',
    subtitle: 'Ceramic Vase · 18 cm',
    price: 1190,
    oldPrice: 1490,
    discountPercent: 20,
    rating: 4.6,
    reviewCount: 86,
    shortDescription: 'A sculptural neutral-toned vase that brings texture, softness and balance to shelves, tables and calm corners.',
    image: vase,
    thumbnail: vase,
    images: [vase, shampoo, headphones, serum],
    highlights: [
      {
        title: 'Soft sculptural shape',
        text: 'Its curved silhouette adds a quiet sense of elegance to both minimal and layered interiors.',
      },
      {
        title: 'Made to style',
        text: 'This versatile piece works beautifully with dried stems, fresh bouquets or simply as a standalone design object.',
      },
    ],
    howToUse: [
      'Place it on a shelf, console or coffee table where it can act as a quiet focal point.',
      'Style with roses, stems or dried branches to suit your mood and room.',
      'Wipe with a soft dry cloth for a clean finish and long-lasting look.',
    ],
    details: {
      Size: '18 cm',
      'Hair type': 'N/A',
      'Key ingredients': 'Ceramic clay, matte glaze',
      Scent: 'Neutral',
      'Made in': 'Bangladesh',
    },
    delivery: {
      eta: '2–4 working days',
      note: 'Free delivery on orders over ৳ 2,000. Easy 7-day returns.',
    },
    reviews: [
      { name: 'Lamia P.', title: 'A lovely everyday piece', text: 'It looks elegant on my shelf and the neutral tone brings a calmer feel to the room. I get compliments on it all the time.', rating: 5, date: '5 days ago' },
      { name: 'Rashid Z.', title: 'Minimal and beautiful', text: 'The finish is lovely and the size is perfect for my dining table. It made the whole corner feel more styled.', rating: 4, date: '1 week ago' },
      { name: 'Nabila H.', title: 'Worth the price', text: 'It feels solid and looks more expensive than it is. Great addition to my home decor.', rating: 5, date: '2 weeks ago' },
    ],
    relatedIds: ['botanic-herbal-repair-shampoo', 'pure-daily-glow-serum', 'sonora-wireless-headphones'],
    current: 1190,
    old: 1490,
    badge: 20,
    description: 'A sculptural neutral-toned vase for fresh stems, styled shelves and softer corners.',
    inStock: true,
    stockLeft: 2,
    stockNote: 'Only 2 left',
    sizes: ['Small', 'Medium', 'Large'],
  },
];

export default products;
