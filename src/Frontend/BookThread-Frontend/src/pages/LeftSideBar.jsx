import React from 'react';

const LeftSideBar = ({ activePage }) => {
  const menuItems = [
    //{ name: 'BookThread', icon: 'fa-book', path: '/BookThread', disabled: false },
    { name: 'Home', icon: 'fa-house-chimney', path: '/Home', hasArrow: true, disabled: false },
    { name: 'Explore', icon: 'fa-compass', path: '/Explore', hasArrow: true, disabled: false },
    { name: 'Clubs', icon: 'fa-layer-group', path: '/Clubs', hasArrow: true, disabled: true },
    { name: 'Challenges', icon: 'fa-medal', path: '/Challenges', disabled: true },
    { name: 'Profile', icon: 'fa-user', path: '/Profile', hasArrow: true, disabled: true },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fa-solid fa-book-open"></i>
        <h1>BookThread</h1>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          // 1. Determine if active
          const isActive = activePage === item.name ? 'active' : '';
          
          // 2. Determine if disabled
          const isDisabled = item.disabled ? 'disabled-link' : '';

          return (
            <a
              key={item.name}
              href={item.disabled ? null : item.path} // Remove href if disabled
              className={`nav-item ${isActive} ${isDisabled}`}
              onClick={(e) => item.disabled && e.preventDefault()} // Block clicks
              style={item.disabled ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.name}
              {item.hasArrow && <i className="fa-solid fa-chevron-right arrow"></i>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default LeftSideBar;
