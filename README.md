# FreelanceHub - Freelancer Hiring Platform

A full-stack MERN application for hiring freelancers across various categories including bodyguards, anchors, actors, models, and dancers.

## Features

### Frontend
- User authentication (login/register)
- Browse and search freelancers by category
- Detailed freelancer profiles with ratings
- Job creation and management
- Payment processing
- Admin dashboard
- Responsive design

### Backend
- RESTful API with Express
- MongoDB database with Mongoose
- JWT authentication
- Role-based access control (Client, Freelancer, Admin)
- Payment processing (mock implementation)

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Seed the database with test data:**
   ```bash
   npm run seed
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

5. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Test Accounts

After running the seed script, you can log in with:

**Admin:**
- Email: admin@example.com
- Password: password123

**Client:**
- Email: client@example.com
- Password: password123

**Freelancers:**
- bodyguard@example.com / password123
- anchor@example.com / password123
- model@example.com / password123
- dancer@example.com / password123
- actor@example.com / password123

## User Roles

- **Client**: Can browse freelancers, create jobs, and make payments
- **Freelancer**: Can create profile, accept/decline jobs
- **Admin**: Can manage users and approve freelancer profiles
