import session from "express-session";
import memoryStore from "memorystore";
import type { Express, RequestHandler } from "express";

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

// Simple auth - just one admin user
export const ADMIN_EMAIL = "admin@flabef.com";
export const ADMIN_PASSWORD = "admin123";

export async function setupAuth(app: Express) {
  app.use(getSession());

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      req.session.userId = "admin";
      (req.session as any).user = { email: ADMIN_EMAIL, id: "admin" };
      return res.json({ message: "Login successful" });
    }
    
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
