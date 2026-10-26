import { drizzle } from "drizzle-orm/netlify-db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { orders } from "../../db/schema";
import products from "../../src/data/products";
import { delivery, store } from "../../src/lib/config";
export default async (req: Request) => {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });
  if (
    req.headers.get("origin") &&
    req.headers.get("origin") !== new URL(req.url).origin
  )
    return new Response("Forbidden", { status: 403 });
  if (Number(req.headers.get("content-length") || 0) > 20000)
    return new Response("Payload too large", { status: 413 });
  try {
    const schema = z.object({
      requestId: z.string().uuid(),
      name: z.string().trim().min(3).max(120),
      phone: z
        .string()
        .transform((v) => v.replace(/[\s()-]/g, ""))
        .pipe(z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/)),
      city: z.string().trim().min(2).max(100),
      address: z.string().trim().min(10).max(500),
      notes: z.string().max(1000).default(""),
      items: z
        .array(
          z.object({
            id: z.string(),
            color: z.string(),
            size: z.string(),
            quantity: z.number().int().min(1).max(10),
          }),
        )
        .min(1)
        .max(30),
    });
    const raw = await req.text();
    if (raw.length > 20000)
      return new Response("Payload too large", { status: 413 });
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json({ error: "Requête invalide." }, { status: 400 });
    }
    const result = schema.safeParse(parsed);
    if (!result.success)
      return Response.json(
        {
          error:
            "Veuillez vérifier le nom, le téléphone marocain et l’adresse.",
        },
        { status: 400 },
      );
    const data = result.data;
    const seen = new Set<string>();
    const items = data.items.map((i) => {
      const p = products.find((p) => p.id === i.id);
      const key = `${i.id}-${i.color}-${i.size}`;
      if (seen.has(key)) throw Error("invalid");
      seen.add(key);
      if (
        !p ||
        !p.sizes.includes(i.size) ||
        !p.colors.some((c) => c.name === i.color) ||
        (p.stock !== null && i.quantity > p.stock)
      )
        throw Error("invalid");
      return { ...i, name: p.name, price: p.price, sample: p.sample };
    });
    for (const p of products) {
      if (
        p.stock !== null &&
        items.filter((i) => i.id === p.id).reduce((n, i) => n + i.quantity, 0) >
          p.stock
      )
        throw Error("invalid");
    }
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const fee = delivery(subtotal);
    const db = drizzle();
    const [saved] = await db
      .insert(orders)
      .values({
        requestId: data.requestId,
        name: data.name,
        phone: data.phone,
        city: data.city,
        address: data.address,
        notes: data.notes,
        items,
        subtotal,
        deliveryFee: fee,
        total: subtotal + fee,
        demo: store.demo ? 1 : 0,
      })
      .onConflictDoNothing({ target: orders.requestId })
      .returning({ id: orders.id, total: orders.total, demo: orders.demo });
    if (saved) return Response.json(saved, { status: 201 });
    const [existing] = await db
      .select({ id: orders.id, total: orders.total, demo: orders.demo })
      .from(orders)
      .where(eq(orders.requestId, data.requestId));
    return Response.json(existing);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid")
      return Response.json(
        { error: "Produit, taille, couleur ou quantité non disponible." },
        { status: 400 },
      );
    return Response.json(
      {
        error:
          "La commande n’a pas été enregistrée. Réessayez ou contactez-nous sur WhatsApp.",
      },
      { status: 503 },
    );
  }
};
export const config = { path: "/api/orders" };
