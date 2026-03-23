# BookThread

A social reading platform where users can share quotes, post reading progress, share reviews, and discuss books with other readers. Built with React and TypeScript on the frontend, backed by an ASP.NET Core API.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Features](#features)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Demo Mode](#demo-mode)
- [Dark Mode](#dark-mode)
- [Known Limitations](#known-limitations)

---

## Overview

BookThread is a single-page application (SPA) with no client-side routing. Navigation between views is handled entirely through React state. The app connects to a local ASP.NET Core backend, and falls back to pre-loaded dummy data when the backend is unreachable.

THIS PROJECT IS STILL IN EARLY ACTIVE DEVELOPEMENT. Please refer to the following documentation for more information...
---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 with TypeScript |
| Styling | Tailwind CSS with custom design tokens |
| HTTP Client | Axios |
| Icons | Lucide React |
| AI Recommendations | Google Gemini via @google/genai |
| Book Search | OpenLibrary API |
| Avatars | DiceBear Adventurer |
| Backend | ASP.NET Core (separate project) |

---

## Project Structure

The entire frontend is currently a single file, `App.tsx`, which contains all components, types, interfaces, and application logic. The file is organised in the following order:

```
App.tsx
  Types and Interfaces
  Configuration constants
  Dummy fallback data
  Helper functions (isDemoToken, getAuthHeaders)
  UI Components
    DarkModeToggle
    PoofEffect
    BookwormCartoon
    HintPopup
    DemoWarningModal
  AuthScreen
  Core UI Components
    Button
    PostCard
  CreatePostModal
  ThreadDetails
  Right Sidebar Widgets
    ReadingChallenge
    CurrentlyReading
    Recommendations
  ProfilePage (and its sub-components)
  App (root component)
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- The BookThread ASP.NET Core backend running on `http://localhost:{PORT}`

### Installation

```bash
npm install
npm run dev
```

### Backend CORS Configuration

The backend must allow requests from the frontend's origin. In your ASP.NET `Program.cs`, add the following before `builder.Build()`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // adjust to frontend port
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
```

And after `var app = builder.Build()`, before `app.UseAuthorization()`:

```csharp
app.UseCors("AllowFrontend");
```

The order matters. `UseCors` must come before `UseAuthorization`, otherwise the server returns a 401 before CORS headers are attached and the browser blocks the request entirely.

---

## Configuration

All configuration lives at the top of `App.tsx`:

```ts
const BACKEND_API_URL = process.meta.env.VITE_BACKEND_URL;
const DEMO_CREDENTIALS = { username: 'guest_reader', password: 'password123' };
```

Change `VITE_BACKEND_URL` from you .env if your backend runs on a different port or host.

### Tailwind Design Tokens

The app uses a custom set of Tailwind colour tokens defined in `tailwind.config.js`. These are referenced throughout all components:

| Token | Usage |
|---|---|
| `book-dark` | Primary dark brown, text, buttons |
| `book-accent` | Accent brown, links, highlights |
| `book-card` | Card backgrounds |
| `book-border` | Borders and dividers |
| `book-main` | Main content background |
| `book-sidebar` | Sidebar background |
| `book-muted` | Secondary/muted text |

---

## Features

### Thread Types

Users can create four types of threads:

- **Quote** — a passage or quote from a book
- **Progress** — a reading progress update with a percentage
- **Review** — a written review of a finished book
- **Thought** — a general thought or discussion prompt

### Book Search

When creating a thread, the user searches for a book via the OpenLibrary search API. On selection, the app fetches edition data to retrieve an ISBN, then checks whether that book already exists in the backend database before posting the thread. If the book does not exist, it is created automatically before the thread is submitted.
Communication with this API only implemented client-side for the time being to allow for the DEMO of the application without a dependence on dedicated backend services.

The following book fields are sent to the backend if available from OpenLibrary:

`isbn`, `title`, `subtitle`, `publisher`, `publishedDate`, `description`, `pageCount`, `language`, `previewLink`, `thumbnail`

### Thread Feed

The main feed displays all threads from the backend, sorted by creation date. Clicking a thread opens the discussion view where users can read comments and post their own.

### Profile Page

The profile page has three tabs:

- **Threads** — all threads posted by the logged-in user
- **Shelf** — books organised into Currently Reading, Read, and Want to Read
- **Stats** — reading metrics, yearly challenge progress, reading streak, and achievements

### AI Book Recommendations

The right sidebar includes an AI Book Buddy powered by Google Gemini. Clicking the button generates two personalised book recommendations based on a Modern Classics prompt. Requires a valid `API_KEY` environment variable set to a Gemini API key.

---

## API Reference

The frontend communicates with the following backend endpoints:

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/Health` | Backend status check on the login screen |

### Auth

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/Auth/login` | `{ usernameOrEmail, password }` |
| POST | `/api/Auth/register` | `{ username, email, password }` |

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/Books/{isbn}` | Check if a book exists |
| POST | `/api/Books` | Create a new book record |

### Threads

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/Threads` | Fetch all threads |
| GET | `/api/Threads/{id}` | Fetch a single thread with comments |
| POST | `/api/Threads` | Create a new thread |
| POST | `/api/Threads/comment` | Post a comment on a thread |

### UserBooks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/UserBooks` | Fetch the user's book shelf |

---

## Authentication

On login, the backend is expected to return the following shape:

```json
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "username": "string",
    "avatarLink": "string"
  }
}
```

The token is stored in `localStorage` under the key `bookthread_token` and the user object under `bookthread_user`. On every subsequent API request the token is passed as a `Bearer` token in the `Authorization` header. The header is attached directly to each individual request rather than via `axios.defaults`, which avoids a race condition where requests fire before the default header is set.

On logout, both values are removed from `localStorage` and the user is returned to the login screen.

---

## Demo Mode

Demo mode is available from the login screen using the following credentials:

```
Username: guest_reader
Password: password123
```

Entering these credentials shows a warning modal before proceeding. In demo mode:

- All API calls to the backend are skipped entirely
- The feed is populated with pre-loaded dummy threads
- Comments posted locally are added to state but not saved
- The token is set to the literal string `demo-jwt-token`, which is checked at every API call site via the `isDemoToken()` helper to prevent any real requests from being made

---

## Dark Mode

Dark mode is toggled via the moon/sun button in the left sidebar and on the login screen. The preference is saved to `localStorage` under the key `theme`.

Internally, toggling dark mode adds or removes the `dark` class on `document.documentElement` (the `<html>` tag). Tailwind's `darkMode: 'class'` configuration means all `dark:` prefixed utility classes across every component activate when that class is present on the root element.

```ts
if (isDarkMode) document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');
```

---

## Known Limitations

- The `Followers` and `Following` counts on the profile page are hardcoded to zero. The current API spec does not expose a followers endpoint or property.
- The reading streak is hardcoded to 14 days. Streak tracking would require a dedicated backend endpoint.
- The yearly reading goal is hardcoded to 20 books. This should eventually be user-configurable.
- The `Explore`, `My Library`, and `Notifications` tabs in the sidebar are present in the navigation but have no view implemented yet.

---

## Security Concerns

These are known security issues that need to be addressed before the project is considered production-ready. The project is still in active development.

**API responses expose full entity models instead of DTOs**

The backend currently returns raw entity objects directly from the database, including sensitive fields such as `passwordHash` on user objects. This is a significant security concern. The backend should return Data Transfer Objects (DTOs) that expose only the fields the client needs, stripping out any sensitive or internal properties before sending the response. This applies to all endpoints but is most critical on anything that returns user data.
This project would not be fit for deployment without this implementation. This shall be the initial main focus on the next phase of development.
---

## Pending Implementation

The following areas are present in the UI but have not yet been functionally implemented. They are noted here to avoid confusion during development.

**Right sidebar**

The right sidebar currently displays entirely static, hardcoded content. This includes the Currently Reading widget, the Reading Challenge progress bar, the Reading Streak counter, and the AI Book Buddy recommendations section (which requires a valid Gemini API key to function). None of these are connected to real user data from the backend yet.

**Search and filtering**

The search bar on the feed page and the Latest, Popular, and Following filter tabs are rendered but non-functional. No search or filter requests are made to the backend. This is to be implemented in a future iteration.

**Spoiler toggle**

When a thread is marked as a spoiler, its content is permanently blurred with no way for the reader to unblur it. A toggle interaction needs to be added so users can choose to reveal spoiler content at their own discretion.

**Comment dates**

Comments returned from the backend are displaying invalid or incorrectly formatted dates. This is likely caused by a mismatch between the date format the backend returns and what `new Date().toLocaleDateString()` expects. The date parsing logic in the comment rendering needs to be reviewed and corrected.

**Comment input re-rendering**

Every character typed into the comment input box triggers a re-render of the thread. This is an issue caused by state being structured in a way that couples the input value to the parent component. The comment input state should be isolated so that typing does not cause the comment list to re-render on each keystroke.

**Lack of Book References in some Thread tyoes**

There are Thread type/s that do not show the book being referenced.
