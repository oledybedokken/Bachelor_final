import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return <div className='d-flex justify-content-center'><nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="#">Navbar</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <Link to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link to="/inntekt">Inntekt</Link>
      </li>
      <li className="nav-item">
       <Link to="/vaermap">Vær Map</Link>
      </li>
    </ul>
  </div>
</nav></div>;
};

export default Header;
