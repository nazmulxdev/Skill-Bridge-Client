# 🎓 SkillBridge Frontend

**Connect with Expert Tutors, Learn Anything**

This is the frontend client for the SkillBridge platform — a full-stack tutoring system that connects students with expert tutors.

Built with **Next.js 16, React 19, Tailwind CSS v4, ShadCN UI, and Better Auth**.

---

# 👨‍💻 Author

**Md. Nazmul Hossen**

---

# 🚀 Live Links

[![Live Frontend](https://img.shields.io/badge/Live_Frontend-SkillBridge-blue?style=for-the-badge&logo=vercel)](https://skillbridge-frontend.vercel.app)

[![Live Backend API](https://img.shields.io/badge/Live_API-SkillBridge_Server-blueviolet?style=for-the-badge&logo=vercel)](https://skillbridge-backend.onrender.com)

[![Frontend Repo](https://img.shields.io/badge/Frontend_Repo-GitHub-000?style=for-the-badge&logo=github)](https://github.com/nazmulxdev/Skill-Bridge-Frontend-)

[![Backend Repo](https://img.shields.io/badge/Backend_Repo-GitHub-333?style=for-the-badge&logo=github)](https://github.com/nazmulxdev/Skill-Bridge-server-)

---

# 📌 Project Overview

SkillBridge is a role-based tutoring platform where:

- 👨‍🎓 Students can browse tutors, book sessions, and leave reviews.
- 👨‍🏫 Tutors can manage profiles, availability, and sessions.
- 🛡️ Admins can manage users, categories, and bookings.

This repository contains only the **Frontend (Client Application)**.

---

# 🛠️ Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- ShadCN UI
- Radix UI
- Framer Motion
- TanStack React Form
- Better Auth
- Zod
- Lucide React
- Sonner (Toast)

---

# 📂 Project Structure

```
src/
 ├── app/
 ├── components/
 ├── features/
 ├── lib/
 ├── hooks/
 └── utils/
```

---

# 🔐 Authentication

Authentication is handled using **Better Auth**.

Role-based system:

- STUDENT
- TUTOR
- ADMIN

Auth flow:

- Register → Select Role
- Login → Access dashboard based on role
- Protected routes via middleware

---

# 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```
# Client URLs
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000/
NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000/
NEXT_PUBLIC_LOGIN_URL=http://localhost:3000/login

# Server URLs
API_URL=http://localhost:5000/api
BACKEND_URL=http://localhost:5000/
AUTH_URL=http://localhost:5000/api/auth
NEXT_PUBLIC_BASE_URL=http://localhost:5000

```

⚠️ When deploying to production, replace localhost URLs with your live backend URL.

---

# 📄 Pages & Routes

## 🌐 Public Pages

- `/` → Home (Hero + Featured Tutors)
- `/tutors` → Browse Tutors
- `/tutors/:id` → Tutor Profile
- `/contact` → Contact page
- `/login` → Login
- `/register` → Register

---

## 👨‍🎓 Student Dashboard

- `/dashboard/dashboard`
- `/dashboard/bookings`
- `/dashboard/dashboard/profile`

---

## 👨‍🏫 Tutor Dashboard

- `/dashboard/tutor/dashboard`
- `/dashboard/tutor/availability`
- `/dashboard/tutor/profile`

---

## 🛡️ Admin Dashboard

- `/dashboard/admin`
- `/dashboard/admin/users`
- `/dashboard/admin/bookings`
- `/dashboard/admin/categories`

---

# 🎨 UI Features

- Responsive Design
- Dark / Light Mode (next-themes)
- Animated transitions (Framer Motion)
- Reusable UI components (ShadCN)
- Form validation (Zod)
- Toast notifications (Sonner)

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```
git clone <your-repository-url>
cd level-2-a4-frontend

```

## 2️⃣ Install Dependencies

```
npm install

```

## 3️⃣ Setup Environment Variables

Create `.env.local` file (see above).

## 4️⃣ Run Development Server

```
npm run dev

```

App will run at:

```
http://localhost:3000

```

---

# 🏗️ Build for Production

```
npm run build
npm start
```

---

# 🔗 Backend Connection

The frontend communicates with the backend API:

```
http://localhost:5000/api

```

Make sure backend server is running before testing.

---
