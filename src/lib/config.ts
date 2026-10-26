export const store = {
  name: "NOUVELLE ALLURE",
  whatsapp: "+212712465913",
  whatsappUrl: "https://wa.me/212712465913",
  deliveryFee: 35,
  freeDeliveryFrom: 699,
  demo: true,
  origin: "https://moroccan-fashion-store.netlify.app",
};
export const money = (n: number) => `${n.toLocaleString("fr-MA")} DH`;
export const imageUrl = (name: string, w = 700) =>
  `/.netlify/images?url=/img/${name}.png&w=${w}&fm=webp`;
export const whatsapp = (product?: string) =>
  `${store.whatsappUrl}?text=${encodeURIComponent(`Bonjour Nouvelle Allure, je souhaite avoir des informations ${product ? `sur le produit ${product}` : "sur ce produit"}. Pouvez-vous me renseigner sur le prix, les tailles disponibles et la livraison ?`)}`;
export const delivery = (subtotal: number) =>
  subtotal >= store.freeDeliveryFrom ? 0 : store.deliveryFee;
