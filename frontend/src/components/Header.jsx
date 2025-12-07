import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <header>
        <div className="container">
          <Link to="/" style={{textDecoration: 'none'}}>
            <h1 style={{color: '#ff8c00'}}>💇‍♀️ Салон Красоты</h1>
          </Link>
          <nav>
            <Link to="/">Главная</Link>
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link to="/admin">Аналитика</Link>
                ) : (
                  <Link to="/profile">Профиль ({user.name})</Link>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    background: "linear-gradient(135deg, #808080 0%, #ff8c00 100%)",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    marginLeft: "20px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                style={{
                  background: "linear-gradient(135deg, #808080 0%, #ff8c00 100%)",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  marginLeft: "20px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Войти
              </button>
            )}
          </nav>
        </div>
      </header>
      
      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
      
      {/* Плавающая кнопка звонка */}
      <a 
        href="tel:+79991234567"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'white',
          boxShadow: '0 8px 25px rgba(37,211,102,0.4)',
          zIndex: 9999,
          animation: 'pulse 2s ease-in-out infinite',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.15)';
          e.target.style.boxShadow = '0 12px 35px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(37,211,102,0.4)';
        }}
        title="Позвонить нам"
      >
        📞
      </a>
    </>
  );
};

export default Header;