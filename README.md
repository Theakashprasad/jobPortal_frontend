# JOB portal - Frontend
[![Screenshot](https://pomodo.s3.eu-north-1.amazonaws.com/Screenshot+2025-04-08+122357.png)]([https://your-link.com](https://blog-hub-frontend-phi.vercel.app/))

The JobPortal frontend is developed using Next.js with functional components and hooks. It offers a clean and responsive UI for user interactions. Authenticated users can add, view, edit, and delete job postings seamlessly, with real-time state updates ensuring smooth user experience.

 https://youtu.be/eZ2xl4y49Dg
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

```
## Features

- User registration and authentication
  - Login
  - Registration
  - Blog Management 
- CRUD operations for blog 
  - Listing blog posts
  - Inline delete & edit options
  - PopUp action for creating new posts
- Responsive UI

## Technologies Used

- context, Zustand
- Axios for API requests
- React Router for navigation
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- React.js


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
   npm start
   ```

