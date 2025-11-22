import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============= SESSION STORAGE (Required for Replit Auth) =============
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// ============= USERS (Required for Replit Auth) =============
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ============= ECOMMERCE PRODUCTS =============
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // camisetas, pantalones, mochilas, zapatos, vestidos, accesorios, laptops, pcs, monitores, perifericos, componentes, smartphones
  image: text("image").notNull(),
  featured: boolean("featured").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const updateProductSchema = insertProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Product = typeof products.$inferSelect;

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

// ============= FOOTERS (Editable footers for each section) =============
export const footers = pgTable("footers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull().unique(), // "tech", "it_services", "food"
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  socialLinks: jsonb("social_links").default({}), // {facebook: "", instagram: "", tiktok: "", whatsapp: ""}
});

export const insertFooterSchema = z.object({
  title: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  socialLinks: z.record(z.string()).optional(),
});

export const updateFooterSchema = insertFooterSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type InsertFooter = z.infer<typeof insertFooterSchema>;
export type UpdateFooter = z.infer<typeof updateFooterSchema>;
export type Footer = typeof footers.$inferSelect;

// ============= SITE SETTINGS (Global branding & configuration) =============
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // "branding", "tech_hero", "it_hero", "food_hero"
  value: jsonb("value").notNull(), // Stores all configuration as JSON
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = z.object({
  key: z.string(),
  value: z.record(z.any()),
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// ============= ADMIN USERS (Role-based access control) =============
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: text("password").notNull(), // Hashed
  role: text("role").notNull().default("viewer"), // "super_admin", "editor", "viewer"
  fullName: varchar("full_name"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by"), // ID of admin who created this user
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["super_admin", "editor", "viewer"]),
  fullName: z.string().optional(),
});

export const updateAdminUserSchema = z.object({
  role: z.enum(["super_admin", "editor", "viewer"]).optional(),
  fullName: z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type UpdateAdminUser = z.infer<typeof updateAdminUserSchema>;

// ============= PASSWORD RESET TOKENS =============
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull(),
  code: varchar("code").notNull().unique(), // 6-digit code
  phone: varchar("phone"), // Phone number if reset via SMS
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPasswordResetSchema = z.object({
  adminId: z.string(),
  code: z.string(),
  phone: z.string().optional(),
  expiresAt: z.date(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// ============= PRODUCT_OWNER (Optional - for future owner tracking) =============
// This tracks which admin user created or owns a product
export const productOwners = pgTable("product_owners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
