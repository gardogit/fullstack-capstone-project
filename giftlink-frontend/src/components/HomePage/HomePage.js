// front/src/components/HomePage/HomePage.js
import React from 'react';

function HomePage() {
    return (
        <div className="container my-5 text-center">
            <h1 className="display-4 mb-3">GiftLink</h1>
            <h2 className="mb-4">Share Gifts and Joy!</h2>
            <p className="lead">
                "Sharing is the essence of community. It is through giving that we enrich and perpetuate both our lives and the lives of others."
            </p>
            <a href="/app" className="btn btn-primary">Get Started</a>
        </div>
    );
}

export default HomePage;
