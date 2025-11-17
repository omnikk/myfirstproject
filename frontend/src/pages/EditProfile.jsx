import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setName(userData.name);
    setUsername(userData.username);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          role: user.role
        }),
      });

      if (!response.ok) throw new Error("Ошибка обновления");

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Профиль успешно обновлен!");
      navigate("/profile");
    } catch (err) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="app">
      <Header />
      
      <div className="container">
        <div className="content">
          <h1 style={{color: '#ff8c00', textAlign: 'center', marginBottom: '30px'}}>
            Редактирование профиля
          </h1>

          <form onSubmit={handleSubmit} style={{maxWidth: '500px', margin: '0 auto'}}>
            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Логин:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditProfile;