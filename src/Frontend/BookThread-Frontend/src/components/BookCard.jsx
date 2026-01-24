import React from "react";

const BookCard = ({ book }) => (
  <div className="book-card">
    <h3>{book.title}</h3>
    <p>{book.author} ({book.publicationYear})</p>
    <small>ISBN: {book.isbn}</small>
  </div>
);

export default BookCard;
