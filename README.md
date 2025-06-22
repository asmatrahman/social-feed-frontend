# 📹 Social Feed

A modern full-stack video-sharing platform where users can upload, explore, and view videos — similar to YouTube Shorts or TikTok. Built with the MERN stack, styled with Tailwind CSS and ShadCN UI, and deployed on Netlify.

🌐 **Live Site:** [social-feed-ar.netlify.app](https://social-feed-ar.netlify.app/)

---

## 🚀 Features

- 🔐 **Authentication**
  - JWT-based login/signup
  - Protected routes (upload only for logged-in users)

- 📤 **Video Upload**
  - Upload `.mp4` files via drag & drop
  - Stored securely using **Cloudinary**

- 🎥 **Video Feed**
  - Responsive grid layout
  - Displays title, description, uploader name, and upload date

- 🔎 **Recommendations**
  - Related videos shown on individual video pages

- ⚙️ **Stack**
  - **Frontend**: Next.js 15+, TypeScript, Tailwind CSS, ShadCN UI
  - **Backend**: Node.js, Express, MongoDB, Mongoose
  - **Media Hosting**: Cloudinary
  - **Auth**: JWT tokens, stored in localStorage
  - **Deployment**: Netlify (frontend), Render/Heroku (backend)

---

## 🧠 Technologies Used

- **Frontend**: `Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `ShadCN UI`
- **Backend**: `Node.js`, `Express`, `MongoDB`, `Mongoose`
- **File Uploads**: `Multer`, `Cloudinary`
- **Authentication**: `JWT`, `bcryptjs`
- **UI/UX**: Responsive design, Dark mode, Alerts (`sonner`)
- **Deployment**: `Netlify`, `Render`, `.env` support

---

## ✨ Credits
- Built by Asmat Rahman 💻
- Cloudinary integration inspired by Cloudinary Node SDK
- UI based on ShadCN and Tailwind design patterns

---
