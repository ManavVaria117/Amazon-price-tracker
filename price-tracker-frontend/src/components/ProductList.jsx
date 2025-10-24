import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this file has the styles below

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', url: '', targetPrice: '' });

  console.log('API URL:', API);

  const fetchProductData = async () => {
    try {
      console.log('Fetching from:', API);
      const response = await fetch(API);
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      await axios.post(API, {
        name: newProduct.name,
        url: newProduct.url,
        targetPrice: Number(newProduct.targetPrice)
      });
      setNewProduct({ name: '', url: '', targetPrice: '' });
      fetchProductData();
    } catch (err) {
      alert('Error adding product');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchProductData();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="tracker-container">
      <form className="product-form" onSubmit={(e) => { e.preventDefault(); addProduct(); }}>     
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Amazon Product URL"
          value={newProduct.url}
          onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Target Price"
          value={newProduct.targetPrice}
          onChange={(e) => setNewProduct({ ...newProduct, targetPrice: e.target.value })}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p._id}>
            <h3>{p.name}</h3>
            <p>
              <strong>Current:</strong> ₹{p.currentPrice ?? 'N/A'}
              <br />
              <strong>Target:</strong> ₹{p.targetPrice}
            </p>
            <p className="timestamp">
              {p.lastChecked ? `Last Checked: ${new Date(p.lastChecked).toLocaleString()}` : 'Not Checked Yet'}
            </p>
            <a href={p.url} target="_blank" rel="noreferrer" className="view-link">🔗 View on Amazon</a>
            <button className="delete-btn" onClick={() => deleteProduct(p._id)}>❌ Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
