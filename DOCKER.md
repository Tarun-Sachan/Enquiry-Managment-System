# Enquiry Management System (EMS) - Access Guide

This document explains how to access and use the **Enquiry Management System** for both **Admin** and **User** using docker.

---

## **1️⃣ Application URLs**

- **Frontend (React app)**:  
  - `http://localhost:3000`  


- **Backend API (Express)**:  
 - `http://<server-ip-or-domain>/api`

---

## **2️⃣ Instructions**

1. Download the docker-compose.yaml file
2. Create .env with 
   1. VITE_PORT = 3000
   2. VITE_API_URL=http://localhost:5000/api
   3. MONGO_URI = mongodb://mongo:27017/enquiryDB
   4. JWT_SECRET= verystrongpassword
   5. PORT=5000
3. Run with docker compose command: docker compose up -d
4. To stop services: docker compose down
5. To stop and remove volumes (MongoDB data will be deleted): docker compose down -v


    

    

3. **User**
4. **Staff** (Can login but has no features)


