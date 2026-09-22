import { useState, useEffect, useContext } from 'react';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${user?.token}` };

    fetch('http://localhost:5000/api/sales', { headers })
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/medicines', { headers })
      .then(res => res.json())
      .then(data => setMedicines(data))
      .catch(err => console.error(err));
  }, [user]);

  const totalSalesToday = sales
    .filter(sale => new Date(sale.date).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const lowStockMedicines = medicines.filter(m => m.stockQuantity < 10);
  const expiringMedicines = medicines.filter(m => {
    const monthsUntilExpiry = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilExpiry < 3 && monthsUntilExpiry > 0;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Today's Sales</h3>
              <p>${totalSalesToday.toFixed(2)}</p>
            </div>
            <TrendingUp color="var(--success)" size={32} />
          </div>
        </div>

        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Total Products</h3>
              <p>{medicines.length}</p>
            </div>
            <Package color="var(--primary-color)" size={32} />
          </div>
        </div>

        <div className="glass-card stat-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Low Stock Alerts</h3>
              <p>{lowStockMedicines.length}</p>
            </div>
            <AlertCircle color="var(--warning)" size={32} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Low Stock Items</h2>
          {lowStockMedicines.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No items are currently low on stock.</p>
          ) : (
            <div className="search-results">
              {lowStockMedicines.map(m => (
                <div key={m._id} className="search-item" style={{ borderLeft: '4px solid var(--warning)' }}>
                  <div>
                    <strong>{m.name}</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock: {m.stockQuantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Expiring Soon</h2>
          {expiringMedicines.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No items are expiring within 3 months.</p>
          ) : (
            <div className="search-results">
              {expiringMedicines.map(m => (
                <div key={m._id} className="search-item" style={{ borderLeft: '4px solid var(--danger)' }}>
                  <div>
                    <strong>{m.name}</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Expires: {new Date(m.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
