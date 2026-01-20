# Level 2: Container Diagram

## 📌 Overview
This diagram "zooms in" on the System Boundary established in Level 1. It identifies the high-level technical containers, their specific technology stacks, and how they communicate to manage the central repository of book data and user interactions.

```mermaid
graph TD
    User((User))

    subgraph System_Boundary [Application Boundary]
        Frontend[React SPA\n'The Interface']
        Backend[ASP.NET Core 9 API\n'The Brain']
    end

    DB[(PostgreSQL\n'The Memory')]
    ExternalAPI(Google Books API\n'External Metadata')

    %% Interactions
    User -->|Uses Browser| Frontend
    Frontend -->|JSON/HTTPS Requests| Backend
    
    %% Book Strategy Logic
    Backend -->|1. Search/Fetch Metadata| ExternalAPI
    ExternalAPI -.->|2. Return ISBN & Details| Backend
    Backend -->|3. Persist to Central Repo| DB
    
    %% Styling
    style User fill:#f9f,stroke:#333
    style Frontend fill:#61dbfb,color:#000,stroke:#333
    style Backend fill:#512bd4,color:#fff,stroke:#333
    style DB fill:#336791,color:#fff,stroke:#333
    style ExternalAPI fill:#df4b37,color:#fff,stroke:#333
```

## 🏗 Container Responsibility Matrix

| Container | Technology | Responsibility |
|-----------|-----------|----------------|
| **Frontend (React)** | React + Vite | Renders the UI, handles routing, and captures user search queries for books. |
| **Backend (API)** | ASP.NET Core 9 | Orchestrates business logic. It acts as the gatekeeper between the Frontend, the Database, and the External Book API. |
| **Database** | PostgreSQL | Our Central Repository. Stores cached book metadata indexed by ISBN, user accounts, and activity logs. |
| **External API** | Google Books API | Provides the verified "Source of Truth" for book details (ISBN, Authors, Cover Art). |

## 🔗 Communication Protocols

* **User ↔ Frontend**: HTTPS (Browser)
* **Frontend ↔ Backend**: RESTful JSON over HTTPS
* **Backend ↔ Database**: SQL / Entity Framework Core
* **Backend ↔ External API**: REST/HTTPS (Server-to-Server)