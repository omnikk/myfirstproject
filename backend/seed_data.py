from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta

models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        if db.query(models.Salon).count() > 0:
            print("База данных уже содержит данные!")
            return
        
        # ========== СОЗДАЕМ ПОЛЬЗОВАТЕЛЕЙ ==========
        print("🚀 Создание пользователей...")
        
        admin = models.User(
            username="admin",
            password="admin",
            name="Администратор",
            role="admin"
        )
        db.add(admin)
        
        user1 = models.User(
            username="maria",
            password="12345",
            name="Мария Иванова",
            role="client"
        )
        db.add(user1)
        
        user2 = models.User(
            username="ivan",
            password="12345",
            name="Иван Петров",
            role="client"
        )
        db.add(user2)
        
        db.commit()
        print(f"✅ Создано 3 пользователя (admin/admin, maria/12345, ivan/12345)")
        
        # ========== СОЗДАЕМ САЛОНЫ ==========
        print("🏢 Создание салонов...")
        
        salons_data = [
            {
                "name": "Салон красоты 'Эльза'",
                "address": "ул. Тверская, д. 12",
                "lat": 55.764276,
                "lon": 37.606831,
                "photo_url": "https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"
            },
            {
                "name": "Beauty Studio 'Жасмин'",
                "address": "Кутузовский проспект, д. 5",
                "lat": 55.752004,
                "lon": 37.566833,
                "photo_url": "https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"
            },
            {
                "name": "Салон 'Magnolia'",
                "address": "ул. Арбат, д. 20",
                "lat": 55.750584,
                "lon": 37.588039,
                "photo_url": "https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"
            },
            {
                "name": "SPA-центр 'Релакс'",
                "address": "Ленинский проспект, д. 45",
                "lat": 55.706892,
                "lon": 37.584573,
                "photo_url": "https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"
            }
        ]
        
        salons = []
        for salon_data in salons_data:
            salon = models.Salon(**salon_data)
            db.add(salon)
            salons.append(salon)
        
        db.commit()
        print(f"✅ Создано {len(salons)} салонов")
        
        # ========== СОЗДАЕМ МАСТЕРОВ ==========
        print("👨‍🎨 Создание мастеров...")
        
        masters_names = [
            "Анна Иванова", "Мария Петрова", "Елена Сидорова",
            "Ольга Смирнова", "Татьяна Козлова", "Наталья Волкова",
            "Ирина Соколова", "Екатерина Морозова"
        ]
        
        masters = []
        for i, salon in enumerate(salons):
            for j in range(2):
                master_index = i * 2 + j
                if master_index < len(masters_names):
                    master = models.Master(
                        name=masters_names[master_index],
                        salon_id=salon.id,
                        specialization="Парикмахер-стилист",
                        experience="5+ лет опыта",
                        photo_url="https://med-rzn.ru/wp-content/uploads/2021/09/no_image-800x600-1.jpg"
                    )
                    db.add(master)
                    masters.append(master)
        
        db.commit()
        print(f"✅ Создано {len(masters)} мастеров")
        
        # ========== СОЗДАЕМ КЛИЕНТОВ (ПРИВЯЗАННЫХ К USERS) ==========
        print("👥 Создание клиентов...")
        
        client1 = models.Client(
            name=user1.name,
            phone="+7 (999) 111-11-11",
            salon_id=salons[0].id,
            user_id=user1.id
        )
        db.add(client1)
        
        client2 = models.Client(
            name=user2.name,
            phone="+7 (999) 222-22-22",
            salon_id=salons[1].id,
            user_id=user2.id
        )
        db.add(client2)
        
        # Клиент без аккаунта (старый формат)
        client3 = models.Client(
            name="Гость без аккаунта",
            phone="+7 (999) 333-33-33",
            salon_id=salons[0].id,
            user_id=None
        )
        db.add(client3)
        
        db.commit()
        print("✅ Создано 3 клиента")
        
        # ========== СОЗДАЕМ ЗАПИСИ ==========
        print("📅 Создание записей...")
        
        services = ["Стрижка", "Окрашивание", "Укладка", "Маникюр", "Педикюр"]
        appointments = []
        base_date = datetime.now() + timedelta(days=1)
        
        for i in range(10):
            appointment = models.Appointment(
                master_id=masters[i % len(masters)].id,
                client_id=[client1.id, client2.id, client3.id][i % 3],
                start_time=base_date + timedelta(hours=i),
                end_time=base_date + timedelta(hours=i+1),
                service=services[i % len(services)]
            )
            db.add(appointment)
            appointments.append(appointment)
        
        db.commit()
        print(f"✅ Создано {len(appointments)} записей")
        
        print("\n🎉 База данных успешно заполнена!")
        print("\n📝 ТЕСТОВЫЕ АККАУНТЫ:")
        print("   Админ: admin / admin")
        print("   Клиент 1: maria / 12345")
        print("   Клиент 2: ivan / 12345")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Запуск заполнения базы данных...")
    seed_database()