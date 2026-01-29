import React from 'react';


const ReadingStreak = () => {
	return (
		<div className="widget streak-widget">
            <h3>Currently Reading</h3>
            <div className="stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
            </div>
            <p>Finished "The Secret History" - a truly academic thriller!</p>
            
            <div className="streak-count">
                <i className="fa-solid fa-fire"></i>
                <div className="count-text">
                    <span className="number">42</span>
                    <span className="label">Day Reading Streak</span>
                    <span className="author">- John Green</span>
                </div>
            </div>
		 </div>
	);
};

export default ReadingStreak;
