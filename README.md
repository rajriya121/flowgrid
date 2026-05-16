FlowGrid - Enterprise Work Management

Live Application:
https://taskly-ten-jet.vercel.app/

GitHub Repository:
https://github.com/Blade-op/Taskly

Project Overview:

FlowGrid is a full-stack enterprise work management web application that allows users to orchestrate projects, align teams, assign tasks, and track progress efficiently.

The application follows a role-based system where users can collaborate within teams using an invite-based workflow.

----------------------------------------

Features:

1. Authentication
- User Signup and Login
- Role-based access (Admin / Member)

2. Dashboard
- Overview of tasks and activities
- Light/Dark mode support
- User profile and notifications

3. Project Management
- Create, update, and manage projects
- Project status: Active / On Hold / Completed

4. Team Management
- Invite users to join a team
- Invite-based system (users are not auto-added)
- Accept invitation flow
- Role assignment (Admin / Member)

5. Task Management
- Create, edit, and delete tasks
- Assign tasks to team members
- Kanban board system:
  - To Do
  - In Progress
  - Done

6. UI/UX
- Modern SaaS-style design
- Responsive layout
- Smooth interactions

----------------------------------------

Tech Stack:

Frontend:
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Node.js
- Express.js

Database:
- MongoDB (Atlas)

Deployment:
- Frontend: Vercel
- Backend: Render

----------------------------------------

How to Run Locally:

1. Clone the repository:
   git clone https://github.com/Blade-op/Taskly

2. Install dependencies:
   npm install

3. Start the frontend:
   npm run dev

4. Setup backend environment variables (.env):
   MONGO_URI=your_mongodb_connection_string

5. Run backend server:
   npm start

----------------------------------------

Notes:

- Team members are added only through an invite system.
- Users must accept an invite to become active members.
- The system simulates real-world team collaboration.

----------------------------------------

Author:

Riya Raj
B.Tech, K.R.Mangalam University

----------------------------------------
