import React from 'react';

const BookInfo = () => {
	return (
		<>		
	       <h2 className="widget-title animate-in" style={{animationDelay: '0.6s'}}>The Book Info</h2>
	            <div className="book-info-card animate-in" style={{animationDelay: '0.7s'}}>
	                <div className="book-details-flex">
	                    <img src="https://covers.openlibrary.org/b/id/10524397-M.jpg" alt="Dune Cover" className="book-cover-md"></img>
	                    <div className="book-text-details">
	                        <h4>Pride and Prejudice</h4>
	                        <p>Pride follows the turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy.</p>
	                        <p style={{marginTop: '0.5rem', fontWeight: '600', color: 'var(--accent-brown)'}}>Jane Austen</p>
	                    </div>
	                </div>

	                <hr></hr><br></br>

	                <a href="#" className="view-details-link">View Book Details</a>
	                <button className="follow-btn">Get Book</button>
	            </div>

	            <br></br>
	
	            <h2 className="widget-title animate-in" style={{animationDelay: '0.8s'}}>Related Threads</h2>
	            <ul className="related-list animate-in" style={{animationDelay: '0.9s'}}>
	                <li>
	                    <h5>Discussion: Best opening lines?</h5>
	                    <p>Related: Emma</p>
	                </li>
	                <li>
	                    <h5>Character Analysis: Mr. Darcy</h5>
	                    <p>Related: Pride and Prejudice</p>
	                </li>
	            </ul>
	     </>
	);
};

export default BookInfo;
