import React, { useState, useEffect } from "react";
import ServiceSelector from "./ServiceSelector";

const BookingForm = ({ master, onClose, onSuccess }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate && master) {
      loadAvailableSlots();
    }
  }, [selectedDate, master]);

  const loadServices = async () => {
    try {
      const response = await fetch("http://localhost:8080/services-with-prices/");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Ошибка загрузки услуг:", error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/masters/${master.id}/available-slots?date=${selectedDate}`
      );
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error("Ошибка загрузки свободных слотов:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Пожалуйста, войдите в систему!");
      return;
    }

    if (!selectedService || !selectedDate || !selectedSlot) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    setLoading(true);

    try {
      const clientResponse = await fetch(
        `http://localhost:8080/users/${user.id}/client`
      );
      let client = await clientResponse.json();

      if (!client) {
        const newClientResponse = await fetch(
          "http://localhost:8080/clients/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              phone: "+7 (999) 000-00-00",
              salon_id: master.salon_id,
              user_id: user.id,
            }),
          }
        );
        client = await newClientResponse.json();
      }

      // ИСПРАВЛЕНО: Создаем дату в локальном времени
      const [year, month, day] = selectedDate.split('-').map(Number);
      const startDateTime = new Date(year, month - 1, day, selectedSlot.hour, 0, 0);
      const endDateTime = new Date(year, month - 1, day, selectedSlot.hour + 1, 0, 0);

      // Форматируем в ISO без изменения часового пояса
      const formatLocalDateTime = (date) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      const selectedServiceObj = services.find(s => s.name === selectedService);

      const appointmentData = {
        master_id: master.id,
        client_id: client.id,
        start_time: formatLocalDateTime(startDateTime),
        end_time: formatLocalDateTime(endDateTime),
        service: selectedService,
        price: selectedServiceObj?.price || 0,
        status: "confirmed"
      };

      console.log("Отправляем запись:", appointmentData); // Для отладки

      const response = await fetch("http://localhost:8080/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        alert("Запись успешно создана!");
        onSuccess();
        onClose();
      } else {
        alert("Ошибка при создании записи");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при создании записи");
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const selectedServiceObj = services.find(s => s.name === selectedService);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '900px'}}>
        <h2>Записаться к мастеру</h2>
        <p style={{ color: "#667eea", fontWeight: "600", marginBottom: "20px" }}>
          {master.name}
        </p>

        <form onSubmit={handleSubmit}>
<div style={{ marginBottom: "30px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "20px", 
              fontWeight: "700", 
              fontSize: "1.2rem", 
              color: "#333" 
            }}>
              ✨ Выберите услугу:
            </label>
            
            <ServiceSelector 
              services={services}
              selectedService={selectedServiceObj}
              onSelectService={(service) => setSelectedService(service.name)}
            />
            
            {selectedServiceObj && (
              <div style={{
                marginTop: "20px",
                padding: "20px",
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                borderRadius: "15px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1.3rem",
                boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
              }}>
                💰 Стоимость услуги: {selectedServiceObj.price.toLocaleString()} ₽
              </div>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Выберите дату:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
              min={minDate}
              max={maxDate}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
                fontSize: "1rem",
              }}
            />
          </div>

          {selectedDate && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "12px", fontWeight: "600" }}>
                Выберите время (свободные слоты - фиолетовые, занятые - серые):
              </label>
              {availableSlots.length === 0 ? (
                <p style={{ color: "#ff6b6b", textAlign: "center", padding: "20px" }}>
                  Загрузка слотов...
                </p>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: "12px"
                }}>
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => slot.available && setSelectedSlot(slot)}
                      disabled={!slot.available}
                      style={{
                        padding: "15px 10px",
                        borderRadius: "12px",
                        border: selectedSlot?.hour === slot.hour 
                          ? "3px solid #764ba2" 
                          : "2px solid transparent",
                        background: !slot.available
                          ? "#e0e0e0"
                          : selectedSlot?.hour === slot.hour 
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                            : "linear-gradient(135deg, #a8b5ff 0%, #b8a5d6 100%)",
                        color: !slot.available ? "#999" : "white",
                        cursor: slot.available ? "pointer" : "not-allowed",
                        fontWeight: selectedSlot?.hour === slot.hour ? "700" : "600",
                        fontSize: "1rem",
                        transition: "all 0.3s",
                        boxShadow: slot.available && selectedSlot?.hour !== slot.hour
                          ? "0 2px 8px rgba(102, 126, 234, 0.3)"
                          : selectedSlot?.hour === slot.hour
                            ? "0 4px 15px rgba(118, 75, 162, 0.5)"
                            : "none",
                        transform: selectedSlot?.hour === slot.hour ? "scale(1.05)" : "scale(1)",
                        opacity: slot.available ? 1 : 0.5
                      }}
                      onMouseEnter={(e) => {
                        if (slot.available && selectedSlot?.hour !== slot.hour) {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (slot.available && selectedSlot?.hour !== slot.hour) {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
                        }
                      }}
                    >
                      {slot.time}
                      {!slot.available && (
                        <div style={{ fontSize: "0.7rem", marginTop: "2px" }}>Занято</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
            <button
              type="submit"
              disabled={loading || !selectedService || !selectedDate || !selectedSlot}
              style={{
                flex: 1,
                background: loading || !selectedService || !selectedDate || !selectedSlot
                  ? "#ccc"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "15px",
                borderRadius: "8px",
                cursor: loading || !selectedService || !selectedDate || !selectedSlot ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {loading ? "Загрузка..." : "Записаться"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: "#f0f0f0",
                color: "#333",
                border: "none",
                padding: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;