const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getContacts = () => fetch(`${BASE_URL}/contacts`).then(r => r.json());
export const getContact = (id) => fetch(`${BASE_URL}/contacts/${id}`).then(r => r.json());
export const createContact = (data) => fetch(`${BASE_URL}/contacts`, {
  method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
}).then(r => r.json());
export const updateContact = (id, data) => fetch(`${BASE_URL}/contacts/${id}`, {
  method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
}).then(r => r.json());
export const deleteContact = (id) => fetch(`${BASE_URL}/contacts/${id}`, { method: 'DELETE' });
