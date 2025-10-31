import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, currentUser, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (authError) setLocalError(authError);
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      setLocalError("");
      setLoading(true);
      clearError();

      const result = await login(email, password);

      if (result.success) {
        const userRole =
          result.user?.role || (email === "admin@gmail.com" ? "admin" : "user");
        if (userRole === "admin") navigate("/admin/dashboard");
        else navigate("/profile");
      } else {
        setLocalError(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLocalError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/login&signup.jpg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "25px",
          padding: "4rem 3rem",
          width: "95%",
          maxWidth: "520px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#FF6F00",
            fontWeight: "700",
            marginBottom: "1rem",
            fontSize: "2rem",
          }}
        >
          Welcome Back to খা.AI
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#4E342E",
            fontSize: "1rem",
          }}
        > Your cravings 🍴 Our intelligence 🤖 
        </p>
        <p
          style={{
            textAlign: "center",
            color: "#4E342E",
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        > 
          Login to discover your next favorite meal!
        </p>

        {localError && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {localError}
            <button
              type="button"
              className="btn-close"
              onClick={() => setLocalError("")}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                borderRadius: "12px",
                border: "1px solid #FF6F00",
                padding: "12px 16px",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                borderRadius: "12px",
                border: "1px solid #FF6F00",
                padding: "12px 16px",
              }}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#FF6F00",
              color: "white",
              borderRadius: "30px",
              fontWeight: "bold",
              padding: "0.85rem",
              marginTop: "10px",
              fontSize: "1.1rem",
              transition: "background-color 0.3s ease",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#E65100")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#FF6F00")}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: "#4E342E", fontSize: "0.95rem" }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#FF6F00", fontWeight: "600" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
