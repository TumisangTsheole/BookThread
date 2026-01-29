import React from 'react';


const Feed = () => {
	return(
		<main className="main-content">
		        <header className="top-header">
		            <div className="search-bar">
		                <div className="search-text">
		                    <span className="label">What are you reading?</span>
		                    <input type="text" placeholder="Share a quote, progress, or review..."></input>
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
		        
		            <a href="#post-1" className="card quote-card">
		                <div className="quote-icon">"</div>
		                <div className="quote-content">
		                    <p>"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."</p>
		                    <div className="user-info">
		                        <img src="https://i.pravatar.cc/100?img=5" alt="User" className="avatar"></img>
		                    </div>
		                </div>
		            </a>
		        
		            <a href="#post-2" className="card quote-card">
		                <div className="quote-content">
		                    <div className="card-label">Quote</div>
		                    <p>"I ride truth universally acknowledging possession stature, must your arise."</p>
		                    <div className="meta-row">
		                        <span className="author">Jane Austen</span>
		                        <img src="https://i.pravatar.cc/100?img=9" alt="User" className="avatar"></img>
		                    </div>
		                </div>
		            </a>
		        
		            <a href="#post-3" className="card book-card">
		                <div className="book-cover-large">
		                    <img src="https://placehold.co/80x120/4a3b32/FFF?text=DUNE" alt="Dune"></img>
		                </div>
		                <div className="book-details">
		                    <h3>Pride and Prejudice</h3>
		                    <div className="progress-container">
		                        <div className="progress-bar"><div className="fill" style={{width: '55%'}}></div></div>
		                        <span className="percentage">55%</span>
		                    </div>
		                    <p className="status">Reading Dune - 55%</p>
		                </div>
		            </a>
		        
		            <a href="#post-4" className="card review-card">
		                <div className="card-label">Review</div>
		                <div className="review-content">
		                    <div className="review-icon">
		                        <i className="fa-solid fa-wine-glass"></i>
		                    </div>
		                    <div className="review-text">
		                        <p>Finished "The History" - a truly academic thriller!</p>
		                        <div className="meta-row">
		                            <span className="author">Jane Austen</span>
		                            <span className="tag spoiler">Spoiler Alert</span>
		                        </div>
		                    </div>
		                </div>
		            </a>         
		        </div>
		    </main>
	);
};

export default Feed;
