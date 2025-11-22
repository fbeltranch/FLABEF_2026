import { storage } from "./storage";

const defaultProductCategories = [
  "camisetas", "pantalones", "mochilas", "zapatos", "vestidos", "accesorios",
  "laptops", "pcs", "monitores", "perifericos", "componentes", "smartphones",
];

const defaultFoodCategories = [
  "desayunos", "almuerzos", "snacks", "bebidas", "postres",
];

export async function initializeAdmins() {
  try {
    const existingAdmins = await storage.getAllAdmins();
    
    if (existingAdmins.length > 0) {
      console.log(`[init] Database already has ${existingAdmins.length} admins. Skipping.`);
    } else {
      console.log("[init] Creating super admin user...");

      // Create the super admin user
      await storage.createAdmin({
        email: "admin@flabef.com",
        password: "admin123", // In production, use hashed passwords!
        role: "super_admin",
        fullName: "Super Admin",
        documentType: "DNI",
        documentNumber: "12345678",
        recoveryEmail: "admin@flabef.com",
      });

      console.log("[init] Super admin created: admin@flabef.com / admin123");
    }

    // Initialize product categories
    const existingProductCategories = await storage.getProductCategories();
    if (existingProductCategories.length === 0) {
      console.log("[init] Creating default product categories...");
      for (const category of defaultProductCategories) {
        await storage.createProductCategory({ name: category });
      }
      console.log(`[init] Created ${defaultProductCategories.length} product categories`);
    }

    // Initialize food categories
    const existingFoodCategories = await storage.getFoodCategories();
    if (existingFoodCategories.length === 0) {
      console.log("[init] Creating default food categories...");
      for (const category of defaultFoodCategories) {
        await storage.createFoodCategory({ name: category });
      }
      console.log(`[init] Created ${defaultFoodCategories.length} food categories`);
    }
  } catch (error) {
    console.error("[init] Failed to initialize:", error);
  }
}
