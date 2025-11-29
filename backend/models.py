from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    role = Column(String, default="client")
    
    client = relationship("Client", back_populates="user", uselist=False)

class Salon(Base):
    __tablename__ = "salons"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    lat = Column(Float, default=55.751574)
    lon = Column(Float, default=37.573856)
    photo_url = Column(String, default="")

    masters = relationship("Master", back_populates="salon")
    clients = relationship("Client", back_populates="salon")

class Master(Base):
    __tablename__ = "masters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    salon_id = Column(Integer, ForeignKey("salons.id"))
    specialization = Column(String, default="Парикмахер")
    experience = Column(String, default="3+ года")
    photo_url = Column(String, default="")
    hourly_rate = Column(Float, default=300.0)

    salon = relationship("Salon", back_populates="masters")
    appointments = relationship("Appointment", back_populates="master")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    salon_id = Column(Integer, ForeignKey("salons.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    salon = relationship("Salon", back_populates="clients")
    appointments = relationship("Appointment", back_populates="client")
    user = relationship("User", back_populates="client")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    master_id = Column(Integer, ForeignKey("masters.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    service = Column(String)
    price = Column(Float, default=0.0)
    status = Column(String, default="confirmed")

    master = relationship("Master", back_populates="appointments")
    client = relationship("Client", back_populates="appointments")