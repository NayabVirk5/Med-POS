import { useState, useEffect, useContext } from 'react';
import { Search, ShoppingCart, Trash2, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function POS() {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch('https://med-pos-production.up.railway.app/api/medicines', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setMedicines(data))
      .catch(err => console.error(err));
  }, [user]);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(m => m.stockQuantity > 0);

  const addToCart = (medicine) => {
    const discountedPrice = medicine.discountPercentage > 0 
      ? medicine.price - (medicine.price * (medicine.discountPercentage / 100))
      : medicine.price;

    const existingItem = cart.find(item => item.medicineId === medicine._id);
    if (existingItem) {
      if (existingItem.quantity < medicine.stockQuantity) {
        setCart(cart.map(item => 
          item.medicineId === medicine._id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * discountedPrice }
            : item
        ));
      } else {
        alert('Cannot add more than available stock!');
      }
    } else {
      setCart([...cart, {
        medicineId: medicine._id,
        name: medicine.name,
        price: discountedPrice,
        quantity: 1,
        total: discountedPrice,
        stockAvailable: medicine.stockQuantity
      }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicineId !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setCart(cart.map(item => {
      if (item.medicineId === id) {
        if (newQuantity > item.stockAvailable) {
          alert('Cannot exceed available stock!');
          return item;
        }
        return { ...item, quantity: newQuantity, total: newQuantity * item.price };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((acc, curr) => acc + curr.total, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    fetch('https://med-pos-production.up.railway.app/api/sales', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ items: cart, totalAmount })
    })
    .then(res => res.json())
    .then(() => {
      alert('Sale completed successfully!');
      setCart([]);
      // Refresh medicines to get updated stock
      fetch('https://med-pos-production.up.railway.app/api/medicines', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setMedicines(data));
    })
    .catch(err => {
      console.error(err);
      alert('Error processing sale');
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>POS Terminal</h1>
      </div>

      <div className="pos-layout">
        {/* Left Side: Search and Products */}
        <div>
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search medicines by name or generic name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div className="search-results">
            {filteredMedicines.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No medicines found in stock.</p>
            )}
            {filteredMedicines.map(medicine => {
              const hasDiscount = medicine.discountPercentage > 0;
              const discountedPrice = hasDiscount 
                ? medicine.price - (medicine.price * (medicine.discountPercentage / 100))
                : medicine.price;

              return (
              <div key={medicine._id} className="search-item" onClick={() => addToCart(medicine)} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                {hasDiscount && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '-1.5rem', background: 'var(--danger)', color: 'white', padding: '0.15rem 1.5rem', transform: 'rotate(45deg)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {medicine.discountPercentage}% OFF
                  </div>
                )}
                <div>
                  <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem', paddingRight: hasDiscount ? '2rem' : '0' }}>{medicine.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{medicine.genericName}</span>
                </div>
                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                  {hasDiscount ? (
                    <div>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '0.5rem' }}>${medicine.price.toFixed(2)}</span>
                      <strong style={{ display: 'inline-block', fontSize: '1.1rem', color: 'var(--success)' }}>${discountedPrice.toFixed(2)}</strong>
                    </div>
                  ) : (
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>${medicine.price.toFixed(2)}</strong>
                  )}
                  <span className={`badge ${medicine.stockQuantity < 10 ? 'badge-warning' : 'badge-success'}`} style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                    Stock: {medicine.stockQuantity}
                  </span>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Right Side: Cart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: 'calc(100vh - 8rem)', position: 'sticky', top: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <ShoppingCart /> Current Sale
          </h2>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', minHeight: '200px' }}>
            {cart.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', opacity: 0.5 }}>
                <ShoppingCart size={48} style={{ marginBottom: '1rem' }} />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.medicineId} className="cart-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price.toFixed(2)} x {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="number" 
                      min="1"
                      className="form-input" 
                      style={{ width: '60px', padding: '0.25rem' }} 
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.medicineId, parseInt(e.target.value))}
                    />
                    <strong style={{ width: '60px', textAlign: 'right' }}>${item.total.toFixed(2)}</strong>
                    <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} onClick={() => removeFromCart(item.medicineId)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span style={{ color: 'var(--primary-color)' }}>${totalAmount.toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <CheckCircle size={20} /> Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
