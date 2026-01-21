# ADR 003: Selection of Tech Stack for MVP

## Status
Accepted

## Context
We need to select a primary technology stack for the Minimum Viable Product (MVP). The requirements specify that while the app will initially be a web-based tool, it must be architected to allow for a native mobile application in the future. Additionally, as a solo developer/small team, we need a balance between high performance, quick initial load times, and a manageable learning curve.

## Decision
We have decided to use a **Decoupled Three-Tier Architecture** consisting of:
1.  **Frontend:** React (built with Vite).
2.  **Backend:** ASP.NET Core 9.0 (Web API).
3.  **Database:** PostgreSQL.

### 1. Why ASP.NET Core 9.0?
* **Separation of Concerns:** By building a Web API, the "brain" of the app is independent of the "face." A future mobile app can use the same API without changes to the backend logic.
* **Performance:** .NET 9.0 is highly optimized for performance and low memory usage, which is critical for hosting on smaller, cost-effective servers during the MVP phase.
* **Type Safety:** C# provides robust type-safety, which reduces "runtime" bugs that are common in loosely typed languages.

### 2. Why React (with Vite)?
* **Load Speed:** Unlike Blazor WebAssembly, React does not require downloading a heavy runtime. This ensures the fast "First Contentful Paint" required for user retention.
* **Ecosystem:** React has the largest library of pre-built UI components, which accelerates development.
* **Future Path:** Knowledge gained building the React web app translates directly to **React Native** if we choose that path for the mobile app later.

### 3. Why PostgreSQL?
* It is a robust, open-source relational database that handles the structured data (Users, Books, Relationships) needed for our core features like "Trending" stats.

## Consequences

### Positive
* **Parallel Development:** We can develop and test the API using tools like Swagger/OpenAPI even before the Frontend is finished.
* **Scalability:** Each tier can be scaled or updated independently.
* **Hosting Flexibility:** Since both .NET 9 and React are cross-platform, we can host them on cheap Linux-based cloud servers (e.g., DigitalOcean, AWS, or Azure).

### Negative / Risks
* **Context Switching:** The developer must switch between C# and JavaScript/TypeScript.
* **Overhead:** Managing two separate projects (Frontend/Backend) is slightly more complex than a monolithic framework like ASP.NET MVC.

---
## Navigation
* [<< ADR 002: Folder Structure](./0002-folder-structure.md)
* [View Level 2: Container Diagram >>](../diagrams/l2-containers.md)