import {
  Request,
  Response,
  NextFunction,
  Express,
} from "express";
import express from "express";
import { Server } from "http";

import { registerRoutes } from "./routes";
import { initializeProducts } from "./initializeProducts";
import { initializeITServices, initializeFoodItems } from "./initializeSampleData";
import { initializeFooters } from "./initializeFooters";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const server = await registerRoutes(app);

  // Initialize sample data if databases are empty
  await initializeProducts();
  await initializeITServices();
  await initializeFoodItems();
  await initializeFooters();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ error: message });
    log(`${status} ${message}`, "express");
  });

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", async () => {
    log(`listening on port ${PORT}`);
    await setup(app, server);
  });

  return { server };
}
