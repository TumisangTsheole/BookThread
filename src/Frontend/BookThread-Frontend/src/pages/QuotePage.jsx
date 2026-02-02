/*
Data Gap Analysis

List of information your JSX expects that your current backend response does not provide:

    User Profile Images: The user object (both for the thread creator and the commenters) contains username, email, and bio, but no profilePictureUrl or avatar field.

    Like Counts: Your JSX shows 124 Likes, but the JSON response doesn't have a likesCount or a list of likes for the thread.

    Comment Likes: Your individual comment cards have a heart icon, but the API doesn't provide a like count for specific comments.

    Relative Timestamps: Your API provides a raw ISO string (createdAt). To get "5m ago" as seen in your original JSX, you will need a library like date-fns or dayjs to calculate the difference from the current time.

    Thread Stats (Total Comments): While I used data.comments.length in the code above, if you eventually paginate your comments, the API should ideally return a totalCommentsCount integer so you don't have to count the array manually.


*/


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
                    {/* Content from API: "This chapter blew my mind!" */}
                    <p className="quote-text-quotepage">{threadData.content}</p>
                    {/* Content from API: "Harry Potter and the Prisoner of Azkaban" */}
                    <p className="quote-author-quotepage">{threadData.book?.title}</p>
                </div>
                <div className="quote-avatar-quotepage">
                    {/* MISSING: No profile pic in API */}
                    <img src="https://i.pravatar.cc/150?img=5" alt={threadData.user?.username}></img>
                </div>
            </div>

            <div className="thread-stats animate-in" style={{ animationDelay: '0.5s' }}>
                {/* MISSING: Like counts not in API response */}
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
                            {/* MISSING: No commenter profile pic in API */}
                            <img src={   comment.user?.avatarLink     } alt={comment.user?.username}></img>
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="user-name">{comment.user?.username == MOCK_USER.username ? "YOU" : comment.user?.username}</span>
                                <span className="time-stamp">
                                    {/* Formatting ISO string to local date */}
                                    {new Date(comment.createdAt || threadData.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                        </div>
                        <div className="comment-actions">
                            <i className="far fa-heart like-btn"></i>
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

