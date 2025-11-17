import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSalonById } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SalonPage = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalonById(id)
      .then(data => setSalon(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <p>  Загрузка салона...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <div className="content">
            <h1>  Салон не найден</h1>
            <Link to="/" className="back-link">← Вернуться на главную</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <div className="container">
        <div className="content">
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #808080 0%, #ff8c00 100%)',
            color: 'white',
            padding: '40px',
            borderRadius: '15px',
            marginBottom: '40px'
          }}>
            <h1>  {salon.name}</h1>
            <p style={{fontSize: '1.2rem', marginTop: '10px'}}>
                {salon.address}
            </p>
            <p style={{fontSize: '1rem', marginTop: '10px', opacity: '0.9'}}>
                Время работы: 09:00 - 21:00
            </p>
          </div>
          
          <h2 style={{color: '#667eea', marginBottom: '30px'}}>
                Наши мастера:
          </h2>
          
          {salon.masters && salon.masters.length > 0 ? (
            <div className="masters-grid">
              {salon.masters.map(master => (
                <div key={master.id} className="master-card">
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '15px'
                  }}>
                     
                  </div>
                  <h3>{master.name}</h3>
                  <p>  {master.specialization}</p>
                  <p>  {master.experience}</p>
                  <Link to={`/master/${master.id}`}>
                    <button className="btn" style={{marginTop: '15px'}}>
                      Записаться →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center', color: '#666', fontSize: '1.2rem'}}>
              К сожалению, мастера пока не добавлены
            </p>
          )}
          
          <Link to="/" className="back-link">← Вернуться к списку салонов</Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SalonPage;