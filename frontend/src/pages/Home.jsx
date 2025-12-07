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
          <p>Загрузка салонов...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      {/* Hero секция */}
      <div className="hero" style={{
        animation: 'fadeIn 1s ease-in',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 8s ease infinite',
          zIndex: 0
        }}></div>
        
        <div style={{position: 'relative', zIndex: 1}}>
          <h1 style={{
            animation: 'slideDown 0.8s ease-out',
            fontSize: '3.5rem',
            marginBottom: '20px'
          }}>
            💇‍♀️ Добро пожаловать в мир красоты!
          </h1>
          <p style={{
            animation: 'slideUp 0.8s ease-out 0.3s backwards',
            fontSize: '1.4rem',
            marginBottom: '30px'
          }}>
            Выберите салон и запишитесь к лучшим мастерам города
          </p>
          
          <button 
            onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              animation: 'pulse 2s ease-in-out infinite',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Выбрать салон ↓
          </button>
        </div>
      </div>
      
      {/* Секция с картой и салонами */}
      <div className="container">
        <div className="content">
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
            padding: '30px',
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            borderRadius: '20px',
            border: '2px dashed #667eea'
          }}>
            <h2 style={{
              color: '#667eea',
              marginBottom: '10px',
              fontSize: '2rem',
              animation: 'fadeIn 0.8s'
            }}>
              📍 Наши салоны на карте
            </h2>
            <p style={{
              color: '#666',
              fontSize: '1.1rem'
            }}>
              Выберите ближайший салон и запишитесь онлайн
            </p>
            <div style={{
              display: 'inline-flex',
              gap: '15px',
              marginTop: '15px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{
                background: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: '#667eea',
                fontWeight: '600',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                🎯 4 салона
              </span>
              <span style={{
                background: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: '#667eea',
                fontWeight: '600',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                ⏰ Работаем до 21:00
              </span>
              <span style={{
                background: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: '#667eea',
                fontWeight: '600',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                💎 20+ мастеров
              </span>
            </div>
          </div>
          
          <SalonMap salons={salons} />
          
          <h2 style={{color: '#667eea', marginTop: '50px', marginBottom: '30px'}}>
            ✨ Выберите салон
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
                <p>📍 {salon.address}</p>
                <p>🕐 09:00 - 21:00</p>
                <Link to={`/salon/${salon.id}`}>
                  <button>Подробнее →</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Секция отзывов */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '80px 20px',
        marginTop: '60px'
      }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            color: '#667eea',
            fontSize: '2.5rem',
            marginBottom: '20px'
          }}>
            💬 Отзывы наших клиентов
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '1.2rem',
            marginBottom: '50px'
          }}>
            Более 1000 довольных клиентов уже выбрали нас!
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                name: 'Анна Сергеева',
                photo: 'https://i.pravatar.cc/150?img=1',
                text: 'Замечательный салон! Мастер Елена сделала потрясающую стрижку. Обязательно вернусь снова!',
                service: 'Стрижка',
                rating: 5
              },
              {
                name: 'Мария Петрова',
                photo: 'https://i.pravatar.cc/150?img=5',
                text: 'Окрашивание получилось именно таким, как я хотела. Очень довольна результатом и сервисом!',
                service: 'Окрашивание',
                rating: 5
              },
              {
                name: 'Екатерина Иванова',
                photo: 'https://i.pravatar.cc/150?img=9',
                text: 'Маникюр - просто огонь! Держится уже 3 недели. Мастер очень внимательная и аккуратная.',
                service: 'Маникюр',
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                animation: `slideUp 0.6s ease-out ${index * 0.15}s backwards`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102,126,234,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <img 
                    src={review.photo}
                    alt={review.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      marginRight: '15px',
                      border: '3px solid #667eea'
                    }}
                  />
                  
                  <div>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: '#333',
                      marginBottom: '5px'
                    }}>
                      {review.name}
                    </div>
                    <div style={{
                      color: '#ffc107',
                      fontSize: '1rem',
                      letterSpacing: '1px'
                    }}>
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                </div>
                
                <p style={{
                  color: '#666',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  fontStyle: 'italic'
                }}>
                  "{review.text}"
                </p>
                
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  ✨ {review.service}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Секция преимуществ */}
      <div className="container">
        <div className="content" style={{marginTop: '60px', marginBottom: '60px'}}>
          <h2 style={{
            textAlign: 'center',
            color: '#667eea',
            fontSize: '2.5rem',
            marginBottom: '50px'
          }}>
            ✨ Почему выбирают нас?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Онлайн-запись 24/7',
                desc: 'Записывайтесь в любое время без звонков и ожидания'
              },
              {
                icon: '👨‍🎨',
                title: 'Лучшие мастера',
                desc: 'Опытные специалисты с постоянным обучением'
              },
              {
                icon: '💎',
                title: 'Премиум материалы',
                desc: 'Используем только профессиональную косметику'
              },
              {
                icon: '⚡',
                title: 'Без очередей',
                desc: 'Вас примут точно в назначенное время'
              },
              {
                icon: '💰',
                title: 'Честные цены',
                desc: 'Никаких скрытых доплат и сюрпризов'
              },
              {
                icon: '🎉',
                title: 'Бонусная программа',
                desc: 'Накапливайте баллы и получайте скидки'
              }
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '30px 20px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.4s',
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s backwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102,126,234,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  animation: 'bounce 2s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  color: '#667eea',
                  fontSize: '1.3rem',
                  marginBottom: '15px',
                  fontWeight: '700'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  {item.desc}
                </p>
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