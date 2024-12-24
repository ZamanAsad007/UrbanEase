
---

# UrbanEase - A Local Community Problem Reporting Portal

A web-based platform for residents to report community problems and allow other residents and administrators to view, comment, and manage these reports. The system provides a feed-like interface where users can post problems, view updates, and ensure transparency in resolving issues.

---

## Features

### Residents
- Post issues with a title, description, and optional image.
- View all reported issues in a feed-style interface.
- Comment on problems and discuss solutions.
- View the status of reported problems (Pending, In Progress, Resolved).

### Admin
- View all reported issues and their details.
- Update the status of problems.
- Receive email notifications about new problem reports.

---

## Tech Stack

- **Frontend**:  
  - React.js  
  - CSS (or a library like TailwindCSS/Bootstrap)  

- **Backend**:  
  - Express.js  
  - Node.js  
  - Nodemailer for email notifications  

- **Database**:  
  - MySQL  

- **Dev Tools**:  
  - VS Code  
  - Postman for API testing  
  - Concurrently for managing frontend and backend  

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/)  
- [MySQL](https://dev.mysql.com/downloads/)  
- [Git](https://git-scm.com/)  

### Steps to Install

#### 1. Clone the Repository
```bash
git clone https://github.com/mahin273/UrbanEase
cd UrbanEase
```

#### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:  
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=community_reporting
   EMAIL_HOST=smtp.yourmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@example.com
   EMAIL_PASS=yourpassword
   ```
4. Run migrations to create database tables:
   ```bash
   node src/db/migrate.js
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

#### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

#### 4. Run Both Servers Together
From the **root folder**, use:
```bash
npm run start
```

---

## API Endpoints

### Authentication
- `POST /api/login` - User login.
- `POST /api/register` - User registration.

### Problem Management
- `GET /api/problems` - Fetch all problems.
- `POST /api/problems` - Create a new problem.
- `GET /api/problems/:id` - Get a specific problem.
- `PUT /api/problems/:id` - Update problem status (admin).
- `DELETE /api/problems/:id` - Delete a problem.

### Commenting
- `POST /api/problems/:id/comments` - Add a comment to a problem.
- `GET /api/problems/:id/comments` - Fetch comments for a specific problem.

---

## Folder Structure

```plaintext
community-problem-reporting/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   │   ├── migrate.js
│   │   │   ├── config.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   ├── public/
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

---

## Future Enhancements

- Add location tagging for problems.
- Integrate notifications for residents when the status of a problem changes.
- Implement OAuth for secure authentication.

---

## Contributing

Feel free to submit issues or pull requests. Contributions are welcome!

---

## License

This project is licensed under the MIT License.

---
