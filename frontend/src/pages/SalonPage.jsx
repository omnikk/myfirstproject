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
                <div key={master.id} className="master-card" style={{
                  background: 'white',
                  border: '2px solid #f0f0f0',
                  padding: '30px 25px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Декоративный фон */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0.1
                  }}></div>
                  
                  {/* Круглое фото мастера */}
                  <div style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 8px 20px rgba(102,126,234,0.3)',
                    background: master.photo_url ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}>
                    {master.photo_url ? (
                      <img 
                        src={master.photo_url} 
                        alt={master.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">👤</div>';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        👤
                      </div>
                    )}
                  </div>
                  
                  <h3 style={{
                    color: '#667eea',
                    marginBottom: '10px',
                    fontSize: '1.3rem'
                  }}>
                    {master.name}
                  </h3>
                  
                  {/* Звёзды рейтинга */}
                  <div style={{
                    color: '#ffc107',
                    fontSize: '1.2rem',
                    marginBottom: '12px',
                    letterSpacing: '2px'
                  }}>
                    ⭐⭐⭐⭐⭐
                    <span style={{
                      color: '#999',
                      fontSize: '0.85rem',
                      marginLeft: '8px'
                    }}>
                      4.9
                    </span>
                  </div>
                  {/* Бейдж для первого мастера в списке */}
                  {salon.masters.indexOf(master) === 0 && (
                    <div style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      marginBottom: '15px',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 8px rgba(255,107,107,0.3)'
                    }}>
                      🏆 Топ мастер
                    </div>
                  )}
                  <p style={{
                    color: '#666',
                    fontSize: '0.95rem',
                    marginBottom: '8px'
                  }}>
                    ✂️ {master.specialization}
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.95rem',
                    marginBottom: '20px'
                  }}>
                    📅 {master.experience}
                  </p>
                  {/* Статистика мастера */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginBottom: '20px',
                    padding: '15px 0',
                    borderTop: '1px solid #f0f0f0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{textAlign: 'center'}}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#667eea'
                      }}>
                        {Math.floor(Math.random() * 500) + 200}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#999',
                        marginTop: '5px'
                      }}>
                        Клиентов
                      </div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#667eea'
                      }}>
                        {Math.floor(Math.random() * 5) + 3}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#999',
                        marginTop: '5px'
                      }}>
                        Лет опыта
                      </div>
                    </div>
                  </div>
                  <Link to={`/master/${master.id}`}>
                    <button style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                    }}>
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