import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============= TECH STORE PRODUCTS =============
export const techProducts = pgTable("tech_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // laptops, pcs, components, peripherals, monitors, smartphones, accessories
  image: text("image").notNull(),
  featured: boolean("featured").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
});

export const insertTechProductSchema = createInsertSchema(techProducts).omit({
  id: true,
});

export const updateTechProductSchema = insertTechProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type InsertTechProduct = z.infer<typeof insertTechProductSchema>;
export type UpdateTechProduct = z.infer<typeof updateTechProductSchema>;
export type TechProduct = typeof techProducts.$inferSelect;

// ============= IT SERVICES =============
export const itServices = pgTable("it_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  icon: text("icon").notNull(), // lucide icon name
  available: boolean("available").notNull().default(true),
});

export const insertITServiceSchema = createInsertSchema(itServices).omit({
  id: true,
});

export const updateITServiceSchema = insertITServiceSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type InsertITService = z.infer<typeof insertITServiceSchema>;
export type UpdateITService = z.infer<typeof updateITServiceSchema>;
export type ITService = typeof itServices.$inferSelect;

// ============= FOOD MENU =============
export const foodItems = pgTable("food_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // desayunos, almuerzos, snacks
  image: text("image").notNull(),
  available: boolean("available").notNull().default(true),
});

export const insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
});

export const updateFoodItemSchema = insertFoodItemSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type UpdateFoodItem = z.infer<typeof updateFoodItemSchema>;
export type FoodItem = typeof foodItems.$inferSelect;

// ============= SHOPPING CART =============
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  image: text("image").notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// ============= CONTACT FORMS =============
export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  serviceType: text("service_type").notNull(), // tech, it_service, food
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
});

export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
