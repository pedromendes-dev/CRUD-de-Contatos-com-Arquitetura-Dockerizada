const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const checkOk = (r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
  return r;
};

export const getContacts = () => fetch(`${BASE_URL}/contacts`).then(checkOk).then(r => r.json());
export const getContact = (id) => fetch(`${BASE_URL}/contacts/${id}`).then(checkOk).then(r => r.json());
export const createContact = (data) => fetch(`${BASE_URL}/contacts`, {
  method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
}).then(checkOk).then(r => r.json());
export const updateContact = (id, data) => fetch(`${BASE_URL}/contacts/${id}`, {
  method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
}).then(checkOk).then(r => r.json());
export const deleteContact = (id) => fetch(`${BASE_URL}/contacts/${id}`, { method: 'DELETE' }).then(checkOk);
