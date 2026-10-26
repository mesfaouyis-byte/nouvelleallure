export type Product = {
  id: string;
  name: string;
  ar: string;
  description: string;
  category: string;
  price: number;
  regularPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number | null;
  sample: boolean;
  isNew: boolean;
  best: boolean;
  seo: string;
};
export const categories = [
  {
    slug: "bottes-bottines",
    name: "Bottes & Bottines",
    ar: "أحذية البوت",
    image: "boots",
  },
  {
    slug: "chaussures-femme",
    name: "Chaussures Femme",
    ar: "أحذية نسائية",
    image: "heels",
  },
  { slug: "sandales", name: "Sandales", ar: "صنادل", image: "heels" },
  {
    slug: "vetements-femme",
    name: "Vêtements Femme",
    ar: "ملابس نسائية",
    image: "coat",
  },
  { slug: "accessoires", name: "Accessoires", ar: "إكسسوارات", image: "bag" },
  { slug: "nouveautes", name: "Nouveautés", ar: "وصل حديثاً", image: "coat" },
  { slug: "promotions", name: "Promotions", ar: "تخفيضات", image: "boots" },
];
const colors = [
  { name: "Chocolat", hex: "#654536" },
  { name: "Noir", hex: "#262321" },
  { name: "Beige", hex: "#d6c4ab" },
];
const products: Product[] = [
  {
    id: "bottines-alma",
    name: "Bottines Alma",
    ar: "بوت ألما",
    description:
      "Une ligne intemporelle, un talon structuré et une teinte chocolat. Le détail qui signe une silhouette. Visuel et caractéristiques de démonstration, à confirmer avant achat.",
    category: "bottes-bottines",
    price: 349,
    regularPrice: 449,
    images: ["boots", "boots"],
    colors,
    sizes: ["36", "37", "38", "39", "40", "41"],
    stock: null,
    sample: true,
    isNew: true,
    best: true,
    seo: "Bottines Alma chocolat – Collection de démonstration Nouvelle Allure Maroc",
  },
  {
    id: "sac-camille",
    name: "Sac Camille",
    ar: "حقيبة كاميل",
    description:
      "Une silhouette structurée couleur caramel, à porter à la main ou à l’épaule. Modèle de démonstration.",
    category: "accessoires",
    price: 299,
    images: ["bag", "bag"],
    colors: colors.slice(0, 2),
    sizes: ["Unique"],
    stock: null,
    sample: true,
    isNew: true,
    best: true,
    seo: "Sac Camille – Accessoires Nouvelle Allure Maroc",
  },
  {
    id: "manteau-inaya",
    name: "Manteau Inaya",
    ar: "معطف عناية",
    description:
      "La douceur du camel et une coupe longue pour accompagner chaque mouvement. Modèle de démonstration ; composition à confirmer.",
    category: "vetements-femme",
    price: 599,
    regularPrice: 749,
    images: ["coat", "coat"],
    colors: [colors[2], colors[1]],
    sizes: ["S", "M", "L", "XL"],
    stock: null,
    sample: true,
    isNew: true,
    best: false,
    seo: "Manteau Inaya camel – Mode femme Maroc",
  },
  {
    id: "escarpins-elise",
    name: "Escarpins Élise",
    ar: "حذاء إليز",
    description:
      "Un bout affiné, une bride délicate et une allure naturellement élégante. Modèle de démonstration.",
    category: "chaussures-femme",
    price: 279,
    images: ["heels", "heels"],
    colors: [colors[1], colors[2]],
    sizes: ["36", "37", "38", "39", "40", "41"],
    stock: null,
    sample: true,
    isNew: true,
    best: true,
    seo: "Escarpins Élise noirs – Chaussures femme Maroc",
  },
  {
    id: "sandales-nour",
    name: "Sandales Nour",
    ar: "صندل نور",
    description:
      "Une proposition de sandales pour la prochaine collection. Illustration indicative, modèle de démonstration.",
    category: "sandales",
    price: 229,
    images: ["heels"],
    colors: [colors[2], colors[1]],
    sizes: ["36", "37", "38", "39", "40", "41"],
    stock: null,
    sample: true,
    isNew: false,
    best: false,
    seo: "Sandales Nour – Collection de démonstration",
  },
];
export default products;
