import React, { useState, useEffect } from "react";
import { createClient, createAppointment, fetchClientByUserId } from "../api/api";

const BookingForm = ({ salonId, masterId, masterName, onSuccess }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [service, setService] = useState("Стрижка");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setName(userData.name);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let client;
      
      // Если пользователь залогинен
      if (user) {
        // Проверяем есть ли уже клиент для этого пользователя
        const existingClient = await fetchClientByUserId(user.id);
        
        if (existingClient) {
          client = existingClient;
        } else {
          // Создаем нового клиента с привязкой к user
          client = await createClient({
            name,
            phone,
            salon_id: salonId,
            user_id: user.id
          });
        }
      } else {
        // Гость без аккаунта
        client = await createClient({
          name,
          phone,
          salon_id: salonId,
          user_id: null
        });
      }

      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      await createAppointment({
        master_id: masterId,
        client_id: client.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        service
      });

      alert(`Отлично, ${name}!\n\nВы записаны на ${service.toLowerCase()}\nК мастеру: ${masterName}\nДата: ${date} в ${time}\n\nЖдём вас!`);
      
      setName("");
      setPhone("");
      setDate("");
      onSuccess && onSuccess();
    } catch (error) {
      alert("Ошибка при записи: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h2>Записаться на услугу</h2>
      
      {user && (
        <div style={{
          background: '#d4edda',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          Вы вошли как: <strong>{user.name}</strong>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ваше имя:</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Введите ваше имя"
            required 
            disabled={!!user}
          />
        </div>
        
        <div className="form-group">
          <label>Телефон:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="+7 (999) 123-45-67"
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Дата:</label>
          <input 
            type="date" 
            value={date} 
            min={today}
            onChange={e => setDate(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Время:</label>
          <select value={time} onChange={e => setTime(e.target.value)}>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Услуга:</label>
          <select value={service} onChange={e => setService(e.target.value)}>
            <option value="Стрижка">Стрижка</option>
            <option value="Окрашивание">Окрашивание</option>
            <option value="Укладка">Укладка</option>
            <option value="Маникюр">Маникюр</option>
            <option value="Педикюр">Педикюр</option>
            <option value="SPA-уход">SPA-уход</option>
          </select>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Загрузка..." : "Записаться"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;