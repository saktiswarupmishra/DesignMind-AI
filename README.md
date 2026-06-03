# DesignMind AI 🎨🤖

> **Your Intelligent Creative Design Partner**
>
> DesignMind AI is a state-of-the-art, enterprise-grade AI-powered Graphic Design SaaS platform. It combines automated design generation, brand identity building, color psychology analysis, marketing copy writing, collaborative canvases, and advanced analytics into a single cohesive workspace.

---

## 🏗️ System Architecture

DesignMind AI is built using a modern decoupled architecture:

```
├── frontend/          React 18 + Vite + Tailwind CSS + ShadCN UI + Redux Toolkit + Socket.IO Client
├── backend/           Express.js + Prisma ORM v5 + MySQL + Socket.IO Server + Redis
├── ai-service/        Python FastAPI + LangChain + OpenAI GPT + Pydantic v2
└── docker-compose.yml Full-stack Docker orchestration configuration
```

---

## 💎 Key Features

### 🎨 1. AI Creative Generators
*   **AI Design Generator** (`/ai/design-generator`): Create complete, tailor-made visual layout concepts from descriptive text prompts. Configurable by style, target platform (e.g., Instagram, LinkedIn, Web), and industry.
*   **AI Logo Generator** (`/ai/logo-generator`): Generate vector-aligned logo concepts, typography recommendations, and design variants using brand details and colors.
*   **AI Color Palette Engine** (`/ai/color-palette`): Generate harmonious color systems complete with detailed emotional psychology profiles, contrast checks, and target industry mapping.
*   **AI Brand Identity Suite** (`/ai/brand-identity`): Generate comprehensive brand packages, including core values, mission/vision statements, voice & tone guidelines, and brand personality metrics.

### 📢 2. Marketing & Publishing Tools
*   **AI Social Media Post Generator** (`/ai/social-media`): Generate post copies, hashtags, layout structures, and engagement triggers tailored for Facebook, Instagram, Twitter/X, and LinkedIn.
*   **AI YouTube Thumbnail Planner** (`/ai/thumbnail`): Craft catchy video titles, graphic asset compositions, and focal point layouts to maximize Click-Through Rate (CTR).
*   **AI Marketing Copywriter** (`/ai/copywriter`): Write conversion-focused copy using structured frameworks like **AIDA** (Attention, Interest, Desire, Action) and **PAS** (Problem, Agitate, Solve).
*   **AI Poster & Flyer Generator** (`/ai/poster`): Instantly layout details for events, product launches, or announcements based on size templates.
*   **AI Banner Creator** (`/ai/banner`): Create custom web banners and headers matching precise dimensions and styling.
*   **AI Ad Creative Generator** (`/ai/ad-creative`): Build conversion-optimized ad variations, hook lines, and visual briefs according to target marketing objectives.

### 🔍 3. Optimization & Analysis Suites
*   **AI Design Analyzer** (`/ai/analyzer`): Inspect visual assets, layout distributions, typography hierarchy, and accessibility standards with instant grading reports.
*   **AI Smart Resizer** (`/ai/resizer`): Adapt design assets seamlessly from one canvas dimension to multiple target platforms while keeping alignment intact.
*   **AI Trend Analyzer** (`/ai/trends`): Fetch real-time visual trends, popular aesthetic movements, and design directions by industry and region.
*   **AI Background Remover** (`/ai/bg-remover`): Extract foreground objects and subjects from images instantly.
*   **AI Mockup Generator** (`/ai/mockup`): Place design mockups dynamically onto device mockups, prints, and merchandise frames.

### 🤝 4. Real-Time Collaboration & Teams
*   **Live Project Workspace**: Bidirectional canvas updates, project edits, and comments synced across users instantly via **Socket.IO**.
*   **Granular Team Management**: Share projects with distinct workspace permissions: `OWNER`, `ADMIN`, `MEMBER`, and `VIEWER`.
*   **Activity Logs & Audit Trails**: Every action (create project, update canvas, download asset) is captured with telemetry (timestamp, action, target entity, client IP address, user-agent).

### 💳 5. Billing & Subscription Management
*   **Flexible Pricing Plans**: Integrates tiered entitlements (`FREE`, `STARTER`, `PROFESSIONAL`, `ENTERPRISE`).
*   **AI Credit System**: Dynamically checks user credit quotas before triggering complex LLM queries.
*   **Transaction Records**: Complete payment ledger displaying amounts, currency, checkout states, and invoice references.

---

## 🛠️ Installation & Setup

You can run the application either directly on your host machine or encapsulated inside a Docker network.

### Option A: Docker Compose Setup (Recommended)

Make sure you have Docker Desktop running, then configure your keys and boot up:

1. Create a `.env` file in the root directory (or copy backend/.env.example):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
2. Launch the services:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the services:
   *   **Frontend Web App**: http://localhost:5173
   *   **Express API Server**: http://localhost:5000/api
   *   **FastAPI AI Docs**: http://localhost:8000/docs

---

### Option B: Local Host Setup

#### Prerequisites
*   Node.js (v18 or higher)
*   Python (3.10 or higher)
*   MySQL Server (e.g., via XAMPP running on default port `3306`)

#### 1. Database Initialization
Start your local MySQL service and create the database schema:
```sql
CREATE DATABASE designmind_ai;
```

#### 2. Backend Setup
Navigate to the `backend/` directory, configure environment variables, migrate schemas, seed seed-users, and start:
```bash
cd backend

# Copy settings
cp .env.example .env

# Install Node dependencies
npm install

# Run database migrations and generate Prisma client
npx prisma generate
npx prisma db push

# Seed default mock data & user accounts
node prisma/seed.js

# Start backend dev server
npm run dev
```

#### 3. AI Service Setup
Navigate to the `ai-service/` directory, configure dependencies inside a virtual environment, and run FastAPI:
```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Start local FastAPI instance
uvicorn app.main:app --reload --port 8000
```

#### 4. Frontend Setup
Navigate to the `frontend/` directory, install packages, and boot Vite:
```bash
cd frontend

# Install client dependencies
npm install

# Start Vite client
npm run dev
```

---

## 👥 Seed User Accounts

Log in to the system immediately using any of the default demo credentials below (all share the password: `password123`):

| Email Address | Platform Role | Target Workspace Persona |
| :--- | :--- | :--- |
| `admin@designmind.ai` | `ADMIN` | Superuser Analytics & Directory Control |
| `designer@designmind.ai` | `DESIGNER` | Default Professional Designer |
| `freelancer@designmind.ai` | `FREELANCER` | Multi-project Independent Agent |
| `agency@designmind.ai` | `AGENCY_OWNER` | Team leader managing workspace invitees |
| `marketing@designmind.ai` | `MARKETING_TEAM` | Copywriting & Ad Campaign Manager |
| `creator@designmind.ai` | `CONTENT_CREATOR` | YouTube & Social Media Specialist |

---

## 📡 REST API Route Registry

### 🔐 Authentication (`/api/auth`)
*   `POST /api/auth/register` - Create a brand new user profile
*   `POST /api/auth/login` - Authenticate user credentials and retrieve JWT + user parameters
*   `POST /api/auth/logout` - Invalidate session token
*   `POST /api/auth/refresh-token` - Renew expired JWT access token using refresh tokens
*   `GET /api/auth/profile` - Fetch authenticated user details
*   `PUT /api/auth/profile` - Update user bio, avatar, phone, and company metadata

### 🤖 AI Generation Proxies (`/api/ai`)
*   `POST /api/ai/generate-design` - Concept creator based on layout theme rules
*   `POST /api/ai/generate-palette` - Hex colors generator + psychology profile
*   `POST /api/ai/generate-logo` - Core visual ideas, typography guidelines, symbols
*   `POST /api/ai/generate-brand` - Brand voice statement, vision goals, and personality traits
*   `POST /api/ai/generate-poster` - Grids, details, and aesthetic patterns for poster prints
*   `POST /api/ai/generate-banner` - Dimension-oriented banner setups
*   `POST /api/ai/generate-ad` - Conversion-optimized headers, copy text, and demographic hooks
*   `POST /api/ai/analyze-design` - Structural visual evaluation reports
*   `POST /api/ai/generate-mockup` - Coordinates mockup projections
*   `POST /api/ai/smart-resize` - Converts visual settings across device profiles
*   `POST /api/ai/analyze-trends` - Forecast trends for specific domains and regional markets
*   `GET /api/ai/history` - Pulls historical logs of AI requests with performance metrics

### 📁 Projects Workspace (`/api/projects`)
*   `GET /api/projects/dashboard` - Retrieve aggregated stats for charts (projects count, active teams, credits)
*   `GET /api/projects` - Retrieve list of user and team-level projects
*   `POST /api/projects` - Create a new project workspace
*   `GET /api/projects/:id` - Fetch details of a project and its child designs
*   `PUT /api/projects/:id` - Modify name, description, category status
*   `DELETE /api/projects/:id` - Archive or remove workspace project

### 👥 Team Workspaces (`/api/teams`)
*   `GET /api/teams` - Fetch active user-owned or shared teams
*   `POST /api/teams` - Provision a new creative team space
*   `GET /api/teams/:id` - View team members, metadata, and associated projects
*   `POST /api/teams/:id/members` - Add a user to the team with specific permissions
*   `PUT /api/teams/:id/members/:userId` - Update user role in the team
*   `DELETE /api/teams/:id/members/:userId` - Revoke member access

### 💳 Payments & Subscription (`/api/subscriptions` & `/api/payments`)
*   `GET /api/subscriptions` - View current plan, credit balance, expiry details
*   `POST /api/subscriptions/upgrade` - Initiate plan upgrades
*   `GET /api/payments` - Retrieve payment records

### 🛡️ Admin Telemetry (`/api/admin`)
*   `GET /api/admin/dashboard` - Full telemetry (total active accounts, system uptime, total API credits consumed)
*   `GET /api/admin/users` - Directory grid for updating statuses and configurations
*   `GET /api/admin/analytics` - Grouped AI model performance indicators and usage breakdowns

---

## 🧬 Prisma Database Models Overview

The MySQL database schema defines relational models mapped to design workflows:
*   `User` & `Profile` - Holds credential hashes, provider types (Local, Google, GitHub), subscription links, and billing details.
*   `Project` & `Design` - Represents canvas directories holding visual elements saved as JSON schemas, thumbnails, and statuses.
*   `Template` - High-quality mock canvases categorized by `DesignType` and marked as `isPremium` or `isFeatured`.
*   `AIRequest` - Audit records logging every prompt, model parameters, consumed credits, execution duration, and error reports.
*   `Subscription` & `Payment` - Tracks current credit quotas (`aiCredits`), plan limitations (`maxProjects`), and payment transactions.
*   `Team` & `TeamMember` - Handles multi-tenant association mapping roles (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
*   `Comment` - Enables nested, collaborative feedback threads directly on specific project designs.
*   `Notification` - Broadcasts alerts to users regarding mentions, team invites, and credit status.
*   `ActivityLog` - Detailed operations ledger tracking all user actions.

---

## 📄 License

DesignMind AI is released under the [MIT License](LICENSE).  
Copyright © 2026 DesignMind AI. All rights reserved.
