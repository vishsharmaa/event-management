# Eventify - MERN Event Management System

## Project Overview
Eventify is a full-stack event management web application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to discover, register for, and manage events, while providing special admin controls for event and user management.

## Features

### User Features
- View all events
- Search for events
- Register (book) for events
- View and unregister from registered events
- Submit feedback via the "Get in Touch" form (visible only to admin)

### Admin Features
- Create, edit, and delete any event
- View all users
- View all feedbacks submitted by users
- Access all user features

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Authentication:** JWT 

## Usage

- **Register or log in as a user** to view, search, and register for events.
- **To access admin features:**
  - Log in or sign up with the username `admin` (case-insensitive).
  - Only admin can create, edit, or delete events, and view all users and feedbacks.
- **Feedbacks:**
  - Any logged-in user can submit feedback via the "Get in Touch" form.
  - Admin can view all feedbacks on the "Feedbacks" page.
- **Search Bar:**
  - Use the search bar in the navbar to find events by title or description. It always shows the latest events.

## Project Structure
- `backend/` - Node.js/Express API, MongoDB models, authentication, admin/user logic
- `frontend/` - React app, pages, components, Tailwind CSS styling