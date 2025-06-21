# Election Survey Management System

## Overview

This is a full-stack application built for managing electoral surveys with role-based access for administrators and field researchers. The system allows administrators to create and manage surveys while enabling researchers to conduct field data collection with geographic assignments.

## System Architecture

The application follows a modern full-stack architecture:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom electoral theme colors
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations

## Key Components

### Authentication System
- Role-based access control (admin/researcher)
- Session-based authentication with PostgreSQL session store
- Password hashing using Node.js crypto (scrypt)
- Protected routes with authentication middleware

### Survey Management
- Survey creation with configurable questions and demographics
- Support for multiple question types (radio, checkbox, text, scale)
- Survey status management (draft, active, completed, paused)
- Geographic region assignment for targeted data collection

### User Roles
- **Admin**: Full system access, survey creation, user management
- **Researcher**: Field data collection, assigned survey responses

### Data Collection
- Geographic assignment of surveys to specific regions
- Mobile-responsive interface for field work
- Real-time progress tracking and completion status

## Data Flow

1. **Authentication Flow**: Users authenticate through login form → Passport.js validates credentials → Session established in PostgreSQL
2. **Survey Creation**: Admin creates survey → Questions and demographics configured → Survey assigned to geographic regions
3. **Field Collection**: Researchers view assigned surveys → Complete surveys in assigned regions → Responses stored with geographic data
4. **Data Management**: Real-time statistics and progress tracking → Export capabilities for analysis

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe database ORM
- **passport**: Authentication middleware
- **express-session**: Session management
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **wouter**: Lightweight React router

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling framework
- **React Hook Form**: Form management with validation

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Build Process
- **Development**: `npm run dev` - Runs both client and server in development mode
- **Production Build**: `npm run build` - Builds client assets and bundles server code
- **Production Start**: `npm run start` - Runs production server

### Environment Configuration
- Uses Replit's autoscale deployment target
- PostgreSQL module enabled for database provisioning
- Port 5000 mapped to external port 80
- Session secret and database URL configured via environment variables

### Database Management
- Drizzle migrations stored in `/migrations` directory
- Schema definitions in `/shared/schema.ts`
- Database push command: `npm run db:push`

## Recent Changes

- June 21, 2025: Complete electoral survey platform implemented
  - Authentication system with admin/researcher roles
  - Admin dashboard with survey creation and management
  - Researcher dashboard with interactive map interface
  - Database seeded with test users (admin/admin123, researcher/researcher123)
  - Survey builder with demographic criteria and questions
  - Real-time statistics and progress tracking
  - Portuguese language interface for Brazilian electoral surveys

## Changelog

- June 21, 2025. Initial setup and full application development

## User Preferences

Preferred communication style: Simple, everyday language.