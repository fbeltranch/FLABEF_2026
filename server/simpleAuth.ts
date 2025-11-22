import session from "express-session";
import memoryStore from "memorystore";
import type { Express, RequestHandler } from "express";
import type { IStorage } from "./storage";

const MemoryStore = memoryStore(session);

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: new MemoryStore(),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  });
}

export async function setupAuth(app: Express, storage: IStorage) {
  app.use(getSession());

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await storage.getAdminByEmail(email);
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Simple password check (in production use bcrypt)
      if (admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = admin.id;
      (req.session as any).user = { 
        email: admin.email, 
        id: admin.id,
        role: admin.role,
        fullName: admin.fullName
      };
      return res.json({ message: "Login successful", user: (req.session as any).user });
    } catch (error) {
      res.status(500).json({ message: "Login error" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  // Get current user info
  app.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json((req.session as any).user);
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export const isSuperAdmin: RequestHandler = (req, res, next) => {
  if (req.session.userId && (req.session as any).user?.role === "super_admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Super Admin only" });
};

export const isEditor: RequestHandler = (req, res, next) => {
  if (req.session.userId && (["super_admin", "editor"].includes((req.session as any).user?.role))) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Editor or higher required" });
};
