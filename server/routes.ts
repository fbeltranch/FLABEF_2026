import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";
import { 
  insertProductSchema,
  updateProductSchema,
  insertITServiceSchema,
  updateITServiceSchema,
  insertFoodItemSchema,
  updateFoodItemSchema,
  insertCartItemSchema,
  insertContactRequestSchema,
  insertFooterSchema,
  insertSiteSettingSchema,
  insertAdminUserSchema,
  updateAdminUserSchema,
} from "@shared/schema";
import { isSuperAdmin, isEditor } from "./simpleAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app, storage);

  // ============= AUTH ROUTES =============
  app.get('/api/auth/user', (req: any, res) => {
    if (req.session.userId) {
      return res.json({ email: req.session.user?.email || "admin" });
    }
    res.status(401).json({ message: "Not authenticated" });
  });
  // ============= PRODUCTS =============
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const products = await storage.getProducts(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Protected admin routes
  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const validated = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validated);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ============= IT SERVICES =============
  app.get("/api/it-services", async (_req, res) => {
    try {
      const services = await storage.getITServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch IT services" });
    }
  });

  app.get("/api/it-services/:id", async (req, res) => {
    try {
      const service = await storage.getITService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/it-services", async (req, res) => {
    try {
      const validated = insertITServiceSchema.parse(req.body);
      const service = await storage.createITService(validated);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  app.put("/api/it-services/:id", async (req, res) => {
    try {
      const validated = updateITServiceSchema.parse(req.body);
      const service = await storage.updateITService(req.params.id, validated);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  app.delete("/api/it-services/:id", async (req, res) => {
    try {
      const success = await storage.deleteITService(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // ============= FOOD ITEMS =============
  app.get("/api/food-items", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const items = await storage.getFoodItems(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch food items" });
    }
  });

  app.get("/api/food-items/:id", async (req, res) => {
    try {
      const item = await storage.getFoodItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Food item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch food item" });
    }
  });

  app.post("/api/food-items", async (req, res) => {
    try {
      const validated = insertFoodItemSchema.parse(req.body);
      const item = await storage.createFoodItem(validated);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid food item data" });
    }
  });

  app.put("/api/food-items/:id", async (req, res) => {
    try {
      const validated = updateFoodItemSchema.parse(req.body);
      const item = await storage.updateFoodItem(req.params.id, validated);
      if (!item) {
        return res.status(404).json({ error: "Food item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid food item data" });
    }
  });

  app.delete("/api/food-items/:id", async (req, res) => {
    try {
      const success = await storage.deleteFoodItem(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Food item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete food item" });
    }
  });

  // ============= SHOPPING CART =============
  app.get("/api/cart", async (_req, res) => {
    try {
      const items = await storage.getCartItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.get("/api/cart/:id", async (req, res) => {
    try {
      const item = await storage.getCartItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart item" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validated = insertCartItemSchema.parse(req.body);
      const item = await storage.addCartItem(validated);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      const item = await storage.updateCartItem(req.params.id, quantity);
      
      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeCartItem(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (_req, res) => {
    try {
      await storage.clearCart();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // ============= CONTACT REQUESTS =============
  app.post("/api/contact", async (req, res) => {
    try {
      const validated = insertContactRequestSchema.parse(req.body);
      const request = await storage.createContactRequest(validated);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact request data" });
    }
  });

  // ============= FOOTERS =============
  app.get("/api/footers", async (_req, res) => {
    try {
      const footers = await storage.getAllFooters();
      res.json(footers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footers" });
    }
  });

  app.get("/api/footers/:section", async (req, res) => {
    try {
      const footer = await storage.getFooter(req.params.section);
      if (!footer) {
        return res.status(404).json({ error: "Footer not found" });
      }
      res.json(footer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footer" });
    }
  });

  app.put("/api/footers/:section", isAuthenticated, async (req, res) => {
    try {
      console.log("Updating footer for section:", req.params.section);
      console.log("Request body:", req.body);
      
      const validated = insertFooterSchema.parse(req.body);
      console.log("Validated data:", validated);
      
      const footer = await storage.updateFooter(req.params.section, validated);
      console.log("Updated footer:", footer);
      
      res.json(footer);
    } catch (error: any) {
      console.error("Footer update error:", error);
      res.status(400).json({ error: error.message || "Invalid footer data" });
    }
  });

  // ============= SITE SETTINGS =============
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSiteSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.put("/api/settings/:key", isAuthenticated, async (req, res) => {
    try {
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ error: "Value is required" });
      }
      const setting = await storage.updateSiteSetting(req.params.key, value);
      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid settings data" });
    }
  });

  // ============= ADMIN USERS MANAGEMENT =============
  app.get("/api/admins", isSuperAdmin, async (_req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  app.post("/api/admins", isSuperAdmin, async (req, res) => {
    try {
      const validated = insertAdminUserSchema.parse(req.body);
      const admin = await storage.createAdmin({
        ...validated,
        createdBy: (req.session as any).user?.id,
      });
      res.json(admin);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid admin data" });
    }
  });

  app.put("/api/admins/:id", isSuperAdmin, async (req, res) => {
    try {
      const validated = updateAdminUserSchema.parse(req.body);
      
      // Opción 1: Super admin puede cambiar contraseña de otros admins
      // Si password está vacío, no cambiar contraseña
      if (validated.password === "" || !validated.password) {
        const { password, ...dataWithoutPassword } = validated;
        const admin = await storage.updateAdmin(req.params.id, dataWithoutPassword);
        return res.json(admin);
      }
      
      const admin = await storage.updateAdmin(req.params.id, validated);
      res.json(admin);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid admin data" });
    }
  });

  app.delete("/api/admins/:id", isSuperAdmin, async (req, res) => {
    try {
      await storage.deleteAdmin(req.params.id);
      res.json({ message: "Admin deleted" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete admin" });
    }
  });

  // ============= PASSWORD RESET =============
  // Request password reset via SMS (Opción 3)
  app.post("/api/password-reset/request-sms", async (req, res) => {
    try {
      const { email, phone, documentNumber } = req.body;
      if (!email || !phone) {
        return res.status(400).json({ error: "Email and phone required" });
      }

      // Verify document first
      if (documentNumber) {
        const isValid = await storage.verifyAdminDocument(email, documentNumber);
        if (!isValid) {
          return res.status(400).json({ error: "Invalid email or document number" });
        }
      }

      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        // Don't reveal if user exists
        return res.json({ message: "If email exists, code will be sent" });
      }

      // Generate 6-digit code
      const code = Math.random().toString().slice(2, 8).padStart(6, "0");
      await storage.createResetToken(admin.id, code, phone, email);

      const isDev = process.env.NODE_ENV === "development";
      let smsSent = false;

      // Try to send SMS via Twilio if configured
      try {
        const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

        if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
          const twilio = require("twilio");
          const client = twilio(twilioAccountSid, twilioAuthToken);
          await client.messages.create({
            body: `Tu código de reseteo de contraseña es: ${code}. Válido por 15 minutos.`,
            from: twilioPhoneNumber,
            to: phone,
          });
          smsSent = true;
        }
      } catch (smsError) {
        console.error("Failed to send SMS:", smsError);
      }

      console.log(`[PASSWORD RESET] Code for ${email}: ${code}`);

      // In development, return code for testing
      if (isDev) {
        return res.json({ message: "Code sent to phone", code });
      }

      res.json({ message: "Code sent to phone" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to request password reset" });
    }
  });

  // Request password reset via email (Alternative)
  app.post("/api/password-reset/request-email", async (req, res) => {
    try {
      const { email, adminEmail, documentNumber } = req.body;
      const emailToUse = email || adminEmail; // Support both field names
      
      if (!emailToUse) {
        return res.status(400).json({ error: "Email required" });
      }

      // Verify document first - check adminEmail if provided
      if (documentNumber && adminEmail) {
        const isValid = await storage.verifyAdminDocument(adminEmail, documentNumber);
        if (!isValid) {
          return res.status(400).json({ error: "Invalid email or document number" });
        }
      }

      const admin = adminEmail 
        ? await storage.getAdminByEmail(adminEmail)
        : await storage.getAdminByEmail(emailToUse);
        
      if (!admin) {
        return res.json({ message: "If email exists, code will be sent" });
      }

      const code = Math.random().toString().slice(2, 8).padStart(6, "0");
      await storage.createResetToken(admin.id, code, undefined, emailToUse);

      const isDev = process.env.NODE_ENV === "development";

      // Log code
      console.log(`[PASSWORD RESET] Code for ${email}: ${code}`);

      // In development, return code for testing
      if (isDev) {
        return res.json({ message: "Code sent to email", code });
      }

      res.json({ message: "Code sent to email" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to request password reset" });
    }
  });

  // Verify document for password reset
  app.post("/api/password-reset/verify-document", async (req, res) => {
    try {
      const { email, documentNumber } = req.body;
      if (!email || !documentNumber) {
        return res.status(400).json({ error: "Email and document number required" });
      }

      const isValid = await storage.verifyAdminDocument(email, documentNumber);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid email or document number" });
      }

      res.json({ message: "Document verified" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to verify document" });
    }
  });

  // Verify code and reset password
  app.post("/api/password-reset/verify", async (req, res) => {
    try {
      const { code, newPassword } = req.body;
      if (!code || !newPassword) {
        return res.status(400).json({ error: "Code and new password required" });
      }

      const token = await storage.getResetToken(code);
      if (!token) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }

      // Check if token expired
      if (new Date() > token.expiresAt) {
        return res.status(400).json({ error: "Code has expired" });
      }

      // Update password
      await storage.updateAdmin(token.adminId, { password: newPassword });
      await storage.markTokenAsUsed(code);

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to reset password" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
