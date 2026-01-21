erDiagram
    USERS ||--o{ THREADS : posts
    USERS ||--o{ USER_BOOKS : tracks
    USERS ||--o{ FOLLOWS : "follower/following"
    BOOKS ||--o{ THREADS : tagged_in
    BOOKS ||--o{ USER_BOOKS : listed_in
    THREADS ||--o{ THREADS : replies

    USERS {
        uuid id PK
        string username
        string email
        string password_hash
        string bio
        string profile_image_url
    }

    BOOKS {
        string isbn PK
        string title
        string author
        string cover_url
        int publish_year
        float average_rating
    }

    THREADS {
        int id PK
        uuid user_id FK
        string isbn_tag FK
        string content
        string type "Quote, Review, Progress, Thought"
        int progress_percentage
        bool is_spoiler
        int parent_thread_id FK
        datetime created_at
    }

    USER_BOOKS {
        uuid user_id PK, FK
        string isbn PK, FK
        string status "WantToRead, Reading, Finished"
        datetime updated_at
    }

    FOLLOWS {
        uuid follower_id PK, FK
        uuid followed_id PK, FK
    }