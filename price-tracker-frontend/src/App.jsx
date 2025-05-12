import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [form, setForm] = useState({ name: '', url: '', targetPrice: '', email: '' });
  const [editedTargetPrice, setEditedTargetPrice] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:5000/api/products';

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products.');
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id, updatedProduct) => {
    console.log("Updating product:", updatedProduct);
    try {
      await axios.put(`${API_BASE}/${id}`, {
        targetPrice: updatedProduct.targetPrice,
        email: updatedProduct.email,
      });
      fetchProducts(); // Refresh with latest data
    } catch (err) {
      console.error(err);
      setError('Failed to update product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(API_BASE, form);
      setForm({ name: '', url: '', targetPrice: '', email: '' });
      fetchProducts();
    } catch (err) {
      setError('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="banner">
        <h1 className="tracker-title">Amazon Price Tracker</h1>
      </div>
      <div className="container">
        <form onSubmit={handleSubmit} className="product-form button">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="url"
            name="url"
            placeholder="Amazon Product URL"
            value={form.url}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="targetPrice"
            placeholder="Target Price"
            value={form.targetPrice}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          <button type="submit" disabled={loading}>Add Product</button>
        </form>

        {error && <p className="error">⚠️ {error}</p>}

        <div className="product-grid">
          {products.map(product => (
            <div className="product-card" key={product._id}>
              <h3>{product.name}</h3>
              <p>Current: ₹{product.currentPrice || 'Wait till scan cycle'}</p>
              <div className='edit-tab'>
                {editProductId === product._id ? (
                  <div className='edit-controls'>
                    <input
                      type="number"
                      className="edit-input"
                      value={editedTargetPrice}
                      onChange={(e) => setEditedTargetPrice(e.target.value)}
                    />
                    <input
                      type="email"
                      className="edit-input"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                    />
                    <button className="edit-controls button"onClick={() => {
                      handleUpdate(product._id, {
                        targetPrice: editedTargetPrice,
                        email: editedEmail
                      });
                      setEditProductId(null);
                    }}>💾 Save</button>
                    <button onClick={() => setEditProductId(null)}>✖ Cancel</button>
                  </div>
                  ) : (
                  <>
                    <p>Target: ₹{product.targetPrice}</p>
                    <p>Email: {product.email}</p>
                    <button className="edit-input" onClick={() => {
                      setEditedTargetPrice(product.targetPrice);
                      setEditedEmail(product.email);
                      setEditProductId(product._id);
                    }}>
                      Edit 
                    </button>

                  </>
                )}
              </div>
              <a href={product.url} className="view-link" target="_blank" rel="noopener noreferrer">
                View Product
              </a>
              <p className="timestamp">
                Last Checked: {product.lastChecked ? new Date(product.lastChecked).toLocaleString() : 'Never'}
              </p>
              <div className="delete-btn-wrapper">
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
