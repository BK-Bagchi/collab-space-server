# 🚀 **Collab Space — Real-Time Team Collaboration & Project Management Platform**

Collab Space is a **full-stack collaboration and productivity platform** built with the MERN stack, Socket.IO, and a fully customizable, modern UI.
It provides **project management**, **task workflow**, **real-time messaging**, **notifications**, **analytics**, **notes**, and **team activity tracking** — all in one unified workspace.

---

## 🌟 **Key Highlights**

- **Real-time Collaboration** using Socket.IO
- **Modular Project & Task System**
- **Integrated Messaging (1:1 + Group/Project Chat)**
- **Live Notifications** for all important events
- **Fully Responsive Custom UI** (Tailwind + DaisyUI)
- **Role-based Permissions**
- **Analytics Dashboard**
- **Database-driven Notes System**
- **Full Activity Log**
- **File Uploads (Images + Documents)**
- **Multi-device user session support**

---

## 🧰 **Tech Stack**

### **Frontend**

- React.js (Vite)
- Tailwind CSS
- DaisyUI
- React Router
- Axios
- React Hook Form + Zod
- Recharts
- Context API (Active, Auth, Theme, Notifications,)
- Lucide Icons
- Cloudinary (Storing images and files)

### **Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + Bcrypt
- Socket.IO (WS server)

### **Real-Time**

- Socket.IO
- Active User Tracking
- Live Messaging
- Instant Notifications

---

## 📦 **Project Structure**

```
collab-space/
│── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── socket/
│   └── index.js
│
│── client/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── charts/
│   │   ├── components/
│   │   ├── context/
│   │   ├── forms/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validations/
│
```

Here are **strong, polished, professional “Why This Project Stands Out?”** points you can put in your README.

---

## 🌟 **Why This Project Stands Out**

Collab Space is not just another project-management tool — it combines real-time communication, task tracking, project analytics, and file sharing into one seamless experience. Here's what makes it special:

### 🚀 **1. All-in-One Collaboration Platform**

Most platforms only do tasks **or** chat **or** file sharing.
Collab Space unifies **chat + projects + tasks + notifications + files + calendar** in a single ecosystem.

### ⚡ **2. Real-Time Everything**

Powered by Socket.IO:

- Live chat
- Instant notifications
- Online/offline status
- Active user tracking
- Real-time updates in project rooms

Zero refresh needed. Everything updates instantly.

### 🎯 **3. Clean, Modern, Fast UI**

With Tailwind + DaisyUI + your custom color palette:

- Smooth, lightweight interface
- Mobile-responsive
- Intuitive navigation
- Minimalistic layout focused on productivity

### 🔐 **4. Secure File Sharing**

Unlike many chat apps, Collab Space allows:

- Uploading images, PDFs, DOCX, ZIP, and more
- Cloudinary-secured file URL
- Downloadable attachments directly in chat

### 📊 **5. Built-In Analytics**

Project dashboard includes:

- Team productivity charts
- Task completion progress
- Overdue task analysis
- Individual user contributions

Turns raw data into meaningful insights.

### 💬 **6. Professional-Grade Chat System**

Not a basic chat — but a complete messaging module:

- Readable bubbles
- Avatars & status badge
- Timestamps, formatting
- File attachments
- Message grouping
- Typing indicators
- Auto-scroll + reverse order sorting

Feels like Slack/Discord but built from scratch.

### 🛠️ **7. Highly Configurable Settings (next version feature)**

Users can personalize:

- Profile
- Theme/appearance
- Notifications
- Chat preferences
- Timezone/calendar
- Privacy
- Danger Zone controls

Gives full control instead of a fixed rigid UI.

### 🔍 **8. Smart Filtering & Searching**

- Filter team partners by expert/intermediate/beginner
- Sort tasks
- Slice lists
- Search users/projects instantly

Optimized for large teams.

### 🎯 **9. Built for Teams**

Perfect for:

- Software teams
- Study groups
- Freelancers
- Small companies
- Startup project management

Scalable and extendable for future roles/permissions.

### 💡 **10. Crafted with Modern Industry Standards**

Uses a **real production-style architecture**:

- React + Context + Hooks
- Node.js & Express modular backend
- MongoDB models, controllers, routes
- Real-time layers (Socket.IO)
- File uploads (Cloudinary)
- JWT authentication
- Clean API structure

This makes the project production-ready, not just for learning.

---

## ✨ **Features in Detail**

### 🔐 **1. Authentication & Authorization**

#### Features:

- Register / Login / Logout
- JWT Authentication
- Password hashing (bcrypt)
- Forgot + Reset Password (next version feature)
- Update Profile
- Update Password
- Context-based global auth state
- Role-based access (ADMIN/ MANAGER/ MEMBER)

---

### 📁 **2. Projects Module**

- Create new projects
- Update project details
- Delete projects
- Add/remove members
- Manage member roles
- Project analytics (tasks, deadlines, members)
- Real-time updates to project participants
- Project-level chat
- Automatic activity logging

---

### 📝 **3. Task Management**

- Create, update, delete tasks
- Assign multiple members
- Set priority (Low, Medium, High)
- Track status (Todo → In Progress → Done)
- Due date picker + overdue detection
- Dynamic subtasks
- Real-time status updates
- Task filtering and sorting
- Zod validation
- Task activity log
- Task notifications in real-time

---

### 💬 **4. Real-Time Chat Module**

#### Supports:

1.  ✔ 1-to-1 Messaging

2.  ✔ Project Group Chat

3.  ✔ File & image messaging

4.  ✔ Online/Offline System

5.  ✔ Typing indicators

6.  ✔ Multi-device delivery

7.  ✔ Last-message previews

Chat Architecture includes:

- Hybrid `Chat` model
- Real-time messaging via Socket.IO
- Seen/unseen tracking ready (next version feature)

---

### 🔔 **5. Notification System (Real-Time + DB)**

Every important event emits a notification:

- Task assigned
- Task updated
- New project invite
- Role changed
- File shared
- Message received

#### Features:

- Notification Context
- Live badge count in header
- Stored in database
- Real-time delivery
- Avoids array-wrapping bug (no more `[[{}]]`)
- Clean Socket.IO listeners

---

### 📊 **6. Dashboard & Analytics**

Dashboard displays:

- Task completion analytics
- Team activity trends
- Personal productivity
- Overdue tasks
- Weekly progress graphs
- Project summaries
- Real-time updates via sockets
- Recharts visualizations

---

### 🧾 **7. Notes System (next version feature)**

A mini personal notes module.

#### Supports:

- Text-based notes
- Todo-list notes
- Tags
- Pinned notes
- Archived notes
- Link notes to projects or tasks
- Search notes
- Update todo items

---

### 🕒 **8. Calendar Integration**

- Show deadlines
- Upcoming tasks
- Project events
- Calendar modal integrated
- Planned reminder + scheduling system

---

### 🗄 **9. File Management**

- Upload images & documents
- Cloudinary integration
- Preview supported
- Stored as message attachments
- Activity logged automatically

---

### 🧩 **10. Activity Log**

Tracks everything:

- Project creation
- Member added/removed
- Task created/updated/deleted
- Role changed
- Settings updated

Users can view their own activity history.

---

## 🔌 **Real-Time System — Socket.IO**

## Socket Events:

### **Client → Server**

- `setup` (user joins)
- `joinRoom`
- `sendMessage`
- `becomeActive`

### **Server → Client**

- `activeUsers`
- `receiveMessage`
- `taskUpdated`
- `newNotification`
- `projectUpdated`

### Online User Tracking:

- Supports multi-tab and multi-device
- Stores array of socket IDs per user
- Disconnect event auto-cleans user registry

### Ensures:

- Precise user targeting
- Efficient broadcasting
- Clean listener cleanup

---

## 🧭 **API Endpoint**

- [Click here]() to see api endpoints

---

## ⚙️ **Installation**

### 1️⃣ Clone repo

```bash
git clone https://github.com/bk-bagchi/collab-space.git
git clone https://github.com/bk-bagchi/collab-space-server.git
```

### 2️⃣ Backend setup

```bash
cd server
npm install
npm run start
```

Get front-end repository [here](https://github.com/BK-Bagchi/collab-space).

### 3️⃣ Frontend setup

```bash
cd client
npm install
npm run start
```

Get backend-end repository [here](https://github.com/BK-Bagchi/collab-space-server).

---

## 🔐 **Environment Variables**

### **Backend `.env`**

```
PORT=your_port_number
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
GOOGLE_CLIENT_ID=your_google_client_id
```

### **Frontend `.env`**

```
VITE_BASE_URL=your_base_url
VITE_API_URL=your_api_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_CLOUD_NAME=your_cloudinary_key
VITE_UPLOAD_PRESET=your_upload_preset
```

---

## 🚀 Deployment

- Frontend: **Netlify**
- Backend: **Render**

---

## 🔮 Roadmap (Planned Features)

- Voice & Video Calls (WebRTC)
- Whiteboard Collaboration
- Notes in dashboard for user specific use.
- AI Assistant for Tasks & Summaries
- Gantt Chart / Timeline System
- Project Automations (Triggers)
- Public/Private Channels
- Offline Mode (IndexedDB)
- Advanced File Manager

---

## 👨‍💻 Author

Developed with ❤️ by Balay Kumar Bagchi

### 👨 About Me

I’m Balay Kumar Bagchi, a Full-Stack Developer passionate about building scalable, real-world applications.
This project demonstrates my ability to:

- Architect secure, production-ready systems.
- Handle complex business logic like escrow payments & disputes.
- Deliver end-to-end solutions (frontend + backend + integration).

📫 Let’s connect → [LinkedIn](https://www.linkedin.com/in/bkbagchi-dipto/) | [Portfolio](https://bkbagchi-dipto.netlify.app/) | [Email](bkbagcchi.dipto@gmail.com) | [Github](https://github.com/bk-bagchi)
