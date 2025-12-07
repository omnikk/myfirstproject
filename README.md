# ОПИСАНИЕ ПРОГРАММЫ

**Система управления салонами красоты**

Версия 1.0

Студент: Выборнов Олег Андреевич  
Группа: ЭФМО-02-25  
Дата: 29.11.2025

---

## 1. ОБЩИЕ СВЕДЕНИЯ

**Наименование:** Система управления салонами красоты

**Программное обеспечение:**
- Backend: Python 3.10+, FastAPI, SQLAlchemy, Uvicorn
- Frontend: Node.js 16+, React 18, Vite, React Router
- База данных: SQLite 3

---
**Запуск** 

- Склонировать репозиторий или скачать к себе
- Открыть два терминала или powershell окна
- В первом перейти в cd ..\project\backend
- Запустить сервер: python -m uvicorn main:app --reload --port 8080
- Во втором перейти в cd ..\project\frontend
- Ввести команду: npm run dev

---

## 2. ФУНКЦИОНАЛЬНОЕ НАЗНАЧЕНИЕ

Программа предназначена для автоматизации процессов управления сетью салонов красоты и решает следующие задачи:

- Управление записями клиентов к мастерам с выбором услуг, даты и времени
- Учет финансовых показателей салонов (выручка, средний чек, отмены)
- Аналитика по салонам, мастерам и услугам с фильтрацией по периодам
- Расчет заработной платы мастеров на основе почасовых ставок
- Экспорт отчетности в формат CSV
- Управление профилями пользователей с разделением прав доступа

**Функциональные ограничения:** Система рассчитана на работу с сетью до 50 салонов, 500 мастеров и 10000 клиентов. Максимальная глубина хранения истории записей - 2 года.

---

## 3. ОПИСАНИЕ ЛОГИЧЕСКОЙ СТРУКТУРЫ

**Архитектура:** Клиент-серверная архитектура с разделением на frontend и backend части.

### Backend (API-сервер):
- `models.py` - модели данных (User, Salon, Master, Client, Appointment)
- `schemas.py` - схемы валидации данных (Pydantic)
- `main.py` - маршруты REST API и обработчики запросов
- `analytics.py` - endpoints аналитики и экспорта данных
- `database.py` - подключение к БД и создание сессий

### Frontend (веб-приложение):
- `components/` - переиспользуемые React-компоненты (Header, Footer, BookingForm, SalonCard)
- `pages/` - страницы приложения (Home, SalonPage, MasterPage, Profile, AdminDashboard)
- `main.jsx` - точка входа, маршрутизация (React Router)

**Метод работы:** RESTful API с обменом данными в формате JSON. Frontend делает HTTP-запросы к Backend через fetch API. Аутентификация через localStorage. Данные хранятся в реляционной БД SQLite с использованием ORM SQLAlchemy.

### Связи между модулями:
- User (1) → (N) Client - один пользователь может быть клиентом в разных салонах
- Salon (1) → (N) Master - в салоне работают несколько мастеров
- Master (1) → (N) Appointment - у мастера множество записей
- Client (1) → (N) Appointment - клиент может иметь много записей

---

## 4. ИСПОЛЬЗУЕМЫЕ ТЕХНИЧЕСКИЕ СРЕДСТВА

### Минимальные требования к серверу:
- Процессор: 2 ядра, 2.0 ГГц
- Оперативная память: 2 ГБ
- Дисковое пространство: 500 МБ
- ОС: Windows 10/11, Linux (Ubuntu 20.04+), macOS 11+

### Требования к клиентской части:
- Веб-браузер: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Разрешение экрана: минимум 1280x720
- Интернет-соединение: стабильное подключение со скоростью от 1 Мбит/с

---

## 5. ВЫЗОВ И ЗАГРУЗКА

### Запуск Backend:
1. Установить зависимости: `pip install fastapi uvicorn sqlalchemy`
2. Инициализировать БД: `python seed_data.py`
3. Запустить сервер: `uvicorn main:app --reload --port 8080`

### Запуск Frontend:
1. Установить зависимости: `npm install`
2. Запустить dev-сервер: `npm run dev`

**Точки входа:** Главная страница (/) - список салонов, Страница салона (/salon/:id), Профиль пользователя (/profile), Панель администратора (/admin)

---

## 6. ВХОДНЫЕ ДАННЫЕ

### Основные типы входных данных:

**1. Регистрация/Аутентификация пользователя:**

Формат JSON:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**2. Создание записи к мастеру:**

Формат JSON:
```json
{
  "master_id": int,
  "client_id": int,
  "start_time": "ISO-datetime",
  "end_time": "ISO-datetime",
  "service": "string",
  "price": float,
  "status": "confirmed"
}
```

**Валидация:** Все входные данные проходят валидацию через Pydantic схемы. Обязательные поля: email (формат email), password (мин. 6 символов), даты (ISO формат), цены (положительные числа).

---

## 7. ВЫХОДНЫЕ ДАННЫЕ

### Основные типы выходных данных:

**1. Список салонов/мастеров:**

Формат JSON (массив):
```json
[
  {
    "id": int,
    "name": "string",
    "photo_url": "string"
  }
]
```

**2. Финансовая аналитика:**

Формат JSON:
```json
{
  "total_revenue": float,
  "total_appointments": int,
  "average_check": float,
  "cancelled_count": int
}
```

**3. Экспорт в CSV:**

Content-Type: `text/csv; charset=utf-8`

Формат: заголовки через запятую, данные построчно

Пример:

    "Салон,Выручка,Количество
    Салон 1,150000,45"

**4. Свободные слоты для записи:**

Формат JSON (массив):
```json
[
  {
    "time": "HH:00",
    "hour": int,
    "available": boolean
  }
]
```

### Тестовые данные:

Система содержит 4 салона, 8 мастеров, 12 клиентов и около 300 тестовых записей за период 60 дней. Услуги включают стрижки, окрашивание, маникюр, педикюр и др. с ценами от 1200₽ до 6000₽. Ставки мастеров варьируются от 280₽ до 400₽ в час.


database:
<img width="1593" height="480" alt="image" src="https://github.com/user-attachments/assets/57f11a29-6055-4602-bfe8-412a95d2eedd" />

Запуск:
<img width="1905" height="366" alt="image" src="https://github.com/user-attachments/assets/946a088b-3bff-480d-99f4-328c4afc61de" />

Главный экран:
<img width="1891" height="985" alt="image" src="https://github.com/user-attachments/assets/7e825fd0-34e6-4c44-8718-c463a5957d60" />
Салон можно выбрать как и с помощью карты(интерактивной) так и из списка.

При выборе салона попадаем на экран выбора специалиста:
<img width="676" height="586" alt="image" src="https://github.com/user-attachments/assets/d8b1febd-3f15-44b4-b13d-927b846ee2f8" />

После выбора специалиста, нужно выбрать Услугу и Дату, запись доступна на 30 дней вперед:
<img width="688" height="676" alt="image" src="https://github.com/user-attachments/assets/2e57b458-5617-4b73-a878-1a84792007c4" />

Перед этим нужно зарегестрироваться или авторизовасться, иначе не получится записаться, окно регистрации и авторизации: 
<img width="340" height="365" alt="image" src="https://github.com/user-attachments/assets/32db3282-2475-4bf5-b79c-7dee8efe4809" />
<img width="279" height="367" alt="image" src="https://github.com/user-attachments/assets/768a576e-add6-413c-8197-2ba1b0259cc5" />

Поcле успешной авторизации можно зайти на свой профиль:
<img width="629" height="786" alt="image" src="https://github.com/user-attachments/assets/d3b279bc-86f5-4831-80bc-9424c074b729" />

Здесь можно отредактировать свои личные данные:
<img width="679" height="310" alt="image" src="https://github.com/user-attachments/assets/c1886809-4762-4f98-986b-27ad85886a37" />

Также можно посмотреть историю своих посещений и повторно записаться:
<img width="581" height="870" alt="image" src="https://github.com/user-attachments/assets/cb1d5517-5809-49f0-a4c5-193e949a8358" />

При авторизации под админом admin\admin появляется возможность перейти нав вкладку аналитики:
<img width="644" height="823" alt="image" src="https://github.com/user-attachments/assets/8fb82579-e705-4d97-b6fe-317ec366bd2a" />
<img width="621" height="862" alt="image" src="https://github.com/user-attachments/assets/425a2a4e-9473-4167-a1e7-c639d7715c63" />

Есть возможность выгрузить любые данные за либой период в формате csv для дальнейшей обработки:
<img width="522" height="241" alt="image" src="https://github.com/user-attachments/assets/11722e31-fee4-49a1-9607-3b779f65400a" />









