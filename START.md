# 🚀 How to Start FreelanceHub

## Important Note
This application requires MongoDB to run the backend. Since MongoDB is not available in this environment, here are your options:

## Option 1: View Frontend Only (Demo Mode)

You can view the frontend design and UI:

```bash
cd frontend
npm run dev
```

The frontend will be available, but API calls will fail since the backend needs MongoDB.

## Option 2: Run Locally with MongoDB

To run the full application on your local machine:

### 1. Install MongoDB
- **Mac**: `brew install mongodb-community`
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Linux**: Follow instructions at https://docs.mongodb.com/manual/administration/install-on-linux/

### 2. Start MongoDB
```bash
# Mac/Linux
mongod --dbpath ~/data/db

# Windows
mongod --dbpath C:\data\db
```

### 3. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Backend
```bash
npm run dev
```

### 6. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### 7. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Option 3: Use MongoDB Atlas (Cloud Database)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env` file
5. Run steps 3-7 from Option 2

## Test Accounts

After seeding, use these credentials:

**Admin**
- Email: admin@example.com
- Password: password123

**Client**
- Email: client@example.com
- Password: password123

**Freelancers**
- bodyguard@example.com / password123
- anchor@example.com / password123
- model@example.com / password123
- dancer@example.com / password123
- actor@example.com / password123