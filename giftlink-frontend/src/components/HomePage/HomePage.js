import React from 'react';
import { useNavigate } from 'react-router-dom';
function HomePage() {
    const navigate = useNavigate();
  
    const handleGetStartedClick = () => {
      navigate('/app');
    };
  
    return (
      <div className="container my-5 text-center">
        <h1 className="display-4 mb-3">GiftLink</h1>
        <h2 className="mb-4">Share Gifts and Joy!</h2>
        <p className="lead">
          "Sharing is the essence of community. It is through giving that we enrich and perpetuate both our lives and the lives of others."
        </p>
        <button className="btn btn-primary" onClick={handleGetStartedClick}>Get Started</button>
      </div>
    );
  }

export default HomePage;
