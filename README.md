---

# Build a Job Board App with Next.js & Prisma

<div align="center">
  <br />
  <a href="https://youtu.be/YOUR_VIDEO_ID" target="_blank">
    <img src="https://github.com/user-attachments/assets/46671cca-93aa-4c99-b965-b7030fbed4d6" alt="Job Board App Banner">
  </a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/-React_Hooks-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Hooks" />
    <img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  </div>
  <h3 align="center">Build a Job Board App with Next.js, Prisma, PostgreSQL, and TailwindCSS</h3>
  <div align="center">
    Follow the full video tutorial on 
    <a href="https://youtu.be/YOUR_VIDEO_ID" target="_blank"><b>YouTube</b></a>
  </div>
  <br />
</div>

## 📋 Table of Contents

1. [Introduction](#-introduction)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [Quick Start](#-quick-start)
5. [Screenshots](#-screenshots)
6. [Deployment](#-deployment)

---

## 🚀 Introduction

In this tutorial, you'll learn how to build a modern **Job Board App** using **Next.js**, **Prisma**, **PostgreSQL**, and **TailwindCSS**. You'll cover **real-world database relations, complex queries, and a complete CRUD workflow**, and implement **dynamic search filters** and **user applications**.

🎥 Watch the full tutorial: [YouTube](https://youtu.be/YOUR_VIDEO_ID)

---

## ⚙️ Tech Stack

* **Next.js 15** – For building the React fullstack app with server components
* **Prisma** – For database ORM and relations
* **PostgreSQL** – As the relational database
* **TailwindCSS** – For styling with utility-first CSS
* **React Hooks** – For managing client-side state & interactivity
* **TypeScript** – Type safety and tooling
* **NextAuth** or custom session handling – For user authentication (depending on your implementation)

---

## ⚡️ Features

* 📝 **Post Job Offers**
  Authenticated users can post new job offers with title, description, type, and location.

* 🔍 **Advanced Search**
  Filter jobs by **keyword**, **type** (Full-time, Part-time, Contract), and **location** — all with Prisma query filters.

* 👤 **User Dashboard**
  Users can view their posted jobs and see how many applicants each job has received.

* ✅ **Job Applications**
  Users can apply for any job. The dashboard lists all applications with statuses.

* 🔄 **Dynamic Routes & Pages**
  Each job has its own dynamic detail page with full information and "Apply" button.

* 🔐 **Authentication & Authorization**
  Users must be signed in to post jobs or apply for them.

---

## 👌 Quick Start

### Prerequisites

* [Node.js](https://nodejs.org/)
* [PostgreSQL Database](https://www.postgresql.org/)
* [Prisma CLI](https://www.prisma.io/docs/getting-started)
* [Next.js](https://nextjs.org/)

### Clone and Run

```bash
git clone https://github.com/yourusername/job-board-next-prisma.git
cd job-board-next-prisma
npm install

# Configure your database in .env
npx auth secret
npx prisma generate
npx prisma migrate dev

npm run dev
```

Your app will be available at: [http://localhost:3000](http://localhost:3000)

### OAuth configuration

Copy `.env.example` to `.env` and set the GitHub and Google OAuth credentials.
Never put real credentials in `.env.example` or commit `.env`.
Create OAuth applications with these callback URLs:

* GitHub: `http://localhost:3000/api/auth/callback/github`
* Google: `http://localhost:3000/api/auth/callback/google`

For production, replace `localhost:3000` with the deployed application URL and
set the same variables in the hosting provider's environment settings.

---

## 🖼️ Screenshots
<img width="1347" alt="Home" src="https://github.com/user-attachments/assets/dcde382d-f842-4493-af5e-0b956cb89b46" />
<img width="1243" alt="Dashboard" src="https://github.com/user-attachments/assets/29da6fbc-6b8c-4475-88ad-a9b700461401" />

---

## ☁️ Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set up your database connection in Vercel Environment Variables
5. Click **Deploy**

Your live app will be hosted on a custom subdomain (e.g. `https://your-job-board.vercel.app`)

---

## 🔗 Useful Links

* [Next.js Documentation](https://nextjs.org/docs)
* [Prisma Documentation](https://www.prisma.io/docs)
* [PostgreSQL Docs](https://www.postgresql.org/docs/)
* [Tailwind CSS Docs](https://tailwindcss.com/)
* [Vercel](https://vercel.com/)

---
