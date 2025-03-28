## Project Description

**TaskFlow** is a task management application designed to organize and simplify project workflows. It enables users to create boards that serve as containers for tasks, allowing them to break down work into manageable steps. Each task is enriched with essential details such as name, description, status, priority, and due date, ensuring clear tracking and efficient project management.

## Features

- **User Authentication**: Users can sign up, log in, and log out.
- **Board Management**: Users can create, delete, and view boards.
- **Task Management**: Users can add tasks to boards, update their details (name, status, description, priority, due date), delete tasks, and access deleted tasks from the history.
- **Task History**: Deleted tasks are stored in the history for easy access later.
- **Task Details**: Each task includes the name, description, status, priority, and due date.

## Technologies Used

- **Frontend**: React, Tailwind
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Middleware**: Custom middleware for token authentication and ownership verification

## Prerequisites

- Node.js
- MongoDB (local or cloud)
- Set up your environment variables for the backend in a .env file. You'll need the following: PORT, MONGO_URI,ACCESS_SECRET_KEY (JWT)


## Getting Started

To get TaskFlow up and running follow these simple steps:

## Installation

1. Clone the repo

   ```bash
   https://github.com/JoannaA21/taskflow.git

   ```

2. Backend Setup

- Navigate to the backend directory: cd backend
- npm install
- npm start

3. Frontend Setup

- Navigate to the frontend directory: cd frontend
- npm install
- npm run dev
