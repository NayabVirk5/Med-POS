import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Cross } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const action = isLogin ? login : register;
    const result = await action(username, password);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100%',
      padding: '1rem',
      background: 'transparent'
    }}>
      <div className="glass-card" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '3rem 2.5rem',
        animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
            padding: '1rem',
            borderRadius: '1rem',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)'
          }}>
            <Cross color="white" size={40} />
          </div>
          <h1 style={{ color: 'var(--text-main)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Lifecare POS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{isLogin ? 'Welcome back! Please sign in.' : 'Create a new POS account'}</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', 
            padding: '0.875rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem', 
            textAlign: 'center', 
            fontSize: '0.9rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter Password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1rem' }}>
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              fontWeight: 500, 
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              {isLogin ? "Register" : "Sign In"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
