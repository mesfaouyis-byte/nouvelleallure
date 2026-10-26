import { useEffect, useState, useRef, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  Truck,
} from "lucide-react";
import products, { categories, type Product } from "../data/products";
import { useShop, ProductCard, SectionTitle, T } from "./Store";
import { store, money, imageUrl, whatsapp, delivery } from "../lib/config";
import { infoArabic, faqArabic } from "../lib/info-ar";
import { arabic } from "../lib/translations";
export function Shop({ category }: { category?: string }) {
  const { ar } = useShop();
  const [q, setQ] = useState(""),
    [max, setMax] = useState(800),
    [color, setColor] = useState(""),
    [size, setSize] = useState(""),
    [sort, setSort] = useState("new"),
    [cat, setCat] = useState(category || "");
  useEffect(() => {
    setQ(new URLSearchParams(location.search).get("q") || "");
  }, []);
  const filtered = products
    .filter(
      (p) =>
        (!cat ||
          (cat === "nouveautes"
            ? p.isNew
            : cat === "promotions"
              ? !!p.regularPrice
              : p.category === cat)) &&
        (p.name + " " + p.ar + " " + p.description)
          .toLowerCase()
          .includes(q.toLowerCase()) &&
        p.price <= max &&
        (!color || p.colors.some((c) => c.name === color)) &&
        (!size || p.sizes.includes(size)),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.price - b.price
        : sort === "desc"
          ? b.price - a.price
          : 0,
    );
  return (
    <div className="section shop-page">
      <div className="breadcrumb">
        <a href="/">
          <T>Accueil</T>
        </a>{" "}
        / {ar ? "المجموعة" : "La collection"}
      </div>
      <span className="eyebrow">
        <T>UNE PIÈCE, MILLE POSSIBILITÉS</T>
      </span>
      <h1>
        {category
          ? categories.find((c) => c.slug === category)?.[ar ? "ar" : "name"] ||
            "Collection"
          : ar
            ? "جميع المنتجات"
            : "Toute la collection"}
      </h1>
      <p className="muted">
        {ar
          ? "مجموعة تجريبية — الأسعار والصور توضيحية والمخزون غير مؤكد."
          : "Collection de démonstration — prix et visuels indicatifs, disponibilité à confirmer."}
      </p>
      <div className="filter-bar">
        <label className="search-field">
          {ar ? "بحث" : "Recherche"}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Bottines, sac, manteau…"
          />
        </label>
        <label>
          {ar ? "الفئة" : "Catégorie"}
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">
              <T>Toutes les catégories</T>
            </option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {ar ? c.ar : c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {ar ? "اللون" : "Couleur"}
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="">
              <T>Toutes</T>
            </option>
            {[
              ...new Set(products.flatMap((p) => p.colors.map((c) => c.name))),
            ].map((c) => (
              <option key={c} value={c}>
                {ar ? arabic[c] || c : c}
              </option>
            ))}
          </select>
        </label>
        <label>
          {ar ? "المقاس" : "Taille"}
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">
              <T>Toutes</T>
            </option>
            {[...new Set(products.flatMap((p) => p.sizes))].map((s) => (
              <option key={s} value={s}>
                {ar ? arabic[s] || s : s}
              </option>
            ))}
          </select>
        </label>
        <label>
          {ar ? "السعر الأقصى" : "Prix maximum"} : {money(max)}
          <input
            type="range"
            min="100"
            max="800"
            step="10"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
        </label>
        <label>
          {ar ? "ترتيب" : "Trier par"}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">
              <T>Nouveautés</T>
            </option>
            <option value="asc">
              <T>Prix croissant</T>
            </option>
            <option value="desc">
              <T>Prix décroissant</T>
            </option>
          </select>
        </label>
      </div>
      <div className="results-line">
        <span>
          {filtered.length} {ar ? "منتجات" : "pièces"}
        </span>
        <button
          onClick={() => {
            setQ("");
            setMax(800);
            setColor("");
            setSize("");
            setCat("");
            setSort("new");
          }}
        >
          <T>Réinitialiser les filtres</T>
        </button>
      </div>
      <div className="products-grid">
        {filtered.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty">
          <h2>
            <T>Aucune pièce pour ces critères</T>
          </h2>
          <p>
            <T>Essayez une autre taille ou un prix maximum plus élevé.</T>
          </p>
        </div>
      )}
    </div>
  );
}
export function ProductPage({ product: p }: { product: Product }) {
  const { ar, add } = useShop();
  const [color, setColor] = useState(p.colors[0].name),
    [size, setSize] = useState(""),
    [quantity, setQuantity] = useState(1),
    [photo, setPhoto] = useState(0),
    [zoom, setZoom] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="section">
      <div className="breadcrumb">
        <a href="/">
          <T>Accueil</T>
        </a>{" "}
        /{" "}
        <a href="/boutique">
          <T>Collection</T>
        </a>{" "}
        / {p.name}
      </div>
      <div className="product-detail">
        <div>
          <button
            className={`gallery-main ${zoom ? "zoomed" : ""}`}
            onClick={() => setZoom(!zoom)}
            aria-label="Agrandir ou réduire la photo"
          >
            <img
              src={imageUrl(p.images[photo], 1100)}
              alt={`${p.name}, ${photo === 0 ? "vue principale" : "détail illustratif"}`}
            />
            <span>{zoom ? "−" : "+"}</span>
          </button>
          <div className="gallery-thumbs">
            {p.images.map((im, i) => (
              <button
                key={i}
                className={photo === i ? "selected" : ""}
                onClick={() => setPhoto(i)}
                aria-label={`Voir l’illustration ${i + 1}`}
              >
                <img
                  src={imageUrl(im, 200)}
                  alt={`Illustration ${i + 1}`}
                  style={
                    i
                      ? { objectPosition: "bottom", transform: "scale(1.3)" }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
          <small className="muted">
            {ar
              ? "صور مولدة توضيحية. تستخدم المشاهد التجريبية الصورة نفسها."
              : "Visuels générés, illustratifs. Les vues de démonstration utilisent la même photographie."}
          </small>
        </div>
        <div className="product-info">
          <span className="eyebrow">
            <T>NOUVELLE ALLURE · LA COLLECTION</T>
          </span>
          <h1>{ar ? p.ar : p.name}</h1>
          <div className="detail-price">
            {money(p.price)}{" "}
            {p.regularPrice && <del>{money(p.regularPrice)}</del>}
          </div>
          <p>
            {ar
              ? "موديل تجريبي من مجموعة نوفيل ألور. الصور والأسعار توضيحية. يرجى تأكيد المواصفات والمقاسات والتوفر عبر واتساب قبل أي شراء حقيقي."
              : p.description}
          </p>
          <div className="sample-box">
            {ar
              ? "منتج تجريبي. المخزون غير مؤكد. الطلبات المسجلة تجريبية وغير قابلة للشحن."
              : "Produit de démonstration. Stock non confirmé. Les commandes enregistrées sont des demandes de test, sans expédition."}
          </div>
          <p className="stock-note">
            {p.stock === null
              ? ar
                ? "المخزون غير مؤكد"
                : "Stock à confirmer"
              : p.stock === 0
                ? ar
                  ? "غير متوفر"
                  : "Épuisé"
                : ar
                  ? `المخزون المتاح: ${p.stock}`
                  : `Stock disponible : ${p.stock}`}
          </p>
          <fieldset>
            <legend>
              {ar ? "اللون" : "Couleur"} : {ar ? arabic[color] || color : color}
            </legend>
            <div className="color-options">
              {p.colors.map((c) => (
                <button
                  title={c.name}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={color === c.name ? "selected" : ""}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{ar ? "المقاس" : "Taille"}</legend>
            <div className="size-options">
              {p.sizes.map((s) => (
                <button
                  aria-pressed={s === size}
                  key={s}
                  className={s === size ? "selected" : ""}
                  onClick={() => {
                    setSize(s);
                    setError("");
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="add-row">
            <div className="quantity">
              <button
                aria-label="Diminuer"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Augmenter"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              className="btn"
              disabled={p.stock === 0}
              onClick={() => {
                if (!size) {
                  setError(
                    ar ? "اختاري المقاس" : "Veuillez sélectionner une taille.",
                  );
                  return;
                }
                add({ id: p.id, color, size, quantity });
              }}
            >
              {ar ? "أضيفي إلى السلة" : "Ajouter au panier"}{" "}
              <ArrowRight size={17} />
            </button>
          </div>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <a
            className="btn outline whatsapp-order"
            href={whatsapp(
              `${p.name} — ${color}, taille ${size || "à préciser"}`,
            )}
          >
            <MessageCircle size={18} />{" "}
            {ar ? "اطلبي عبر واتساب" : "Commander via WhatsApp"}
          </a>
          <div className="product-delivery">
            <Truck size={19} />
            <span>
              {ar ? "التوصيل في المغرب" : "Livraison partout au Maroc"} ·{" "}
              {money(store.deliveryFee)}
              <small>
                {ar ? "مجاناً ابتداءً من" : "Offerte dès"}{" "}
                {money(store.freeDeliveryFrom)} ·{" "}
                {ar ? "الدفع عند الاستلام" : "Paiement à la livraison"}
              </small>
            </span>
          </div>
          <details>
            <summary>
              <T>Détails & entretien</T>
            </summary>
            <p>
              {ar
                ? "موديل تجريبي. ستضاف الخامات والقياسات وإرشادات العناية مع المجموعة الحقيقية. تواصلي معنا لأي معلومات."
                : "Modèle de démonstration. Les matières, mesures et conseils d’entretien définitifs seront renseignés avec le catalogue réel. Contactez-nous pour toute information."}
            </p>
          </details>
          <details>
            <summary>
              <T>Livraison & retours</T>
            </summary>
            <p>
              Les frais s’affichent avant validation. Les délais et conditions
              de retour restent à confirmer avant le lancement commercial.{" "}
              <a href="/livraison-retours">Lire la politique</a>.
            </p>
          </details>
        </div>
      </div>
      <SectionTitle
        eyebrow="LE SENS DU DÉTAIL"
        title="Pour compléter votre allure"
      />
      <div className="products-grid three">
        {products
          .filter((x) => x.id !== p.id)
          .slice(0, 3)
          .map((x) => (
            <ProductCard product={x} key={x.id} />
          ))}
      </div>
    </div>
  );
}
export function Cart({ checkout = false }: { checkout?: boolean }) {
  const { cart, setCart, ar } = useShop();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [requestId, setRequestId] = useState("");
  useEffect(() => {
    setRequestId(crypto.randomUUID());
  }, []);
  const lines = cart
    .map((i, index) => ({
      item: i,
      p: products.find((p) => p.id === i.id),
      index,
    }))
    .filter((l) => l.p);
  const subtotal = lines.reduce((n, l) => n + l.item.quantity * l.p!.price, 0),
    fee = delivery(subtotal);
  const update = (index: number, n: number) =>
    setCart(
      cart.map((i, k) =>
        k === index ? { ...i, quantity: Math.max(1, Math.min(10, n)) } : i,
      ),
    );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          name: form.get("name"),
          phone: form.get("phone"),
          city: form.get("city"),
          address: form.get("address"),
          notes: form.get("notes"),
          items: cart,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.id)
        throw Error(result.error || "Enregistrement impossible.");
      sessionStorage.setItem("na-confirmation", JSON.stringify(result));
      setCart([]);
      localStorage.setItem("na-cart", "[]");
      window.location.assign("/confirmation");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur de connexion. Réessayez.",
      );
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  if (!lines.length)
    return (
      <div className="section empty">
        <ShoppingEmpty />
        <h1>
          {ar
            ? "سلتك تنتظر اختياراتك"
            : "Votre panier attend votre coup de cœur"}
        </h1>
        <p>
          <T>Les belles découvertes commencent ici.</T>
        </p>
        <a href="/boutique" className="btn">
          <T>Découvrir la collection</T> <ArrowRight size={18} />
        </a>
      </div>
    );
  return (
    <div className="section">
      <div className="breadcrumb">
        <a href="/boutique">
          <T>Collection</T>
        </a>{" "}
        / <a href="/panier">Panier</a>
        {checkout ? " / Livraison" : ""}
      </div>
      <h1>
        {checkout
          ? ar
            ? "إتمام الطلب"
            : "Un dernier détail…"
          : ar
            ? "سلة التسوق"
            : "Votre sélection"}
      </h1>
      <div className="checkout-layout">
        <div>
          {!checkout ? (
            lines.map(({ item: i, p, index }) => (
              <div className="cart-line" key={`${i.id}-${i.size}-${i.color}`}>
                <a href={`/produit/${i.id}`}>
                  <img src={imageUrl(p!.images[0], 300)} alt={p!.name} />
                </a>
                <div>
                  <a href={`/produit/${i.id}`}>
                    <h3>{p!.name}</h3>
                  </a>
                  <p>
                    {i.color} · Taille {i.size}
                  </p>
                  <small>
                    <T>Modèle de démonstration</T>
                  </small>
                  <div className="quantity">
                    <button
                      aria-label="Diminuer"
                      onClick={() => update(index, i.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{i.quantity}</span>
                    <button
                      aria-label="Augmenter"
                      onClick={() => update(index, i.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-line-end">
                  <b>{money(p!.price * i.quantity)}</b>
                  <button
                    className="icon"
                    aria-label={`Retirer ${p!.name}`}
                    onClick={() => setCart(cart.filter((_, k) => index !== k))}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <form className="checkout-form" id="order-form" onSubmit={submit}>
              <h2>{ar ? "معلومات التوصيل" : "Vos coordonnées de livraison"}</h2>
              <div className="sample-box">
                <T>
                  Mode démonstration : cette demande est enregistrée en base de
                  données, mais n’entraîne aucune expédition ni paiement.
                </T>
              </div>
              <label>
                {ar ? "الاسم الكامل" : "Nom complet"} *
                <input
                  name="name"
                  required
                  minLength={3}
                  maxLength={120}
                  autoComplete="name"
                />
              </label>
              <label>
                {ar ? "رقم الهاتف المغربي" : "Téléphone marocain"} *
                <input
                  name="phone"
                  required
                  type="tel"
                  pattern="(\+212|0)[5-7][0-9]{8}"
                  placeholder="0612345678"
                  autoComplete="tel"
                />
                <small>
                  <T>
                    Format : 06/07/05 suivi de 8 chiffres ou +212, sans espaces.
                  </T>
                </small>
              </label>
              <label>
                {ar ? "المدينة" : "Ville"} *
                <input
                  name="city"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="address-level2"
                  list="cities"
                />
                <datalist id="cities">
                  {[
                    "Casablanca",
                    "Rabat",
                    "Marrakech",
                    "Tanger",
                    "Fès",
                    "Agadir",
                    "Meknès",
                    "Oujda",
                    "Tétouan",
                    "Kénitra",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </datalist>
              </label>
              <label>
                {ar ? "العنوان الكامل" : "Adresse complète"} *
                <textarea
                  name="address"
                  required
                  minLength={10}
                  maxLength={500}
                  autoComplete="street-address"
                  rows={3}
                />
              </label>
              <label>
                {ar ? "ملاحظات (اختياري)" : "Notes de commande (facultatif)"}
                <textarea name="notes" maxLength={1000} rows={3} />
              </label>
              <div className="payment-choice">
                <Check size={20} />
                <div>
                  <b>
                    <T>Paiement à la livraison</T>
                  </b>
                  <p>
                    <T>Aucune carte bancaire demandée.</T>
                  </p>
                </div>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" required /> <T>J’ai lu les</T>{" "}
                <a href="/conditions" target="_blank">
                  <T>conditions générales</T>
                </a>{" "}
                <T>
                  et je comprends qu’il s’agit d’une commande de démonstration.
                </T>
              </label>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy || !requestId}
                className="btn full"
              >
                {busy
                  ? ar
                    ? "جارٍ التسجيل…"
                    : "Enregistrement en cours…"
                  : ar
                    ? "تسجيل الطلب التجريبي"
                    : "Enregistrer la commande de démonstration"}{" "}
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
        <aside className="order-summary">
          <h2>{ar ? "ملخص الطلب" : "Votre récapitulatif"}</h2>
          {checkout &&
            lines.map(({ item: i, p }) => (
              <div
                className="summary-product"
                key={`${i.id}-${i.color}-${i.size}`}
              >
                <span>
                  {p!.name} × {i.quantity}
                  <small>
                    {i.color} · {i.size}
                  </small>
                </span>
                <b>{money(i.quantity * p!.price)}</b>
              </div>
            ))}
          <div>
            <span>
              <T>Sous-total</T>
            </span>
            <span>{money(subtotal)}</span>
          </div>
          <div>
            <span>
              <T>Livraison au Maroc</T>
            </span>
            <span>{fee ? money(fee) : "Offerte"}</span>
          </div>
          <div className="summary-total">
            <span>
              <T>Total</T>
            </span>
            <span>{money(subtotal + fee)}</span>
          </div>
          <small>
            <T>Prix en DH · Aucun frais ajouté après validation.</T>
          </small>
          {!checkout && (
            <a className="btn full" href="/commander">
              {ar ? "إتمام الطلب" : "Passer commande"} <ArrowRight size={17} />
            </a>
          )}
          <p className="secure-note">
            <Check size={16} /> <T>Paiement à la réception</T>
          </p>
          <a href={whatsapp()}>
            <T>Un conseil ? Écrivez-nous sur WhatsApp</T>
          </a>
        </aside>
      </div>
    </div>
  );
}
function ShoppingEmpty() {
  return <div className="empty-symbol">N / A</div>;
}
export function Confirmation() {
  const { ar } = useShop();
  const [order, setOrder] = useState<{
    id: string;
    total: number;
    demo: number;
  } | null>(null);
  useEffect(() => {
    try {
      setOrder(JSON.parse(sessionStorage.getItem("na-confirmation") || "null"));
    } catch {}
  }, []);
  return (
    <div className="section empty">
      <span className="eyebrow">NOUVELLE ALLURE</span>
      <h1>
        {order
          ? ar
            ? "تم تسجيل طلبك."
            : "Votre demande a été enregistrée."
          : ar
            ? "تأكيد طلبك"
            : "Votre confirmation de commande"}
      </h1>
      {order ? (
        <>
          <p>
            Référence : <strong>{order.id}</strong>
          </p>
          <p>Total : {money(order.total)} · Paiement à la livraison</p>
          {order.demo ? (
            <div className="sample-box">
              <T>
                Commande de démonstration enregistrée. Aucun produit ne sera
                expédié et aucun paiement n’est dû.
              </T>
            </div>
          ) : (
            <p>
              Nous vous contacterons pour confirmer la disponibilité et la
              livraison.
            </p>
          )}
          <a className="btn" href={whatsapp(`Commande ${order.id}`)}>
            <T>Contacter la boutique</T>
          </a>
        </>
      ) : (
        <p>
          <T>
            Aucune commande confirmée dans cette session. La confirmation
            apparaît uniquement après l’enregistrement réussi.
          </T>
        </p>
      )}
      <a className="text-link" href="/boutique">
        <T>Retour à la collection →</T>
      </a>
    </div>
  );
}
const faq = [
  [
    "Comment passer commande ?",
    "Choisissez une pièce, une couleur et une taille, ajoutez-la au panier puis renseignez vos coordonnées. La confirmation apparaît après l’enregistrement réussi de votre demande. Le catalogue actuel est une démonstration : aucune expédition n’est effectuée.",
  ],
  [
    "Quels moyens de paiement acceptez-vous ?",
    "Le paiement à la livraison est le seul moyen de paiement prévu. Aucune information bancaire n’est demandée.",
  ],
  [
    "Livrez-vous dans ma ville ?",
    "La boutique est prévue pour livrer partout au Maroc. Les frais de démonstration sont de 35 DH, offerts dès 699 DH. Les délais seront confirmés lors du lancement commercial.",
  ],
  [
    "Comment choisir ma pointure ?",
    "Les chaussures proposent des pointures configurables de 36 à 41. Contactez-nous sur WhatsApp pour demander les mesures avant un achat réel.",
  ],
  [
    "Puis-je retourner un article ?",
    "La politique commerciale de retour est en préparation. Aucun délai ni remboursement n’est promis pour les modèles de démonstration. Consultez la page Livraison & retours avant tout achat réel.",
  ],
  [
    "Le stock affiché est-il réel ?",
    "Non. Les produits, prix et images actuels sont des exemples, et aucun stock réel n’est déclaré. Les disponibilités seront publiées avec le véritable catalogue.",
  ],
];
export function Info({ page }: { page: string }) {
  const { ar } = useShop();
  if (page === "faq")
    return (
      <div className="section prose">
        <span className="eyebrow">
          <T>À VOTRE ÉCOUTE</T>
        </span>
        <h1>{ar ? "أسئلة شائعة" : "Les réponses à vos questions"}</h1>
        {(ar ? faqArabic : faq).map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <a className="btn" href={whatsapp()}>
          <T>Une autre question ? WhatsApp</T>
        </a>
      </div>
    );
  const content: Record<
    string,
    { title: string; intro: string; sections: [string, string][] }
  > = {
    "a-propos": {
      title: "Une allure qui vous ressemble.",
      intro:
        "NOUVELLE ALLURE est une boutique de mode pensée pour les femmes au Maroc. Notre idée de l’élégance : des lignes choisies, des associations naturelles et le plaisir de se sentir soi-même.",
      sections: [
        [
          "Notre regard sur la mode",
          "Des chaussures aux accessoires, nous construisons un univers contemporain, chaleureux et accessible. Une sélection à explorer à votre rythme, avec un conseil humain sur WhatsApp.",
        ],
        [
          "Une boutique en préparation",
          "Le catalogue présenté est une démonstration. Les visuels sont illustratifs et les produits, matières, prix et disponibilités seront remplacés par les informations réelles avant le lancement commercial.",
        ],
      ],
    },
    contact: {
      title: "Parlons de votre allure.",
      intro:
        "Une taille, une couleur, une question sur la livraison ? Notre point de contact officiel est WhatsApp.",
      sections: [
        ["WhatsApp officiel", store.whatsapp],
        [
          "Livraison",
          "Boutique en ligne destinée au Maroc. Aucune adresse de magasin physique ni horaires d’ouverture ne sont actuellement annoncés.",
        ],
        [
          "Suivi d’une demande",
          "Pour toute demande enregistrée, transmettez sa référence sur WhatsApp. Ne communiquez jamais d’informations bancaires.",
        ],
      ],
    },
    compte: {
      title: "Votre espace, en toute simplicité.",
      intro:
        "Commandez sans créer de compte. Pour suivre votre demande, contactez notre équipe avec la référence affichée après son enregistrement.",
      sections: [
        [
          "Suivre une commande",
          "Envoyez votre référence sur WhatsApp. Aucune liste de commandes ni donnée personnelle n’est accessible publiquement.",
        ],
        [
          "La sélection continue",
          "Votre panier est conservé sur cet appareil. Vous pouvez le modifier ou le supprimer à tout moment.",
        ],
      ],
    },
    "livraison-retours": {
      title: "Livraison & retours",
      intro:
        "Ces informations décrivent la configuration de démonstration. Les conditions définitives seront publiées avant l’ouverture des ventes.",
      sections: [
        [
          "Livraison partout au Maroc",
          "Frais indicatifs : 35 DH, livraison offerte à partir de 699 DH. Le montant exact est visible dans le panier avant validation. Aucun délai de livraison n’est annoncé tant que le service commercial n’est pas ouvert.",
        ],
        [
          "Paiement à la livraison",
          "Aucun paiement en ligne. Dans le futur parcours commercial, le règlement est prévu à réception, après confirmation de la commande par la boutique.",
        ],
        [
          "Retour, échange ou article endommagé",
          "La procédure commerciale, les délais d’éligibilité, les frais et les modalités de remboursement doivent être validés par la boutique avant lancement. Contactez le WhatsApp officiel avant tout retour. Cette page ne limite pas les droits légaux applicables au Maroc.",
        ],
        [
          "Catalogue de démonstration",
          "Les demandes de test sont enregistrées mais aucun colis n’est expédié.",
        ],
      ],
    },
    confidentialite: {
      title: "Votre confidentialité",
      intro:
        "Nous utilisons uniquement les informations nécessaires au fonctionnement de la boutique et à l’enregistrement de vos demandes.",
      sections: [
        [
          "Données collectées",
          "Nom, téléphone, ville, adresse, contenu du panier et notes sont enregistrés lorsque vous validez une demande. Évitez les données sensibles dans vos notes. Les demandes sont conservées dans une base de données hébergée via Netlify.",
        ],
        [
          "Stockage sur votre appareil",
          "Le panier, la langue et votre choix de consentement sont conservés localement dans votre navigateur. La référence de confirmation est conservée pendant la session. Vous pouvez supprimer ces données dans les réglages du navigateur.",
        ],
        [
          "Mesure d’audience et publicité",
          "Aucun identifiant Analytics, Meta ou TikTok n’est configuré. Aucun traceur marketing n’est chargé par défaut. Les intégrations futures nécessitent votre accord ; votre choix est modifiable via Cookies en pied de page.",
        ],
        [
          "Vos droits et contact",
          "Pour demander un accès, une rectification ou une suppression de vos données, contactez NOUVELLE ALLURE au " +
            store.whatsapp +
            ". Les durées de conservation, informations légales du responsable et formalités applicables doivent être complétées avant le lancement commercial.",
        ],
        [
          "Services externes",
          "Un clic sur WhatsApp ouvre un service de Meta soumis à ses propres conditions. Les polices de caractères sont chargées via Google Fonts.",
        ],
      ],
    },
    conditions: {
      title: "Conditions générales",
      intro:
        "Le site NOUVELLE ALLURE présente actuellement une collection de démonstration. La validation d’une demande de test ne constitue pas un achat réel.",
      sections: [
        [
          "Produits et prix",
          "Les visuels générés, descriptions et prix en dirhams sont illustratifs. La disponibilité réelle n’est pas déclarée. Les informations complètes et le stock doivent être publiés avant l’activation des ventes.",
        ],
        [
          "Commandes",
          "Vous choisissez le produit, sa couleur, sa taille et sa quantité. Le total et les frais de livraison s’affichent avant validation. Une demande n’est confirmée à l’écran qu’après enregistrement réussi en base de données.",
        ],
        [
          "Paiement et livraison",
          "Le paiement prévu est à la livraison au Maroc. Aucune carte bancaire n’est acceptée sur le site. Aucun envoi ni paiement n’est effectué en démonstration.",
        ],
        [
          "Informations légales avant lancement",
          "La raison sociale, l’adresse du vendeur, les références d’immatriculation, les conditions de rétractation et les modalités de résolution des litiges doivent être renseignées et validées avant les ventes réelles. Les droits légaux du consommateur restent applicables.",
        ],
        ["Contact", "Pour toute question : WhatsApp " + store.whatsapp + "."],
      ],
    },
  };
  const data = ar ? infoArabic[page] : content[page];
  if (!data)
    return (
      <div className="section empty">
        <h1>Cette page n’existe pas.</h1>
        <a className="btn" href="/">
          Retour à l’accueil
        </a>
      </div>
    );
  return (
    <div className="section prose">
      <span className="eyebrow">NOUVELLE ALLURE</span>
      <h1>{data.title}</h1>
      <p className="intro">{data.intro}</p>
      {data.sections.map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
      {["contact", "a-propos", "compte"].includes(page) && (
        <a className="btn" href={whatsapp()}>
          <MessageCircle size={18} /> <T>Discuter sur WhatsApp</T>
        </a>
      )}
    </div>
  );
}
