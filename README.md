# postgresql-ejs-basic-crud

A basic **CRUD (Create, Read, Update, Delete)** web application built with **Node.js, TypeScript, Express, PostgreSQL, and EJS**.
This project demonstrates **server-side rendered templates** with real database operations, without using any frontend framework or REST API architecture.

---

## 📌 Features

- Create student records
- View student list (real-time refresh)
- Edit existing student records
- Delete students with SweetAlert2 confirmation
- PostgreSQL database with parameterized queries
- Server-side rendering using EJS templates
- Single-page workflow (no redirect on submit)
- Toast notifications for success/error
- Public IP display for accessing from another device
- Clean and beginner-friendly code structure

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Template Engine:** EJS
- **UI Enhancements:** SweetAlert2, CSS
- **Dev Tool:** ts-node-dev

---

## 📂 Project Structure

```
postgresql-ejs-basic-crud/
│
├── src/
│   ├── app.ts          # Main server file
│   ├── db.ts           # PostgreSQL connection
│   ├── views/
│   │   └── form.ejs    # Main UI template
│   └── public/
│       └── logo.png    # App logo
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Setup

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  roll VARCHAR(50) NOT NULL,
  registration VARCHAR(50) NOT NULL,
  email VARCHAR(120) NOT NULL,
  address TEXT NOT NULL
);
```

Update your database credentials in `src/db.ts`.

---

## ▶️ How to Run the Project

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start the development server

```bash
npm run dev
```

### 3️⃣ Open in browser

```
http://localhost:3000
```

---

## 🌐 Access From Another Device

The application header displays your **public IP address**.

Example:

```
http://YOUR_PUBLIC_IP:3000
```

Ensure:

- Port `3000` is allowed in firewall
- Devices are on the same network or router allows access

---

## 🎓 Use Case

This project is suitable for:

- Database Management System (DBMS) assignments
- Learning PostgreSQL with Node.js
- Understanding CRUD without frontend frameworks
- Academic demonstrations
- Beginner full-stack practice

---

## 🚀 Future Improvements (Optional)

- Search and filter students
- Pagination
- Soft delete
- Authentication
- Deployment to cloud/VPS

---

## 📄 License

This project is for **educational purposes**.
You are free to use, modify, and extend it.

---

## 👨‍💻 Author

Developed as a learning project using **TypeScript + PostgreSQL + EJS**.
