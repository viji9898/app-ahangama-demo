import lighthouseHappyHourImage from "../assets/temp/lighthouse-happy-hour.jpeg";
import sambaHappyHourImage from "../assets/temp/Samba Haappy Hour .png";
import cafeCeylonMovieNightImage from "../assets/temp/Cafe Ceylon Movie Night .jpeg";
import monoDjNightImage from "../assets/temp/Mono - DJ Night .jpg";
import hotelDeUnclesMonsoonNightImage from "../assets/temp/Hotel De Uncles Monsoon Nights .jpeg";
import img2Image from "../assets/temp/img2.jpeg";
import img3Image from "../assets/temp/img3.jpeg";
import img4Image from "../assets/temp/img4.jpeg";
import img5Image from "../assets/temp/img5.jpeg";
import img6Image from "../assets/temp/img6.jpeg";
import img7Image from "../assets/temp/img7.jpeg";
import img8Image from "../assets/temp/img8.jpeg";
import { PLACES } from "./places";

const eventImage = (fileName) =>
  encodeURI(`/Images for Events Calendar/${fileName}`);

const hakunaMatataSunsetImage = eventImage(
  "Hakuna Matata - Thursday sunset Event Flyer.png",
);
const hotelDeUnclesKaraokeImage = eventImage(
  "Hotel De uncles - Karaoke Event Flyer_.jpg",
);
const kaiAhangamaImage = eventImage("Kai - Live Music - Venue Image.png");
const monoImage = eventImage("Mono - Dante Alchemico Koila Event Flyer.jpg");
const kurunduImage = eventImage("Kurundu - Sundown session Event Flyer.png");
const emberAndIceRitualsImage = eventImage("Ember & Ice-  Rituals Image.png");
const emberAndIceBreathworkImage = eventImage(
  "Ember & Ice - Breathworking Image_.png",
);
const ceylonSlidersImage = eventImage(
  "Ceylon sliders - Saturday Session - Party night image.jpg",
);
const leCafeFrenchBistroImage = eventImage(
  "Le Cafe french bistro - two Wine glasses and two  side plates of cheese_.png",
);
const surfClubMidigamaImage = eventImage(
  "Surf Club midigama - Sunset Club Event Flyer.jpg",
);

const VENUE_NAME_ALIASES = {
  "le cafe french bistro": "le cafe",
};

function formatDiscount(discount) {
  if (typeof discount !== "number" || discount <= 0) return "";

  return `${Math.round(discount * 100)}% off`;
}

function normalizeVenueName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findVenuePlace(name) {
  const normalizedName = normalizeVenueName(name);
  const normalizedAlias = VENUE_NAME_ALIASES[normalizedName];
  return PLACES.find(
    (place) =>
      place.destinationSlug === "ahangama" &&
      (normalizeVenueName(place.name) === normalizedName ||
        normalizeVenueName(place.name) === normalizedAlias),
  );
}

function getPassBenefit(name) {
  const place = findVenuePlace(name);
  const discountLabel = formatDiscount(place?.discount);

  if (!place?.cardPerk && !discountLabel) return null;

  return {
    label: "Ahangama Pass",
    discount: discountLabel,
    perk: place.cardPerk || "Pass holder perk available.",
  };
}

function getInstagramUrl(name) {
  const place = findVenuePlace(name);
  if (place?.instagram) {
    return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`site:instagram.com ${name} Ahangama`)}`;
}

function getDirectionsUrl(name) {
  const place = findVenuePlace(name);
  if (place?.mapUrl) return place.mapUrl;
  if (typeof place?.lat === "number" && typeof place?.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Ahangama`)}`;
}

function enrichEvent(event) {
  const passBenefit = Object.prototype.hasOwnProperty.call(event, "passBenefit")
    ? event.passBenefit
    : getPassBenefit(event.venue);
  const instagramUrl = Object.prototype.hasOwnProperty.call(
    event,
    "instagramUrl",
  )
    ? event.instagramUrl
    : getInstagramUrl(event.venue);
  const directionsUrl = Object.prototype.hasOwnProperty.call(
    event,
    "directionsUrl",
  )
    ? event.directionsUrl
    : getDirectionsUrl(event.venue);

  return {
    ...event,
    instagramUrl,
    directionsUrl,
    passBenefit,
  };
}

export const EVENTS_CALENDAR_OVERVIEW = {
  monthLabel: "July 2026",
  kicker: "Ahangama Events Agenda",
  summary:
    "This week's highlights, weekly picks, wellness sessions and late June events around Ahangama.",
  weekLabel: "Ahangama . 18 - 30 June",
  weekDescription:
    "A curated selection of music, wellness, happy hours and social nights around town.",
};

export const EVENTS_CALENDAR_DAYS = [
  {
    key: "2026-06-18",
    weekday: "Thursday",
    dayNumber: "18",
    month: "June",
    events: [
      enrichEvent({
        venue: "Hakuna Matata",
        time: "Happy Hour: 5:00 PM - 7:00 PM",
        category: "Weekly Picks",
        image: hakunaMatataSunsetImage,
        description:
          "20% off all cocktails with sunset music and a full night line-up.",
        details: [
          "Music: Skillz Jay, Monamourrr, Mr. Percussion, Hotel De Uncles",
          "Offer: 20% off all cocktails",
        ],
      }),
      enrichEvent({
        title: "Karaoke Thursday",
        venue: "Hakuna Matata",
        time: "From 6:00 PM",
        category: "Weekly Picks",
        image: hotelDeUnclesKaraokeImage,
      }),
      enrichEvent({
        title: "Live Music with Channa",
        venue: "Kai Ahangama",
        time: "From 5:00 PM",
        category: "Weekly Picks",
        image: kaiAhangamaImage,
        instagramUrl:
          "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-06-19",
    weekday: "Friday",
    dayNumber: "19",
    month: "June",
    events: [
      enrichEvent({
        title: "Mono — Dante Alchemico Koila",
        venue: "Mono",
        time: "8:00 PM - 10:00 PM; 10:00 PM - Midnight",
        category: "This Week's Highlights.",
        image: monoImage,
        description:
          "Electronic live set by Bali-based DJ and producer Dante Alchemico Koila.",
      }),
    ],
  },
  {
    key: "2026-06-20",
    weekday: "Saturday",
    dayNumber: "20",
    month: "June",
    events: [
      enrichEvent({
        title: "Kurundu Sundown Session",
        venue: "Kurundu",
        time: "4:00 PM - 2:00 AM",
        category: "This Week's Highlights",
        image: kurunduImage,
        description: "Sunset music, cocktails and late-night dancing.",
        details: [
          "Line-up: Adriqus, Banu, Derek, Jayy Vibes b2b Chiruka, Sam, Shamika",
          "Tickets: Rs. 5,000",
        ],
      }),
      enrichEvent({
        title: "Mono — Drum & Bass Night",
        venue: "Mono",
        time: "8:30 PM - 11:30 PM",
        category: "This Week's Highlights",
        image: monoImage,
        description: "Featuring DJ Janaka.",
      }),
      enrichEvent({
        title: "Live Music with Ashane",
        venue: "Kai Ahangama",
        time: "From 5:00 PM",
        category: "This Week's Highlights",
        image: kaiAhangamaImage,
        instagramUrl:
          "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-06-21",
    weekday: "Sunday",
    dayNumber: "21",
    month: "June",
    events: [
      enrichEvent({
        title: "Live Music with Shenal",
        venue: "Kai Ahangama",
        time: "From 5:00 PM",
        category: "Weekly Picks",
        image: kaiAhangamaImage,
        instagramUrl:
          "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-06-24",
    weekday: "Wednesday",
    dayNumber: "24",
    month: "June",
    events: [
      enrichEvent({
        title: "Ember & Ice Ritual",
        venue: "Ember & Ice",
        time: "11:00 AM",
        category: "Wellness",
        image: emberAndIceRitualsImage,
      }),
    ],
  },
  {
    key: "2026-06-27",
    weekday: "Saturday",
    dayNumber: "27",
    month: "June",
    events: [
      enrichEvent({
        title: "Sunset Club",
        venue: "Surf Club Midigama",
        time: "From 4:00 PM onwards",
        category: "Late June Events",
        image: surfClubMidigamaImage,
        details: ["Music: Claremont x Gaali (2 DJs)"],
      }),
      enrichEvent({
        title: "Saturday Session",
        venue: "Ceylon Sliders",
        time: "8:00 PM - 1:00 AM",
        category: "Late June Events",
        image: ceylonSlidersImage,
        description: "Featuring Miloh & Sheran.",
        details: [
          "Entry: Free before 8pm",
          "Rs. 1,000 from 8-9pm",
          "Rs. 2,000 from 9pm-12:30am",
          "Rs. 1,000 after 12:30am",
        ],
      }),
    ],
  },
  {
    key: "2026-07-01",
    weekday: "Wednesday",
    dayNumber: "01",
    month: "July",
    events: [
      enrichEvent({
        title: "Movie Night - A Bug's Life",
        venue: "Cafe Ceylon",
        time: "6:15 PM",
        category: "Weekly Picks",
        image: cafeCeylonMovieNightImage,
        description: "Chicken schnitzel or sliders with fries.",
        instagramUrl:
          "https://www.instagram.com/cafe_ceylon?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-07-02",
    weekday: "Thursday",
    dayNumber: "02",
    month: "July",
    events: [
      enrichEvent({
        title: "Sunset Party",
        venue: "Hakuna Matata",
        time: "From 5:00 PM",
        category: "Weekly Picks",
        image: img2Image,
        description:
          "Played by Monamourrr, Skillz Jay, Mr Percussion.",
        instagramUrl:
          "https://www.instagram.com/hakuna_matata_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
      enrichEvent({
        title: "Karaoke Thursday",
        venue: "Hotel De Uncles",
        time: "6.00PM",
        category: "Weekly Picks",
        image: img3Image,
        instagramUrl:
          "https://www.instagram.com/hoteldeuncles?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
      enrichEvent({
        title: "Live Music",
        venue: "Kai Ahangama",
        time: "5.00PM",
        category: "Weekly Picks",
        image: img4Image,
        description: "Played by Chana.",
        instagramUrl:
          "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-07-03",
    weekday: "Friday",
    dayNumber: "03",
    month: "July",
    events: [
      enrichEvent({
        title: "House / Disco / Afro Grooves",
        venue: "Mono",
        time: "8:30 PM - 11:30 PM",
        category: "Weekly Picks",
        image: monoDjNightImage,
        description: "Music played by ED Templeton.",
        instagramUrl:
          "https://www.instagram.com/find_mono_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
      enrichEvent({
        title: "Weekend Flow",
        venue: "Crust Ahangama",
        time: "7.00PM till dawn",
        category: "Weekly Picks",
        image: img7Image,
        description:
          "DJ Shaggy & Dammy D take over the decks with the hottest beats all night long.",
          instagramUrl:
          "https://www.instagram.com/crust_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-07-04",
    weekday: "Saturday",
    dayNumber: "04",
    month: "July",
    events: [
      enrichEvent({
        title: "Monsoon Nights",
        venue: "Hotel De Uncles",
        time: "6:00 PM",
        category: "Weekly Picks",
        image: hotelDeUnclesMonsoonNightImage,
        description: "Hotel De Uncles x Latoya Presents.",
        instagramUrl:
          "https://www.instagram.com/hoteldeuncles?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
      enrichEvent({
        title: "Live Music",
        venue: "Kai Ahangama",
        time: "5.00PM",
        category: "Weekly Picks",
        image: img6Image,
        description: "Played by Channuka.",
        instagramUrl:
          "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-07-05",
    weekday: "Sunday",
    dayNumber: "05",
    month: "July",
    events: [
      enrichEvent({
        title: "Live Music",
        venue: "Kai Ahangama",
        time: "5.00PM",
        category: "Weekly Picks",
        image: img5Image,
        description: "Played by Delaa.",
        instagramUrl:
          "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
  {
    key: "2026-07-06",
    weekday: "Monday",
    dayNumber: "06",
    month: "July",
    events: [
      enrichEvent({
        title: "No Shame Monday - Karaoke Night",
        venue: "Crust Ahangama",
        time: "7.00PM Onwards",
        category: "Weekly Picks",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783314017/Crust_Ahangama_Karaoke_pii79w.jpg",
        description: "Played by Minol.",
        instagramUrl:"https://www.instagram.com/crust_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      }),
    ],
  },
  {
    key: "2026-07-07",
    weekday: "Tuesday",
    dayNumber: "07",
    month: "July",
    events: [
      enrichEvent({
        title: "BREATHWORK",
        venue: "Ember & Ice",
        time: "10.00AM",
        category: "Wellness",
        image: emberAndIceBreathworkImage,
        description: "Breathwork session with Ember & Ice.",
        instagramUrl:
          "https://www.instagram.com/emberandiceahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
      enrichEvent({
        title: "Traditional Cooking Class",
        venue: "Kumbuk Community",
        time: "4:00 PM - 7:00 PM",
        category: "Weekly Picks",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783314826/Kumbuk_Kitchen_cooking_class_czudav_no7spc.webp",
        description: "Kumbuk Community Kitchen traditional cooking class.",
        instagramUrl:
         "https://www.instagram.com/kumbuk.community?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
    ],
  },
  {
    key: "2026-07-08",
    weekday: "Wednesday",
    dayNumber: "08",
    month: "July",
    events: [
      enrichEvent({
        title: "Cane Weaving (Wewel)",
        venue: "Sarana",
        time: "11.30PM",
        category: "Weekly Picks",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783315427/Sarana_Cane_weaving_c6tuw6.jpg",
          description: "Discover the traditional craft of Wewel cane weaving and create your own handcrafted piece.",
                 instagramUrl:
         "https://www.instagram.com/saranalanka?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
      enrichEvent({
        title: "Movie Night - Kids Special",
        venue: "Cafe Ceylone",
        time: "6.15PM",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/cafe_ceylon?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783403880/WhatsApp_Image_2026-07-07_at_09.01.22_e7sftg.jpg",
        description:
          "Kids menu - Special price\nChicken schnitzel or sliders with fries.",
      }),
      enrichEvent({
        title: "Electric Sands with DIS & DAT",
        venue: "Crust Ahangama",
        time: "7:00 PM Onwards",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/crust_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783405168/WhatsApp_Image_2026-07-06_at_23.44.12_ufrfqv.jpg",
        description:
          "Live Music & Good Vibes\nGreat Food & Drinks\nBeachside Atmosphere",
      }),
    ],
  },
  {
    key: "2026-07-09",
    weekday: "Thursday",
    dayNumber: "09",
    month: "July",
    events: [
      enrichEvent({
        title: "Traditional Cooking Class",
        venue: "Kumbuk Community",
        time: "4:00 PM - 7:00 PM",
        category: "Weekly Picks",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783314826/Kumbuk_Kitchen_cooking_class_czudav_no7spc.webp",
        description: "Kumbuk Community Kitchen traditional cooking class.",
         instagramUrl:
         "https://www.instagram.com/kumbuk.community?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
      enrichEvent({
        title: "Live Music",
        venue: "Kai Ahangama",
        time: "5:00 PM Onwards",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783429217/WhatsApp_Image_2026-07-07_at_13.19.28_njocuj.jpg",
        description: "Live Music with Pradhee.",
      }),
      enrichEvent({
        title: "Karaoke Thursday",
        venue: "Hotel De Uncles",
        time: "6:00 PM Onwards",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/hoteldeuncles?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783485938/WhatsApp_Image_2026-07-08_at_10.03.40_e49xcu.jpg",
        description:
          "Karaoke Night, Fun with Friends & Family, Live Sing-Along Vibes.",
      }),
    ],
  },
  {
    key: "2026-07-10",
    weekday: "Friday",
    dayNumber: "10",
    month: "July",
    events: [
      enrichEvent({
        title: "Mono Friday",
        venue: "Mono Ahangama",
        time: "8.00PM - 11.30PM",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/find_mono_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783404499/WhatsApp_Image_2026-07-07_at_08.11.41_aygcos.jpg",
        description: "Played by Sadboi Sam (LK)\nIndie Dance\nGroovy House",
      }),
    ],
  },
  {
    key: "2026-07-11",
    weekday: "Saturday",
    dayNumber: "11",
    month: "July",
    events: [
      enrichEvent({
        title: "Live Music",
        venue: "Kai Ahangama",
        time: "5:00 PM Onwards",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783429209/WhatsApp_Image_2026-07-07_at_13.19.27_1_g5wurw.jpg",
        description:
          "Live Music with Shenal",
      }),
    ],
  },
  {
    key: "2026-07-12",
    weekday: "Sunday",
    dayNumber: "12",
    month: "July",
    events: [
      enrichEvent({
        title: "Live Music",
        venue: "Kai Ahangama",
        time: "5:00 PM Onwards",
        category: "Weekly Picks",
        instagramUrl:
         "https://www.instagram.com/kai_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783429202/WhatsApp_Image_2026-07-07_at_13.19.27_clnh7a.jpg",
        description: "Live Music with Jeewaka.",
      }),
    ],
  },
  {
    key: "2026-07-15",
    weekday: "Wednesday",
    dayNumber: "15",
    month: "July",
    events: [
      enrichEvent({
        title: "A Community Gathering & Working Session",
        venue: "Flowground, Ahangama",
        time: "6:00 PM",
        category: "Weekly Picks",
        image: img8Image,
        description:
          "Film screening 'Monsters Cave', guest speakers Dilsiri Welikala (Kite Surfing Lanka), Pearl Protectors & more, facilitated by Marla Lise (The Eco Chapter).",
      }),
    ],
  },
  {
    key: "ongoing-this-week",
    weekday: "The Weekly",
    dayNumber: "Flow",
    month: "",
    events: [
      enrichEvent({
        title: "The Well Yoga Week",
        venue: "The Well",
        time: "9:00 AM",
        category: "Wellness",
        instagramUrl:
         "https://www.instagram.com/thewell_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783317753/The_well_Schedule_kzntt5.png",
        description:
          "Price: 3000 LKR per class + use pool after your session",
        details: [
          "8th Wednesday 9am Asana & Pranayama.",
        ],
      }),
      enrichEvent({
        title: "Terra Weekly Classes",
        venue: "Terra Ahangama",
        time: "Weekly Schedule",
        category: "Wellness",
        instagramUrl:
         "https://www.instagram.com/terra.srilanka?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783321778/Terra_Schedule_vs9pd2.jpg",
        description:
          "8th Wednesday\n• 9:00 AM – 10:00 AM: Morning Vinyasa Flow (Pardis)\n• 9:30 AM – 10:30 AM: Reformer Pilates (Rebeka)\n• 3:00 PM – 4:00 PM: Reformer Pilates (Hannah)\n• 4:00 PM – 5:00 PM: Yin Yoga (Pardis)",
      }),
      enrichEvent({
        title: "Calma Samaya Weekly Schedule",
        venue: "Calma Samaya Hotel, Café & Wellness",
        time: "Weekly Schedule",
        category: "Wellness",
        instagramUrl:
         "https://www.instagram.com/calmasamaya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783322456/Calma_samaya_schedule_u1ag1a.jpg",
        description:
          "8th Wednesday\n• 10:30 AM – 11:30 AM: Mat Pilates (Yashi)\n• 7:00 PM – 8:00 PM: Breathwork (Paradis)",
      }),
    ],
  },
  {
    key: "ongoing",
    weekday: "Local",
    dayNumber: "Perks",
    month: "",
    events: [
      enrichEvent({
        title: "Daily Happy Hour",
        venue: "Samba",
        time: "5:00 PM - 7:00 PM",
        category: "Ongoing",
        image: sambaHappyHourImage,
        description: "Buy 2 get 1 free for all cocktails during happy hour.",
        instagramUrl:
          "https://www.instagram.com/samba_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
      enrichEvent({
        title: "50% Off All Cocktails",
        venue: "Crave",
        time: "Daily",
        category: "Ongoing",
         description: "Daily 50% Off All Cocktails.",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783316092/Crave_offer_50_vjhobv.png",
                        instagramUrl:
         "https://www.instagram.com/crave_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
      enrichEvent({
        title: "Daily Pasta + 1 Soft Drink - 2,500 LKR",
        venue: "Surfing Wombat",
        time: "Daily",
        category: "Ongoing",
        image:
          "https://res.cloudinary.com/xmybcqyi/image/upload/v1783316605/Surfing_wombat_offer_gztyv1.webp",
        description: "Daily pasta plus one soft drink for only 2,500 LKR.",
        instagramUrl:
         "https://www.instagram.com/surfingwombats?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        passBenefit: null,
      }),
      enrichEvent({
        title: "Stairway Rooftop Bar Happy Hour",
        venue: "Lighthouse",
        time: "4:00 PM - 6:00 PM",
        category: "Ongoing",
        image: lighthouseHappyHourImage,
        description: "Selected drinks available during the rooftop happy hour.",
        instagramUrl:
          "https://www.instagram.com/lighthouse_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        directionsUrl: "https://maps.app.goo.gl/39z6wZ3tGpp2jw7z7",
        passBenefit: null,
      }),
      enrichEvent({
        title: "Daily Happy Hour",
        venue: "Le Café French Bistro",
        time: "5:00 PM - 6:00 PM",
        category: "Ongoing",
        image: leCafeFrenchBistroImage,
        description:
          "Receive a complimentary charcuterie or cheese bite with every glass of wine or beer.",
        instagramUrl:
          "https://www.instagram.com/le_cafe_french_bistro_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      }),
    ],
  },
];

export const EVENTS_EDITOR_PICKS = [
  "Kurundu Sundown Session — biggest event of the week.",
  "Mono: Dante Alchemico Koila — strongest electronic music booking.",
  "Hakuna Matata Sunset Happy Hour — best value night out.",
  "Ceylon Sliders Saturday Session — late June social favourite.",
];

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDayLabel(day) {
  if (day.key.startsWith("ongoing")) return "Ongoing";

  return `${day.weekday.slice(0, 3)} ${day.dayNumber} ${day.month.slice(0, 3)} 2026`;
}

function isDatedDay(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(day.key);
}

function buildUpcomingCalendarDays() {
  const todayKey = getTodayKey();
  const datedDays = EVENTS_CALENDAR_DAYS.filter((day) => isDatedDay(day));
  const ongoingDays = EVENTS_CALENDAR_DAYS.filter(
    (day) => day.key.startsWith("ongoing"),
  );

  return [...datedDays.filter((day) => day.key >= todayKey), ...ongoingDays];
}

function buildHomepageEvents(days) {
  return days
    .flatMap((day) =>
      day.events.map((event) => ({
        ...event,
        date: formatDayLabel(day),
        dayKey: day.key,
      })),
    )
    .slice(0, 5);
}

function buildUpcomingEditorPicks(days) {
  return days
    .flatMap((day) =>
      day.events.map((event) => {
        const eventDate =
          day.key.startsWith("ongoing") ? "Ongoing" : formatDayLabel(day);

        return `${event.title} at ${event.venue} — ${eventDate}.`;
      }),
    )
    .slice(0, 4);
}

function buildHomepageDateLabel(events) {
  const datedEvents = events.filter(
    (event) => !String(event.dayKey).startsWith("ongoing"),
  );

  if (!datedEvents.length) return "Ahangama . Ongoing";

  const firstEvent = datedEvents[0];
  const lastEvent = datedEvents[datedEvents.length - 1];
  const firstDate = firstEvent.date
    .replace(/^[A-Za-z]{3} /, "")
    .replace(" 2026", "");
  const lastDate = lastEvent.date
    .replace(/^[A-Za-z]{3} /, "")
    .replace(" 2026", "");

  if (firstDate === lastDate) return `Ahangama . ${firstDate}`;

  return `Ahangama . ${firstDate} - ${lastDate}`;
}

export const UPCOMING_EVENTS_CALENDAR_DAYS = buildUpcomingCalendarDays();
export const UPCOMING_EVENTS_EDITOR_PICKS = buildUpcomingEditorPicks(
  UPCOMING_EVENTS_CALENDAR_DAYS,
);
export const THIS_WEEK_EVENTS = buildHomepageEvents(
  UPCOMING_EVENTS_CALENDAR_DAYS,
);
export const THIS_WEEK_EVENTS_LABEL = buildHomepageDateLabel(THIS_WEEK_EVENTS);
