import { storage } from "./storage";

export async function initializeAdmins() {
  try {
    const existingAdmins = await storage.getAllAdmins();
    
    if (existingAdmins.length > 0) {
      console.log(`[init] Database already has ${existingAdmins.length} admins. Skipping.`);
      return;
    }

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
  } catch (error) {
    console.error("[init] Failed to initialize admins:", error);
  }
}
