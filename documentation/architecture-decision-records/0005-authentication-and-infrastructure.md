# ADR 005: Authentication and Infrastructure Strategy

## Status
Accepted

## Context
As a decoupled system (React Frontend + ASP.NET API) with a planned mobile expansion, we need a secure way to identify users across different platforms. Furthermore, as we enter the development phase, we need a standardized way to handle errors and monitor system health (Logging) without duplicating code across every feature.

## Decision
We will implement the following infrastructural components:

1.  **Identity: JWT (JSON Web Tokens):** We will use JWT for authentication. The API will issue a signed token upon login, which the client will store and send in the Authorization header for subsequent requests. This is stateless and perfectly compatible with both Web and Native Mobile apps.
2.  **Security: ASP.NET Core Identity:** We will leverage the built-in .NET Identity system for password hashing and user management to avoid "rolling our own" security.
3.  **Global Exception Handling:** We will implement a custom Middleware to catch all unhandled exceptions. This ensures the API always returns a consistent JSON error object to the frontend rather than a raw stack trace.
4.  **Logging:** We will use the built-in .NET ILogger interface within our Logic Layer and Middleware to track critical events (e.g., failed logins, external API timeouts).

## Consequences

### Positive
* **Scalability:** JWTs allow the API to remain stateless, making it easier to scale across multiple server instances in the future.
* **Security:** Using industry-standard libraries (ASP.NET Identity) reduces the risk of common vulnerabilities like poor password storage.
* **Maintainability:** Global error handling means we don't have to write try-catch blocks in every single Controller action.

### Negative / Risks
* **Token Management:** The frontend (React) must be carefully designed to store tokens securely (e.g., in memory or Secure Cookies) to prevent XSS attacks.
* **Complexity:** Setting up the Initial Identity configuration in .NET 9 requires some upfront boilerplate code.
