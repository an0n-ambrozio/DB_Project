# Railway Deployment Guide

This guide details how to deploy **TALENTHUB** and its MySQL database entirely on **Railway**.

## 1. Prerequisites

-   A [GitHub](https://github.com/) account with the `talenthub` repository pushed to it.
-   A [Railway](https://railway.app/) account (Sign up with GitHub).

## 2. Create Project & Database

1.  Log in to the **Railway Dashboard**.
2.  Click **+ New Project**.
3.  Select **Provision MySQL**.
    -   This creates a MySQL database service automatically.
4.  Click on the newly created **MySQL** service card.
5.  Go to the **Variables** tab.
6.  Copy the `DATABASE_URL` (it looks like `mysql://root:password@containers...`). **Keep this safe.**

## 3. Connect Application (Frontend/API)

1.  In the same project, click **+ New** (top right) -> **GitHub Repo**.
2.  Select your `talenthub` repository.
3.  Click **Deploy Now**.
    -   *The build will likely fail initially because we haven't set the environment variables yet. This is normal.*

## 4. Configure Environment Variables

1.  Click on your **talenthub** application service card.
2.  Go to the **Variables** tab.
3.  Add the following variables:

| Variable Name | Value |
| :--- | :--- |
| `DATABASE_URL` | Paste the `DATABASE_URL` from the MySQL service (Step 2.6). |
| `JWT_SECRET` | A long, random string (e.g., `my-super-secure-secret-key-123`). |

## 5. Configure Build & Migrations (Crucial Step)

To ensure the database schema is updated automatically whenever you deploy, we need to adjust the Build Command.

1.  Click on your **talenthub** application service card.
2.  Go to the **Settings** tab.
3.  Scroll down to the **Build** section.
4.  Change **Build Command** to:
    ```bash
    npx prisma generate && npx prisma migrate deploy && next build
    ```
    -   `npx prisma generate`: Creates the Prisma Client.
    -   `npx prisma migrate deploy`: Applies pending migrations to the production DB.
    -   `next build`: Compiles the Next.js app.

## 6. Public Access

1.  In the **Settings** tab of your application service.
2.  Scroll to **Networking**.
3.  Click **Generate Domain**.
4.  Railway will assign a public URL (e.g., `talenthub-production.up.railway.app`).
5.  Click this URL to access your live application!

---

## Troubleshooting

-   **Build Failed?** Check the **Deployments** logs. If it says "Authentication failed", check your `DATABASE_URL`.
-   **Database Error?** Ensure `npx prisma migrate deploy` is in your build command.
-   **Default Admin?** To create the admin user in production, you can run the seed script locally pointing to the remote DB, or use the Railway CLI console:
    ```bash
    # Local terminal (requires DATABASE_URL in .env to be the Railway one)
    npx tsx prisma/seed.ts
    ```
