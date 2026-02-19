# JOB portal - Frontend

<img width="599" height="370" alt="image" src="https://github.com/user-attachments/assets/359482b6-dce3-4015-a6d9-2bc565136bce" />

The JobPortal frontend is developed using Next.js with functional components and hooks. It offers a clean and responsive UI for user interactions. Authenticated users can add, view, edit, and delete job postings seamlessly, with real-time state updates ensuring smooth user experience.

## Project Structure
```
project-root/
└── frontend/
    └── jobPortal-frontend/
        └── ├── app/
            │   └── (auth)
            │   └── jobs
            │
            ├── components/
            │   ├── Dashboard.tsx
            │   ├── job.tsx
            │   ├── ProtectedRoute.tsx
            │   └── ... (reusable components)
            │
            ├── lib/
            │   └── tokenHandler.ts
            │
            ├── services/
            │   └── auth.service
            │   └── job.service
            │
            ├── types/
            │   └── auth.tsx
            │   └── job.tsx
            │
            ├── middleware/
            │   
            │
            └── main.tsx / index.tsx
## Features

- User registration and authentication
  - Signup
  - Login
  - Account setup (company details)
- Job Management (CRUD)
  - Listing jobs in dashboard
  - View, edit, delete jobs
  - Create new job via form
- Responsive UI
  - Dashboard with sidebar and navbar
  - Toast notifications for actions
  - Delete confirmation modals
  - Job status & days remaining

## Technologies Used

- Next.js (App Router) + React (functional components & hooks)
- TypeScript
- Tailwind CSS for styling
- Axios for API requests
- Sonner for notifications
- Lucide React for icons
- Cookie-based auth with middleware

## Getting Started

### Prerequisites

- Next


### Installation

1. Clone the repository
   ```sh
    https://github.com/Theakashprasad/jobPortal_frontend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3.  **Environment Variables**:

        Ensure that the environment variables are correctly set in a `.env` file, in the location .env.example is located. Here is an example of the required environment variables:

        ```
        VITE_BACKEND_URL = http://localhost:3000
        

    ```
4. Start the server
   ```sh
   npm run dev
   ```

