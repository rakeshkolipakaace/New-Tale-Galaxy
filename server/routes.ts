import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAudioRoutes } from "./replit_integrations/audio";
import express from "express";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Increase limit for audio payloads
  app.use(express.json({ limit: "50mb" }));
  
  // Register AI audio routes
  registerAudioRoutes(app);

  // put application routes here
  // prefix all routes with /api

  return httpServer;
}
