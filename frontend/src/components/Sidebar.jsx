import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Cross, Tag, LogOut, UserCircle } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <Cross size={28} /> Lifecare
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/inventory" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Package size={20} />
          Inventory
        </NavLink>
        
        <NavLink 
          to="/discounted" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Tag size={20} />
          Discounted
        </NavLink>
        
        <NavLink 
          to="/pos" 
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
        
        <button onClick={logout} className="btn btn-logout">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
