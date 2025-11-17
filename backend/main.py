from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, database

# Создаем таблицы
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Beauty Salon API")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==================== SALONS ====================

@app.get("/salons/", response_model=List[schemas.Salon])
def read_salons(db: Session = Depends(get_db)):
    """Получить все салоны"""
    return db.query(models.Salon).all()

@app.get("/salons/{salon_id}", response_model=schemas.SalonWithMasters)
def read_salon(salon_id: int, db: Session = Depends(get_db)):
    """Получить салон по ID с мастерами"""
    salon = db.query(models.Salon).filter(models.Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon not found")
    return salon

@app.post("/salons/", response_model=schemas.Salon)
def create_salon(salon: schemas.SalonCreate, db: Session = Depends(get_db)):
    """Создать новый салон"""
    db_salon = models.Salon(name=salon.name, address=salon.address)
    db.add(db_salon)
    db.commit()
    db.refresh(db_salon)
    return db_salon

# ==================== MASTERS ====================

@app.get("/masters/", response_model=List[schemas.Master])
def read_masters(salon_id: int = None, db: Session = Depends(get_db)):
    """Получить всех мастеров (опционально по salon_id)"""
    query = db.query(models.Master)
    if salon_id:
        query = query.filter(models.Master.salon_id == salon_id)
    return query.all()

@app.get("/masters/{master_id}", response_model=schemas.Master)
def read_master(master_id: int, db: Session = Depends(get_db)):
    """Получить мастера по ID"""
    master = db.query(models.Master).filter(models.Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="Master not found")
    return master

@app.post("/masters/", response_model=schemas.Master)
def create_master(master: schemas.MasterCreate, db: Session = Depends(get_db)):
    """Создать нового мастера"""
    db_master = models.Master(name=master.name, salon_id=master.salon_id)
    db.add(db_master)
    db.commit()
    db.refresh(db_master)
    return db_master

# ==================== CLIENTS ====================

@app.get("/clients/", response_model=List[schemas.Client])
def read_clients(db: Session = Depends(get_db)):
    """Получить всех клиентов"""
    return db.query(models.Client).all()

@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    """Создать нового клиента"""
    db_client = models.Client(
        name=client.name, 
        phone=client.phone, 
        salon_id=client.salon_id
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# ==================== APPOINTMENTS ====================

@app.get("/appointments/", response_model=List[schemas.Appointment])
def read_appointments(db: Session = Depends(get_db)):
    """Получить все записи"""
    return db.query(models.Appointment).all()

@app.post("/appointments/", response_model=schemas.Appointment)
def create_appointment(
    appointment: schemas.AppointmentCreate, 
    db: Session = Depends(get_db)
):
    """Создать новую запись"""
    db_appointment = models.Appointment(
        master_id=appointment.master_id,
        client_id=appointment.client_id,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        service=appointment.service
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

# Root endpoint
@app.get("/")
def root():
    return {"message": "Beauty Salon API is running!"}