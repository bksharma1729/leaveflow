LeaveFlow – Full Stack Leave Management System
🧾 Overview

LeaveFlow is a full-stack role-based Leave Management System designed to streamline employee leave requests and approvals.

The system supports Admin, Manager, and Employee roles, each with controlled access using JWT authentication and role-based authorization middleware.

This project demonstrates modern full-stack development using React, Node.js, Express, MongoDB, and structured Git workflow.

 Tech Stack
Frontend

React (Vite)

React Router DOM

Axios (centralized API client)

Context API (Auth management)

Role-based Protected Routes

Chart-based Dashboard UI

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Role-based Authorization Middleware

Input Validation Middleware

🔐 Authentication & Authorization

JWT-based authentication

Token stored in localStorage

Centralized Axios interceptor for Authorization header

Role-based middleware on backend

Protected routes on frontend

👥 User Roles & Capabilities
🧑‍💼 Employee

Register & Login

Apply for leave

View leave history

Track leave status (Pending / Approved / Rejected)

🧑‍💻 Manager

View all leave requests

Approve or reject leave applications

Access dashboard analytics

🛠 Admin

View all users

Update user roles

Delete users

Full system oversight

📂 Project Structure
leaveflow/
│
├── client/         # React Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── server/         # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
🚀 Installation & Setup
1️⃣ Clone Repository
git clone <repository-url>
cd leaveflow
2️⃣ Backend Setup
cd server
npm install

Create .env file inside server/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend:

npm run dev

Server runs on:

http://localhost:5000
3️⃣ Frontend Setup
cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173
🌐 API Base URL Configuration

Frontend Axios client uses:

import.meta.env.VITE_API_BASE_URL

Fallback:

http://localhost:5000/api

Optional .env inside client:

VITE_API_BASE_URL=http://localhost:5000/api
🔄 Application Workflow

User registers

JWT token issued on login

Token stored in localStorage

Axios interceptor attaches token

Backend verifies token

Role middleware controls access

Leave workflow executed

📊 Key Features

Role-based dashboards

Leave application system

Leave approval system

Centralized Axios API layer

Protected frontend routing

Modular backend architecture

Clean Git workflow using feature branches

🧠 Architecture Highlights

Separation of concerns (routes, controllers, middleware)

Centralized API client

Role-based access control (RBAC)

Structured commit history

Feature-branch Git workflow

Clean project modularization

🛠 Git Workflow Used

main → Production stable

develop → Integration branch

feature/* → Feature development

Structured commits per feature

📌 Future Improvements

Leave balance tracking

Pagination for leave tables

Email notifications

Deployment (Vercel + Render)

Unit testing

📜 License

This project is developed for academic and learning purposes.

👨‍💻 Author

bablu kumar
Full Stack Developer
GitHub: https://github.com/bksharma1729

⭐ Final Notes

This project demonstrates:

Full-stack integration

Authentication & authorization

REST API design

React state management

Git branch strategy

Real-world application structure
