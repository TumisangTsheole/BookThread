import React, { useEffect, useState } from "react";
import { getAllBooks } from "../api/books";
import BookCard from "../components/BookCard";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getAllBooks().then(setBooks);
  }, []);

  return (
    <div>
      <h2>Books</h2>
      {books.map(b => <BookCard key={b.isbn} book={b} />)}
    </div>
  );
};

export default Books;
