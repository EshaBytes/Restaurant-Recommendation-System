import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, currentUser, error: authError, clearError } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);


  useEffect(() => {
    if (authError) setLocalError(authError);
  }, [authError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLocalError("");
      setLoading(true);
      clearError();

      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        navigate("/");
      } else {
        setLocalError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setLocalError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/login&signup.jpg')", 
        backgroundSize: "cover",
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
          padding: "3.5rem 3rem",
          width: "95%",
          maxWidth: "520px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#FF6F00",
            fontWeight: "700",
            marginBottom: "0.5rem",
            fontSize: "2rem",
          }}
        >
          Join খা.AI
        </h2>


       <p
  style={{
    textAlign: "center",
    color: "#4E342E",
    fontSize: "1rem",
    lineHeight: "1.6",
    fontWeight: "500",
  }}
>
  Your cravings 🍲 Our intelligence 🤖
</p>

<p
  style={{
    textAlign: "center",
    color: "#4E342E",
    marginBottom: "2rem",
    fontSize: "1rem",
    lineHeight: "1.6",
    fontWeight: "500",
  }}
>
  Sign up and let খা.AI spice up your food journey! 😋
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
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              fontSize: "1.1rem",
              border: "none",
              transition: "background-color 0.3s ease",
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: "#4E342E" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#FF6F00", fontWeight: "600" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
