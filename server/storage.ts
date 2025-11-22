import { 
  type Product, 
  type InsertProduct,
  type ITService,
  type InsertITService,
  type FoodItem,
  type InsertFoodItem,
  type CartItem,
  type InsertCartItem,
  type ContactRequest,
  type InsertContactRequest,
  type User,
  type UpsertUser,
  type Footer,
  type InsertFooter,
  type UpdateFooter,
  type SiteSetting,
  type InsertSiteSetting,
  type AdminUser,
  type InsertAdminUser,
  type UpdateAdminUser,
  type PasswordResetToken,
  products,
  itServices,
  foodItems,
  cartItems,
  contactRequests,
  users,
  footers,
  siteSettings,
  adminUsers,
  passwordResetTokens,
} from "@shared/schema";
import { and } from "drizzle-orm";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(category?: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // IT Services
  getITServices(): Promise<ITService[]>;
  getITService(id: string): Promise<ITService | undefined>;
  createITService(service: InsertITService): Promise<ITService>;
  updateITService(id: string, service: Partial<InsertITService>): Promise<ITService | undefined>;
  deleteITService(id: string): Promise<boolean>;
  
  // Food Items
  getFoodItems(category?: string): Promise<FoodItem[]>;
  getFoodItem(id: string): Promise<FoodItem | undefined>;
  createFoodItem(item: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: string, item: Partial<InsertFoodItem>): Promise<FoodItem | undefined>;
  deleteFoodItem(id: string): Promise<boolean>;
  
  // Cart
  getCartItems(): Promise<CartItem[]>;
  getCartItem(id: string): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<boolean>;
  clearCart(): Promise<void>;
  
  // Contact
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Footers
  getFooter(section: string): Promise<Footer | undefined>;
  updateFooter(section: string, footer: InsertFooter): Promise<Footer>;
  getAllFooters(): Promise<Footer[]>;

  // Site Settings
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(key: string, value: Record<string, any>): Promise<SiteSetting>;
  getAllSiteSettings(): Promise<SiteSetting[]>;

  // Admin Users
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  getAdminById(id: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser & { createdBy?: string }): Promise<AdminUser>;
  updateAdmin(id: string, admin: UpdateAdminUser): Promise<AdminUser>;
  deleteAdmin(id: string): Promise<void>;
  getAllAdmins(): Promise<AdminUser[]>;

  // Password Reset Tokens
  createResetToken(adminId: string, code: string, phone?: string, email?: string): Promise<PasswordResetToken>;
  getResetToken(code: string): Promise<PasswordResetToken | undefined>;
  markTokenAsUsed(code: string): Promise<void>;
  cleanExpiredTokens(): Promise<void>;
  
  // Document Verification
  verifyAdminDocument(email: string, documentNumber: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.cartItems = new Map();
  }

  // ===== Products =====
  async getProducts(category?: string): Promise<Product[]> {
    let query = db.select().from(products);
    if (category && category !== "all") {
      query = query.where(eq(products.category, category));
    }
    return query;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // ===== IT Services =====
  async getITServices(): Promise<ITService[]> {
    return db.select().from(itServices);
  }

  async getITService(id: string): Promise<ITService | undefined> {
    const result = await db.select().from(itServices).where(eq(itServices.id, id));
    return result[0];
  }

  async createITService(service: InsertITService): Promise<ITService> {
    const result = await db.insert(itServices).values(service).returning();
    return result[0];
  }

  async updateITService(id: string, updates: Partial<InsertITService>): Promise<ITService | undefined> {
    const result = await db
      .update(itServices)
      .set(updates)
      .where(eq(itServices.id, id))
      .returning();
    return result[0];
  }

  async deleteITService(id: string): Promise<boolean> {
    const result = await db.delete(itServices).where(eq(itServices.id, id));
    return result.rowCount > 0;
  }

  // ===== Food Items =====
  async getFoodItems(category?: string): Promise<FoodItem[]> {
    let query = db.select().from(foodItems);
    if (category && category !== "all") {
      query = query.where(eq(foodItems.category, category));
    }
    return query;
  }

  async getFoodItem(id: string): Promise<FoodItem | undefined> {
    const result = await db.select().from(foodItems).where(eq(foodItems.id, id));
    return result[0];
  }

  async createFoodItem(item: InsertFoodItem): Promise<FoodItem> {
    const result = await db.insert(foodItems).values(item).returning();
    return result[0];
  }

  async updateFoodItem(id: string, updates: Partial<InsertFoodItem>): Promise<FoodItem | undefined> {
    const result = await db
      .update(foodItems)
      .set(updates)
      .where(eq(foodItems.id, id))
      .returning();
    return result[0];
  }

  async deleteFoodItem(id: string): Promise<boolean> {
    const result = await db.delete(foodItems).where(eq(foodItems.id, id));
    return result.rowCount > 0;
  }

  // ===== Cart (In-Memory) =====
  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async getCartItem(id: string): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem: CartItem = { ...item, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeCartItem(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }

  // ===== Contact Requests =====
  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const result = await db.insert(contactRequests).values(request).returning();
    return result[0];
  }

  // ===== Users =====
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: userData,
      })
      .returning();
    return result[0];
  }

  // ===== Footers =====
  async getFooter(section: string): Promise<Footer | undefined> {
    const result = await db.select().from(footers).where(eq(footers.section, section));
    return result[0];
  }

  async updateFooter(section: string, footer: InsertFooter): Promise<Footer> {
    const result = await db
      .insert(footers)
      .values({ section, ...footer })
      .onConflictDoUpdate({
        target: footers.section,
        set: footer,
      })
      .returning();
    return result[0];
  }

  async getAllFooters(): Promise<Footer[]> {
    return db.select().from(footers);
  }

  // ===== Site Settings =====
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return result[0];
  }

  async updateSiteSetting(key: string, value: Record<string, any>): Promise<SiteSetting> {
    const result = await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return result[0];
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }

  // ===== Admin Users =====
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return result[0];
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return result[0];
  }

  async createAdmin(adminData: InsertAdminUser & { createdBy?: string }): Promise<AdminUser> {
    const result = await db
      .insert(adminUsers)
      .values({
        email: adminData.email,
        password: adminData.password, // In production, hash this!
        role: adminData.role,
        fullName: adminData.fullName,
        documentType: adminData.documentType,
        documentNumber: adminData.documentNumber,
        createdBy: adminData.createdBy,
      })
      .returning();
    return result[0];
  }

  async updateAdmin(id: string, adminData: UpdateAdminUser): Promise<AdminUser> {
    const result = await db
      .update(adminUsers)
      .set({ ...adminData, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return result[0];
  }

  async deleteAdmin(id: string): Promise<void> {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  }

  async getAllAdmins(): Promise<AdminUser[]> {
    return db.select().from(adminUsers);
  }

  // ===== Password Reset Tokens =====
  async createResetToken(adminId: string, code: string, phone?: string, email?: string): Promise<PasswordResetToken> {
    // Expire in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const result = await db
      .insert(passwordResetTokens)
      .values({
        adminId,
        code,
        phone,
        email,
        expiresAt,
      })
      .returning();
    return result[0];
  }

  async getResetToken(code: string): Promise<PasswordResetToken | undefined> {
    const result = await db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.code, code), eq(passwordResetTokens.isUsed, false)));
    return result[0];
  }

  async markTokenAsUsed(code: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ isUsed: true })
      .where(eq(passwordResetTokens.code, code));
  }

  async cleanExpiredTokens(): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.isUsed, false),
      ));
  }

  // ===== Document Verification =====
  async verifyAdminDocument(email: string, documentNumber: string): Promise<boolean> {
    const admin = await db.select()
      .from(adminUsers)
      .where(and(
        eq(adminUsers.email, email),
        eq(adminUsers.documentNumber, documentNumber),
      ));
    return admin.length > 0;
  }
}

export const storage = new DatabaseStorage();
