import { users, leads, leadRequests, type User, type InsertUser, type Lead, type InsertLead, type LeadRequest, type InsertLeadRequest } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadsByLocation(location: string): Promise<Lead[]>;
  
  // Lead request operations
  createLeadRequest(request: InsertLeadRequest): Promise<LeadRequest>;
  getLeadRequests(): Promise<LeadRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private leadRequests: Map<number, LeadRequest>;
  private currentUserId: number;
  private currentLeadId: number;
  private currentRequestId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.leadRequests = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.currentRequestId = 1;

    // Add some sample leads for demonstration
    this.initializeSampleLeads();
  }

  private initializeSampleLeads() {
    const sampleLeads = [
      {
        businessName: "Manhattan Coffee Co.",
        email: "info@manhattancoffee.com",
        phone: "(212) 555-0123",
        location: "Manhattan, NY",
        yelpUrl: "https://yelp.com/biz/manhattan-coffee-co",
        category: "Coffee Shop",
      },
      {
        businessName: "Luigi's Italian Bistro",
        email: "contact@luigisbistro.com",
        phone: "(212) 555-0456",
        location: "Little Italy, NY",
        yelpUrl: "https://yelp.com/biz/luigis-italian-bistro",
        category: "Restaurant",
      },
      {
        businessName: "FitZone Gym",
        email: "hello@fitzonegym.com",
        phone: "(718) 555-0789",
        location: "Brooklyn, NY",
        yelpUrl: "https://yelp.com/biz/fitzone-gym",
        category: "Fitness Center",
      },
      {
        businessName: "Style Studio Salon",
        email: "bookings@stylestudio.com",
        phone: "(917) 555-0321",
        location: "Queens, NY",
        yelpUrl: "https://yelp.com/biz/style-studio-salon",
        category: "Hair Salon",
      },
    ];

    sampleLeads.forEach(lead => {
      const id = this.currentLeadId++;
      const leadWithId: Lead = {
        ...lead,
        id,
        createdAt: new Date(),
      };
      this.leads.set(id, leadWithId);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentLeadId++;
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getLeadsByLocation(location: string): Promise<Lead[]> {
    return Array.from(this.leads.values())
      .filter(lead => lead.location.toLowerCase().includes(location.toLowerCase()))
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createLeadRequest(insertRequest: InsertLeadRequest): Promise<LeadRequest> {
    const id = this.currentRequestId++;
    const request: LeadRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
    };
    this.leadRequests.set(id, request);
    return request;
  }

  async getLeadRequests(): Promise<LeadRequest[]> {
    return Array.from(this.leadRequests.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new MemStorage();
