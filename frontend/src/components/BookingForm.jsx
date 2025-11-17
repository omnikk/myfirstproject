import React, { useState } from "react";
import { createClient, createAppointment } from "../api/api";

const BookingForm = ({ salonId, masterId, onSuccess }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [service, setService] = useState("Стрижка");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Создаем клиента
      const client = await createClient({
        name,
        phone,
        salon_id: salonId
      });

      // Создаем запись
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 час

      await createAppointment({
        master_id: masterId,
        client_id: client.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        service
      });

      alert(`Спасибо, ${name}! Вы записаны на ${date} в ${time}`);
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
    <div className="form">
      <h2>Записаться на услугу</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Телефон:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Дата:</label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Время:</label>
          <select value={time} onChange={e => setTime(e.target.value)}>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
          </select>
        </div>
        <div>
          <label>Услуга:</label>
          <select value={service} onChange={e => setService(e.target.value)}>
            <option value="Стрижка">Стрижка</option>
            <option value="Окрашивание">Окрашивание</option>
            <option value="Укладка">Укладка</option>
            <option value="Маникюр">Маникюр</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Записаться"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;