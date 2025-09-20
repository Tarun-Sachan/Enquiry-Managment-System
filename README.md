===============================
Enquiry Management System (EMS)
===============================

Link : http://20.244.27.212/  
Postman Documentation Link : https://documenter.getpostman.com/view/28696955/2sB3HtEwJ8#8c3efe8b-5b0e-4230-a7b9-a2154607e82d  
Project working is described in ACCESS.md  

A MERN stack application for managing customer enquiries.
Frontend: React + Vite
Backend: Node.js + Express
Database: MongoDB

-------------------------------
1. Clone Repositorie
-------------------------------

# Backend
git clone <GITHUB_URL>

-------------------------------
1. Backend Setup
-------------------------------

cd backend

# Create .env file with the following content:
# PORT=5000
# JWT_SECRET=your_jwt_secret_key
# MONGO_URI=mongodb://localhost:27017/enquiryDB

npm install
npm run dev

# Backend will run at: http://localhost:5000

-------------------------------
3. Frontend Setup
-------------------------------

cd frontend

# Create .env file with the following content:
# VITE_PORT=3000
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev

# Frontend will run at: http://localhost:3000

-------------------------------
4. Frontend Production Build
-------------------------------

cd frontend
npm run build

# The `dist/` folder is ready to serve via Nginx.

-------------------------------
5. Environment Variables
-------------------------------

Frontend:
  - VITE_PORT: development server port
  - VITE_API_URL: backend API base URL

Backend:
  - PORT: backend server port
  - JWT_SECRET: secret key for JWT tokens
  - MONGO_URI: MongoDB connection string

-------------------------------
6. Common Commands
-------------------------------

# Install backend dependencies
cd backend && npm install

# Run backend dev server
npm run dev

# Install frontend dependencies
cd frontend && npm install

# Run frontend dev server
npm run dev

# Build frontend for production
npm run build

-------------------------------
7. Deployment Notes
-------------------------------

- Update `VITE_API_URL` in frontend `.env` for production
- Use Nginx to serve frontend `dist/` and proxy `/api` requests to backend
- Use Certbot for HTTPS once domain resolves to your server IP
- Ensure backend port matches `proxy_pass` in Nginx config
