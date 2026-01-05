import {
  CoffeeOutlined,
  HomeOutlined,
  CompassOutlined,
  BookOutlined,
} from "@ant-design/icons";

export const CATEGORIES = [
  {
    key: "eat",
    title: "Eat & Drink",
    description:
      "Curated cafés, restaurants, and bars — chosen for consistency, atmosphere, and places you’ll return to.",
    icon: CoffeeOutlined,
    basePath: "/eat",
    seoTitle: "Eat & Drink in Ahangama",
    seoDescription:
      "Curated cafés, restaurants, and bars in Ahangama — no rankings, no noise.",
  },
  {
    key: "stays",
    title: "Stays",
    description:
      "Boutique stays, guesthouses, and long-stay friendly places — design-led, calm, and well-located.",
    icon: HomeOutlined,
    basePath: "/stays",
    seoTitle: "Stays in Ahangama",
    seoDescription:
      "Curated stays in Ahangama — boutique hotels, guesthouses, and long-stay picks.",
  },
  {
    key: "wellness",
    title: "Wellness",
    description:
      "Yoga, mindfulness, wellness treatments, and holistic practices — curated for wellness travelers.",
    icon: CompassOutlined,
    basePath: "/wellness",
    seoTitle: "Wellness in Ahangama",
    seoDescription:
      "Curated wellness experiences in Ahangama — yoga, mindfulness, and holistic practices.",
  },
  {
    key: "culture",
    title: "Culture",
    description:
      "Context thats helps you travel better — local rhythms, etiquette, seasons, and how it actually works.",
    icon: BookOutlined,
    basePath: "/culture",
    seoTitle: "Ahangama Culture Guide",
    seoDescription:
      "A practical culture guide to Ahangama — rhythms, etiquette, seasons, and local context.",
  },
];
