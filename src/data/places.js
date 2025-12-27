export const PLACES = [
  // {
  //   id: "slow-mornings",
  //   destinationSlug: "ahangama",
  //   category: "eat",
  //   name: "A Café for Slow Mornings",
  //   slug: "slow-mornings",
  //   excerpt:
  //     "Natural light, unhurried service, and a menu that rewards staying longer than one coffee.",
  //   description:
  //     "If you want a slow, easy start to the day—this is our go-to. Good coffee, good light, and a calm rhythm that makes you stay longer than planned.",
  //   bestFor: ["Coffee", "Breakfast", "Reading", "Work-friendly"],
  //   tags: ["Calm", "Bright", "Consistent"],
  //   cardPerk: "10% off the bill with the Ahangama Card (once per day).",
  //   offer: "10% off the bill with the Ahangama Card (once per day).",
  //   price: "Mid-range",
  //   hours: "07:30 – 16:30 (confirm seasonally)",
  //   area: "Ahangama (Central)",
  //   lat: 5.9705,
  //   lng: 80.364,
  //   image:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/coffee.webp",
  //   ogImage:
  //     "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=5.9705,80.3640",
  // },
  // {
  //   id: "good-lunch",
  //   destinationSlug: "ahangama",
  //   category: "eat",
  //   name: "The Place We Go Back for Lunch",
  //   slug: "good-lunch",
  //   excerpt:
  //     "Simple food done properly. Reliable, relaxed, and easy to return to day after day.",
  //   description:
  //     "A dependable lunch spot with a menu that keeps it simple. If you’re here for a while, this becomes one of your default choices.",
  //   bestFor: ["Lunch", "Casual", "Consistent"],
  //   tags: ["Easy", "Relaxed", "Reliable"],
  //   cardPerk: "Free coffee with the Ahangama Card (once per day).",
  //   offer: "Free coffee with the Ahangama Card (once per day).",
  //   price: "Mid-range",
  //   hours: "11:30 – 16:00 (confirm seasonally)",
  //   area: "Ahangama (Central)",
  //   lat: 5.9695,
  //   lng: 80.365,
  //   image:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+6food.webp",
  //   ogImage:
  //     "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=Ahangama",
  // },
  // {
  //   id: "sunset-drinks",
  //   destinationSlug: "ahangama",
  //   category: "eat",
  //   name: "Sunset Drinks Without the Chaos",
  //   slug: "sunset-drinks",
  //   excerpt:
  //     "Good drinks, space to breathe, and a view that doesn’t require fighting for a table.",
  //   description:
  //     "A calmer sunset option with a better mood than the loud party spots. Come for a drink, stay for the view, leave before it gets messy.",
  //   bestFor: ["Sunset", "Drinks", "Casual"],
  //   tags: ["Sunset", "Chill", "Good vibe"],
  //   cardPerk: "15% off drinks with the Ahangama Card (once per day).",
  //   offer: "15% off drinks with the Ahangama Card (once per day).",
  //   price: "Mid-range",
  //   hours: "16:00 – late (confirm seasonally)",
  //   area: "Ahangama (Beach road)",
  //   lat: 5.9685,
  //   lng: 80.3675,
  //   image:
  //     "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   ogImage:
  //     "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=5.9685,80.3675",
  // },
  // {
  //   id: "quiet-boutique-stay",
  //   destinationSlug: "ahangama",
  //   category: "stays",
  //   name: "A Quiet Boutique Stay",
  //   slug: "quiet-boutique-stay",
  //   excerpt: "Design-led, calm, and perfectly located for beach + town.",
  //   description:
  //     "A boutique stay we’d recommend for people who want calm, comfort, and easy access to the best parts of Ahangama.",
  //   bestFor: ["Boutique", "Couples", "Long-stay friendly"],
  //   tags: ["Quiet", "Minimal", "Good service"],
  //   cardPerk: "Room upgrade (subject to availability) with the Ahangama Card.",
  //   offer: "Room upgrade (subject to availability) with the Ahangama Card.",
  //   price: "Premium",
  //   hours: "Check-in/out times vary",
  //   area: "Ahangama",
  //   lat: 5.971,
  //   lng: 80.363,
  //   image:
  //     "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   ogImage:
  //     "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=5.9710,80.3630",
  // },
  // {
  //   id: "long-stay-guesthouse",
  //   destinationSlug: "ahangama",
  //   category: "stays",
  //   name: "A Long-Stay Guesthouse",
  //   slug: "long-stay-guesthouse",
  //   excerpt: "Simple, comfortable, and good value if you’re here for weeks.",
  //   description:
  //     "If you’re staying longer, this is the kind of place that feels easy: practical rooms, calm vibe, and a location that doesn’t complicate your days.",
  //   bestFor: ["Budget", "Long stays", "Work-friendly"],
  //   tags: ["Practical", "Calm", "Good value"],
  //   cardPerk: "Late checkout (subject to availability) with the Ahangama Card.",
  //   offer: "Late checkout (subject to availability) with the Ahangama Card.",
  //   price: "Budget–Mid",
  //   hours: "Check-in/out times vary",
  //   area: "Ahangama",
  //   lat: 5.972,
  //   lng: 80.362,
  //   image:
  //     "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   ogImage:
  //     "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=5.9720,80.3620",
  // },
  // EXPERIENCES
  // {
  //   id: "progressive-surf-school",
  //   destinationSlug: "ahangama",
  //   category: "experiences",
  //   name: "A Surf School That Actually Teaches",
  //   slug: "progressive-surf-school",
  //   excerpt: "Progress-focused coaching, not just pushing you into waves.",
  //   description:
  //     "A coaching-first surf setup for beginners and improvers who want real technique and steady progression.",
  //   bestFor: ["Surf", "Beginners", "Improvers"],
  //   tags: ["Coaching", "Safe", "Progress"],
  //   cardPerk: "10% off surf lesson packages with the Ahangama Card.",
  //   offer: "10% off surf lesson packages with the Ahangama Card.",
  //   price: "Mid-range",
  //   hours: "Depends on tides/conditions",
  //   area: "Ahangama / Midigama",
  //   lat: 5.969,
  //   lng: 80.368,
  //   image:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+2soul-surf.webp",
  //   ogImage:
  //     "https://images.pexels.com/photos/390051/surfing-wave-surfboard-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=5.9690,80.3680",
  // },
  // {
  //   id: "sunset-yoga-session",
  //   destinationSlug: "ahangama",
  //   category: "experiences",
  //   name: "A Sunset Yoga Session",
  //   slug: "sunset-yoga-session",
  //   excerpt: "A calm, consistent class that resets your day.",
  //   description:
  //     "A well-run yoga session with a grounded vibe. Good pacing, good instruction, and not overly spiritualised.",
  //   bestFor: ["Wellness", "Yoga", "Evenings"],
  //   tags: ["Calm", "Consistent", "Good teachers"],
  //   cardPerk: "Free class add-on (subject to schedule) with the Ahangama Card.",
  //   offer: "Free class add-on (subject to schedule) with the Ahangama Card.",
  //   price: "Mid-range",
  //   hours: "Class schedule varies",
  //   area: "Ahangama",
  //   lat: 5.97,
  //   lng: 80.366,
  //   image:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+3yoga.webp",
  //   ogImage:
  //     "https://images.pexels.com/photos/3822356/pexels-photo-3822356.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   mapUrl: "https://maps.google.com/?q=5.9700,80.3660",
  // },
  // {
  //   id: "cactus-cafe",
  //   destinationSlug: "ahangama",
  //   category: "eat",
  //   name: "Cactus",
  //   slug: "cactus-cafe",
  //   excerpt: "A local cafe with great atmosphere and good coffee.",
  //   description:
  //     "Cactus offers a cozy atmosphere perfect for coffee and casual dining.",
  //   bestFor: ["Coffee", "Casual dining", "Local vibe"],
  //   tags: ["Local", "Coffee", "Casual"],
  //   offer: "10% off coffee with the Ahangama Card",
  //   price: "Mid-range",
  //   area: "Ahangama",
  //   image:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+5catus.webp",
  //   ogImage:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/cactus-logo.jpg",
  //   lat: 5.9718909084100185,
  //   lng: 80.36452917292674,
  //   mapUrl: "https://maps.google.com/?q=5.9718909084100185,80.36452917292674",
  // },
  // {
  //   id: "marshmellow-surf-cafe",
  //   destinationSlug: "ahangama",
  //   category: "eat",
  //   name: "Marshmellow Surf Café",
  //   slug: "marshmellow-surf-cafe",
  //   excerpt: "A surf-themed cafe with great coffee and laid-back vibes.",
  //   description:
  //     "Marshmellow Surf Café combines great coffee with a relaxed surf atmosphere, perfect for post-session refreshments.",
  //   bestFor: ["Coffee", "Surf culture", "Casual dining", "Relaxed atmosphere"],
  //   tags: ["Surf", "Coffee", "Casual", "Local"],
  //   offer: "Free smoothie with breakfast order using the Ahangama Card",
  //   price: "Mid-range",
  //   area: "Ahangama",
  //   image:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+1marshmellow.webp",
  //   ogImage:
  //     "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/marshmellow-logo.jpg",
  //   lat: 5.972424094254227,
  //   lng: 80.36355358042105,
  //   mapUrl: "https://maps.google.com/?q=5.972424094254227,80.36355358042105",
  // },
  //CAFES

  {
    id: "marshmellow-surf-cafe",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Marshmellow Surf Café",
    slug: "marshmellow-surf-cafe",
    stars: 4.6,
    reviews: 1103,
    excerpt:
      "Big, buzzy café energy with an all-day menu and a serious following.",
    description:
      "One of the most reviewed spots in Ahangama. Popular for breakfast-through-lunch hangs and an easy, surf-town vibe.",
    bestFor: ["Breakfast", "Brunch", "All-day"],
    tags: ["Popular", "All-day", "Social"],
    cardPerk: "Free smoothie with any breakfast order using the Ahangama Card.",
    offer: ["Free Smoothie", "Breakfast Deal"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Matara Road)",
    lat: 5.9722427,
    lng: 80.3635965,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+14marshmellow.webp",
    ogImage:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/marshmellow-logo.jpg",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJMWdHKFgT4ToRU_rkte-QoDI",
  },
  {
    id: "cactus-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Cactus",
    slug: "cactus-ahangama",
    stars: 4.5,
    reviews: 1018,
    excerpt:
      "A central classic—easy to drop into, reliably busy, always in the mix.",
    description:
      "Ahangama main-road staple with a menu that suits groups and repeat visits. Convenient location makes it a default meet-up.",
    bestFor: ["Coffee", "Lunch", "People-watching"],
    tags: ["Central", "Reliable", "Busy"],
    cardPerk: "10% off all coffee drinks with the Ahangama Card.",
    offer: ["10% Off", "Coffee Discount"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Central)",
    lat: 5.9718757,
    lng: 80.3645275,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+5catus.webp",
    ogImage:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/cactus-logo.jpg",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJs3FQfk8T4ToRFksxXDpsvL0",
  },
  {
    id: "moochies-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Moochies Ahangama Restaurant & Rooftop",
    slug: "moochies-ahangama",
    stars: 4.9,
    reviews: 608,
    excerpt:
      "Rooftop vibes, strong crowd, and a solid go-to for sunset timing.",
    description:
      "A high-volume favorite with rooftop energy. Good for groups, casual dinners, and that end-of-day drink-and-food combo.",
    bestFor: ["Dinner", "Rooftop", "Sunset"],
    tags: ["Rooftop", "Lively", "Group-friendly"],
    cardPerk: "15% off sunset drinks on the rooftop with the Ahangama Card.",
    offer: ["15% Off", "Sunset Drinks"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Matara Road)",
    lat: 5.9703741,
    lng: 80.3676768,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+15moochies.webp",
    ogImage:
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJz1rAFQMV4ToRW7iWdc4p3RA",
  },
  {
    id: "the-kip",
    destinationSlug: "ahangama",
    category: "eat",
    name: "The Kip",
    slug: "the-kip",
    stars: 4.7,
    reviews: 503,
    excerpt:
      "Long-stay favorite—easy rhythms, steady quality, very repeatable.",
    description:
      "A well-known base in Ahangama with a café component people return to. Feels like a reliable anchor if you're staying nearby.",
    bestFor: ["Coffee", "Long-stay", "Casual bites"],
    tags: ["Chill", "Reliable", "Local-favorite"],
    cardPerk: "Extended wifi hours + workspace perks with the Ahangama Card.",
    offer: ["Wifi Hours", "Workspace Perks"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Dharmarama Rd)",
    lat: 5.9700077,
    lng: 80.3735191,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+9the-kip.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJMTRdTaQU4ToRM-xEwUWydew",
  },
  {
    id: "ceylon-sliders",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Ceylon Sliders",
    slug: "ceylon-sliders",
    stars: 4.5,
    reviews: 454,
    excerpt: "A strong all-rounder—good energy, good food, easy dinner option.",
    description:
      "A consistently popular stop on Matara Road. Works well for casual evenings when you want something dependable.",
    bestFor: ["Dinner", "Drinks", "Groups"],
    tags: ["Social", "Casual", "Dependable"],
    cardPerk: "Buy 2 get 1 free on signature sliders with the Ahangama Card.",
    offer: ["Buy 2", "Get 1"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Matara Road)",
    lat: 5.9721737,
    lng: 80.3640169,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+7ceylon-sliders.webp",
    ogImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ3XlQ7z0T4ToRfAv-CstU8gY",
  },
  {
    id: "le-cafe-french-bistro-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Le Café French Bistro Ahangama",
    slug: "le-cafe-french-bistro-ahangama",
    stars: 4.8,
    reviews: 448,
    excerpt:
      "French-bistro comfort with a polished feel and big repeat appeal.",
    description:
      "One of the most established, highly reviewed options around. Great when you want something a bit more ‘proper’ without being stiff.",
    bestFor: ["Brunch", "Dinner", "Date"],
    tags: ["Bistro", "Polished", "Consistent"],
    cardPerk:
      "Complimentary French pastry with coffee using the Ahangama Card.",
    offer: ["Free Pastry", "Coffee Combo"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Wella Watta)",
    lat: 5.9723607,
    lng: 80.362433,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Le+Cafe%CC%81+French+Bistro.webp",
    ogImage:
      "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ9y-qkHK95ToR7BPkd9mZu9Q",
  },
  {
    id: "hakuna-matata-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Hakuna Matata",
    slug: "hakuna-matata-ahangama",
    stars: 4.4,
    reviews: 441,
    excerpt: "Easygoing, no-fuss spot with a broad appeal and steady traffic.",
    description:
      "A familiar name around the junction area. Works well when you want something casual and straightforward.",
    bestFor: ["Casual dinner", "Groups", "Drinks"],
    tags: ["Casual", "Easy", "Crowd-pleaser"],
    cardPerk: "20% off the daily special with the Ahangama Card.",
    offer: ["20% Off", "Daily Special"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Aranwala Junction)",
    lat: 5.9669647,
    lng: 80.3748064,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+17Hakuna.webp",
    ogImage:
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJoUInqa0T4ToRj3sGiuTB3bU",
  },
  {
    id: "cafe-ceylon-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Café Ceylon Ahangama",
    slug: "cafe-ceylon-ahangama",
    stars: 4.3,
    reviews: 403,
    excerpt: "A familiar stop near Kabalana—good for a quick coffee reset.",
    description:
      "Solid, straightforward café option if you're around Kabalana and want something easy and predictable.",
    bestFor: ["Coffee", "Quick stop", "Casual"],
    tags: ["Easy", "Convenient", "No-fuss"],
    cardPerk: "Free second coffee refill with the Ahangama Card.",
    offer: ["Free Refill", "Coffee Perk"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Kabalana (Matara Road)",
    lat: 5.9782004,
    lng: 80.348526,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+19cafe-ceylon.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ5cfB9UsT4ToR399DOqCo6dg",
  },
  {
    id: "black-honey-cafe",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Black Honey cafe",
    slug: "black-honey-cafe",
    stars: 4.6,
    reviews: 395,
    excerpt:
      "A bit off the main strip—worth it if you like calmer café energy.",
    description:
      "Popular and well-reviewed despite being slightly tucked away. A nice change of pace from the busiest roadside spots.",
    bestFor: ["Coffee", "Brunch", "Quiet catch-up"],
    tags: ["Calm", "Tucked-away", "Well-loved"],
    cardPerk: "Honey-infused drink upgrade free with the Ahangama Card.",
    offer: ["Honey Upgrade", "Free Boost"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Wewilihena / Duwa Watta)",
    lat: 5.987142,
    lng: 80.3543167,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+21black-honey-cafe.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ73RKi2dt4ToRiTk9y0-1-fM",
  },
  {
    id: "squeeze-me",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Squeeze Me",
    slug: "squeeze-me",
    stars: 4.7,
    reviews: 315,
    excerpt:
      "Juice/smoothie-friendly stop that fits the post-surf, post-gym routine.",
    description:
      "A high-review wellness-leaning option in the Kaya collective area. Great for something light, fresh, and quick.",
    bestFor: ["Juices", "Light lunch", "Post-surf"],
    tags: ["Fresh", "Wellness", "Light"],
    cardPerk: "Free protein boost in any smoothie with the Ahangama Card.",
    offer: ["Protein Boost", "Free Add-on"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Kaya Collective)",
    lat: 5.9667637,
    lng: 80.3753645,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+22squeeze-me.webp",
    ogImage:
      "https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ96Mwsbw_4ToRE5WfSZI7o8U",
  },
  {
    id: "twin-fin-surf-x-coffee",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Twin Fin Surf x Coffee",
    slug: "twin-fin-surf-x-coffee",
    stars: 4.9,
    reviews: 275,
    excerpt: "Surf-shop-meets-café—easy coffee stop with gear and good energy.",
    description:
      "A highly reviewed hybrid spot. Convenient when you want a coffee break and a browse without changing locations.",
    bestFor: ["Coffee", "Surf town", "Quick stop"],
    tags: ["Hybrid", "Convenient", "Surf vibe"],
    cardPerk: "Free coffee with any surf gear rental using the Ahangama Card.",
    offer: ["Free Coffee", "Surf Gear"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Galle Road)",
    lat: 5.973358,
    lng: 80.3604935,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+25twin-fin.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ30q9adET4ToR5oSAehWi8Fk",
  },
  {
    id: "samba-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Samba Ahangama",
    slug: "samba-ahangama",
    stars: 4.8,
    reviews: 263,
    excerpt: "Beach-road staple—strong all-rounder for food + a lively scene.",
    description:
      "A popular, highly reviewed option on the southern beach road. Works for casual dinners and easy evening plans.",
    bestFor: ["Dinner", "Drinks", "Beach road"],
    tags: ["Lively", "Dependable", "Social"],
    cardPerk: "Fresh catch of the day - 10% off with the Ahangama Card.",
    offer: ["Fresh Catch", "10% Off"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (A2 Southern Beach Road)",
    lat: 5.9680796,
    lng: 80.3734503,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+23samba.webp",
    ogImage:
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJt2e3EEQV4ToRUqgcr_LXi5Q",
  },
  {
    id: "kaffi-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Kaffi",
    slug: "kaffi-ahangama",
    stars: 4.6,
    reviews: 242,
    excerpt: "A steady coffee stop on Matara Road—easy to default to.",
    description:
      "Well-reviewed and centrally placed. Good for a consistent caffeine run when you're moving between spots in town.",
    bestFor: ["Coffee", "Casual", "Quick stop"],
    tags: ["Central", "Reliable", "Simple"],
    cardPerk:
      "Double shot espresso at single shot price with the Ahangama Card.",
    offer: ["Double Shot", "Single Price"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Matara Road)",
    lat: 5.9689078,
    lng: 80.3706031,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+24kaffi.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJu7pmUN0T4ToRzNnyYODfGU4",
  },
  {
    id: "meori-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Meori",
    slug: "meori-ahangama",
    stars: 4.8,
    reviews: 211,
    excerpt: "A polished café/restaurant pick—good for a slightly nicer meal.",
    description:
      "A dependable option when you want something a touch more elevated than the simplest café stop, without going formal.",
    bestFor: ["Brunch", "Lunch", "Dinner"],
    tags: ["Polished", "Reliable", "Repeatable"],
    cardPerk:
      "Complimentary appetizer with main course using the Ahangama Card.",
    offer: ["Free Appetizer", "Main Course"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Matara Road)",
    lat: 5.9756109,
    lng: 80.3552236,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+30meori.webp",
    ogImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJY5S0VQAT4ToRJQa1LFa8Kys",
  },
  {
    id: "sisters-kabalana",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Sisters Kabalana",
    slug: "sisters-kabalana",
    stars: 4.9,
    reviews: 201,
    excerpt:
      "Beach-adjacent favorite—great stop before/after Kabalana sessions.",
    description:
      "An easy pick in the Kabalana zone. Good coffee + beach proximity makes it a natural part of the day’s loop.",
    bestFor: ["Coffee", "Breakfast", "Beach days"],
    tags: ["Kabalana", "Beach-adjacent", "Popular"],
    cardPerk: "Pre-surf breakfast combo special with the Ahangama Card.",
    offer: ["Surf Combo", "Breakfast Special"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Kabalana (Beach / Matara-Galle Road)",
    lat: 5.9779099,
    lng: 80.3513977,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+10sisters.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJs3TNP9YT4ToRsOY3_6NdMfA",
  },
  {
    id: "fruit-cafe-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Fruit Cafe - 100% Vegetarian / Vegan Friendly",
    slug: "fruit-cafe-ahangama",
    stars: 4.9,
    reviews: 197,
    excerpt: "Light, fresh, and easy—strong pick for plant-forward meals.",
    description:
      "A high-rated option for vegetarian/vegan-friendly eating that fits the warm-weather routine: simple, clean, and repeatable.",
    bestFor: ["Vegan", "Light lunch", "Fresh"],
    tags: ["Vegan-friendly", "Light", "Fresh"],
    cardPerk: "Free coconut water with any fruit bowl using the Ahangama Card.",
    offer: ["Free Coconut", "Fruit Bowl"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama",
    lat: 5.9713144,
    lng: 80.3661895,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+26fruit-cafe.webp",
    ogImage:
      "https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ0z_XLQAV4ToR57cYLTd1E-w",
  },
  {
    id: "maria-bonita-sri-lanka",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Maria Bonita Sri Lanka Café & Casa",
    slug: "maria-bonita-sri-lanka",
    stars: 4.8,
    reviews: 178,
    excerpt:
      "Café + stay energy—nice for a slower, more ‘set up here’ kind of visit.",
    description:
      "A well-reviewed café/casa combo. Good when you want a place that feels like a small hub rather than a quick stop.",
    bestFor: ["Brunch", "Coffee", "Chill time"],
    tags: ["Casa", "Relaxed", "Well-loved"],
    cardPerk: "Extended stay perks + café discounts with the Ahangama Card.",
    offer: ["Stay Perks", "Café Discount"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Welikanda)",
    lat: 5.9743119,
    lng: 80.3583762,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+27maria-bonita.webp",
    ogImage:
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJkbeaLj8T4ToR8Pb-FNdHuro",
  },
  {
    id: "follow-the-white-rabbit-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Follow The White Rabbit – Restaurant & Garden Brunch and sunset cafe",
    slug: "follow-the-white-rabbit-ahangama",
    stars: 4.5,
    reviews: 177,
    excerpt:
      "Garden brunch + sunset café—good when you want a ‘proper outing’.",
    description:
      "A well-reviewed, more ‘experience’ style café/restaurant. Nice for brunch plans or a relaxed sunset stop.",
    bestFor: ["Brunch", "Sunset", "Date"],
    tags: ["Garden", "Scenic", "Brunch"],
    cardPerk: "Garden table priority booking with the Ahangama Card.",
    offer: ["Priority Booking", "Garden Table"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Welikanda / Matara Road)",
    lat: 5.9745022,
    lng: 80.3575392,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+28follow-the-white-rabbit.webp",
    ogImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJo4cGR_kT4ToRhIM6t8uibno",
  },
  {
    id: "makai-cafe-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "MAKAI Café",
    slug: "makai-cafe-ahangama",
    stars: 5,
    reviews: 170,
    excerpt:
      "A new-school café pick with strong ratings and a clean, easy vibe.",
    description:
      "A highly rated café option that fits neatly into the ‘coffee + something tasty’ loop when you're in Ahangama.",
    bestFor: ["Coffee", "Breakfast", "Brunch"],
    tags: ["Highly-rated", "Modern", "Easy"],
    cardPerk:
      "Signature MAKAI latte + pastry combo deal with the Ahangama Card.",
    offer: ["Latte Combo", "Signature Drink"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Mahavihara Road)",
    lat: 5.9717426,
    lng: 80.3709232,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+29makai.webp",
    ogImage:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ6fM2WqwV4ToRDwJESR4dQbs",
  },
  {
    id: "teddies-ahangama",
    destinationSlug: "ahangama",
    category: "eat",
    name: "Teddies Ahangama",
    slug: "teddies-ahangama",
    stars: 5,
    reviews: 157,
    excerpt:
      "Popular roadside stop—easy for dinner + drinks with a lively crowd.",
    description:
      "A well-reviewed place that’s become part of the main-strip rotation. Good for relaxed evenings and social plans.",
    bestFor: ["Dinner", "Drinks", "Groups"],
    tags: ["Lively", "Main road", "Social"],
    cardPerk:
      "Social hour drinks - buy one get one 50% off with the Ahangama Card.",
    offer: ["Social Hour", "BOGO 50%"],
    price: "Mid-range",
    hours: "Confirm seasonally",
    area: "Ahangama (Matara Road)",
    lat: 5.9701641,
    lng: 80.3680971,
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+8teddies.webp",
    ogImage:
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mapUrl:
      "https://www.google.com/maps/place/?q=place_id:ChIJ3Sf2xwsV4ToRsupIqBjy_Ao",
  },
];
