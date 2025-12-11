# TALENTHUB Recruitment Platform

**TALENTHUB** is a premium, AI-powered recruitment dashboard designed to streamline the hiring process for modern teams. It features a high-end, glassmorphic UI, real-time analytics, and role-based access control (RBAC) for recruiters and candidates.

## 🚀 Key Features

### For Recruiters
-   **Dashboard Analytics**: Visualize hiring metrics, qualified candidates, and interview schedules in real-time.
-   **Candidate Management**: Kanban-style tracking, detailed profiles, and status management (Qualified, Scheduled, Rejected).
-   **AI Scoring**: Automated candidate fit scoring based on skills and experience.
-   **Team Collaboration**: Connect with top talent instantly.

### For Candidates
-   **Professional Profile**: Build a comprehensive profile with skills and experience.
-   **Application Tracking**: Track the status of your applications in real-time.
-   **Job Discovery**: View available companies and positions.

## 🛠 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) (Animations)
-   **Database**: MySQL
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)

## 🏗 Architecture

The project follows a standard Next.js App Router structure:

-   `app/`: Main application routes and pages.
    -   `api/`: Backend API routes (REST endpoints).
    -   `(auth)/`: Authentication pages (Login/Signup).
    -   `dashboard/`: Recruiter dashboard.
    -   `candidates/`: Candidate management views.
-   `components/`: Reusable UI components (Glassmorphic cards, Modals, Navbar).
-   `lib/`: Utility functions and Prisma client instance.
-   `prisma/`: Database schema and seed scripts.

## ⚡ Getting Started

### Prerequisites
-   **Node.js**: v18 or higher
-   **MySQL**: A running MySQL database instance (local or cloud).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd talenthub
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    # Database Connection String
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/talenthub_db"
    
    # JWT Secret for Authentication
    JWT_SECRET="your_secure_secret_key_here"
    ```
    > Replace `USER`, `PASSWORD`, `HOST`, and `PORT` with your MySQL credentials.

4.  **Database Setup**
    Initialize the database schema and seed default data:
    ```bash
    # Push schema to database
    npx prisma migrate dev --name init
    
    # Seed the database (Default Users)
    npx tsx prisma/seed.ts
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Access Credentials

The database seeding script (`prisma/seed.ts`) creates two default users for testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Recruiter (Admin)** | `admin@talenthub.com` | `password123` |
| **Candidate** | `candidate@talenthub.com` | `password123` |

## 🗄 Database Access

This project uses **Prisma ORM**. You can access and manage your database data easily using Prisma Studio, a visual editor.

### Using Prisma Studio (GUI)
Run the following command to open the database GUI in your browser:
```bash
npx prisma studio
```
This allows you to View, Edit, and Delete records in your MySQL database directly.

### Using MySQL CLI or Workbench
You can also connect using standard tools using your `.env` credentials:
-   **Host**: `localhost` (usually)
-   **Port**: `3306`
-   **Database**: `talenthub_db`
-   **User/Pass**: As configured in your `.env`.

## 📜 Scripts

-   `npm run dev`: Start development server.
-   `npm run build`: Build for production.
-   `npm run start`: Start production server.
-   `npm run lint`: Check for code style issues.

## 🚀 Deployment Guide

To deploy this project to production, we recommend using **Vercel** for the frontend/API and a managed SQL provider for the database.

### 1. Database Hosting
Vercel **does not** host the MySQL database itself. You need an external provider.
**Recommended Options:**
-   **Railway** (Free/Paid): Easy MySQL setup.
-   **PlanetScale** (Paid): specialized MySQL platform.
-   **Supabase** (Free/Paid): If you switch to PostgreSQL (requires changing `provider` in `schema.prisma`).
-   **AWS RDS / DigitalOcean**: Standard managed databases.

**Action:**
1.  Create a database on one of these platforms.
2.  Get the **Connection String** (e.g., `mysql://user:pass@host:port/full_db_name`).

### 2. Prepare for Production
Before deploying, ensure you run migrations on your **production** database. You can do this from your local machine:
```bash
# Update .env temporarily to your PRODUCTION_DB_URL
# Then run:
npx prisma migrate deploy
```

### 3. Deploy to Vercel
1.  Push your code to **GitHub**.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  Import your repository.
4.  **Environment Variables**:
    -   Add `DATABASE_URL`: Your production database connection string.
    -   Add `JWT_SECRET`: A strong, random string.
5.  Click **Deploy**.

Vercel will build your Next.js app, and it will automatically connect to your external database using the variables provided.

---

**TALENTHUB** © 2025. All rights reserved.
