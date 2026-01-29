import React from 'react';

const ProgressPost = ({ postLink, bookImageLink, bookName, progressPercentage }) => {
  return (
    <a href={postLink} className="card book-card">
      <div className="book-cover-large">
        <img src={bookImageLink} alt={bookName} />
      </div>
      <div className="book-details">
        <h3>{bookName}</h3>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className="percentage">{progressPercentage}%</span>
        </div>
        <p className="status">Reading {bookName} - {progressPercentage}%</p>
      </div>
    </a>
  );
};

export default ProgressPost;
