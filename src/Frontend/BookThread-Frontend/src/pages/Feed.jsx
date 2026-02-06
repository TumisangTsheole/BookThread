import React, { useEffect, useState } from 'react';
import QuotePost from '../components/QuotePost.jsx';
import ThoughtPost from '../components/ThoughtPost.jsx';
import ProgressPost from '../components/ProgressPost.jsx';
import ReviewPost from '../components/ReviewPost.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx'
//import getAllThreads from '../api/threads.js';
import axios from 'axios';

// TODO: Backend must send `progressPercentage` for ProgressPost
// TODO: Backend must send `imageLink` for QuotePost and QuotePost2

const BACKEND_API_URL = `http://localhost:5164/api`;

const typeMap = {
  0: "QuotePost",
  1: "ProgressPost",
  2: "ReviewPost",
  3: "ThoughtPost"
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Create Post Modal Funtionss
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
	
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/threads`); // adjust endpoint
        const response = res.data;
        
        const normalized = response.map(post => {
          switch (post.threadType) {
            case 0: // QuotePost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `/post/${post.id}`,
                
                content: post.content,
                imageLink: "https://i.pravatar.cc/100?img=5" // TODO: replace with backend field
              };
            case 1: // ProgressPost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `/post/${post.id}`,
                bookImageLink: post.book?.thumbnail,
                bookName: post.book?.title,
                progressPercentage: 42 // TODO: replace with backend field
              };
            case 2: // ReviewPost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `/post/${post.id}`,
                reviewText: post.content
              };
            case 3: // ThoughtPost
              return {
                ...post,
                type: typeMap[post.threadType],
                postLink: `/post/${post.id}`,
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
      case "ThoughtPost":
        return (
          <ThoughtPost
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
    	  <div className="tab-group_FeedPage">
    	    <button className="tab active">Latest</button>
    	    <button className="tab">Popular</button>
    	    <button className="tab">Following</button>
    	  </div>
    	
    	  <button onClick={openModal} className="add-post-btn_FeedPage">
    	    <span className="btn-text_FeedPage">Add Post</span>
    	    <span className="btn-icon_FeedPage">+</span>
    	  </button>
    	</div>
    	
        {posts.map(renderPost)}

		<CreatePostModal isOpen={isModalOpen} onClose={closeModal}/>
        
      </div>
    </main>
  );
};

export default Feed;
