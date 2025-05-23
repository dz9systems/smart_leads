import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadRequestSchema, insertLeadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // POST /api/scrape - Generate leads (with API key)
  app.post("/api/scrape", async (req, res) => {
    try {
      const requestData = insertLeadRequestSchema.parse(req.body);
      
      // Determine which API key to use - user's key or backend key
      const apiKeyToUse = requestData.apiKey || process.env.SERPAPI_KEY;
      
      // Check if we have an API key to use
      if (!apiKeyToUse) {
        return res.status(400).json({ 
          message: "API key required. Please provide your SERP API key or upgrade to premium.",
          error: "NO_API_KEY"
        });
      }

      // Store the lead request
      const leadRequest = await storage.createLeadRequest(requestData);

      // Simulate lead generation based on location and parameters
      const generatedLeads = await generateLeadsForLocation(requestData);

      // Store generated leads
      for (const leadData of generatedLeads) {
        await storage.createLead(leadData);
      }

      res.json({
        success: true,
        leads: generatedLeads,
        requestId: leadRequest.id,
        message: `Generated ${generatedLeads.length} leads for ${requestData.location}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      console.error("Error in /api/scrape:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: "SCRAPE_ERROR"
      });
    }
  });

  // POST /api/signup - Sign up and generate leads (free mode)
  app.post("/api/signup", async (req, res) => {
    try {
      const requestData = insertLeadRequestSchema.parse(req.body);
      
      // Require name and email for signup
      if (!requestData.name || !requestData.email) {
        return res.status(400).json({ 
          message: "Name and email are required for sign-up",
          error: "MISSING_SIGNUP_DATA"
        });
      }

      // Store the lead request
      const leadRequest = await storage.createLeadRequest(requestData);

      // Generate limited leads for free mode (max 5)
      const generatedLeads = await generateLeadsForLocation(requestData, 5);

      // Store generated leads
      for (const leadData of generatedLeads) {
        await storage.createLead(leadData);
      }

      res.json({
        success: true,
        leads: generatedLeads,
        requestId: leadRequest.id,
        message: `Generated ${generatedLeads.length} leads for ${requestData.location} (Free mode - limited results)`,
        mode: "free"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      console.error("Error in /api/signup:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: "SIGNUP_ERROR"
      });
    }
  });

  // GET /api/leads - Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({ leads });
    } catch (error) {
      console.error("Error in /api/leads:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: "LEADS_FETCH_ERROR"
      });
    }
  });

  // GET /api/leads/location/:location - Get leads by location
  app.get("/api/leads/location/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const leads = await storage.getLeadsByLocation(location);
      res.json({ leads });
    } catch (error) {
      console.error("Error in /api/leads/location:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: "LOCATION_LEADS_FETCH_ERROR"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to simulate lead generation
async function generateLeadsForLocation(requestData: any, limit?: number) {
  const businessTypes = [
    { type: "Restaurant", icon: "utensils" },
    { type: "Coffee Shop", icon: "coffee" },
    { type: "Retail Store", icon: "shopping-bag" },
    { type: "Fitness Center", icon: "dumbbell" },
    { type: "Hair Salon", icon: "cut" },
    { type: "Dental Office", icon: "tooth" },
    { type: "Law Firm", icon: "balance-scale" },
    { type: "Auto Repair", icon: "wrench" },
    { type: "Pet Grooming", icon: "paw" },
    { type: "Bakery", icon: "bread-slice" }
  ];

  const emailDomains = requestData.emailDomains 
    ? requestData.emailDomains.split(',').map((d: string) => d.trim())
    : ['gmail.com', 'yahoo.com', 'company.com'];

  const areaCodes = requestData.areaCodes || ['212', '718', '917', '646'];
  
  const leads = [];
  const maxLeads = limit || (requestData.apiKey ? 50 : 5);

  for (let i = 0; i < maxLeads; i++) {
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    
    const businessName = generateBusinessName(businessType.type);
    const email = generateEmail(businessName, emailDomain);
    const phone = `(${areaCode}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    leads.push({
      businessName,
      email,
      phone,
      location: requestData.location,
      yelpUrl: `https://yelp.com/biz/${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      category: businessType.type,
    });
  }

  return leads;
}

function generateBusinessName(type: string): string {
  const prefixes = ['Elite', 'Premium', 'Golden', 'Royal', 'Prime', 'Metro', 'City', 'Downtown', 'Urban', 'Modern'];
  const suffixes = ['Co.', 'Inc.', 'LLC', 'Group', 'Services', 'Solutions', 'Studio', 'Center', 'Place', 'Works'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${type} ${suffix}`;
}

function generateEmail(businessName: string, domain: string): string {
  const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const prefixes = ['info', 'contact', 'hello', 'support', 'sales'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  return `${prefix}@${cleanName.substring(0, 10)}.${domain}`;
}
