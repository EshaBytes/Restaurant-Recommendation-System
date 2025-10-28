import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-light py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Discover the Best Restaurants</h1>
          <p className="lead mb-4">Find and review your favorite dining spots</p>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="Search for restaurants, cuisines, or locations" 
                />
                <button className="btn btn-primary btn-lg" type="button">
                  <span>🔍</span> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container my-5">
        <div className="row mb-5">
          <div className="col-md-8 mx-auto text-center">
            <h2 className="mb-5">How It Works</h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="p-3">
                  <div className="text-primary mb-3" style={{fontSize: '3rem'}}>🔍</div>
                  <h4>1. Search</h4>
                  <p>Find restaurants by cuisine, location, or rating</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-3">
                  <div className="text-primary mb-3" style={{fontSize: '3rem'}}>🍽️</div>
                  <h4>2. Discover</h4>
                  <p>Explore detailed information and reviews</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-3">
                  <div className="text-primary mb-3" style={{fontSize: '3rem'}}>⭐</div>
                  <h4>3. Review</h4>
                  <p>Share your experience with others</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <Link to="/restaurants" className="btn btn-primary btn-lg px-5 py-3">
              Browse All Restaurants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;