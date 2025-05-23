# Smart Leads - Lead Generation Platform

## Overview

Smart Leads is a full-stack web application designed for generating and managing business leads. The platform allows users to search for businesses by location and various filters, generate leads through API scraping, and manage the collected data through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API endpoints
- **Session Management**: PostgreSQL-based session storage
- **Development**: Hot reload with Vite middleware integration

### Project Structure
- **Monorepo Layout**: Client and server code in separate directories
- **Shared Types**: Common schemas and types in `/shared` directory
- **Client**: React application in `/client` directory
- **Server**: Express.js backend in `/server` directory

## Key Components

### Database Schema (Drizzle ORM)
- **Users Table**: User authentication and management
- **Leads Table**: Business lead information (name, email, phone, location, category, Yelp URL)
- **Lead Requests Table**: Track API requests with filters and user information

### API Endpoints
- **POST /api/scrape**: Generate leads based on location and filters
  - Supports API key authentication for premium features
  - Accepts location, area codes, email domains, and user information
  - Returns generated leads and request tracking ID

### Frontend Components
- **Dashboard**: Main application interface with lead generation form and results table
- **LeadForm**: Form for inputting search criteria and API keys
- **LeadsTable**: Sortable, filterable table for displaying leads with CSV export
- **UI Components**: Complete shadcn/ui component library implementation

### Data Storage Strategy
- **Development**: In-memory storage with sample data for rapid prototyping
- **Production**: PostgreSQL database with connection pooling
- **Migration Ready**: Drizzle migrations configured for schema updates

## Data Flow

1. **Lead Generation Request**:
   - User submits location and filters through LeadForm
   - Frontend validates data using Zod schemas
   - API request sent to `/api/scrape` endpoint
   - Server validates API key (if provided) and stores request
   - Mock lead generation based on parameters
   - Leads stored in database and returned to client

2. **Data Display**:
   - TanStack Query manages server state and caching
   - LeadsTable provides sorting, filtering, and pagination
   - CSV export functionality for data portability
   - Real-time updates through query invalidation

3. **Authentication Flow**:
   - API key-based authentication for premium features
   - Session management through PostgreSQL store
   - Client-side API key persistence in localStorage

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Unstyled UI component primitives
- **class-variance-authority**: Type-safe CSS class variants

### Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Zod integration for form validation
- **zod**: Runtime type validation and schema definition

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Application runs on port 5000
- **Hot Reload**: Vite development server with Express middleware

### Production Build
- **Frontend**: Vite builds React app to `/dist/public`
- **Backend**: esbuild bundles Node.js server to `/dist`
- **Deployment Target**: Autoscale deployment on Replit
- **Process Management**: npm scripts for development and production

### Database Management
- **Schema Migrations**: Drizzle Kit for database schema changes
- **Environment Variables**: DATABASE_URL required for database connection
- **Connection Pooling**: Neon serverless handles connection management

### Key Features
- **Free Tier**: Basic lead generation without API key
- **Premium Tier**: Enhanced features with API key authentication
- **Data Export**: CSV download functionality for generated leads
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: End-to-end TypeScript with shared schemas