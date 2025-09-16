BlogSpace

A personal blogging platform where users can create, edit, and share their thoughts with the world.
Features include user authentication, post management, pagination, comments, likes, bookmarks, and responsive design.

✨ Features

📝 Rich text editor for creating blog content

🔑 User authentication (Register, Login, Protected Routes with JWT)

➕ Create, Read, Update, and Delete blog posts

❤️ Like & Bookmark posts

💬 Comment on posts

👤 Profile page showing all user information and their posts

📚 Pagination on home page (6 posts per page)

📱 Responsive design (mobile & desktop)

🤖 AI integration – used chatbot during development (later to be integrated in-app for suggestions)

🛠 Technologies Used

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT

Other: REST API

🚀 Installation
1. Clone the repository
git clone <your-repo-url>

2. Backend Setup
cd backend
npm install
cp .env.example .env   # configure your MongoDB URI, JWT secret, etc.
npm run dev            # starts backend server

3. Frontend Setup
cd frontend
npm install
npm start

4. Access the App

Open browser: http://localhost:3000

📌 Usage

Register or login to access protected features.

Create, edit, delete blog posts using the editor.

Like, bookmark, and comment on blogs.

View paginated posts (6 per page).

Manage your profile (edit, delete, view info).

AI chatbot was used during development for faster feature implementation (planned for in-app integration for content suggestions).

📡 API Reference (Examples)

GET /api/blogs – list all posts (with pagination)

POST /api/blogs – create a new post

PUT /api/blogs/:id – update post

DELETE /api/blogs/:id – delete post

POST /api/auth/register – register user

POST /api/auth/login – login user

📂 Project Structure
/backend     # Express.js REST API
/frontend    # React.js web app
/docs        # Screenshots, API docs

📸 Screenshots

Homepage

Create Post

Edit Post

Login/Register

Profile Page

Comments, Likes, Bookmarks (not attached due to limit)

🤖 AI Usage

Used ChatGPT and AI tools for:

Debugging authentication flow

Optimizing pagination logic

Designing API routes & data models

Preparing README & documentation

Plan to integrate Chatbot in the app later for AI-based content suggestions for blogs.

✅ Submission Checklist

 GitHub repo with frontend + backend code

 README with setup instructions, AI usage, and documentation

 REST API backend

 Working web interface (React frontend)

 Screenshots of app usage

 Bonus features (Pagination, Comments, Likes, Bookmarks, Profile Page)

📜 License

MIT License