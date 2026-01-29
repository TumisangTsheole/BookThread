import React, { useState } from 'react';
import ReadingStreak from '../components/ReadingStreak.jsx';
import BookInfo from '../components/BookInfo.jsx';



/**
 * Helper Component: ProgressBook
 * Manages individual loading states for book thumbnails.
 */
const ProgressBook = ({ src, alt, progress }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="book-progress-card">
            <div className="book-cover-container" style={{ position: 'relative', minWidth: '40px' }}>

                {/* 1. The Loading Placeholder */}
                {!loaded && (
                    <div className="skeleton-thumb">
                        <span className="skeleton-text">...</span>
                    </div>
                )}
                
                {/* 2. The Actual Image */}
                <img 
                    src={src} 
                    alt={alt} 
                    className={`book-cover-sm ${loaded ? 'fade-in' : 'is-hidden'}`}
                    onLoad={() => setLoaded(true)}
                />
            </div>

            <div className="progress-bar-rightsidebar">
                <div className="progress-fill" style={{ '--target-width': progress }}></div>
            </div>
            <span className="progress-text">{progress}</span>
        </div>
    );
};

/**
 * Main Component: RightSideBar
 */
const RightSideBar = ({ view }) => {
    return (
        <div className="sidebar-right">
            <h2 className="widget-title animate-in" style={{ animationDelay: '0.3s' }}>
                Your Reading Hub
            </h2>
            <h3 className="widget-subtitle animate-in" style={{ animationDelay: '0.4s' }}>
                Currently Reading
            </h3>
        
            <div className="reading-hub-grid animate-in" style={{ animationDelay: '0.5s' }}>
                <ProgressBook 
                    src="https://covers.openlibrary.org/b/id/10524397-M.jpg" 
                    alt="Dune" 
                    progress="23%" 
                />
                <ProgressBook 
                    src="https://covers.openlibrary.org/b/id/12607948-M.jpg" 
                    alt="The Great Gatsby" 
                    progress="45%" 
                />
                <ProgressBook 
                    src="https://covers.openlibrary.org/b/id/12547185-M.jpg" 
                    alt="1984" 
                    progress="89%" 
                />
            </div>

            {/* Conditional Content based on route */}
            
                {view === "feed" && <ReadingStreak />}
                {view === "quote" && <BookInfo />}
            
        </div>
    );
};

export default RightSideBar;
