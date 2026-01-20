# ADR 006: Data Modeling and API Contract Strategy

## Status
Accepted

## Context
Following the selection of the tech stack (ASP.NET 9 / PostgreSQL), we need to define the implementation details for data storage and transmission. Specifically, we must ensure data integrity in our central book repository and maintain a secure boundary between our database and the React frontend.

## Decision
We have decided on the following implementation strategies:

1.  **Normalized Database Schema:** We will use a relational PostgreSQL schema. To maintain a "Central Repository," the `Books` table will be indexed by **ISBN-13**. User-specific data (reading status) will be stored in a join table (`UserBooks`) to avoid data redundancy.
2.  **DTO (Data Transfer Object) Strategy:** We will strictly prohibit returning Database Entities directly from API controllers. Every endpoint will return a DTO. This ensures security (preventing password/ID exposure) and allows the API to evolve without breaking the React frontend.
3.  **Service-Layer Orchestration:** Business logic (e.g., character limits, feed sorting) will reside in a "Logic Layer" using C# Services. Controllers will remain "Thin," only handling HTTP routing and handing data to the Services.
4.  **RESTful API Design:** We will follow standard REST conventions for our endpoints (GET for fetching, POST for creating, PUT for updates) to ensure the backend is predictable for both the Web and future Mobile clients.

## Consequences

### Positive
* **Security:** Sensitive database fields are never serialized into JSON or sent over the network.
* **Integrity:** The ISBN-centric schema prevents the "Duplicate Book" problem, ensuring all user interactions link to a single source of truth for metadata.
* **Flexibility:** We can change our database structure (e.g., adding columns) as long as we map them back to the same DTOs, preventing frontend crashes.

### Negative / Risks
* **Boilerplate:** This approach requires creating more classes (Entities + DTOs + Mappers), which takes more time upfront than a "Rapid Prototyping" approach.
* **Mapping Overhead:** Every new field added to the database must also be added to the DTO and the mapping logic.
