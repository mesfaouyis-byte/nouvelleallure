import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { categories, type Product } from "../data/products";
import { store, whatsapp, money, imageUrl } from "../lib/config";
import { arabic } from "../lib/translations";
import { enableAnalytics, revokeAnalytics } from "../lib/analytics";
export type CartItem = {
  id: string;
  color: string;
  size: string;
  quantity: number;
};
type ShopState = {
  ar: boolean;
  setAr: (v: boolean) => void;
  cart: CartItem[];
  setCart: (v: CartItem[]) => void;
  add: (item: CartItem) => void;
  notify: (v: string) => void;
};
const Context = createContext<ShopState>(null!);
export const useShop = () => useContext(Context);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [ar, setAr] = useState(false),
    [cart, setCart] = useState<CartItem[]>([]),
    [ready, setReady] = useState(false),
    [toast, notify] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("na-cart") || "[]");
      if (Array.isArray(saved))
        setCart(
          saved.filter(
            (i) =>
              typeof i.id === "string" &&
              typeof i.size === "string" &&
              typeof i.color === "string" &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0 &&
              i.quantity <= 10,
          ),
        );
      setAr(localStorage.getItem("na-lang") === "ar");
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      localStorage.setItem("na-cart", JSON.stringify(cart));
      localStorage.setItem("na-lang", ar ? "ar" : "fr");
      document.documentElement.lang = ar ? "ar" : "fr";
      document.documentElement.dir = ar ? "rtl" : "ltr";
    }
  }, [cart, ar, ready]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => notify(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const add = (item: CartItem) => {
    const old = cart.find(
      (i) => i.id === item.id && i.color === item.color && i.size === item.size,
    );
    setCart(
      old
        ? cart.map((i) =>
            i === old
              ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) }
              : i,
          )
        : [...cart, item],
    );
    notify(
      ar ? "تمت الإضافة إلى السلة" : "La pièce a été ajoutée à votre panier",
    );
  };
  return (
    <Context.Provider value={{ ar, setAr, cart, setCart, add, notify }}>
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}{" "}
          <a href="/panier">{ar ? "عرض السلة ←" : "Voir le panier →"}</a>
        </div>
      )}
    </Context.Provider>
  );
}
export function Logo() {
  return (
    <a className="logo" href="/" aria-label="Nouvelle Allure — Accueil">
      <span>NOUVELLE ALLURE</span>
      <small>
        <T>L’ÉLÉGANCE AU QUOTIDIEN</T>
      </small>
    </a>
  );
}
export function Layout({ children }: { children: ReactNode }) {
  const { ar, setAr, cart } = useShop();
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false);
  return (
    <>
      <div className="topbar">
        <span>
          {ar
            ? "التوصيل لجميع أنحاء المغرب | الدفع عند الاستلام"
            : "Livraison partout au Maroc | Paiement à la livraison"}
        </span>
        <button onClick={() => setAr(!ar)}>
          {ar ? "FRANÇAIS" : "العربية"} <span>⌄</span>
        </button>
      </div>
      <header>
        <div className="header-main">
          <button
            className="mobile-only icon"
            aria-label="Menu"
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
          <span className="header-note">
            <T>UNE ALLURE. VOTRE SIGNATURE.</T>
          </span>
          <Logo />
          <div className="header-actions">
            <button
              className="icon"
              aria-label="Rechercher"
              onClick={() => setSearch(!search)}
            >
              <Search />
            </button>
            <a
              className="icon account-icon"
              href="/compte"
              aria-label="Mon espace"
            >
              <UserRound />
            </a>
            <a className="icon cart-icon" href="/panier" aria-label="Panier">
              <ShoppingBag />
              <sup>{cart.reduce((n, i) => n + i.quantity, 0)}</sup>
            </a>
          </div>
        </div>
        <nav className={menu ? "open" : ""}>
          <a href="/boutique">{ar ? "جميع المنتجات" : "Toute la collection"}</a>
          {categories.map((c) => (
            <a
              key={c.slug}
              className={c.slug === "promotions" ? "sale-link" : ""}
              href={`/categorie/${c.slug}`}
            >
              {ar ? c.ar : c.name}
            </a>
          ))}
        </nav>
        {search && (
          <form action="/boutique" className="header-search">
            <Search />
            <input
              name="q"
              placeholder={
                ar ? "ابحثي عن قطعة…" : "Rechercher une pièce, une envie…"
              }
              autoFocus
            />
            <button className="btn">{ar ? "بحث" : "Rechercher"}</button>
            <button
              type="button"
              className="icon"
              onClick={() => setSearch(false)}
              aria-label="Fermer"
            >
              <X />
            </button>
          </form>
        )}
      </header>
      <main>{children}</main>
      <section className="trust-strip">
        <div>
          <Truck />
          <p>
            {ar ? "التوصيل في جميع أنحاء المغرب" : "Partout au Maroc"}
            <small>
              <T>À votre porte, tout simplement</T>
            </small>
          </p>
        </div>
        <div>
          <ShieldCheck />
          <p>
            {ar ? "الدفع عند الاستلام" : "Paiement à la livraison"}
            <small>
              <T>Vous payez à la réception</T>
            </small>
          </p>
        </div>
        <div>
          <MessageCircle />
          <p>
            {ar ? "نحن هنا لمساعدتك" : "À votre écoute"}
            <small>
              <T>Un conseil sur WhatsApp</T>
            </small>
          </p>
        </div>
        <div>
          <RotateCcw />
          <p>
            {ar ? "إرجاع بكل وضوح" : "Des retours en toute clarté"}
            <small>
              <a href="/livraison-retours">
                <T>Consulter les conditions</T>
              </a>
            </small>
          </p>
        </div>
      </section>
      <footer>
        <div className="footer-grid">
          <div>
            <Logo />
            <p>
              <T>Des pièces choisies avec soin.</T>
              <br />
              <T>Une allure qui n’appartient qu’à vous.</T>
            </p>
            <a href={whatsapp()} className="footer-contact">
              WhatsApp · {store.whatsapp}
            </a>
          </div>
          <div>
            <h4>
              <T>LA BOUTIQUE</T>
            </h4>
            <a href="/boutique">
              <T>Toute la collection</T>
            </a>
            <a href="/categorie/nouveautes">
              <T>Nouveautés</T>
            </a>
            <a href="/categorie/promotions">
              <T>Promotions</T>
            </a>
            <a href="/a-propos">
              <T>Notre histoire</T>
            </a>
          </div>
          <div>
            <h4>
              <T>À VOTRE SERVICE</T>
            </h4>
            <a href="/contact">
              <T>Nous contacter</T>
            </a>
            <a href="/faq">
              <T>Questions fréquentes</T>
            </a>
            <a href="/livraison-retours">
              <T>Livraison & retours</T>
            </a>
            <a href="/compte">
              <T>Mes commandes</T>
            </a>
          </div>
          <div>
            <h4>
              <T>RESTONS EN CONTACT</T>
            </h4>
            <p>
              <T>Une question, une taille, un conseil ?</T>
              <br />
              <T>Échangeons sur WhatsApp.</T>
            </p>
            <a className="footer-chat" href={whatsapp()}>
              <T>PARLONS MODE</T> <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} NOUVELLE ALLURE · Pensé pour vous, au
            Maroc.
          </span>
          <div>
            <a href="/confidentialite">
              <T>Confidentialité</T>
            </a>
            <a href="/conditions">
              <T>Conditions générales</T>
            </a>
            <button
              onClick={() => {
                localStorage.removeItem("na-consent");
                window.dispatchEvent(new Event("consent-reset"));
              }}
            >
              <T>Cookies</T>
            </button>
          </div>
        </div>
      </footer>
      <a
        className="floating-wa"
        href={whatsapp()}
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter Nouvelle Allure sur WhatsApp"
      >
        <MessageCircle />
      </a>
      <Consent />
    </>
  );
}
function Consent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!localStorage.getItem("na-consent"));
    enableAnalytics();
    const fn = () => setShow(true);
    window.addEventListener("consent-reset", fn);
    return () => window.removeEventListener("consent-reset", fn);
  }, []);
  const choose = (value: string) => {
    localStorage.setItem("na-consent", value);
    window.dispatchEvent(
      new CustomEvent("analytics-consent", { detail: value }),
    );
    if (value === "granted") enableAnalytics();
    else revokeAnalytics();
    setShow(false);
  };
  return show ? (
    <aside className="consent">
      <p>
        <T>
          Votre confidentialité compte. Aucun traceur publicitaire n’est activé
          sans votre accord.
        </T>{" "}
        <a href="/confidentialite">
          <T>En savoir plus</T>
        </a>
      </p>
      <button onClick={() => choose("denied")}>
        <T>Refuser</T>
      </button>
      <button className="btn" onClick={() => choose("granted")}>
        <T>Accepter</T>
      </button>
    </aside>
  ) : null;
}
export function ProductCard({ product: p }: { product: Product }) {
  const { ar } = useShop();
  return (
    <article className="product-card">
      <a className="product-image" href={`/produit/${p.id}`}>
        <img
          src={imageUrl(p.images[0])}
          loading="lazy"
          alt={ar ? p.ar : p.name}
        />
        <span className="product-tag">
          {p.regularPrice
            ? `−${Math.round((1 - p.price / p.regularPrice) * 100)} %`
            : ar
              ? "جديد"
              : "NOUVEAU"}
        </span>
        <span className="quick-view">
          {ar ? "اكتشفي القطعة" : "Découvrir la pièce"}{" "}
          <ArrowUpRight size={17} />
        </span>
      </a>
      <div className="product-meta">
        <span>
          {categories.find((c) => c.slug === p.category)?.[ar ? "ar" : "name"]}
        </span>
        <span className="swatches">
          {p.colors.map((c) => (
            <i key={c.name} style={{ background: c.hex }} title={c.name} />
          ))}
        </span>
      </div>
      <a className="product-name" href={`/produit/${p.id}`}>
        {ar ? p.ar : p.name}
      </a>
      <div className="price">
        {money(p.price)} {p.regularPrice && <del>{money(p.regularPrice)}</del>}
      </div>
      <small className="sample-label">
        {ar
          ? "نموذج تجريبي • المخزون غير مؤكد"
          : "Modèle de démonstration · stock à confirmer"}
      </small>
    </article>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  const { ar } = useShop();
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {ar ? arabic[eyebrow] || eyebrow : eyebrow}
        </span>
        <h2>{ar ? arabic[title] || title : title}</h2>
      </div>
      {href && (
        <a className="text-link" href={href}>
          <T>Tout découvrir</T> <ArrowRight size={17} />
        </a>
      )}
    </div>
  );
}

export function T({ children }: { children: string }) {
  const { ar } = useShop();
  return <>{ar ? arabic[children.trim()] || children : children}</>;
}
