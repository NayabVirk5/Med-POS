import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Cross, Tag, LogOut, UserCircle } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ isOpen, closeMenu }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-title" style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cross size={28} /> Lifecare
        </div>
        <button className="mobile-close-btn" onClick={closeMenu}>
          &times;
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          onClick={closeMenu}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/inventory" 
          onClick={closeMenu}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Package size={20} />
          Inventory
        </NavLink>
        
        <NavLink 
          to="/discounted" 
          onClick={closeMenu}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Tag size={20} />
          Discounted
        </NavLink>
        
        <NavLink 
          to="/pos" 
          onClick={closeMenu}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <ShoppingCart size={20} />
          POS Terminal
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <UserCircle size={32} color="var(--primary-color)" />
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        
        <button onClick={() => { closeMenu(); logout(); }} className="btn btn-logout">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
