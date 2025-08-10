# Nextoria Dashboard - Demo Version

A comprehensive digital marketing agency dashboard built with Next.js 13, TypeScript, and modern web technologies. This is a **demo version** that uses local storage for data persistence, perfect for showcasing and team demonstrations.

## 🌟 Features

- **Client Management**: Manage your client base with detailed profiles and contact information
- **Campaign Management**: Track and monitor digital marketing campaigns across platforms
- **Content Calendar**: Schedule and manage content across social media and marketing channels
- **Lead Management**: Track leads from various sources and manage the sales pipeline
- **Task Management**: Organize team tasks and project workflows
- **Invoice Management**: Generate and track invoices for client services
- **Analytics**: Visual data representation with charts and metrics
- **User Profiles**: Team member management with role-based access
- **Role-Based Access Control (RBAC)**: Granular permissions for different agency roles

## 🚀 Demo Features

This demo version includes:

- **Local Authentication**: Simple email/password login with predefined demo accounts
- **Local Storage**: All data persists in browser localStorage - no external database required
- **Pre-loaded Demo Data**: Sample clients, campaigns, tasks, and analytics data
- **Full Functionality**: All features work exactly like the production version

### Demo Credentials

Test different role-based access levels with these accounts:

- **Admin**: `demo@nextoria.com` / `demo123` - Full access to all features
- **Marketer**: `sarah@nextoria.com` / `sarah123` - Campaign & lead management
- **Designer**: `mike@nextoria.com` / `mike123` - Content creation & design tasks
- **Developer**: `alex@nextoria.com` / `alex123` - Technical tasks & analytics

## 🔐 Role-Based Access Control (RBAC)

The app includes a comprehensive RBAC system with different permission levels:

### Role Permissions:

**Admin**

- Full access to all features and data
- User management and system settings
- Can create, read, update, and delete all resources

**Marketer**

- Manage clients, campaigns, and leads
- Access to analytics and reporting
- Limited user management capabilities

**Designer**

- Focus on content creation and design tasks
- Read access to client and campaign information
- Full control over content calendar

**Developer**

- Access to technical tasks and analytics
- Read-only access to clients and campaigns
- Task management for development work

Each role sees only relevant navigation items and features based on their permissions.

## 🛠️ Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Local storage based demo auth
- **Data Storage**: Browser localStorage with Zustand
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## 🏃‍♂️ Quick Start

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nextoria-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Login with demo credentials:
   - Email: `demo@nextoria.com`
   - Password: `demo123`

## 📊 Demo Data

The demo comes pre-loaded with:

- 3 sample clients (TechStart Inc, GreenEarth Solutions, FoodieHub)
- Multiple active campaigns across different platforms
- Content calendar with scheduled posts
- Lead pipeline with various statuses
- Team tasks and project assignments
- Sample invoices and billing data
- Analytics and performance metrics

## 🎯 Perfect For

- **Team Demonstrations**: Show your marketing dashboard concept to stakeholders
- **Client Presentations**: Demonstrate your agency's capabilities
- **Development Testing**: Test features without external dependencies
- **Offline Demos**: Works completely offline once loaded
- **Portfolio Showcase**: Add to your portfolio without backend complexity

## 🔧 Architecture

### Local Data Storage

- **Zustand Store**: Centralized state management with localStorage persistence
- **Mock Data**: Pre-loaded realistic demo data for all features
- **Local Auth**: Simple authentication system for demo purposes
- **No External APIs**: Completely self-contained for demonstrations

### Security Note

This is a demo version designed for presentations and testing. For production use, implement proper authentication, database security, and API validation.

## 🖥️ Screenshots & Features

- **Dashboard**: Overview with key metrics and activity feed
- **Clients**: Client management with profile details and campaign tracking
- **Campaigns**: Campaign creation and performance monitoring
- **Content**: Content calendar with scheduling capabilities
- **Leads**: Lead pipeline management and conversion tracking
- **Tasks**: Team task management with priority and status tracking
- **Invoices**: Invoice generation and payment tracking
- **Analytics**: Visual data representation with charts and KPIs

## 🔄 Data Persistence

All data is stored in the browser's localStorage and will persist between sessions. To reset the demo data:

1. Clear browser localStorage for the site
2. Refresh the page to load fresh demo data

## 📱 Responsive Design

The dashboard is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices
- All modern browsers

Perfect for presenting on any device or screen size!
