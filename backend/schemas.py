from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SalonBase(BaseModel):
    name: str
    address: str
    lat: Optional[float] = 55.751574
    lon: Optional[float] = 37.573856
    photo_url: Optional[str] = ""

class SalonCreate(SalonBase):
    pass

class Salon(SalonBase):
    id: int
    class Config:
        from_attributes = True

class MasterBase(BaseModel):
    name: str
    salon_id: int
    specialization: Optional[str] = "Парикмахер"
    experience: Optional[str] = "3+ года"
    photo_url: Optional[str] = ""
    hourly_rate: Optional[float] = 300.0

class MasterCreate(MasterBase):
    pass

class Master(MasterBase):
    id: int
    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    name: str
    phone: str
    salon_id: int
    user_id: Optional[int] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    master_id: int
    client_id: int
    start_time: datetime
    end_time: datetime
    service: str
    price: Optional[float] = 0.0
    status: Optional[str] = "confirmed"

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    class Config:
        from_attributes = True

class SalonWithMasters(Salon):
    masters: List[Master] = []

class AppointmentWithDetails(Appointment):
    master: Master
    
class ClientProfile(Client):
    appointments: List[AppointmentWithDetails] = []

class UserBase(BaseModel):
    username: str
    name: str
    role: Optional[str] = "client"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str