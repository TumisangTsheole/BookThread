# ADR 1: Use Mermaid.js for Architecture Documentation

## Status
**Accepted**

## Context
We are beginning the architecture process for the system and need a visual way to document and communicate our design choices (e.g., C4 Model, Flowcharts, Sequence Diagrams). 

We evaluated three primary options:
1. **Manual Drawing Tools (Lucidchart/Excalidraw):** Easy to use but difficult to version control and keep in sync with changing code.
2. **Structurizr:** Powerful for deep C4 modeling, but has a steeper learning curve and requires specialized DSL knowledge.
3. **Mermaid.js:** A "Diagram as Code" tool that renders text-based syntax into visuals.

## Decision
We will use **Mermaid.js** for all high-level and component architecture diagrams. 

We chose this because:
* **Native Integration:** It renders automatically in GitHub, GitLab, and Notion without extra plugins.
* **Low Friction:** The syntax is simple (e.g., `[Box] --> [(Database)]`) and easy for a first-time architect to learn.
* **Version Control:** Since diagrams are stored as text, we can track changes using Git and review diagram updates in Pull Requests alongside code changes.
* **Speed:** It allows for quick iterations and "rough drafts" without worrying about pixel-perfect alignment.

## Consequences
* **Pros:** * Documentation stays in the same repository as the code.
    * Any developer on the team can update a diagram by editing a simple text file.
    * No external software licenses or proprietary file formats are required.
* **Cons:** * Extremely complex diagrams with hundreds of nodes can become difficult to manage in text format.
    * Unlike Structurizr, we do not have a "centralized model," so if we rename a component, we must manually update it across all individual Mermaid files.

## Notes
Diagrams should be embedded directly in the project `README.md` or dedicated markdown files in a `/docs` folder.
