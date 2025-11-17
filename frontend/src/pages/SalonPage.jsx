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

  if (loading) return <p>Загрузка салона...</p>;
  if (!salon) return <p>Салон не найден</p>;

  return (
    <div>
      <Header />
      <div className="container">
        <h1>{salon.name}</h1>
        <p><strong>Адрес:</strong> {salon.address}</p>
        
        <h2>Мастера:</h2>
        {salon.masters && salon.masters.length > 0 ? (
          <div className="masters-grid">
            {salon.masters.map(master => (
              <div key={master.id} className="card">
                <h3>{master.name}</h3>
                <Link to={`/master/${master.id}`}>
                  <button>Записаться</button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Мастера не найдены</p>
        )}
        
        <Link to="/">← Назад на главную</Link>
      </div>
      <Footer />
    </div>
  );
};

export default SalonPage;