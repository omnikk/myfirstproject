from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi.staticfiles import StaticFiles
import os
import shutil
from fastapi import UploadFile, File
import models
import schemas
import database

# Создаем папку для загрузок
os.makedirs("uploads", exist_ok=True)

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Beauty Salon API")

# После создания app добавь:
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/salons/", response_model=List[schemas.Salon])
def read_salons(db: Session = Depends(get_db)):
    return db.query(models.Salon).all()

@app.get("/salons/{salon_id}", response_model=schemas.SalonWithMasters)
def read_salon(salon_id: int, db: Session = Depends(get_db)):
    salon = db.query(models.Salon).filter(models.Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon not found")
    return salon

@app.post("/salons/", response_model=schemas.Salon)
def create_salon(salon: schemas.SalonCreate, db: Session = Depends(get_db)):
    db_salon = models.Salon(**salon.dict())
    db.add(db_salon)
    db.commit()
    db.refresh(db_salon)
    return db_salon

@app.get("/masters/", response_model=List[schemas.Master])
def read_masters(salon_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Master)
    if salon_id:
        query = query.filter(models.Master.salon_id == salon_id)
    return query.all()

@app.get("/masters/{master_id}", response_model=schemas.Master)
def read_master(master_id: int, db: Session = Depends(get_db)):
    master = db.query(models.Master).filter(models.Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="Master not found")
    return master

@app.post("/masters/", response_model=schemas.Master)
def create_master(master: schemas.MasterCreate, db: Session = Depends(get_db)):
    db_master = models.Master(**master.dict())
    db.add(db_master)
    db.commit()
    db.refresh(db_master)
    return db_master

@app.get("/clients/", response_model=List[schemas.Client])
def read_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

@app.get("/clients/{client_id}", response_model=schemas.ClientProfile)
def read_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/appointments/", response_model=List[schemas.Appointment])
def read_appointments(client_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Appointment)
    if client_id:
        query = query.filter(models.Appointment.client_id == client_id)
    return query.all()

@app.post("/appointments/", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

# ==================== USERS ====================

@app.post("/register/", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    # Проверяем есть ли уже такой username
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    db_user = models.User(
        username=user.username,
        password=user.password,  # В реальном проекте хешировать!
        name=user.name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login/")
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Вход пользователя"""
    user = db.query(models.User).filter(
        models.User.username == credentials.username,
        models.User.password == credentials.password
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "role": user.role
    }

@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Получить пользователя по ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users/{user_id}/client")
def get_user_client(user_id: int, db: Session = Depends(get_db)):
    """Получить клиента по user_id"""
    client = db.query(models.Client).filter(models.Client.user_id == user_id).first()
    if not client:
        return None
    return client

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserBase, db: Session = Depends(get_db)):
    """Обновить профиль пользователя"""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.name = user.name
    db_user.username = user.username
    db_user.role = user.role
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/salons/{salon_id}", response_model=schemas.Salon)
def update_salon(salon_id: int, salon: schemas.SalonCreate, db: Session = Depends(get_db)):
    """Обновить салон"""
    db_salon = db.query(models.Salon).filter(models.Salon.id == salon_id).first()
    if not db_salon:
        raise HTTPException(status_code=404, detail="Salon not found")
    
    db_salon.name = salon.name
    db_salon.address = salon.address
    db_salon.lat = salon.lat
    db_salon.lon = salon.lon
    db_salon.photo_url = salon.photo_url
    
    db.commit()
    db.refresh(db_salon)
    return db_salon

@app.put("/masters/{master_id}", response_model=schemas.Master)
def update_master(master_id: int, master: schemas.MasterCreate, db: Session = Depends(get_db)):
    """Обновить мастера"""
    db_master = db.query(models.Master).filter(models.Master.id == master_id).first()
    if not db_master:
        raise HTTPException(status_code=404, detail="Master not found")
    
    db_master.name = master.name
    db_master.salon_id = master.salon_id
    db_master.specialization = master.specialization
    db_master.experience = master.experience
    db_master.photo_url = master.photo_url
    
    db.commit()
    db.refresh(db_master)
    return db_master

@app.get("/")
def root():
    return {"message": "Beauty Salon API is running!", "docs": "/docs"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """Загрузка файла"""
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "url": f"http://localhost:8080/uploads/{file.filename}"}