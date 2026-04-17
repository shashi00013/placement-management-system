# 🎓 College Placement Management System

A full‑stack web application to streamline the student placement process for colleges.  
It provides three distinct portals – **Student**, **Training & Placement Officer (TPO)**, **Management**, and a **Super Admin** – to manage everything from job postings to offer letters.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-upload-3448C5?logo=cloudinary)

---


## 📸 Screenshots
<img width="1536" height="1024" alt="screenshort" src="https://github.com/user-attachments/assets/6c5960ff-d6a2-435b-953a-88e66f149af0" />

## ✨ Features
### 👨‍🎓 Student Portal
- Register / Login with JWT authentication
- Complete profile (branch, CGPA, skills, phone, etc.)
- Upload resume (PDF/DOCX) – stored on **Cloudinary**
- View job openings filtered by CGPA & branch eligibility
- Apply for jobs (one click)
- Track application status: applied → shortlisted → interview scheduled → selected → offer letter generated
- Download offer letter when available

### 👔 TPO (Training & Placement Officer) Portal
- Post, edit, and delete job listings
- Define eligibility criteria (min CGPA, allowed branches)
- View all applications for each job with student profiles
- Update application status
- Schedule interviews (date & meeting link)
- Upload offer letters (PDF) – stored on Cloudinary
- Overview of all applications across jobs

### 📊 Management Dashboard
- Real‑time placement statistics:
  - Total students, placed students, placement percentage
  - Branch‑wise placement counts (bar chart)
  - Top recruiting companies (table)
  - Monthly placement trends (line chart)
- Visual charts using **Recharts**

### 👑 Super Admin
- Manage all users (create, edit roles, delete)
- Create TPO and Management accounts
- View system‑wide stats (total users by role, profile completion rate)

### 🔒 Security
- Role‑based access control (student / tpo / management / superadmin)
- Password hashing with bcrypt
- JWT tokens for API protection

---

## 🛠️ Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| **Frontend**| React 18, React Router, Axios, Tailwind CSS, Recharts, React Hot Toast     |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Multer                                |
| **Database**| MongoDB (Mongoose ODM)                                                     |
| **File Storage** | Cloudinary (resumes & offer letters)                                  |
| **Dev Tools**| Vite, Nodemon, ESLint                                                     |

---

## 🗂️ Project Structure
placement-management-system/
├── backend/
│   ├── config/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   └── App.js
    ├── package.json
    └── index.html


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shashi00013/placement-management-system.git
   cd placement-management-system


  Backend setup

bash
cd backend
npm install
Create a .env file in backend/:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement_system
JWT_SECRET=your_super_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start the backend server:

bash
npm run dev   # runs on http://localhost:5000
Frontend setup

bash
cd ../frontend
npm install
npm start      # runs on http://localhost:3000
Seed a Super Admin (optional)
Connect to MongoDB and run:

javascript
db.users.insertOne({
  name: "Super Admin",
  email: "admin@college.edu",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/FuE6k5lQjJ5Q5g5b5x5x5x5x5x5", // "admin123" hashed
  role: "superadmin",
  createdAt: new Date()
})
📸 Screenshots (Placeholder)
Add your own screenshots after running the project.

Student Dashboard	Job Listings	Application Tracking
https://via.placeholder.com/400x200?text=Student+Dashboard	https://via.placeholder.com/400x200?text=Job+Listings	https://via.placeholder.com/400x200?text=Applications
TPO – Manage Jobs	Management Analytics
https://via.placeholder.com/400x200?text=TPO+Manage+Jobs	https://via.placeholder.com/400x200?text=Management+Analytics
🧪 API Endpoints (Main)
Method	Endpoint	Description	Access
POST	/api/auth/register	Student registration	Public
POST	/api/auth/login	Login all users	Public
GET	/api/student/jobs	Get eligible jobs	Student
POST	/api/student/jobs/:id/apply	Apply to a job	Student
POST	/api/tpo/jobs	Create a job	TPO, Admin
PUT	/api/tpo/applications/:id	Update application status	TPO, Admin
GET	/api/management/stats	Placement analytics	Management, Admin
GET	/api/superadmin/users	List all users	Super Admin
Full API documentation available in the backend/routes folder.

🤝 Contributing
Contributions are welcome!

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

📄 License
Distributed under the MIT License. See LICENSE file for more information.

📬 Contact
Shashi Kumar – sk5251476@gmail.com
GitHub: shashi00013
LinkedIn: linkedin.com/in/shashi0013

Project Link: https://github.com/shashi00013/placement-management-system

🙏 Acknowledgements
React

Node.js

MongoDB

Cloudinary

Tailwind CSS

Recharts

text

This README matches your GitHub profile style, includes your contact info, and provides a clear, actionable guide for anyone who wants to use or contribute to the project. You can replace the placeholder screenshots with actual images once you deploy the app.
