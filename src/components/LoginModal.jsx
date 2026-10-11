import React, { useState } from 'react';
import { X, User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function LoginModal({ onClose }) {
  const { loginUser, registerUser } = useBooking();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('user123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await registerUser({ name, email, password });
      } else {
        await loginUser(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isRegister ? 'Sign up to manage your bus bookings easily' : 'Sign in to access your tickets and saved details'}</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 8,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontSize: 13,
            marginBottom: 16
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            {loading && <Loader2 size={16} className="spin-icon" />}
            {loading ? 'Connecting...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>

          <p className="modal-switch-text">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="link-btn"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
