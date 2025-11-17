import React, { useState } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Неверный логин или пароль");
      }

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password,
          name,
          role: "client"
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Ошибка регистрации");
      }

      alert("Регистрация успешна! Теперь войдите в систему.");
      setIsRegister(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setError("");
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        width: "400px",
        maxWidth: "90%"
      }}>
        <h2 style={{
          color: "#ff8c00",
          marginBottom: "30px",
          textAlign: "center"
        }}>
          {isRegister ? "Регистрация" : "Вход в систему"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600"
              }}>
                Имя:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem"
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600"
            }}>
              Логин:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isRegister ? "Придумайте логин" : "admin"}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600"
            }}>
              Пароль:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? "Придумайте пароль" : "admin"}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
            />
          </div>

          {error && (
            <div style={{
              color: "red",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #808080 0%, #ff8c00 100%)",
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "25px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "10px"
            }}
          >
            {loading ? "Загрузка..." : (isRegister ? "Зарегистрироваться" : "Войти")}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              background: "#ddd",
              color: "#333",
              border: "none",
              padding: "12px",
              borderRadius: "25px",
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "15px"
            }}
          >
            Отмена
          </button>

          <div style={{
            textAlign: "center",
            borderTop: "1px solid #ddd",
            paddingTop: "20px",
            marginTop: "10px"
          }}>
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: "none",
                border: "none",
                color: "#ff8c00",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                textDecoration: "underline"
              }}
            >
              {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </button>
          </div>
        </form>

        {!isRegister && (
          <p style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.9rem",
            color: "#666"
          }}>
            Тестовый аккаунт:<br />
            <strong>admin / admin</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;