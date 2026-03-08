# UrbanEase

UrbanEase is a **local community problem reporting system** where residents can report issues in their area (e.g., broken streetlights, garbage, water problems), and moderators/admins can track and resolve them. It is built as a full‑stack web application with a **Node.js + Express + MySQL** backend and a **React + Bootstrap** frontend.

---

## Tech Stack

- **Backend**: Node.js, Express, MySQL (`mysql2`), JWT auth, Multer for image uploads
- **Frontend**: React (Create React App), React Router, Axios, Bootstrap 5 (with light/dark theme)
- **Auth & Security**: JWT-based authentication, role-based access control
- **Other**: Nodemailer (email helper), bcrypt for password hashing, dotenv for config

---

## Features

### Roles

- **Admin**
  - Create areas
  - Assign moderators to areas
  - Approve / reject new users
  - Create moderator accounts
  - Delete non-placeholder areas (with safety checks)
- **Moderator**
  - See all posts from their assigned area
  - Change post status: `pending` → `in_progress` → `resolved`
  - Delete posts if necessary
  - Work with a tabbed dashboard: **Active** vs **Resolved** posts
- **User**
  - Register and log in
  - Create posts with title, description, optional location URL, and up to 2 images
  - Comment on posts
  - Upvote posts (one upvote per user per post)
  - Manage profile (name changes with cooldown, password change, avatar upload)

### Areas & Posts

- Areas are created by admin; each user and moderator belongs to an area.
- Users can view a **feed of posts by area**.
- Each post includes:
  - Title & description
  - Optional Google Maps / external location link
  - Optional images
  - Status field: `pending`, `in_progress`, or `resolved`
  - Upvote count & whether the current user upvoted

### Comments

- Users can comment on posts.
- Comments display commenter **usernames**, not just IDs.

### Upvotes

- Separate `post_upvotes` table ensures **one upvote per user per post**.
- Only **regular users** (role user) can upvote; moderators/admins cannot.

### Theming & UI

- Responsive dashboards for Admin, Moderator, and User roles.
- Sticky top navbar with:
  - App brand
  - Theme toggle (light/dark; stored in `localStorage`)
  - Profile collage (avatar + username) linked to `/profile`.
- Sidebar navigation for each role, with logout button at the bottom.

---

## Project Structure

```
UrbanEase/
  backend/
    src/
      index.js            # Express app entry
      config/             # DB + server config
      controllers/        # Route handlers
      models/             # DB model helpers
      repositories/       # Data access (CRUD abstractions)
      routes/             # Express routers (v1, posts, users, areas, etc.)
      services/           # Business logic (posts, users, areas, upvotes)
      db/                 # SQL schema, seed, migration, admin creation
  frontend/
    src/
      components/         # Navbar, Sidebar, PostCard, DashboardLayout, etc.
      pages/              # Login, Register, Dashboards, Profile, Post details
      routes/             # AppRoutes (role-based routing)
      services/           # Axios API helpers
```

---

## Backend Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**

   Create a `.env` file in `backend` (you already have one, just ensure values are correct):

   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=urbanease
   JWT_SECRET=your_jwt_secret
   ```

3. **Initialize and migrate the database**

   ```bash
   cd backend
   npm run db:init      # creates schema/tables if needed
   npm run db:migrate   # applies safe schema migrations
   npm run db:seed      # basic seed data (roles, etc.)
   npm run db:seed:demo # (optional) demo users + posts
   npm run db:create-admin # create an initial admin user
   ```

4. **Run the backend (dev)**

   ```bash
   cd backend
   npm run dev
   ```

   The API typically runs on `http://localhost:3001`.

---

## Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Run the frontend (dev)**

   ```bash
   cd frontend
   npm start
   ```

   The app typically runs on `http://localhost:3000`.

3. **Build for production**

   ```bash
   cd frontend
   npm run build
   ```

---

## Root Convenience Script

From the project root, you can start both backend and frontend together:

```bash
npm install      # installs root dev deps (concurrently)
npm run start    # runs backend and frontend in parallel
```

---

## Key Endpoints (High-Level)

> Full details are in the Express route files under `backend/src/routes/v1`.

- `POST /api/v1/auth/login` – Login and receive JWT
- `POST /api/v1/users` – Register a new user (starts as pending)
- `GET /api/v1/users/me` – Get current user profile
- `PATCH /api/v1/users/me` – Update profile (name)
- `PATCH /api/v1/users/me/password` – Change password
- `PATCH /api/v1/users/me/avatar` – Upload avatar (Multer)
- `GET /api/v1/areas` – List areas
- `POST /api/v1/areas` – (Admin) Create area
- `PATCH /api/v1/areas/:id/assign-moderator` – (Admin) Assign moderator to area
- `DELETE /api/v1/areas/:id` – (Admin) Delete area (with user reassignment & safety checks)
- `GET /api/v1/posts?area_id=...` – List posts by area
- `GET /api/v1/posts/mine` – List posts by current user
- `POST /api/v1/posts` – Create post (with optional images)
- `GET /api/v1/posts/:id` – Get post + comments
- `PATCH /api/v1/posts/:id/status` – (Moderator/Admin) Update post status
- `DELETE /api/v1/posts/:id` – (Moderator/Admin) Delete post
- `POST /api/v1/posts/:id/comments` – Add comment
- `GET /api/v1/posts/:id/comments` – List comments
- `POST /api/v1/posts/:id/upvote` – (User) Toggle upvote

---

## Roles & Access Summary

- **Admin**
  - Owns area and moderator management
  - Approves/rejects users
  - Can delete areas (except the placeholder `Unassigned` area, and only when they have no posts)
- **Moderator**
  - Only sees posts for their assigned area
  - Changes statuses and can delete posts
  - Works mainly from the tabbed Moderator Dashboard
- **User**
  - Creates and upvotes posts
  - Comments and manages own profile

---

## Notes

- There is a special placeholder area (e.g., **Unassigned**, usually `id = 1`) used as a safe default when deleting areas or reassigning users.
- Migrations (`npm run db:migrate`) are designed to be **safe** (additive / non-destructive) so you can evolve the schema on an existing database.

---

## License

This project is licensed under the **MIT License**.
