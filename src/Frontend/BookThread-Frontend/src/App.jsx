import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import LeftSideBar from './pages/LeftSideBar.jsx';
import Feed from './pages/Feed.jsx';
import RightSideBar from './pages/RightSideBar.jsx';
import QuotePage from './pages/QuotePage.jsx';


const App = () => (
<div className="app-container">
  <Router>
    <Routes>
      <Route path="/Feed" element={<><LeftSideBar activePage="Feed"/><Feed /><RightSideBar view="feed" /></>} />
      <Route path="/Quote/:id" element={<><LeftSideBar /><QuotePage /><RightSideBar view="progess" /></>} />
    </Routes>
  </Router>
</div>  
);

export default App;














