import React from 'react';

const ReviewPost = ({ postLink, reviewText }) => {
  return (
    <a href={postLink != null ? postLink : "#" } className="card review-card">
      <div className="card-label">Review</div>
      <div className="review-content">
        <div className="review-icon">
          <i className="fa-solid fa-wine-glass"></i>
        </div>
        <div className="review-text">
          <p>{reviewText}</p>
          <div className="meta-row">
            <span className="author">Jane Austen</span>
            <span className="tag spoiler">Spoiler Alert</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ReviewPost;
