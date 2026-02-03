import React, { useEffect, useState } from 'react';
import QuotePost from '../components/QuotePost.jsx';
import QuotePost2 from '../components/QuotePost2.jsx';
import ProgressPost from '../components/ProgressPost.jsx';
import ReviewPost from '../components/ReviewPost.jsx';
//import getAllThreads from '../api/threads.js';
import axios from 'axios';

// TODO: Backend must send `progressPercentage` for ProgressPost
// TODO: Backend must send `imageLink` for QuotePost and QuotePost2

const typeMap = {
  0: "QuotePost",
  1: "ProgressPost",
  2: "ReviewPost",
  3: "QuotePost2"
};

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await axios.get('http://localhost:5164/api/threads'); // adjust endpoint
        const response = res.data;
        
        const normalized = response.map(post => {
          switch (post.threadType) {
            case 0: // QuotePost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `#post-${post.id}`,
                
                content: post.content,
                imageLink: "https://i.pravatar.cc/100?img=5" // TODO: replace with backend field
              };
            case 1: // ProgressPost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `#post-${post.id}`,
                bookImageLink: post.book?.thumbnail,
                bookName: post.book?.title,
                progressPercentage: 42 // TODO: replace with backend field
              };
            case 2: // ReviewPost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `#post-${post.id}`,
                reviewText: post.content
              };
            case 3: // QuotePost2
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `#post-${post.id}`,
                content: post.content,
                imageLink: "https://i.pravatar.cc/100?img=9", // TODO: replace with backend field
                profileName: post.user?.username
              };
            default:
              return post;
          }
        });

        setPosts(normalized);
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    fetchThreads();
  }, []);

  const renderPost = (post) => {
    switch (post.type) {
      case "QuotePost":
        return (
          <QuotePost
            key={post.id}
            postLink={post.postLink}
            content={post.content}
            avatarLink={post.imageLink}
          />
        );
      case "QuotePost2":
        return (
          <QuotePost2
            key={post.id}
            postLink={post.postLink}
            content={post.content}
            imageLink={post.imageLink}
            profileName={post.profileName}
          />
        );
      case "ProgressPost":
        return (
          <ProgressPost
            key={post.id}
            postLink={post.postLink}
            bookImageLink={post.bookImageLink}
            bookName={post.bookName}
            progressPercentage={post.progressPercentage}
          />
        );
      case "ReviewPost":
        return (
          <ReviewPost
            key={post.id}
            postLink={post.postLink}
            reviewText={post.reviewText}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      <header className="top-header">
        <div className="search-bar">
          <div className="search-text">
            <span className="label">What are you reading?</span>
            <input type="text" placeholder="Share a quote, progress, or review..." />
          </div>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </header>

      <div className="feed-container">
        <h2 className="section-title">Home Feed</h2>

        <div className="tabs">
          <button className="tab active">Latest</button>
          <button className="tab">Popular</button>
          <button className="tab">Following</button>
        </div>

        {posts.map(renderPost)}
      </div>
    </main>
  );
};

export default Feed;

/* -------------------------------
   ORIGINAL VERSION (for fallback)
----------------------------------

import React from 'react';
import QuotePost from '../components/QuotePost.jsx';
import QuotePost2 from '../components/QuotePost2.jsx';
import ProgressPost from '../components/ProgressPost.jsx';
import ReviewPost from '../components/ReviewPost.jsx';

const response = [
  {
    id: 1,
    type: "QuotePost",
    postLink: "#post-1",
    content: "It is a truth universally acknowledged...",
    imageLink: "https://i.pravatar.cc/100?img=5"
  },
  {
    id: 2,
    type: "QuotePost2",
    postLink: "#post-2",
    content: "All we have to decide...",
    imageLink: "https://i.pravatar.cc/100?img=9",
    profileName: "J.R.R. Tolkien"
  },
  {
    id: 3,
    type: "ProgressPost",
    postLink: "#post-3",
    bookImageLink: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    bookName: "Pride and Prejudice",
    progressPercentage: 55
  },
  {
    id: 4,
    type: "ReviewPost",
    postLink: "#post-4",
    reviewText: 'Finished "Dune"...'
  }
];

const Feed = () => {
  const posts = response;

  const renderPost = (post) => {
    switch (post.type) {
      case "QuotePost":
        return (
          <QuotePost
            key={post.id}
            postLink={post.postLink}
            content={post.content}
            imageLink={post.imageLink}
          />
        );
      case "QuotePost2":
        return (
          <QuotePost2
            key={post.id}
            postLink={post.postLink}
            content={post.content}
            imageLink={post.imageLink}
            profileName={post.profileName}
          />
        );
      case "ProgressPost":
        return (
          <ProgressPost
            key={post.id}
            postLink={post.postLink}
            bookImageLink={post.bookImageLink}
            bookName={post.bookName}
            progressPercentage={post.progressPercentage}
          />
        );
      case "ReviewPost":
        return (
          <ReviewPost
            key={post.id}
            postLink={post.postLink}
            reviewText={post.reviewText}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      <header className="top-header">
        <div className="search-bar">
          <div className="search-text">
            <span className="label">What are you reading?</span>
            <input type="text" placeholder="Share a quote, progress, or review..." />
          </div>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </header>

      <div className="feed-container">
        <h2 className="section-title">Home Feed</h2>

        <div className="tabs">
          <button className="tab active">Latest</button>
          <button className="tab">Popular</button>
          <button className="tab">Following</button>
        </div>

        {posts.map(renderPost)}
      </div>
    </main>
  );
};

export default Feed;
*/
