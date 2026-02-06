import React, { useState, useEffect } from "react";
import axios from "axios";
import MOCK_USER from "../mockData/LoggedInUser.js";

const CreatePostModal = ({ isOpen, onClose }) => {
    const [content, setContent] = useState("");
    const [threadType, setThreadType] = useState(0);
    const [isSpoiler, setIsSpoiler] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [userProgress, setUserProgress] = useState(0);

    // Loading States
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const res = await axios.get(
                        `https://openlibrary.org/search.json?q=${searchQuery}`,
                    );
                    const validBooks = res.data.docs
                        .filter((book) => book.key && book.key.length > 0)
                        .slice(0, 5);
                    setSearchResults(validBooks);
                    console.log(validBooks);
                } catch (err) {
                    console.error("Search error", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 600);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleSelectBook = async (book) => {
        try {
            // 1. Fetch the specific editions for this "Work"
            // This specific Open Library endpoint gives us the actual physical books
            const response = await axios.get(
                `https://openlibrary.org${book.key}/editions.json`,
            );

            // 2. Find the first edition that has an ISBN
            const editionWithIsbn = response.data.entries.find(
                (e) => e.isbn_13?.length > 0 || e.isbn_10?.length > 0,
            );

            if (!editionWithIsbn) {
                alert(
                    "This specific version doesn't have an ISBN. Please try another result.",
                );
                return;
            }

            const isbn =
                editionWithIsbn.isbn_13?.[0] || editionWithIsbn.isbn_10?.[0];

            setSelectedBook({
                isbn: isbn,
                title: book.title,
                author: book.author_name?.[0] || "Unknown",
                cover: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
            });

            setSearchQuery("");
            setSearchResults([]);
        } catch (err) {
            console.error("Error fetching edition details:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBook) return;

        setIsSubmitting(true);
        try {
            let bookExists = false;
            let userBookExists = false;
            try {
                await axios.get(
                    `http://localhost:5164/api/Books/${selectedBook.isbn}`,
                );
                bookExists = true; // If this succeeds, the book is already there
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    bookExists = false; // Book not found, need to create it
                } else {
                    throw err; // Some other error happened (network, 500, etc.)
                }
            }

            try {
                await axios.get(
                    `http://localhost:5164/api/UserBooks/${MOCK_USER.id}/${selectedBook.isbn}/`,
                );
                userBookExists = true;
            } catch (err) {
                if (err.response && err.response.status == 404)
                    userBookExists = false;
                else throw err;
            }

            console.log(`Does the book exist? :${bookExists}`);
            console.log(`Book ISBN :${selectedBook.isbn}`);
            // Only POST the book if it doesn't exist
            if (!bookExists) {
                await axios.post("http://localhost:5164/api/Books", {
                    isbn: selectedBook.isbn,
                    title: selectedBook.title,
                    author: selectedBook.author,
                });
            }

            // Add that the User has/is read/reading a book (UserBooks)
            if (!userBookExists) {
                await axios.post("http://localhost:5164/api/UserBooks", {
                    UserId: MOCK_USER.id,
                    BookISBN: selectedBook.isbn,
                    Status: "Reading",
                    Progress: 0,
                });
            }

            // Create Thread
            const payload = {
                Content: content,
                ThreadType: threadType,
                IsSpoiler: isSpoiler,
                UserId: MOCK_USER.id,
                BookISBN: selectedBook.isbn,
            };

            // const payload = {
            //  	Content: "This is another thread",
            //     ThreadType: 3,
            //     IsSpoiler: isSpoiler,
            //     UserId: "2b34f5e6-eafa-4849-b6a6-3ead51e04267",
            //     BookISBN: "9780062457714"
            // }

            async function SendPostRequest(payload) {
                await axios.post("http://localhost:5164/api/Threads", payload);
            }
            SendPostRequest(payload);

            // Cleanup
            setContent("");
            setSelectedBook(null);
            onClose();
        } catch (err) {
            console.error("Submission error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay_FeedPage" onClick={onClose}>
            <div
                className="modal-card_FeedPage"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="modal-title_FeedPage">Create New Thread</h2>

                <form onSubmit={handleSubmit}>
                    <div className="type-selector_FeedPage">
                        {["Quote", "Progress", "Review", "Thought"].map(
                            (label, idx) => (
                                <button
                                    key={label}
                                    type="button"
                                    className={`type-pill_FeedPage ${threadType === idx ? "active" : ""}`}
                                    onClick={() => setThreadType(idx)}
                                >
                                    {label}
                                </button>
                            ),
                        )}
                    </div>

                    <div className="search-container_FeedPage">
                        <div className="input-wrapper_FeedPage">
                            <input
                                className="modal-input_FeedPage"
                                placeholder="Search book title or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {isSearching && (
                                <div className="loader-small_FeedPage"></div>
                            )}
                        </div>

                        {searchResults.length > 0 && (
                            <div className="search-dropdown_FeedPage">
                                {searchResults.map((book) => (
                                    <div
                                        key={book.key}
                                        className="search-item_FeedPage"
                                        onClick={() => handleSelectBook(book)}
                                    >
                                        <span className="search-title">
                                            {book.title}
                                        </span>
                                        <span className="search-author">
                                            {" "}
                                            by {book.author_name?.[0]}
                                        </span>
                                        <span className="search-author">
                                            by {book.author_name?.[0]} (
                                            {book.first_publish_year})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedBook && (
                        <div className="selected-book-preview_FeedPage animate-in">
                            <img src={selectedBook.cover} alt="cover" />

                            <div className="book-info_FeedPage">
                                <h4>{selectedBook.title}</h4>
                                <p>{selectedBook.author}</p>
                                <div className="progress-indicator_FeedPage">
                                    Progress: {userProgress}%
                                </div>
                            </div>
                        </div>
                    )}

                    <textarea
                        className="modal-textarea_FeedPage"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="modal-footer_FeedPage">
                        <label className="spoiler-checkbox_FeedPage">
                            <input
                                type="checkbox"
                                checked={isSpoiler}
                                onChange={(e) => setIsSpoiler(e.target.checked)}
                            />
                            <span className="custom-box"></span>
                            Spoiler?
                        </label>

                        <div className="button-group_FeedPage">
                            <button
                                type="button"
                                className="cancel-btn_FeedPage"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="post-btn_FeedPage"
                                disabled={isSubmitting || !selectedBook}
                            >
                                {isSubmitting ? (
                                    <div className="loader-button_FeedPage"></div>
                                ) : (
                                    "Publish Thread"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
