import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchMasterById } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";

const MasterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMasterById(id)
      .then(data => setMaster(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookingSuccess = () => {
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <p>  Загрузка информации о мастере...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!master) {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <div className="content">
            <h1>  Мастер не найден</h1>
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '40px',
            borderRadius: '15px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
             <img 
  src={master.photo_url || "https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"}
  alt={master.name}
  style={{
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid white',
    marginBottom: '20px'
  }}
/>
            <h1>{master.name}</h1>
            <p style={{fontSize: '1.2rem', marginTop: '10px'}}>
                {master.specialization}
            </p>
            <p style={{fontSize: '1rem', marginTop: '5px', opacity: '0.9'}}>
                {master.experience}
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: '#f5f7fa',
              padding: '30px',
              borderRadius: '15px'
            }}>
              <h2 style={{color: '#667eea', marginBottom: '20px'}}>
                  О мастере
              </h2>
              <div style={{color: '#666', lineHeight: '1.8'}}>
                <p>  Профессиональное образование</p>
                <p>  Регулярное повышение квалификации</p>
                <p>  Индивидуальный подход</p>
                <p>  Использование качественных материалов</p>
                <p>  Большой опыт работы</p>
              </div>
            </div>
            
            <div style={{
              background: '#f5f7fa',
              padding: '30px',
              borderRadius: '15px'
            }}>
              <h2 style={{color: '#667eea', marginBottom: '20px'}}>
                  Услуги
              </h2>
              <div style={{color: '#666', lineHeight: '1.8'}}>
                <p>   Стрижки любой сложности</p>
                <p>  Окрашивание волос</p>
                <p>     Укладки и прически</p>
                <p>  Маникюр и педикюр</p>
                <p>  SPA-процедуры</p>
              </div>
            </div>
          </div>
          
          <BookingForm 
            salonId={master.salon_id} 
            masterId={master.id}
            masterName={master.name}
            onSuccess={handleBookingSuccess}
          />
          
          <Link to="/" className="back-link">← Вернуться на главную</Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MasterPage;