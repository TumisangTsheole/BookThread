# API Documentation

| Category | Endpoint | Method | Description | Auth Required |
|----------|----------|--------|-------------|---------------|
| **Auth** | `/api/auth/register` | POST | Create new account | No |
| **Auth** | `/api/auth/login` | POST | Returns JWT Token | No |
| **Books** | `/api/books/search?q={query}` | GET | Search external/internal repo | Yes |
| **Books** | `/api/books/{isbn}` | GET | Get book details & local stats | Yes |
| **Threads** | `/api/threads` | POST | Create a new post (Quote, Review, etc.) | Yes |
| **Threads** | `/api/threads/feed` | GET | Get personalized home feed | Yes |
| **Threads** | `/api/threads/book/{isbn}` | GET | Get all threads for a specific book | Yes |
| **Users** | `/api/users/{username}` | GET | Get profile, stats, and bookshelf | Yes |
| **Users** | `/api/users/follow` | POST | Follow/Unfollow a user | Yes |
| **Users** | `/api/users/status` | PUT | Update "Currently Reading" / "Finished" | Yes |