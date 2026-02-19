# BlogHub - Frontend
[![Screenshot](https://pomodo.s3.eu-north-1.amazonaws.com/Screenshot+2025-04-08+122357.png)]([https://your-link.com](https://blog-hub-frontend-phi.vercel.app/))

The BlogHub frontend is developed using React.js with functional components and hooks. It provides a clean UI for user registration, login, and blog management. Authenticated users can create, view, edit, and delete their own posts seamlessly with real-time state updates.

 https://youtu.be/eZ2xl4y49Dg
## Project Structure
```
project-root/
└── frontend/
    └── bloghub-frontend/
        └── src/
            ├── api/
            │   └── axiosConfig.ts
            │   └── authAPI.ts
            │   └── blogAPI.ts
            │
            ├── components/
            │   ├── Navbar.tsx
            │   ├── BlogCard.tsx
            │   ├── ProtectedRoute.tsx
            │   └── ... (reusable components)
            │
            ├── context/
            │   └── AuthContext.tsx
            │
            ├── HOC/
            │   └── withAuth.tsx
            │
            ├── interfaces/
            │   ├── user.interface.ts
            │   ├── blog.interface.ts
            │   └── auth.interface.ts
            │
            ├── pages/
            │   ├── Home.tsx
            │   ├── Login.tsx
            │   ├── Register.tsx
            │   ├── CreateBlog.tsx
            │   ├── EditBlog.tsx
            │   ├── BlogDetails.tsx
            │   └── Profile.tsx
            │
            ├── redux/
            │   ├── slices/
            │   │   ├── authSlice.ts
            │   │   └── blogSlice.ts
            │   └── rootReducer.ts
            │
            ├── routes/
            │   └── AppRoutes.tsx
            │
            ├── store/
            │   └── store.ts
            │
            ├── utils/
            │   ├── tokenHandler.ts
            │   ├── formatDate.ts
            │   └── toastConfig.ts
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
   https://github.com/Theakashprasad/BlogHub_frontend.git
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

