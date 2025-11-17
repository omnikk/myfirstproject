import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMasterById } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";

const MasterPage = () => {
  const { id } = useParams();
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMasterById(id)
      .then(data => setMaster(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Загрузка мастера...</p>;
  if (!master) return <p>Мастер не найден</p>;

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Мастер: {master.name}</h1>
        
        <div className="content">
          <div>
            <h2>Информация</h2>
            <p>Опыт работы: 5+ лет</p>
            <p>Специализация: Все виды стрижек</p>
          </div>
          
          <BookingForm 
            salonId={master.salon_id} 
            masterId={master.id}
            onSuccess={() => alert("Запись успешно создана!")}
          />
        </div>
        
        <Link to="/">← Назад на главную</Link>
      </div>
      <Footer />
    </div>
  );
};

export default MasterPage;