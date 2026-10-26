import {
  pgTable,
  text,
  jsonb,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
export const orders = pgTable("orders", {
  id: uuid().defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().unique(),
  name: text().notNull(),
  phone: text().notNull(),
  city: text().notNull(),
  address: text().notNull(),
  notes: text().notNull().default(""),
  items: jsonb().notNull(),
  subtotal: integer().notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  total: integer().notNull(),
  status: text().notNull().default("pending"),
  demo: integer().notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
