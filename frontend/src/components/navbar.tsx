import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { useAuth } from 'react-oidc-context';

interface NavBarProps {
  brandName: string;
  imageSrcPath: string;
  navItems: string[];
}

function NavBar({ brandName, imageSrcPath, navItems }: NavBarProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const auth = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {imageSrcPath && (
          <img
            src={imageSrcPath}
            width="60"
            height="60"
            className="d-inline-block align-center"
            alt={brandName}
          />
        )}
        <span className="fw-bolder fs-4">{brandName}</span>
      </div>
      <ul className="navbar-nav">
        {navItems.map((item, index) => (
          <li
            key={item}
            className="nav-item"
            onClick={() => setSelectedIndex(index)}
          >
             {item === auth.user?.profile.name ? (
                  <a // Or Link if you are using a routing solution
                      className={selectedIndex === index ? "nav-link active fw-bold" : "nav-link"}

                      href={`/user/${encodeURIComponent(auth.user?.profile.name)}`}
                  >
                      {item}
                  </a>
              ) : (
                  <Link
                      className={selectedIndex === index ? "nav-link active fw-bold" : "nav-link"}
                      to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  >
                      {item}
                  </Link>
                  )
              }
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;