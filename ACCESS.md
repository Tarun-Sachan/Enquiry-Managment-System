# Enquiry Management System (EMS) - Access Guide

This document explains how to access and use the **Enquiry Management System** for both **Admin** and **User** roles.

---

## **1️⃣ Application URLs**

- **Frontend (React app)**:  
  - Development: `http://localhost:3000`  
  - Production: `http://<your-domain>` (e.g., `ems.aryansachan.dev`)

- **Backend API (Express)**:  
  - Development: `http://localhost:5000/api`  
  - Production: `http://<server-ip-or-domain>/api`

---

## **2️⃣ User Roles**

The application has two types of users:

1. **Admin**
2. **User**
3. **Staff** (Can login but has no features)

---

## **3️⃣ Default Credentials**

> Replace these with your actual seeded users or admin credentials

| Role  | Email                  | Password       |
|-------|------------------------|----------------|
| Admin | admin@gmail.com        | 1234           |
| User  | user1@gmail.com        | 1234           |

---

## **4️⃣ Login**

1. Open the frontend URL in your browser.
2. Enter the **email** and **password**.
3. Click **Login**.

**Notes:**
- Admin users have access to all features, including managing users, viewing all enquiries, and changing enquiry statuses.
- Regular users can only create enquiries and view their own submissions.

---

## **5️⃣ Dashboard Overview**

### **Admin Dashboard**

- **Users Tab**:  
  View, add, or manage all registered users.
- **Enquiries Tab**:  
  View all enquiries, edit statuses, assign enquiries, and delete enquiries.
- **Logout**:  
  Click **Logout** button at the top-right corner to exit.

### **User Dashboard**

- **Enquiries Tab**:  
  View only enquiries created by this user.
- **Add Enquiry**:  
  Fill in customer details and message to create a new enquiry.
- **Logout**:  
  Click **Logout** to exit.

---


## **6️⃣ Notes**


- For production, ensure the frontend environment variable `VITE_API_URL` points to your backend API URL.

---

## **7️⃣ Logout**

Click the **Logout** button in the top-right of the dashboard. This will:

1. Clear authentication token and user info.
2. Redirect you to the login page.

