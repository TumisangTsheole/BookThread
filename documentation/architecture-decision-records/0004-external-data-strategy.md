# ADR 004: External Book Metadata Integration Strategy

## Status
Proposed

## Context
A core requirement of the application involves users interacting with specific books. To ensure data integrity and prevent the fragmentation of our "Central Repository of Books," we cannot rely solely on manual user input. Manual entry leads to duplicate records for the same book (e.g., "The Hobbit" vs. "Hobbit, The") due to variations in spelling, edition, or formatting. 

We need a strategy to uniquely identify books and fetch high-quality metadata (titles, authors, cover images) from a reliable external source.

## Decision
We will implement an **External Metadata Service** pattern using the following components:

1.  **Primary Identifier (ISBN-13):** We will use the International Standard Book Number (ISBN) as the unique key for all books in our database. This ensures that regardless of how a user searches, every entry for a specific edition maps to a single record.
2.  **Primary Data Source:** We will integrate with the **Google Books API** as our initial external provider due to its comprehensive index and high availability.
3.  **Search-and-Select Workflow:** The user interface will require users to search for a book via the API before adding it. Users will select from verified results, ensuring the data saved to our system is accurate from the start.
4.  **Local Metadata Caching (Persistence):** Once a book is selected, its metadata (Title, Author, ISBN, Thumbnail URL) will be persisted in our PostgreSQL database. This avoids redundant external API calls, reduces latency, and ensures our system remains functional if the external service is temporarily unavailable.

## Consequences

### Positive
* **Data Consistency:** Using ISBNs prevents duplicate entries and ensures all users interacting with the same book are linked to the same database entity.
* **Rich User Experience:** Users get high-quality cover art and verified bibliographic details without having to type them manually.
* **Performance:** By storing (caching) the metadata locally after the first fetch, we minimize network overhead and stay within external API rate limits.

### Negative / Risks
* **Dependency on External Service:** If the Google Books API is down or changes its terms, we may need to implement a fallback provider (e.g., Open Library).
* **Data Staleness:** If a book's metadata is updated externally, our local copy may become outdated. (Mitigated by the fact that book metadata like ISBN and Author rarely change after publication).
