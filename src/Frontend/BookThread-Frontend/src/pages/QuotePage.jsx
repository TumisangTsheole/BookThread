import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuotePage = () => {
    const [threadData, setThreadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder for your backend URL
    const API_URL = 'http://localhost:5164/api/Threads/1'; // TODO: Change this to use a prop to dynamically get specific thread | Create an .env for this endpoint

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const response = await axios.get(API_URL);
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
                            <img src={`https://i.pravatar.cc/150?img=${index + 1}`} alt={comment.user?.username}></img>
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="user-name">{comment.user?.username}</span>
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

            <div className="comment-input-area animate-in" style={{ animationDelay: '0.9s' }}>
                <div className="input-avatar">
                     {/* MISSING: Authenticated user's pic not in API */}
                     <img src="https://i.pravatar.cc/150?img=41" alt="My Avatar"></img>
                </div>
                <input type="text" placeholder="Add a comment..."></input>
                <button className="post-btn">Post</button>
            </div>
        </div>
    );
};

export default QuotePage;



/*import React from 'react';


const QuotePage = () => {
	return (
		<div className="main-content-quotepage" style={{ paddingBottom: '5rem'}}>
		<h1 className="quote-author-quotepage">Quote</h1><br></br>
		<div className="quote-card-quotepage animate-in" style={{ animationDelay: '0.4s' }}>
		    <div className="quote-content-quotepage">
		        <span className="quote-mark-quotepage">"</span>
		        <p className="quote-text-quotepage">It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>
		        <p className="quote-author-quotepage">Jane Austen</p>
		    </div>
		    <div className="quote-avatar-quotepage">
		        <img src="https://i.pravatar.cc/150?img=5" alt="User Avatar"></img>
		    </div>
		</div>

		<div className="thread-stats animate-in" style={{ animationDelay: '0.5s' }}>
		    <span><i className="fas fa-heart"></i> 124 Likes</span>
		    <span><i className="far fa-comment"></i> 37 Comments</span>
		</div>

		<div className="comments-list">
		    <div className="comment-card animate-in" style={{ animationDelay: '0.6s' }}>
		        <div className="comment-avatar">
		            <img src="https://i.pravatar.cc/150?img=1" alt="Commenter 1"></img>
		        </div>
		        <div className="comment-content">
		            <div className="comment-header">
		                <span className="user-name">Shade lady out hine</span>
		                <span className="time-stamp">5m ago</span>
		            </div>
		            <p className="comment-text">gololly ochtued is academic thriller?</p>
		        </div>
		        <div className="comment-actions">
		            <i className="far fa-heart like-btn"></i>
		        </div>
		    </div>

		    <div className="comment-card animate-in" style={{ animationDelay: '0.7s' }}>
		        <div className="comment-avatar">
		            <img src="https://i.pravatar.cc/150?img=9" alt="Commenter 2"></img>
		        </div>
		        <div className="comment-content">
		            <div className="comment-header">
		                <span className="user-name">User123</span>
		                <span className="time-stamp">5m ago</span>
		            </div>
		            <p className="comment-text">Such a classNameic opener truly sets the tone.</p>
		        </div>
		        <div className="comment-actions">
		            <i className="fas fa-heart like-btn"></i>
		        </div>
		    </div>

		    <div className="comment-card animate-in" style={{ animationDelay: '0.8s' }}>
		        <div className="comment-avatar">
		            <img src="https://i.pravatar.cc/150?img=32" alt="Commenter 3"></img>
		        </div>
		        <div className="comment-content">
		            <div className="comment-header">
		                <span className="user-name">Discussion Bot</span>
		                <span className="time-stamp">1h ago</span>
		            </div>
		            <p className="comment-text">Is this the best opening line in history?</p>
		        </div>
		        <div className="comment-actions">
		            <i className="far fa-heart like-btn"></i>
		        </div>
		    </div>
		</div>

		<div className="comment-input-area animate-in" style={{ animationDelay: '0.9s' }}>
		    <div className="input-avatar">
		         <img src="https://i.pravatar.cc/150?img=41" alt="My Avatar"></img>
		    </div>
		    <input type="text" placeholder="Add a comment..."></input>
		    <button className="post-btn">Post</button>
		</div>

	</div>		

	);
};


export default QuotePage;
*/













