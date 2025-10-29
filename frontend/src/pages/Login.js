import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/'); // ✅ CHANGED: Redirect to root instead of /home
    }
  }, [currentUser, navigate]);

  // Sync with auth context errors
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      setLocalError('');
      setLoading(true);
      clearError();
      
      const result = await login(email, password);

      if (result.success) {
        navigate('/'); // ✅ CHANGED: Redirect to root instead of /home
      } else {
        setLocalError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setLocalError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Log In</h2>

              {localError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {localError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setLocalError('')}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="btn btn-primary w-100"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;