import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  Shop,
  ProductPage,
  Cart,
  Confirmation,
  Info,
} from "../components/Pages";
import products, { categories } from "../data/products";
import { store } from "../lib/config";
const infos = [
  "a-propos",
  "contact",
  "faq",
  "livraison-retours",
  "confidentialite",
  "conditions",
  "compte",
];
export const Route = createFileRoute("/$")({
  loader: ({ params }) => {
    const path = params._splat || "";
    const [section, id, ...extra] = path.split("/");
    if (extra.length) throw notFound();
    if (section === "produit" && products.some((p) => p.id === id))
      return {
        kind: "product",
        id,
        title: products.find((p) => p.id === id)!.seo,
      };
    if (section === "categorie" && categories.some((c) => c.slug === id))
      return {
        kind: "category",
        id,
        title: categories.find((c) => c.slug === id)!.name,
      };
    if (
      ["boutique", "panier", "commander", "confirmation", ...infos].includes(
        path,
      )
    )
      return {
        kind: path,
        id: "",
        title:
          path === "boutique"
            ? "Toute la collection"
            : path.charAt(0).toUpperCase() + path.slice(1),
      };
    throw notFound();
  },
  head: ({ loaderData }) => ({
    links: [
      {
        rel: "canonical",
        href:
          store.origin +
          "/" +
          (loaderData?.kind === "product"
            ? "produit/" + loaderData.id
            : loaderData?.kind === "category"
              ? "categorie/" + loaderData.id
              : loaderData?.kind || ""),
      },
    ],
    meta: [
      {
        property: "og:title",
        content: `${loaderData?.title || "Collection"} | NOUVELLE ALLURE`,
      },
      { title: `${loaderData?.title || "Collection"} | NOUVELLE ALLURE` },
      {
        name: "description",
        content:
          loaderData?.kind === "product"
            ? products.find((p) => p.id === loaderData.id)?.description
            : "Découvrez NOUVELLE ALLURE : mode femme et élégance au Maroc. Paiement à la livraison.",
      },
      ...(["panier", "commander", "confirmation", "compte"].includes(
        loaderData?.kind || "",
      )
        ? [{ name: "robots", content: "noindex, nofollow" }]
        : []),
    ],
  }),
  component: Page,
  notFoundComponent: () => (
    <div className="section empty">
      <h1>Page introuvable</h1>
      <a className="btn" href="/">
        Retour à l’accueil
      </a>
    </div>
  ),
});
function Page() {
  const d = Route.useLoaderData();
  if (d.kind === "product")
    return (
      <ProductPage key={d.id} product={products.find((p) => p.id === d.id)!} />
    );
  if (d.kind === "category") return <Shop key={d.id} category={d.id} />;
  if (d.kind === "boutique") return <Shop />;
  if (d.kind === "panier") return <Cart />;
  if (d.kind === "commander") return <Cart checkout />;
  if (d.kind === "confirmation") return <Confirmation />;
  return <Info page={d.kind} />;
}
