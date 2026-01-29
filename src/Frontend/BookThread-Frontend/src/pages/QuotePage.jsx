import React from 'react';

/*
quote-card
animate-in
quote-content
quote-mark
quote-text
quote-author
quote-avatar
thread-stats
animate-in
fas fa-heart
far fa-comment
comments-list
comment-card
comment-avatar
comment-content
comment-header
user-name
time-stamp
comment-text
comment-actions
far fa-heart like-btn
comment-input-area 
input-avatar
post-btn
*/

const QuotePage = () => {
	return (
		<div className="main-content-quotepage" style={{ paddingBottom: '5rem'}}>
		<h1 className="quote-author">Quote</h1><br></br>
		<div className="quote-card animate-in" style={{ animationDelay: '0.4s' }}>
		    <div className="quote-content">
		        <span className="quote-mark">"</span>
		        <p className="quote-text">It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>
		        <p className="quote-author">Jane Austen</p>
		    </div>
		    <div className="quote-avatar">
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
