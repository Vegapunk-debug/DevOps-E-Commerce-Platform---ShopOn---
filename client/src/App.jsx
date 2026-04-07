import { useState, useEffect } from 'react'

function App() {
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    fetch(`${apiUrl}/api/sneakers`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setSneakers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sneakers:', err);
        setError("Could not load shoes. Is the backend server running?");
        setLoading(false);
      });
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  return (
    <div className="container">
      <header className="header">
        <img src="/logo.png" alt="ShopOn Logo" style={{ height: '60px', marginBottom: '10px' }} />
        <h1>Shop On</h1>
        <p>Sneakers Collection</p>
      </header>

      <main>
        {/* Error Message */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Loading State or Sneaker Grid */}
        {loading && !error ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Loading collection...</p>
          </div>
        ) : (
          <div className="shoe-grid">
            {sneakers.map((shoe) => (
              <div key={shoe.id} className="shoe-card">
                <div className="shoe-image-container">
                  <img
                    src={`${apiUrl}/images/${shoe.image}`}
                    alt={shoe.name}
                    className="shoe-image"
                  />
                </div>
                <div className="shoe-info">
                  <div className="shoe-tag">New Arrival</div>
                  <h3 className="shoe-name">{shoe.name}</h3>
                  <p className="shoe-price" style={{ fontWeight: 'bold', marginTop: '5px' }}>
                    ${shoe.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App