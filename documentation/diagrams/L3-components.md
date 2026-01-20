# Level 3: Component Diagram (Full API Interior)

## 📌 Overview
This diagram provides the complete view of the ASP.NET Core 9 API. It shows the "Feature" services (Threads, Books, Users), the "Infrastructure" (Auth, Logging), and the "Data/Integration" layers (Database, Google Books API) working together.

```mermaid
graph TD
    subgraph API_Container [ASP.NET Core 9 API]
        
        subgraph Infrastructure [Infrastructure & Security]
            Auth[Identity & JWT Service]
            Logger[Logging & Exception Middleware]
        end

        subgraph Presentation_Layer [Presentation Layer / Controllers]
            TC[Threads Controller]
            BC[Books Controller]
            UC[Users Controller]
        end

        subgraph Logic_Layer [Logic Layer / Services]
            TS[Threads Service]
            BS[Books Service]
            US[Users Service]
        end

        subgraph Data_Layer [Data Layer / Persistence]
            DB_Context[AppDbContext]
            Database[(PostgreSQL)]
        end

        subgraph Integration_Layer [Integration Layer]
            GBC[External Book Client]
        end
    end

    %% Infrastructure wrapping
    Logger -.->|Monitors| Presentation_Layer
    Auth -.->|Validates Tokens| Presentation_Layer

    %% Flow: Presentation to Logic
    TC --> TS
    BC --> BS
    UC --> US

    %% Cross-Service Logic
    US -->|Queries Metadata| BS

    %% Logic to Data & Integration
    TS --> DB_Context
    BS --> DB_Context
    BS --> GBC
    US --> DB_Context
    
    %% Final Persistence
    DB_Context --> Database
```

# 🏗 Component Responsibilities (Updated)

| Component | Responsibility |
|-----------|----------------|
| **Identity & JWT Service** | Handles password hashing, user registration, and generating secure tokens for the React/Mobile frontend. |
| **Logging Middleware** | Automatically captures every request/error and logs it for debugging. |
| **Threads Service** | Business logic for social interactions (Posts, Replies, Feeds). |
| **Books Service** | Orchestrates book data—checks the Database first, then calls the External Client. |
| **Users Service** | Manages profiles, follower relationships, and reading statistics. |
| **AppDbContext** | The central gateway for all SQL operations via Entity Framework Core 9. |
| **External Book Client** | Handles the actual HTTPS communication with the Google Books API. |