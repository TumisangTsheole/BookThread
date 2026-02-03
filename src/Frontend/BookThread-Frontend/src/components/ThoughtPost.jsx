import React from 'react';

const ThoughtPost = ({ postLink, content, imageLink, profileName }) => {
  return (
    <a href={postLink || "#"} className="card quote-card">
      <div className="quote-content">
        <div className="card-label">Quote</div>
        <p>{content}</p>
        <div className="meta-row">
          <span className="author">{profileName}</span>
          <img src={imageLink} alt="User" className="avatar" />
        </div>
      </div>
    </a>
  );
};

export default ThoughtPost;
