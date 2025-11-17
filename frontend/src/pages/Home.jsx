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

  if (loading) return <p>Загрузка салонов...</p>;

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Выберите салон</h1>
        
        <div className="content">
          <div className="map">
            <SalonMap salons={salons} />
          </div>
          
          <div className="salon-list">
            {salons.map(salon => (
              <div key={salon.id} className="card">
                <h3>{salon.name}</h3>
                <p>{salon.address}</p>
                <Link to={`/salon/${salon.id}`}>
                  <button>Выбрать</button>
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