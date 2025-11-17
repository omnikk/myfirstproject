const BASE_URL = "http://localhost:8080";

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

export const createAppointment = async (appointmentData) => {
  const res = await fetch(`${BASE_URL}/appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
  if (!res.ok) throw new Error("Ошибка при создании записи");
  return res.json();
};

export const fetchAppointments = async (clientId = null) => {
  const url = clientId 
    ? `${BASE_URL}/appointments/?client_id=${clientId}` 
    : `${BASE_URL}/appointments/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Ошибка при получении записей");
  return res.json();
};

export const createClient = async (clientData) => {
  const res = await fetch(`${BASE_URL}/clients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
  });
  if (!res.ok) throw new Error("Ошибка при создании клиента");
  return res.json();
};

export const fetchClientById = async (id) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`);
  if (!res.ok) throw new Error("Ошибка при получении клиента");
  return res.json();
};

// НОВАЯ ФУНКЦИЯ
export const fetchClientByUserId = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/client`);
  if (!res.ok) throw new Error("Ошибка при получении клиента");
  return res.json();
};