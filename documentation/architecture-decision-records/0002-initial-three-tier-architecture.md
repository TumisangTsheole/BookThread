# ADR 2: Initial Three-Tier System Architecture

## Status
**Accepted**

## Context
We need to establish the foundational structural pattern for the system. As this is the first iteration of the architecture, the goal is to balance simplicity, ease of development, and clear separation of concerns. We need to define how the user interacts with the system and where data is persisted.

## Decision
We will adopt a **Three-Tier Architecture** pattern. This will be represented in our technical diagrams using a Top-Down (TD) flow:
1.  **Presentation Tier (User):** Represented as a circular Actor node.
2.  **Logic Tier (Web Application):** A standard rectangular component that handles business logic and UI.
3.  **Data Tier (Database):** A cylindrical storage node for persistence.

The implementation will follow this Mermaid structure:
`User((User)) --> App[Web Application] --> DB[(Database)]`

## Consequences
* **Pros:**
    * **Simplicity:** High legibility for stakeholders and new developers.
    * **Separation of Concerns:** Clearly distinguishes between the interface, the logic, and the data.
    * **Scalability:** Allows us to eventually split the "Web Application" into a Frontend and Backend (API) without breaking the fundamental conceptual model.
* **Cons:**
    * **Abstraction:** At this level, specific communication protocols (like REST, GraphQL, or SQL) are hidden.
    * **Monolithic Risk:** By grouping "Web Application" as one box, we must be careful not to let the internal logic become too tangled before we zoom in to Level 2 (Container) diagrams.

## Notes
This architecture will be updated/refined as soon as specific technology choices (e.g., React, Node.js, PostgreSQL) are finalized.
