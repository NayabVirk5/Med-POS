import { useState, useEffect, useContext, useCallback } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Inventory() {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    name: '', genericName: '', batchNumber: '', expiryDate: '', price: '', stockQuantity: '', discountPercentage: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchMedicines = useCallback(() => {
    if (!user) return;
    fetch('http://localhost:5000/api/medicines', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setMedicines(data))
      .catch(err => console.error(err));
  }, [user]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/api/medicines/${editingId}`
      : 'http://localhost:5000/api/medicines';
    
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}` 
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      fetchMedicines();
      setFormData({ name: '', genericName: '', batchNumber: '', expiryDate: '', price: '', stockQuantity: '', discountPercentage: '' });
      setEditingId(null);
      setIsFormVisible(false);
    })
    .catch(err => console.error(err));
  };

  const handleEdit = (medicine) => {
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName,
      batchNumber: medicine.batchNumber,
      expiryDate: medicine.expiryDate.split('T')[0],
      price: medicine.price,
      stockQuantity: medicine.stockQuantity,
      discountPercentage: medicine.discountPercentage || 0
    });
    setEditingId(medicine._id);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      fetch(`http://localhost:5000/api/medicines/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(() => fetchMedicines())
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Inventory Management</h1>
        <button className="btn btn-primary" onClick={() => {
          setIsFormVisible(!isFormVisible);
          setEditingId(null);
          setFormData({ name: '', genericName: '', batchNumber: '', expiryDate: '', price: '', stockQuantity: '', discountPercentage: '' });
        }}>
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {isFormVisible && (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            {editingId ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Generic Name</label>
              <input type="text" name="genericName" className="form-input" value={formData.genericName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Batch Number</label>
              <input type="text" name="batchNumber" className="form-input" value={formData.batchNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input type="date" name="expiryDate" className="form-input" value={formData.expiryDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" step="0.01" name="price" className="form-input" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" name="stockQuantity" className="form-input" value={formData.stockQuantity} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input type="number" name="discountPercentage" className="form-input" value={formData.discountPercentage} onChange={handleInputChange} min="0" max="100" />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn" onClick={() => setIsFormVisible(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'} Medicine</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Generic Name</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Disc(%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(m => (
              <tr key={m._id}>
                <td><strong>{m.name}</strong></td>
                <td>{m.genericName}</td>
                <td>{m.batchNumber}</td>
                <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${m.stockQuantity < 10 ? 'badge-warning' : 'badge-success'}`}>
                    {m.stockQuantity}
                  </span>
                </td>
                <td>${m.price.toFixed(2)}</td>
                <td>{m.discountPercentage > 0 ? `${m.discountPercentage}%` : '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => handleEdit(m)}>
                      <Edit2 size={18} />
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} onClick={() => handleDelete(m._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
