# SyncHire

**SyncHire** is a modern, responsive, and fully-featured Job Portal application built on the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless experience for three primary types of users: **Candidates**, **Recruiters**, and **System Administrators**. 

With an emphasis on a premium, glassmorphic UI, robust role-based routing, real-time communications, and a clean applicant tracking pipeline, SyncHire streamlines the entire hiring and job-seeking process.

## ✨ Key Features

### For Candidates
* **Explore Jobs:** Browse available job postings with real-time filtering (Full-time, Part-time, Remote, Internship) and text search.
* **Profile Builder:** Upload your resume, add your qualifications, skills, and set up your profile picture.
* **My Pipeline:** A visual, interactive timeline tracking the progress of your job applications (Applied → Shortlisted → Interview Scheduled → Selected).
* **Real-time Chat:** Communicate directly with recruiters regarding your applications and share files seamlessly.
* **Instant Notifications:** Receive real-time socket-based notifications when your application status changes or when a recruiter sends you a message.

### For Recruiters
* **Active Portfolios (Dashboard):** Manage all your job postings in one place.
* **Screening Hub:** View all applicants for a specific job and update their statuses dynamically.
* **AI Resume Parsing:** Automatically extract candidate skills directly from uploaded PDF resumes.
* **Real-time Candidate Chat:** Open a direct communication channel with candidates right from the Screening Hub.
* **Resume Access:** Instantly view and download candidate resumes.

### For Administrators
* **Admin Dashboard:** A dedicated control panel featuring an attractive 3D isometric UI.
* **System Overview:** View real-time statistics on total users, jobs, and applications across the platform.
* **User Management:** Monitor and ban users. SyncHire implements robust cascading deletes to automatically clean up orphaned data (jobs and applications) when a user is removed.
* **Global Job Monitoring:** View all active and archived job postings across the entire platform.

### General Platform Features
* **Real-time WebSockets Engine:** Built-in Socket.io integration powering instant messaging and live push notifications.
* **Secure File Uploads:** Cross-platform optimized file handling (Multer) for resumes and profile pictures.
* **Secure Authentication:** JWT-based login with strict role-based access control (RBAC).
* **OTP Email Verification:** Signup and password recovery flows powered by secure one-time passwords (sent via Brevo API).
* **Modern Design:** Deep teal brand colors, glassmorphic navigation, 3D assets, micro-animations, and responsive layouts across all devices.

---

## 📁 Folder Structure

The project is organized into a mono-repo structure with a decoupled client and server:

```text
SyncHire/
├── client/                     # Frontend React Application (Vite)
│   ├── public/                 # Static assets
│   └── src/                    # React Source Code
│       ├── assets/             # Images (admin_dashboard_3d.png) & API services (axios instances)
│       ├── components/         # Reusable UI (Navbar, ChatWindow, Footer, Loader, etc.)
│       ├── context/            # React Context (AuthContext)
│       ├── pages/              # Core Application Pages 
│       │   ├── AdminDashboard.jsx
│       │   ├── Applications.jsx      # Recruiter Screening Hub
│       │   ├── CandidatePipeline.jsx # Candidate Tracking
│       │   ├── ChatWindow.jsx        # Socket.io Chat Interface
│       │   └── ... (Auth, Jobs, Profile pages)
│       ├── routes/             # Routing configs (AppRoutes, ProtectedRoute)
│       ├── App.jsx             # Root routing wrapper
│       ├── main.jsx            # React entry point
│       └── index.css           # Global CSS variables & animations
│
├── server/                     # Backend Node.js / Express API
│   ├── config/                 # Database configurations (db.js)
│   ├── controllers/            # Core business logic
│   │   ├── adminController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── jobController.js
│   ├── middleware/             # Custom middlewares (authMiddleware, uploadMiddleware)
│   ├── models/                 # Mongoose schemas (Application, ChatRoom, Job, Message, Notification, User)
│   ├── routes/                 # Express API routing definitions
│   ├── scripts/                # Utility scripts (seed jobs/users)
│   ├── uploads/                # Local storage for resumes & profile pictures
│   ├── utils/                  # Utilities (resumeParserService.js, sendStatusEmail.js)
│   ├── seedAdmin.js            # Script to seed the superadmin account
│   ├── .env                    # Environment variables (Mongo URI, Brevo API key, JWT Secret)
│   └── server.js               # Express app entry & Socket.io WebSocket engine
│
└── README.md                   # Application documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v20+ recommended)
* **MongoDB** (Local instance or MongoDB Atlas cluster)

### 1. Environment Setup

Inside the `server/` directory, ensure your `.env` file is properly configured:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini-job-portal
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key_for_emails
EMAIL_FROM=noreply@synchire.com
```

### 2. Installing Dependencies

You will need to install the dependencies for both the frontend and backend.
Open two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm install
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
```

### 3. Running the Application

Start both development servers to run the app locally.

**Start the Backend & WebSocket Server (Terminal 1):**
```bash
npm run dev
```
*(Runs on `http://localhost:5000`)*

**Start the Frontend (Terminal 2):**
```bash
npm run dev
```
*(Runs on `http://localhost:5173`)*

Navigate to `http://localhost:5173` in your browser to access SyncHire!

---

## 🛠️ Tech Stack
* **Frontend:** React, Vite, React Router DOM, CSS Modules, Socket.io-client, Axios, React Toastify.
* **Backend:** Node.js, Express.js, Socket.io (WebSockets), MongoDB, Mongoose, JWT, Bcrypt, Multer, pdf-parse.
* **Third-Party:** Brevo (Email OTP Delivery).
