const BASE_URL = "http://localhost:8000";

// Salons
export const fetchSalons = async () => {
  const res = await fetch(`${BASE_URL}/salons/`);
  if (!res.ok) throw new Error("Ошибка при получении салонов");
  return res.json();
};

export const fetchSalonById = async (id) => {
  const res = await fetch(`${BASE_URL}/salons/${id}`);
  if (!res.ok) throw new Error("Ошибка при получении салона");
  return res.json();
};

// Masters
export const fetchMasters = async (salonId = null) => {
  const url = salonId 
    ? `${BASE_URL}/masters/?salon_id=${salonId}` 
    : `${BASE_URL}/masters/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Ошибка при получении мастеров");
  return res.json();
};

export const fetchMasterById = async (id) => {
  const res = await fetch(`${BASE_URL}/masters/${id}`);
  if (!res.ok) throw new Error("Ошибка при получении мастера");
  return res.json();
};

// Appointments
export const createAppointment = async (appointmentData) => {
  const res = await fetch(`${BASE_URL}/appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
  if (!res.ok) throw new Error("Ошибка при создании записи");
  return res.json();
};

// Clients
export const createClient = async (clientData) => {
  const res = await fetch(`${BASE_URL}/clients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
  });
  if (!res.ok) throw new Error("Ошибка при создании клиента");
  return res.json();
};