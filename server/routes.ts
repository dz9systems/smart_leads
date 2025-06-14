import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateLeadsForLocation } from "./utils/leads";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/scrape - Generate leads (with API key)
  app.post("/api/scrape", async (req, res) => {
    try {
      const data = req.body;
      const hasPremium = data.email?.includes("@");
      const apiKey = data.apiKey || (hasPremium && process.env.SERPAPI_KEY);

      if (!apiKey) {
        return res.status(400).json({
          message: "API key required. Provide your SERP API key or upgrade to premium.",
          error: "NO_API_KEY",
          requiresPremium: !hasPremium
        });
      }
      const leads = await generateLeadsForLocation(data, data.limit || 10);
      res.json({
        success: true,
        leads,
        message: `Generated ${leads.length} leads for ${data.location}`
      });
    } catch (error) {
      handleError(res, error, "SCRAPE_ERROR");
      if (error instanceof z.ZodError) {
        console.error("Zod validation error:", error.flatten());
        return res.status(400).json({
          message: "Invalid request data",
          errors: error.flatten()
        });
      }

    }
  });

  // POST /api/signup - Sign up and generate leads (free mode)
  app.post("/api/signup", async (req, res) => {
    try {
      const data = req.body;
      if (!data.name || !data.email) {
        return res.status(400).json({
          message: "Name and email are required for sign-up",
          error: "MISSING_SIGNUP_DATA"
        });
      }

      const leads = await generateLeadsForLocation(data, 5);
      res.json({
        success: true,
        leads,
        message: `Generated ${leads.length} leads for ${data.location} (Free mode)`,
        mode: "free"
      });
    } catch (error) {
      handleError(res, error, "SIGNUP_ERROR");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Error handler
function handleError(res: any, error: any, code: string) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: error.errors
    });
  }

  console.error(`Error in ${code}:`, error);
  res.status(500).json({
    message: "Internal server error",
    error: code
  });
}
