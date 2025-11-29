import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [financialOverview, setFinancialOverview] = useState(null);
  const [revenueBySalon, setRevenueBySalon] = useState([]);
  const [revenueByService, setRevenueByService] = useState([]);
  const [masterEarnings, setMasterEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [period, setPeriod] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Пожалуйста, войдите в систему!");
      navigate("/");
      return;
    }

    const userData = JSON.parse(savedUser);
    
    if (userData.role !== "admin") {
      alert("Доступ запрещен! Требуются права администратора.");
      navigate("/");
      return;
    }
    
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, period, customStart, customEnd]);

  const getDateRange = () => {
    const now = new Date();
    let start = null;
    let end = null;

    switch(period) {
      case "today":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "yesterday":
        start = new Date(now.setDate(now.getDate() - 1));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        start = new Date(now.setDate(now.getDate() - 7));
        end = new Date();
        break;
      case "month":
        start = new Date(now.setMonth(now.getMonth() - 1));
        end = new Date();
        break;
      case "year":
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        end = new Date();
        break;
      case "custom":
        if (customStart && customEnd) {
          start = new Date(customStart);
          end = new Date(customEnd);
        }
        break;
      default:
        return { start: null, end: null };
    }

    return {
      start: start ? start.toISOString() : null,
      end: end ? end.toISOString() : null
    };
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();
      const params = new URLSearchParams();
      if (start) params.append('start_date', start);
      if (end) params.append('end_date', end);
      const queryString = params.toString();

      const [overviewRes, financialRes, revenueSalonRes, revenueServiceRes, earningsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/analytics/overview`),
        fetch(`http://localhost:8080/api/analytics/filtered-overview?${queryString}`),
        fetch(`http://localhost:8080/api/analytics/filtered-revenue-by-salon?${queryString}`),
        fetch(`http://localhost:8080/api/analytics/filtered-revenue-by-service?${queryString}`),
        fetch(`http://localhost:8080/api/analytics/filtered-master-earnings?${queryString}`)
      ]);

      setOverview(await overviewRes.json());
      setFinancialOverview(await financialRes.json());
      setRevenueBySalon(await revenueSalonRes.json());
      setRevenueByService(await revenueServiceRes.json());
      setMasterEarnings(await earningsRes.json());
    } catch (err) {
      console.error("Ошибка загрузки аналитики:", err);
      alert("Ошибка при загрузке данных аналитики");
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = () => {
    window.open("http://localhost:8080/api/analytics/export-csv", "_blank");
  };

  const handleExportFinancial = () => {
    window.open("http://localhost:8080/api/analytics/export-financial-csv", "_blank");
  };

  const handleExportMasters = () => {
    window.open("http://localhost:8080/api/analytics/export-masters-csv", "_blank");
  };

  const handleExportServices = () => {
    window.open("http://localhost:8080/api/analytics/export-services-csv", "_blank");
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading"><p>Загрузка аналитики...</p></div>
        <Footer />
      </div>
    );
  }

  if (!user || !overview || !financialOverview) return null;

  return (
    <div className="app">
      <Header />
      
      <div className="container">
        <div className="content">
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '40px',
            borderRadius: '15px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <h1>Панель администратора</h1>
            <p style={{fontSize: '1.1rem', marginTop: '10px', marginBottom: '20px'}}>
              Аналитика и статистика сети салонов красоты
            </p>
            
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px'}}>
                <button onClick={() => setPeriod("all")} style={{
                  background: period === "all" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "all" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Все время</button>
                <button onClick={() => setPeriod("today")} style={{
                  background: period === "today" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "today" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Сегодня</button>
                <button onClick={() => setPeriod("yesterday")} style={{
                  background: period === "yesterday" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "yesterday" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Вчера</button>
                <button onClick={() => setPeriod("week")} style={{
                  background: period === "week" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "week" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Неделя</button>
                <button onClick={() => setPeriod("month")} style={{
                  background: period === "month" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "month" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Месяц</button>
                <button onClick={() => setPeriod("year")} style={{
                  background: period === "year" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "year" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Год</button>
                <button onClick={() => setPeriod("custom")} style={{
                  background: period === "custom" ? 'white' : 'rgba(255,255,255,0.3)',
                  color: period === "custom" ? '#667eea' : 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>Свой период</button>
              </div>

              {period === "custom" && (
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              )}
            </div>

            <button onClick={handleExportAll} style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              Экспорт всех данных в CSV
            </button>
          </div>

          <h2 style={{color: '#667eea', marginBottom: '20px'}}>Основные показатели</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div className="metric-card">
              <div className="metric-value">{overview.total_salons}</div>
              <div className="metric-label">Салонов</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{overview.total_masters}</div>
              <div className="metric-label">Мастеров</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{overview.total_clients}</div>
              <div className="metric-label">Клиентов</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{overview.total_appointments}</div>
              <div className="metric-label">Всего записей</div>
            </div>
          </div>

          <h2 style={{color: '#28a745', marginBottom: '20px', marginTop: '50px'}}>
            Финансовая статистика {period !== "all" && `(${period === "today" ? "Сегодня" : period === "yesterday" ? "Вчера" : period === "week" ? "7 дней" : period === "month" ? "30 дней" : period === "year" ? "Год" : "Свой период"})`}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div className="financial-card">
              <div className="financial-value">{financialOverview.total_revenue.toLocaleString()} </div>
              <div className="financial-label">Выручка</div>
            </div>
            <div className="financial-card">
              <div className="financial-value">{financialOverview.total_appointments}</div>
              <div className="financial-label">Записей</div>
            </div>
            <div className="financial-card">
              <div className="financial-value">{financialOverview.average_check.toLocaleString()} </div>
              <div className="financial-label">Средний чек</div>
            </div>
            <div className="financial-card" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'}}>
              <div className="financial-value">{financialOverview.cancelled_count}</div>
              <div className="financial-label">Отменено</div>
            </div>
            <div className="financial-card" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'}}>
              <div className="financial-value">{financialOverview.cancelled_revenue.toLocaleString()}  </div>
              <div className="financial-label">Потери</div>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{color: '#28a745', margin: 0}}>Выручка по салонам</h2>
            <button onClick={handleExportFinancial} style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>CSV</button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {revenueBySalon.map((salon, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h3 style={{color: '#28a745', marginBottom: '15px', fontSize: '1.1rem'}}>
                  {salon.salon_name}
                </h3>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#28a745', marginBottom: '10px'}}>
                  {salon.revenue.toLocaleString()}  
                </div>
                <div style={{color: '#666', fontSize: '0.9rem'}}>
                  {salon.appointments_count} записей
                </div>
              </div>
            ))}
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{color: '#28a745', margin: 0}}>Выручка по услугам</h2>
            <button onClick={handleExportServices} style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>CSV</button>
          </div>
          
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '40px',
            border: '2px solid #f0f0f0'
          }}>
            {revenueByService.slice(0, 10).map((item, index) => {
              const maxRevenue = revenueByService[0]?.revenue || 1;
              const percentage = (item.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} style={{marginBottom: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{fontWeight: '600'}}>{item.service}</span>
                    <span style={{color: '#28a745', fontWeight: '600'}}>
                      {item.revenue.toLocaleString()}   ({item.count} записей)
                    </span>
                  </div>
                  <div style={{background: '#f0f0f0', borderRadius: '10px', height: '12px', overflow: 'hidden'}}>
                    <div style={{
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      width: `${percentage}%`,
                      height: '100%',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{color: '#28a745', margin: 0}}>Доходы мастеров</h2>
            <button onClick={handleExportMasters} style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>CSV</button>
          </div>
          
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '40px',
            border: '2px solid #f0f0f0',
            overflowX: 'auto'
          }}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #f0f0f0'}}>
                  <th style={{padding: '15px', textAlign: 'left', color: '#28a745'}}>Мастер</th>
                  <th style={{padding: '15px', textAlign: 'left', color: '#28a745'}}>Салон</th>
                  <th style={{padding: '15px', textAlign: 'right', color: '#28a745'}}>Ставка/час</th>
                  <th style={{padding: '15px', textAlign: 'right', color: '#28a745'}}>Записей</th>
                  <th style={{padding: '15px', textAlign: 'right', color: '#28a745'}}>Выручка</th>
                  <th style={{padding: '15px', textAlign: 'right', color: '#28a745'}}>Зарплата</th>
                </tr>
              </thead>
              <tbody>
                {masterEarnings.slice(0, 15).map((master, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: index < 3 ? '#e8f5e9' : 'transparent'
                  }}>
                    <td style={{padding: '15px', fontWeight: '600'}}>{master.master_name}</td>
                    <td style={{padding: '15px', color: '#666'}}>{master.salon_name}</td>
                    <td style={{padding: '15px', textAlign: 'right'}}>{master.hourly_rate}  </td>
                    <td style={{padding: '15px', textAlign: 'right'}}>{master.appointments_count}</td>
                    <td style={{padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#28a745'}}>
                      {master.total_revenue.toLocaleString()}  
                    </td>
                    <td style={{padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#667eea'}}>
                      {master.master_earnings.toLocaleString()}  
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Footer />

      <style>{`
        .metric-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 30px;
          borderRadius: 15px;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .metric-label {
          color: #666;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .financial-card {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
          color: white;
        }
        
        .financial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(40,167,69,0.3);
        }
        
        .financial-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .financial-label {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;