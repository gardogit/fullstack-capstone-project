import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate=useNavigate();
    
    useEffect(() => {
      const authTokenFromSession = localStorage.getItem('auth-token');
      const nameFromStorage = localStorage.getItem('name');
      if (authTokenFromSession && nameFromStorage) {
          setUserName(nameFromStorage);
          setIsLoggedIn(true);
      } else {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('name');
          localStorage.removeItem('email');
          setIsLoggedIn(false);
      }
  }, [setIsLoggedIn, setUserName]);

    const handleLogout=()=>{
      localStorage.removeItem('auth-token');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate(`/app`);

    }
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" id='navbar_container'>
        <Link className="navbar-brand" to="/app">GiftLink</Link>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/app">Gifts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/app/search">Search</Link>
            </li>
            <ul className="navbar-nav ml-auto">
            {isLoggedIn ? (
                <>
                    <li className="nav-item"> <span className="nav-link" style={{color: "black", cursor:"pointer"}} onClick={() => navigate(`/app/profile`)}>Welcome, {userName}</span> </li>
                    <li className="nav-item"><button className="nav-link login-btn" onClick={handleLogout}>Logout</button></li>
                </>
                ) : (
                <>
                    <li className="nav-item">

                    <Link className="nav-link login-btn" to="/app/login">Login</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link register-btn" to="/app/register">Register</Link>
                    </li>
                </>
                )
            }
            </ul>
          </ul>
        </div>
      </nav>
        </>
    )
}