import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema,
  updateProductSchema,
  insertITServiceSchema,
  updateITServiceSchema,
  insertFoodItemSchema,
  updateFoodItemSchema,
  insertCartItemSchema,
  insertContactRequestSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
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

  app.delete("/api/products/:id", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
