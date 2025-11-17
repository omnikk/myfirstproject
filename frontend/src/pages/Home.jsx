import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSalons } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SalonMap from "../components/Map";

const Home = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons()
      .then(data => setSalons(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <p>  Загрузка салонов...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <div className="hero">
        <h1>  Добро пожаловать в мир красоты!</h1>
        <p>Выберите салон и запишитесь к лучшим мастерам города</p>
      </div>
      
      <div className="container">
        <div className="content">
          <h2 style={{color: '#667eea', marginBottom: '30px'}}>
              Наши салоны на карте
          </h2>
          
          <SalonMap salons={salons} />
          
          <h2 style={{color: '#667eea', marginTop: '50px', marginBottom: '30px'}}>
              Выберите салон
          </h2>
          
          <div className="salons-grid">
  {salons.map(salon => (
    <div key={salon.id} className="card">
      <img 
        src={salon.photo_url || "https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"}
        alt={salon.name}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '15px'
        }}
      />
      <h3>{salon.name}</h3>
                <p>  {salon.address}</p>
                <p>  09:00 - 21:00</p>
                <Link to={`/salon/${salon.id}`}>
                  <button>Подробнее →</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;