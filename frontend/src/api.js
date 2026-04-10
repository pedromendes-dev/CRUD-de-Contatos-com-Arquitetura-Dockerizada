const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const checkOk = (r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
  return r;
};

// Maps frontend Portuguese field names to the backend English API shape
const toApi = (data, id) => ({
  ...(id !== undefined && id !== null ? { id } : {}),
  name: data.nome || '',
  email: data.email || '',
  phone: data.telefone || '',
  address: data.endereco || '',
});

// Maps backend English field names to the frontend Portuguese shape
const fromApi = ({ id, name, email, phone, address }) => ({
  id,
  nome: name || '',
  email: email || '',
  telefone: phone || '',
  endereco: address || '',
});

export const getContacts = () =>
  fetch(`${BASE_URL}/contacts`).then(checkOk).then(r => r.json()).then(list => list.map(fromApi));

export const getContact = (id) =>
  fetch(`${BASE_URL}/contacts/${id}`).then(checkOk).then(r => r.json()).then(fromApi);

export const createContact = (data) =>
  fetch(`${BASE_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(data)),
  }).then(checkOk).then(r => r.json()).then(fromApi);

export const updateContact = (id, data) =>
  fetch(`${BASE_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(data, id)),
  }).then(checkOk);

export const deleteContact = (id) =>
  fetch(`${BASE_URL}/contacts/${id}`, { method: 'DELETE' }).then(checkOk);
