export interface StoreCategory {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
  path: string;
}

export interface SeriesLink {
  name: string;
  path: string;
}

export interface HeroShowcase {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
}

const tagPath = (tag: string): string => `/products?tags=${encodeURIComponent(tag)}`;

/**
 * Real catalog product images (Otakumode CDN). `imageAt`/`imageSrcSet` resize
 * these per breakpoint, so the cards always show an actual product from the
 * matching collection rather than a homepage banner.
 */
const PRODUCT_IMAGES = {
  prinzHeinrich:
    "https://resize.cdn.otakumode.com/ex/228.228/510.349.840.840/shop/product/ba11665c61a5434eb9ba2bd6c38538cf.jpg",
  hinaSorasaki:
    "https://resize.cdn.otakumode.com/ex/228.228/74.53.610.609/shop/product/63de4b4a08414a5da2e212ecec12de76.jpg",
  mikuNt:
    "https://resize.cdn.otakumode.com/ex/228.228/211.277.316.316/shop/product/8fb3c7c7c94d4a07aa9eb67c395aad63.jpg",
  reoPlush:
    "https://resize.cdn.otakumode.com/ex/228.228/shop/product/5e7bc6a7b723450dbe366f09f196ad59.jpg",
  suisei:
    "https://resize.cdn.otakumode.com/ex/228.228/181.145.352.352/shop/product/7a5ffb70ad13483cb46a4bddd9eaf6cf.jpg",
  kafka:
    "https://resize.cdn.otakumode.com/ex/228.228/475.275.567.567/shop/product/74a164c37bf0486d99bc42087c7d8768.jpg",
  racingMiku:
    "https://resize.cdn.otakumode.com/ex/228.228/277.59.316.317/shop/product/ca552ba108504a7887a9b5d30ca2de16.jpg",
  robobot:
    "https://resize.cdn.otakumode.com/ex/228.228/shop/product/c0d13d305dc34f7d87a16c68edeebe3f.jpg",
} as const;

export const storeCategories: readonly StoreCategory[] = [
  {
    name: "Scale & Bishoujo Figures",
    description: "1/7, 1/6 and 1/4 centrepiece figures with show-stopping sculpts and paintwork.",
    image: PRODUCT_IMAGES.prinzHeinrich,
    imageAlt: "Azur Lane Prinz Heinrich 1/7 scale figure",
    badge: "Collector",
    path: tagPath("Bishoujo Figures"),
  },
  {
    name: "Nendoroid & Chibi",
    description: "Pocket-sized heroes, expressive faces and palm-perfect display companions.",
    image: PRODUCT_IMAGES.hinaSorasaki,
    imageAlt: "Nendoroid Blue Archive Hina Sorasaki",
    badge: "Small",
    path: tagPath("Chibi Figures"),
  },
  {
    name: "figma & Action Figures",
    description: "Fully poseable figures with swappable faces, hands and accessories.",
    image: PRODUCT_IMAGES.mikuNt,
    imageAlt: "figma Hatsune Miku NT",
    badge: "Poseable",
    path: tagPath("figma"),
  },
  {
    name: "Plushies & Mascots",
    description: "Soft, huggable versions of your favourite heroes, idols and mascots.",
    image: PRODUCT_IMAGES.reoPlush,
    imageAlt: "Phapha Doll Blue Lock Reo Mikage action doll plushie",
    badge: "Soft & huggable",
    path: "/products?q=plush",
  },
  {
    name: "Hololive & VTubers",
    description: "Vtubers, streamer figures and merch from hololive and beyond.",
    image: PRODUCT_IMAGES.suisei,
    imageAlt: "Pop Up Parade SP Hoshimachi Suisei",
    badge: "Vtubers",
    path: tagPath("Vtuber"),
  },
  {
    name: "HoYoverse & Game Figures",
    description: "Genshin Impact, Honkai, Zenless Zone Zero and other game collectibles.",
    image: PRODUCT_IMAGES.kafka,
    imageAlt: "Honkai: Star Rail Kafka 1/7 scale figure",
    badge: "Video Game",
    path: tagPath("HoYoverse"),
  },
  {
    name: "Hatsune Miku & Vocaloid",
    description: "Miku, Racing Miku and singing-synthesizer figures in every style.",
    image: PRODUCT_IMAGES.racingMiku,
    imageAlt: "Racing Miku 2024 1/7 scale figure",
    badge: "Vocaloid",
    path: tagPath("Hatsune Miku"),
  },
  {
    name: "Anime Goods & Accessories",
    description: "Acrylic stands, keychains, display accessories and shelf-ready extras.",
    image: PRODUCT_IMAGES.robobot,
    imageAlt: "Nendoroid More Kirby Planet Robobot Robobot Armor",
    badge: "Other",
    path: tagPath("Figure Accessories"),
  },
];

export const figureSeries: readonly SeriesLink[] = [
  { name: "hololive", path: tagPath("hololive") },
  { name: "HoYoverse", path: tagPath("HoYoverse") },
  { name: "Hatsune Miku", path: tagPath("Hatsune Miku") },
  { name: "Fate Series", path: tagPath("Fate Series") },
  { name: "Azur Lane", path: tagPath("Azur Lane") },
  { name: "Demon Slayer", path: tagPath("Demon Slayer: Kimetsu no Yaiba") },
  { name: "Jujutsu Kaisen", path: tagPath("Jujutsu Kaisen") },
  { name: "My Hero Academia", path: tagPath("My Hero Academia") },
  { name: "Evangelion", path: tagPath("Evangelion Series") },
  { name: "Re:Zero", path: tagPath("Re:Zero -Starting Life in Another World-") },
];

export const heroShowcase: readonly HeroShowcase[] = [
  {
    image: PRODUCT_IMAGES.mikuNt,
    imageAlt: "figma Hatsune Miku NT",
    eyebrow: "figma · Hatsune Miku",
    title: "Poseable perfection",
  },
  {
    image: PRODUCT_IMAGES.prinzHeinrich,
    imageAlt: "Azur Lane Prinz Heinrich 1/7 scale figure",
    eyebrow: "Scale figures",
    title: "Centerpiece energy",
  },
];

export const heroStats = ["10k+ figures", "100+ series", "Weekly drops"] as const;
