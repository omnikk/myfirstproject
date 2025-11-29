from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta
import random

models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        if db.query(models.Salon).count() > 0:
            print("База данных уже содержит данные!")
            return
        
        print("Создание пользователей...")
        
        admin = models.User(username="admin", password="admin", name="Администратор", role="admin")
        db.add(admin)
        user1 = models.User(username="maria", password="12345", name="Мария Иванова", role="client")
        db.add(user1)
        user2 = models.User(username="ivan", password="12345", name="Иван Петров", role="client")
        db.add(user2)
        
        db.commit()
        print("Создано 3 пользователя")
        
        print("Создание салонов...")
        
        salons_data = [
            {"name": "Салон красоты 'Эльза'", "address": "ул. Тверская, д. 12", "lat": 55.764276, "lon": 37.606831, "photo_url": "https://delosmelo.ru/files/images/331169af67b00ca0d328700849e72994.jpg"},
            {"name": "Beauty Studio 'Жасмин'", "address": "Кутузовский проспект, д. 5", "lat": 55.752004, "lon": 37.566833, "photo_url": "https://www.equipnet.ru/netcat_files/userfiles/52079/Salon_krasoty/004.jpg"},
            {"name": "Салон 'Magnolia'", "address": "ул. Арбат, д. 20", "lat": 55.750584, "lon": 37.588039, "photo_url": "https://s.dirsalona.ru/images/raspolojenie-salona-krasoty11.jpg"},
            {"name": "SPA-центр 'Релакс'", "address": "Ленинский проспект, д. 45", "lat": 55.706892, "lon": 37.584573, "photo_url": "https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/441913/JobDbImWpMBqKKZCgQykoQ.jpg"}
        ]
        
        salons = []
        for salon_data in salons_data:
            salon = models.Salon(**salon_data)
            db.add(salon)
            salons.append(salon)
        
        db.commit()
        print(f"Создано {len(salons)} салонов")
        
        print("Создание мастеров...")
        
        masters_data = [
    {
        "name": "Анна Иванова", 
        "hourly_rate": 350.0,
        "photo_url": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400"
    },
    {
        "name": "Мария Петрова", 
        "hourly_rate": 320.0,
        "photo_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400"
    },
    {
        "name": "Елена Сидорова", 
        "hourly_rate": 400.0,
        "photo_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400"
    },
    {
        "name": "Ольга Смирнова", 
        "hourly_rate": 280.0,
        "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    },
    {
        "name": "Татьяна Козлова", 
        "hourly_rate": 300.0,
        "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    {
        "name": "Наталья Волкова", 
        "hourly_rate": 380.0,
        "photo_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400"
    },
    {
        "name": "Ирина Соколова", 
        "hourly_rate": 290.0,
        "photo_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    {
        "name": "Екатерина Морозова", 
        "hourly_rate": 330.0,
        "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    }
]
        
        masters = []
        for i, salon in enumerate(salons):
            for j in range(2):
                master_index = i * 2 + j
                if master_index < len(masters_data):
                    master = models.Master(
                        name=masters_data[master_index]["name"],
                        salon_id=salon.id,
                        specialization="Парикмахер-стилист",
                        experience="5+ лет опыта",
                        photo_url=masters_data[master_index]["photo_url"],  # Теперь берется из данных
                        hourly_rate=masters_data[master_index]["hourly_rate"]
                    )
                    db.add(master)
                    masters.append(master)

        db.commit()
        print(f"Создано {len(masters)} мастеров")
        
        print("Создание клиентов...")
        
        client1 = models.Client(name=user1.name, phone="+7 (999) 111-11-11", salon_id=salons[0].id, user_id=user1.id)
        db.add(client1)
        client2 = models.Client(name=user2.name, phone="+7 (999) 222-22-22", salon_id=salons[1].id, user_id=user2.id)
        db.add(client2)
        
        additional_clients = [
            {"name": "Анна Сергеева", "phone": "+7 (999) 333-33-33", "salon_id": salons[0].id},
            {"name": "Ольга Николаева", "phone": "+7 (999) 444-44-44", "salon_id": salons[1].id},
            {"name": "Екатерина Павлова", "phone": "+7 (999) 555-55-55", "salon_id": salons[2].id},
            {"name": "Татьяна Романова", "phone": "+7 (999) 666-66-66", "salon_id": salons[3].id},
            {"name": "Наталья Белова", "phone": "+7 (999) 777-77-77", "salon_id": salons[0].id},
            {"name": "Виктория Зайцева", "phone": "+7 (999) 888-88-88", "salon_id": salons[1].id},
            {"name": "Алиса Кузнецова", "phone": "+7 (999) 999-99-99", "salon_id": salons[2].id},
            {"name": "Дарья Морозова", "phone": "+7 (998) 111-11-11", "salon_id": salons[0].id},
            {"name": "София Новикова", "phone": "+7 (998) 222-22-22", "salon_id": salons[1].id},
            {"name": "Юлия Васильева", "phone": "+7 (998) 333-33-33", "salon_id": salons[2].id},
        ]
        
        clients = [client1, client2]
        for client_data in additional_clients:
            client = models.Client(**client_data, user_id=None)
            db.add(client)
            clients.append(client)
        
        db.commit()
        print(f"Создано {len(clients)} клиентов")
        
        print("Создание записей...")
        
        services_prices = {
            "Стрижка": 1500,
            "Окрашивание": 3500,
            "Укладка": 1200,
            "Маникюр": 1800,
            "Педикюр": 2000,
            "SPA-уход": 4500,
            "Мелирование": 4000,
            "Химическая завивка": 5000,
            "Кератиновое выпрямление": 6000
        }
        
        statuses = ["confirmed", "confirmed", "confirmed", "confirmed", "cancelled"]
        
        appointments = []
        base_date = datetime.now()
        
        for day_offset in range(-30, 30):
            current_date = base_date + timedelta(days=day_offset)
            num_appointments = random.randint(3, 7)
            
            for _ in range(num_appointments):
                hour = random.randint(9, 19)
                start_time = current_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                end_time = start_time + timedelta(hours=1)
                service = random.choice(list(services_prices.keys()))
                
                appointment = models.Appointment(
                    master_id=random.choice(masters).id,
                    client_id=random.choice(clients).id,
                    start_time=start_time,
                    end_time=end_time,
                    service=service,
                    price=services_prices[service],
                    status=random.choice(statuses)
                )
                db.add(appointment)
                appointments.append(appointment)
        
        db.commit()
        print(f"Создано {len(appointments)} записей")
        
        print("\nБаза данных успешно заполнена!")
        print(f"\nТестовые аккаунты:")
        print(f"   Админ: admin / admin")
        print(f"   Клиент 1: maria / 12345")
        print(f"   Клиент 2: ivan / 12345")
        print(f"\nСтатистика:")
        print(f"   Салонов: {len(salons)}")
        print(f"   Мастеров: {len(masters)}")
        print(f"   Клиентов: {len(clients)}")
        print(f"   Записей: {len(appointments)}")
        
    except Exception as e:
        print(f"Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Запуск заполнения базы данных...")
    seed_database()