import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        color: "#2E2E2E",
      }}
    >
      <div
        style={{
          backgroundColor: "transparent",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "15px",
            padding: "2rem",
            maxWidth: "700px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            style={{
              color: "#e9981eff",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            WELCOME TO খা.AI
          </h1>
          <p style={{ color: "#4E342E", fontSize: "1.1rem" }}>
            খা.AI is your intelligent dining companion, blending AI precision
            with real human cravings. Discover top-rated restaurants, hidden
            gems, and food trends tailored just for you.
          </p>
          <p style={{ color: "#4E342E", fontWeight: "600" }}>
            Your cravings, Our intelligence!!
          </p>
        </div>

  
        <div className="container mt-5">
          <h2 className="mb-5" style={{ color: "#FF6F00", fontWeight: "bold" }}>
            HOW IT WORKS
          </h2>
          <div className="row justify-content-center align-items-stretch">
            <div className="col-md-3 mb-4 d-flex">
              <div
                className="p-4 rounded flex-fill"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "3rem" }}>🔍</div>
                <h4 style={{ color: "#FF6F00" }}>1. Search</h4>
                <p style={{ color: "#2E2E2E" }}>
                  Find restaurants by cuisine, location, or rating
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4 d-flex">
              <div
                className="p-4 rounded flex-fill"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "3rem" }}>🤖</div>
                <h4 style={{ color: "#FF6F00" }}>2. Smart Recommendations</h4>
                <p style={{ color: "#2E2E2E" }}>
                  AI learns your taste to recommend the best spots nearby.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4 d-flex">
              <div
                className="p-4 rounded flex-fill"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "3rem" }}>⭐</div>
                <h4 style={{ color: "#FF6F00" }}>3. Review & Share</h4>
                <p style={{ color: "#2E2E2E" }}>
                  Share your dining experiences with the খা.AI community.
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="text-center mt-4">
          <Link
            to="/restaurants"
            className="btn btn-lg px-5 py-3"
            style={{
              backgroundColor: "#e49983ff",
              color: "white",
              borderRadius: "30px",
              fontWeight: "bold",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#E64A19")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#FF7043")}
          >
            Browse All Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
