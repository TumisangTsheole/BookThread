import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import your sub-components
import ProgressPost from '../components/ProgressPost';
import QuotePost from '../components/QuotePost';
import ReviewPost from '../components/ReviewPost';
import ThoughtPost from '../components/ThoughtPost';

import MOCK_USER from '../mockData/LoggedInUser.js';

const QuotePage = () => {
    const [threadData, setThreadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    const { id } = useParams();
    const API_URL = `http://localhost:5164/api`; 

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const response = await axios.get(`${API_URL}/Threads/${id}`);
                setThreadData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching thread:", err);
                setError(err);
                setLoading(false);
            }
        };
        fetchThread();
    }, [id]);

    // --- THE SWITCH RENDERER ---
    const renderThreadHero = () => {
        const type = threadData.threadType; // 0=Quote, 1=Progress, 2=Review, 3=Thought
        
        // common URL for links if needed, or just '#' since we are already on the page
        const currentLink = "#"; 

        switch (type) {
            case 0:
                return (
                    <QuotePost 
                        postLink={currentLink}
                        content={threadData.content}
                        avatarLink={threadData.user?.avatarLink || "https://i.pravatar.cc/150"}
                    />
                );
            case 1:
                return (
                    <ProgressPost 
                        postLink={currentLink}
                        bookImageLink={threadData.book?.imageUrl}
                        bookName={threadData.book?.title}
                        progressPercentage={threadData.progressPercentage || 0}
                    />
                );
            case 2:
                return (
                    <ReviewPost 
                        postLink={currentLink}
                        reviewText={threadData.content}
                    />
                );
            case 3:
                return (
                    <ThoughtPost 
                        postLink={currentLink}
                        content={threadData.content}
                        imageLink={threadData.user?.avatarLink}
                        profileName={threadData.user?.username}
                    />
                );
            default:
                return <p>Unknown Thread Type</p>;
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        const newComment = {
            id: crypto.randomUUID(), // Better than zeros for local UI state
            content: commentText,
            userId: MOCK_USER.id,
            threadId: id,
            createdAt: new Date().toISOString(),
            user: { username: MOCK_USER.username, avatarLink: `https://api.dicebear.com/7.x/adventurer/svg?seed=${MOCK_USER.id}` }
        };
    
        try {
            await axios.post(`${API_URL}/Threads/comment`, newComment);
            setThreadData(prev => ({
                ...prev,
                comments: [...(prev.comments || []), newComment]
            }));
            setCommentText("");
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    if (loading) return <div className="main-content-quotepage">Loading...</div>;
    if (error) return <div className="main-content-quotepage">Error loading content.</div>;
    if (!threadData) return null;

    return (
        <div className="main-content-quotepage" style={{ paddingBottom: '5rem' }}>
            <h1 className="quote-author-quotepage">Discussion</h1><br />

            <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                {renderThreadHero()}
            </div>

            <div className="thread-stats animate-in" style={{ animationDelay: '0.5s' }}>
                <span><i className="fas fa-heart"></i> {threadData.likesCount || 0} Likes</span>
                <span><i className="far fa-comment"></i> {threadData.comments?.length || 0} Comments</span>
            </div>

            <div className="comments-list">
                {threadData.comments?.map((comment, index) => (
                    <div key={comment.id} className="comment-card animate-in" style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}>
                        <div className="comment-avatar">
                            <img src={comment.user?.avatarLink || "https://i.pravatar.cc/150"} alt={comment.user?.username} />
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="user-name">{comment.user?.username === MOCK_USER.username ? "YOU" : comment.user?.username}</span>
                                <span className="time-stamp">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handlePostComment} className="comment-input-area animate-in" style={{ animationDelay: '0.9s' }}>
                <div className="input-avatar">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${MOCK_USER.id}`} alt="My Avatar" />
                </div>
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                />
                <button type="submit" className="post-btn">Post</button>
            </form>
        </div>
    );
};

export default QuotePage;



/*
Data Gap Analysis

List of information your JSX expects that your current backend response does not provide:

    User Profile Images: The user object (both for the thread creator and the commenters) contains username, email, and bio, but no profilePictureUrl or avatar field.

    Like Counts: Your JSX shows 124 Likes, but the JSON response doesn't have a likesCount or a list of likes for the thread.

    Comment Likes: Your individual comment cards have a heart icon, but the API doesn't provide a like count for specific comments.

    Relative Timestamps: Your API provides a raw ISO string (createdAt). To get "5m ago" as seen in your original JSX, you will need a library like date-fns or dayjs to calculate the difference from the current time.

    Thread Stats (Total Comments): While I used data.comments.length in the code above, if you eventually paginate your comments, the API should ideally return a totalCommentsCount integer so you don't have to count the array manually.




import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

/// TEMPORARY/MOCK USER |REMOVE AFTER AUTHENTICATION IMPLEMENTATION|
import MOCK_USER from '../mockData/LoggedInUser.js';

const QuotePage = () => {
    const [threadData, setThreadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState("");

    const { id } = useParams();

    // Placeholder for your backend URL Create an .env for this endpoint

    const API_URL = `http://localhost:5164/api`; 
    useEffect(() => {
        const fetchThread = async () => {
            try {
                const response = await axios.get(`${API_URL}/Threads/${id}`);
                setThreadData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching thread:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchThread();
    }, []);

    if (loading) return <div className="main-content-quotepage">Loading discussion...</div>;
    if (error) return <div className="main-content-quotepage">Error loading content. Please try again later.</div>;
    if (!threadData) return null;




    // Post Comment Request
    const handlePostComment = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
    
        const newComment = {
            id: "00000000-0000-0000-0000-000000000000", 
            content: commentText,
            userId: "2b34f5e6-eafa-4849-b6a6-3ead51e04267",
            threadId: 1 
        };
    
        try {
            const commentResponse = await axios.post('http://localhost:5164/api/Threads/comment', newComment);
            console.log("Success!", commentResponse.data);

			// Update the comment section with the new comment
			setThreadData(prevData => {
			    // 1. Safety check: If prevData is null, just return it
			    if (!prevData) return prevData;
			
			    // 2. Return a new object that looks exactly like the old one...
			    return {
			        ...prevData, 
			        // 3. ...but overwrite the 'comments' property
			        comments: [
			            ...(prevData.comments || []), // Take all existing comments (or empty array if none)
			            newComment                    // Add your brand new comment at the end
			        ]
			    };
			});
            
            setCommentText(""); // Clear the input
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    

    return (
        <div className="main-content-quotepage" style={{ paddingBottom: '5rem' }}>
            <h1 className="quote-author-quotepage">Quote</h1><br />


            <div className="quote-card-quotepage animate-in" style={{ animationDelay: '0.4s' }}>
                <div className="quote-content-quotepage">
                    <span className="quote-mark-quotepage">"</span>
                    <p className="quote-text-quotepage">{threadData.content}</p>
                    <p className="quote-author-quotepage">{threadData.book?.title}</p>
                </div>
                <div className="quote-avatar-quotepage">
                    <img src="https://i.pravatar.cc/150?img=5" alt={threadData.user?.username}></img>
                </div>
            </div>

            <div className="thread-stats animate-in" style={{ animationDelay: '0.5s' }}>
                <span><i className="fas fa-heart"></i> 124 Likes</span>
                <span><i className="far fa-comment"></i> {threadData.comments?.length || 0} Comments</span>
            </div>

            <div className="comments-list">
                {threadData.comments?.map((comment, index) => (
                    <div 
                        key={comment.id} 
                        className="comment-card animate-in" 
                        style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}
                    >
                        <div className="comment-avatar">
                            <img src={   comment.user?.avatarLink     } alt={comment.user?.username}></img>
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="user-name">{comment.user?.username == MOCK_USER.username ? "YOU" : comment.user?.username}</span>
                                <span className="time-stamp">
                                    {new Date(comment.createdAt || threadData.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                        </div>
                        <div className="comment-actions">
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handlePostComment} className="comment-input-area animate-in" style={{ animationDelay: '0.9s' }}>
                    <div className="input-avatar">
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${MOCK_USER.id}`} alt="My Avatar" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />
                    <button type="submit" className="post-btn">Post</button>
                </form>
        </div>
    );
};

export default QuotePage;

*/















