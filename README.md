# SyncHire

**SyncHire** is a modern, responsive, and fully-featured Job Portal application built on the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless experience for two primary types of users: **Candidates** and **Recruiters**. 

With an emphasis on a premium, glassmorphic UI, robust role-based routing, and a clean applicant tracking pipeline, SyncHire streamlines the hiring and job-seeking process.

## ✨ Key Features

### For Candidates
* **Explore Jobs:** Browse available job postings with real-time filtering (Full-time, Part-time, Remote, Internship) and text search.
* **Profile Builder:** Upload your resume, add your qualifications, skills, and set up your profile picture.
* **My Pipeline:** A visual, interactive timeline tracking the progress of your job applications (Applied → Shortlisted → Interview Scheduled → Selected).
* **Job Sharing:** Quickly copy and share job links with your network.

### For Recruiters
* **Active Portfolios (Dashboard):** Manage all your job postings in one place.
* **Demo Environment:** New recruiters can instantly load a fully-populated mock screening pipeline with jobs and applicants to test the system.
* **Screening Hub:** View all applicants for a specific job and update their statuses dynamically.
* **Interview Scheduling:** Directly schedule interviews (Date, Time, Meeting Link) which automatically reflects on the candidate's visual pipeline.
* **Resume Access:** Instantly view and download candidate resumes.

### General Features
* **State Management & UI Feedback:** Comprehensive loading spinners, user-friendly toast error messages, and beautifully designed empty states when no data (jobs/applications) exists.
* **Form Validations:** Robust frontend and backend validation ensuring no empty fields, valid email formats, and secure data entry.
* **Secure Authentication:** JWT-based login with role-based access control.
* **OTP Email Verification:** Signup and password recovery flows powered by secure one-time passwords (sent via Brevo API).
* **Modern Design:** Deep teal brand colors, glassmorphic navigation, micro-animations, and responsive layouts across all devices.

---

## 📁 Folder Structure

The project is organized into a mono-repo structure with a decoupled client and server:

```text
SyncHire/
├── client/                     # Frontend React Application (Vite)
│   ├── public/                 # Static assets (favicons, etc.)
│   └── src/                    # React Source Code
│       ├── assets/             # Images and API service definitions (jobService, etc.)
│       ├── components/         # Reusable UI components (Navbar, Footer, Loader)
│       ├── context/            # React Context (AuthContext for global user state)
│       ├── pages/              # Application Pages (Login, Pipeline, Dashboard, Jobs, etc.)
│       ├── routes/             # React Router configuration (AppRoutes, ProtectedRoute)
│       ├── App.jsx             # Root component containing routing logic
│       ├── main.jsx            # React entry point
│       └── index.css           # Global styles, animations, and design system variables
│
├── server/                     # Backend Node.js / Express API
│   ├── config/                 # Database connection configurations (db.js)
│   ├── controllers/            # Route logic (authController, jobController, applicationController)
│   ├── middleware/             # Custom Express middlewares (auth, file upload)
│   ├── models/                 # MongoDB Mongoose schemas (User, Job, Application)
│   ├── routes/                 # API routing definitions
│   ├── scripts/                # Utility scripts (seeding database, loading mock data)
│   ├── uploads/                # Local storage for user resumes and profile pictures
│   ├── utils/                  # Helper utilities (sendOTPEmailService)
│   ├── .env                    # Environment variables (Mongo URI, JWT Secret, Brevo API key)
│   └── server.js               # Express application entry point
│
└── README.md                   # Application documentation
```

*(Note: Unused legacy directories like `hooks`, `layouts`, and `utils` from the client have been strictly pruned for code cleanliness).*

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v16+ recommended)
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

**Start the Backend (Terminal 1):**
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
* **Frontend:** React, Vite, React Router DOM, CSS Modules, Axios, React Toastify.
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt, Multer (File uploads).
* **Third-Party:** Brevo (Email OTP Delivery).
