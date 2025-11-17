from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Schemas для Salon
class SalonBase(BaseModel):
    name: str
    address: str

class SalonCreate(SalonBase):
    pass

class Salon(SalonBase):
    id: int
    
    class Config:
        from_attributes = True

# Schemas для Master
class MasterBase(BaseModel):
    name: str
    salon_id: int

class MasterCreate(MasterBase):
    pass

class Master(MasterBase):
    id: int
    
    class Config:
        from_attributes = True

# Schemas для Client
class ClientBase(BaseModel):
    name: str
    phone: str
    salon_id: int

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    
    class Config:
        from_attributes = True

# Schemas для Appointment
class AppointmentBase(BaseModel):
    master_id: int
    client_id: int
    start_time: datetime
    end_time: datetime
    service: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    
    class Config:
        from_attributes = True

# Расширенные schemas с вложенными данными
class SalonWithMasters(Salon):
    masters: List[Master] = []