import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Camera } from "lucide-react";
import products, { categories } from "../data/products";
import { imageUrl, whatsapp, store } from "../lib/config";
import { ProductCard, SectionTitle, T, useShop } from "../components/Store";
export const Route = createFileRoute("/")({
  head: () => ({ links: [{ rel: "canonical", href: store.origin + "/" }] }),
  component: Home,
});
function Home() {
  const { ar } = useShop();
  return (
    <>
      <section className="hero">
        <img
          className="hero-img"
          src={imageUrl("hero", 1800)}
          alt="Élégance contemporaine dans un patio marocain"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow">
            <T>NOUVELLE SAISON · NOUVELLE ÉNERGIE</T>
          </span>
          <h1>
            {ar ? (
              <>
                اكشفي عن
                <br />
                <em>أناقتك.</em>
              </>
            ) : (
              <>
                Révélez
                <br />
                votre <em>allure.</em>
              </>
            )}
          </h1>
          <p>
            {ar
              ? "قطع تتحدث عنك. أناقة ترافقك كل يوم."
              : "Des pièces qui vous ressemblent."}
            <br />
            {ar
              ? "مجموعة مختارة من أجلك."
              : "Une élégance qui vous accompagne."}
          </p>
          <a href="/boutique" className="btn light">
            {ar ? "اكتشفي المجموعة" : "Découvrir la collection"}{" "}
            <ArrowRight size={18} />
          </a>
          <small>
            <T>LE STYLE CHANGE. L’ALLURE RESTE.</T>
          </small>
        </div>
        <div className="hero-bottom">
          <span>
            ÉDITION <i /> 01
          </span>
          <span>
            <T>LA COLLECTION NOUVELLE ALLURE</T>
          </span>
        </div>
      </section>
      <div className="brand-ribbon">
        <span>
          <T>L’élégance, sans compromis.</T>
        </span>
        <i>✦</i>
        <span>
          <T>Votre style, votre signature.</T>
        </span>
        <i>✦</i>
        <span>
          <T>Imaginé pour vos envies.</T>
        </span>
      </div>
      <section className="section categories-section">
        <SectionTitle
          eyebrow="À CHAQUE ENVIE, SON ALLURE"
          title={ar ? "عالمك من الأناقة" : "Explorez nos univers"}
        />
        <div className="category-grid">
          {[categories[0], categories[3], categories[4], categories[1]].map(
            (c, i) => (
              <a
                className="category-tile"
                key={c.slug}
                href={`/categorie/${c.slug}`}
              >
                <img src={imageUrl(c.image, 600)} loading="lazy" alt={c.name} />
                <div>
                  <span>
                    <small>0{i + 1} / LA SÉLECTION</small>
                    <h3>{ar ? c.ar : c.name}</h3>
                  </span>
                  <ArrowUpRight />
                </div>
              </a>
            ),
          )}
        </div>
      </section>
      <section className="section arrivals">
        <SectionTitle
          eyebrow="LE RENDEZ-VOUS DU STYLE"
          title={ar ? "وصلت للتو" : "Fraîchement arrivées"}
          href="/categorie/nouveautes"
        />
        <div className="products-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="editorial">
        <div className="editorial-image">
          <img
            src={imageUrl("coat", 1000)}
            alt="Silhouette camel de la collection"
            loading="lazy"
          />
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">
            <T>LES ESSENTIELS, AUTREMENT</T>
          </span>
          <h2>
            <T>Moins d’hésitation.</T>
            <br />
            <em>
              <T>Plus d’allure.</T>
            </em>
          </h2>
          <p>
            <T>
              Des lignes intemporelles, des tons qui s’accordent et ce petit
              détail qui change tout. Découvrez les pièces qui font la
              différence.
            </T>
          </p>
          <a href="/categorie/promotions" className="btn">
            <T>La sélection à prix doux</T> <ArrowRight size={17} />
          </a>
          <span className="editorial-note">
            <T>JUSQU’À −25 % SUR LES MODÈLES SÉLECTIONNÉS</T>
          </span>
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="LA SÉLECTION SIGNATURE"
          title={ar ? "اختياراتنا المفضلة" : "Les pièces à adopter"}
          href="/boutique"
        />
        <p className="section-note">
          <T>
            Notre sélection de démonstration, en attendant vos véritables
            best-sellers.
          </T>
        </p>
        <div className="products-grid three">
          {products
            .filter((p) => p.best)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="brand-story">
        <span className="eyebrow">
          <T>BIENVENUE CHEZ NOUVELLE ALLURE</T>
        </span>
        <h2>
          <T>La mode passe.</T>
          <br />
          <T>Votre</T>{" "}
          <em>
            <T>allure</T>
          </em>{" "}
          <T>vous appartient.</T>
        </h2>
        <p>
          <T>Nous croyons aux pièces que l’on aime porter et reporter.</T>
          <br />
          <T>
            À une mode accessible, à l’élégance spontanée, à la confiance d’être
            soi.
          </T>
        </p>
        <a className="text-link" href="/a-propos">
          <T>L’esprit Nouvelle Allure</T> <ArrowUpRight size={18} />
        </a>
      </section>
      <section className="section social-section">
        <div>
          <Camera size={24} />
          <span className="eyebrow">
            <T>LE STYLE SE PARTAGE</T>
          </span>
          <h2>
            <T>Votre prochaine</T>
            <br />
            <em>
              <T>inspiration.</T>
            </em>
          </h2>
          <p>
            <T>Notre univers social se prépare.</T>
            <br />
            <T>En attendant, parlons de vos envies.</T>
          </p>
          <a className="text-link" href={whatsapp()}>
            <T>Retrouvons-nous sur WhatsApp</T> <ArrowUpRight size={17} />
          </a>
        </div>
        <img
          src={imageUrl("bag", 500)}
          loading="lazy"
          alt="Sac caramel de démonstration"
        />
        <img
          src={imageUrl("boots", 500)}
          loading="lazy"
          alt="Bottines chocolat de démonstration"
        />
      </section>
      <div className="demo-notice">
        <T>
          Collection de démonstration : visuels illustratifs, prix indicatifs et
          disponibilité à confirmer. Aucun avis client fictif.
        </T>
      </div>
    </>
  );
}
