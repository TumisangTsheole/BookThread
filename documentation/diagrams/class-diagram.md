classDiagram
    class IBooksService {
        <<interface>>
        +SearchBooks(query: string) List~BookDto~
        +GetBookByIsbn(isbn: string) BookDto
        +UpdateBookStats(isbn: string)
    }

    class IThreadsService {
        <<interface>>
        +CreateThread(dto: CreateThreadDto) ThreadDto
        +GetHomeFeed(userId: uuid, page: int) List~ThreadDto~
        +GetBookThreads(isbn: string) List~ThreadDto~
    }

    class IUsersService {
        <<interface>>
        +GetProfile(userId: uuid) UserProfileDto
        +FollowUser(followerId: uuid, followedId: uuid)
        +UpdateReadingStatus(userId: uuid, isbn: string, status: string)
    }

    class BooksService {
        -AppDbContext _context
        -IGoogleBooksClient _externalClient
    }

    class ThreadsService {
        -AppDbContext _context
    }

    BooksService ..|> IBooksService
    ThreadsService ..|> IThreadsService