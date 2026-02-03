import React from 'react';

const QuotePost = ({ postLink, content, avatarLink }) => {
  return (
    <a href={postLink || "#"} className="card quote-card">
      <div className="quote-icon">"</div>
      <div className="quote-content">
        <p>{content}</p>
        <div className="user-info">
          <img src={avatarLink} alt="User" className="avatar" />
        </div>
      </div>
    </a>
  );
};

export default QuotePost;
