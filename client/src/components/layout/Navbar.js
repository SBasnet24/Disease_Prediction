import React from 'react'
import { Link } from "react-router-dom";

const Navbar =()=> {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper white">
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="col main__nav"
            >
              <h2>Disease Prediction System </h2>
            </Link>
          </div>
        </nav>
      </div>
    );
}

export default Navbar;
