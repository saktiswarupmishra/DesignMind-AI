# DesignMind AI 🎨🤖

> **Your Intelligent Creative Design Partner**

An enterprise-grade AI-powered Graphic Design SaaS platform that combines AI Design Generation, Branding, Image Generation, Design Analysis, Marketing Assistance, and Content Creation into a single modern platform.

## 🏗️ Architecture

```
├── frontend/        React + Vite + Tailwind + ShadCN UI
├── backend/         Express.js + Prisma ORM + MySQL
├── ai-service/      Python FastAPI + OpenAI + LangChain
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- XAMPP (MySQL on port 3306)
- Git

### 1. Database Setup
Start XAMPP and ensure MySQL is running on port 3306.
Create the database:
```sql
CREATE DATABASE designmind_ai;
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

### 3. AI Service Setup
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **AI Service:** http://localhost:8000/docs

## 👥 Demo Accounts

| Email | Role | Password |
|-------|------|----------|
| admin@designmind.ai | Admin | password123 |
| designer@designmind.ai | Designer | password123 |
| freelancer@designmind.ai | Freelancer | password123 |
| agency@designmind.ai | Agency Owner | password123 |
| marketing@designmind.ai | Marketing Team | password123 |
| creator@designmind.ai | Content Creator | password123 |

## 🤖 AI Features (Phase 1)

- **AI Design Generator** - Generate complete design concepts from text prompts
- **AI Color Palette Engine** - Create harmonious color palettes with psychology reports
- **AI Logo Generator** - Professional logo concepts with multiple styles

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### AI Generation
- `POST /api/ai/generate-design` - Generate design concept
- `POST /api/ai/generate-palette` - Generate color palette
- `POST /api/ai/generate-logo` - Generate logo concepts
- `POST /api/ai/generate-brand` - Generate brand identity
- `GET /api/ai/history` - AI request history

### Projects
- `GET /api/projects/dashboard` - Dashboard stats
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🔐 Environment Variables

Copy `.env.example` to `.env` in the backend directory and configure:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - JWT signing key
- `OPENAI_API_KEY` - (Optional) For real AI responses

## 📄 License

MIT License © 2026 DesignMind AI
