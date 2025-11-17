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
            <h1 style={{color: '#ff8c00'}}>Салон Красоты</h1>
          </Link>
          <nav>
            <Link to="/">Главная</Link>
            {user ? (
              <>
                <Link to="/profile">Профиль ({user.name})</Link>
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
    </>
  );
};

export default Header;