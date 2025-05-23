import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  yelpUrl: text("yelp_url"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadRequests = pgTable("lead_requests", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  areaCodes: text("area_codes").array(),
  emailDomains: text("email_domains"),
  apiKey: text("api_key"),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertLeadRequestSchema = createInsertSchema(leadRequests).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type LeadRequest = typeof leadRequests.$inferSelect;
export type InsertLeadRequest = z.infer<typeof insertLeadRequestSchema>;
