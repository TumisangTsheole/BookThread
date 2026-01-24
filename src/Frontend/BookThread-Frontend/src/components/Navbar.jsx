import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link> |  
    <Link to="/books">Books</Link> |  
    <Link to="/threads">Threads</Link> |  
    <Link to="/users">Users</Link> |
    <Link to="/userbooks">UserBooks</Link> |
  </nav>
);

export default Navbar;
