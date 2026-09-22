import { useState, useEffect, useContext } from 'react';
import { Tag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function DiscountedMedicines() {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch('http://localhost:5000/api/medicines', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setMedicines(data))
      .catch(err => console.error(err));
  }, [user]);

  const discountedMedicines = medicines.filter(m => m.discountPercentage > 0);

  return (
    <div>
      <div className="page-header">
        <h1>Discounted Medicines</h1>
      </div>
      
      {discountedMedicines.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Tag size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>No medicines are currently on discount.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {discountedMedicines.map(m => {
            const discountedPrice = m.price - (m.price * (m.discountPercentage / 100));
            
            return (
              <div key={m._id} className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '-2rem', background: 'var(--danger)', color: 'white', padding: '0.25rem 2rem', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {m.discountPercentage}% OFF
                </div>
                
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', paddingRight: '2rem' }}>{m.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{m.genericName}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Original Price:</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>${m.price.toFixed(2)}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--success)' }}>Discounted Price:</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>${discountedPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
