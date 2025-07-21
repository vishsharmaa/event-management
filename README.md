# MERN Event Management

## Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the following content:
   ```env
   MONGO_URI=mongodb://localhost:27017/eventdb
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

## Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend app:
   ```sh
   npm start
   ```

## Usage
- Register a new user or login.
- Create, view, edit, and delete events.
- All events are visible to everyone, but only the creator can edit or delete their events.

---

**Ensure MongoDB is running locally on your machine.** 