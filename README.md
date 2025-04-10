# 📝 MERN Task Manager with Role-Based Access (Admin & User)

This is a secure task management system built with the **MERN Stack** (MongoDB, Express, React, Node.js), featuring two roles: **User** and **Admin**, with an additional **Super Admin** role for enhanced control and security.

## 🔐 Security Highlight

To enhance security, there is **no public admin signup route**.  
A **Super Admin** is manually created in the database, and only the Super Admin can create new admin profiles. This prevents normal users from accessing admin privileges.

---

## 🚀 Features

### 👤 User
- Register & Log in
- Add tasks
- Update task status
- Delete tasks
- View own profile

### 🛡️ Admin
- Created by Super Admin only
- View all users
- Delete users (automatically deletes their tasks)
- Delete specific user tasks
- View own profile

### 👑 Super Admin
- Manually added in DB
- Has access to create Admin accounts only

---

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap, Custom CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Password Encryption:** Bcrypt

---

## 📷 Screenshots

![Login](./screenshots/1.png)
![Login](./screenshots/2.png)
![Login](./screenshots/3.png)
![Login](./screenshots/4.png)
![Login](./screenshots/5.png)
![Login](./screenshots/6.png)
![Login](./screenshots/7.png)

