import client from './client';

export const getLeads = (params) => client.get('/leads', { params });
export const getLead = (id) => client.get(`/leads/${id}`);
export const createLead = (data) => client.post('/leads', data);
export const updateLead = (id, data) => client.patch(`/leads/${id}`, data);
export const deleteLead = (id) => client.delete(`/leads/${id}`);
export const moveStage = (id, stage_id) => client.patch(`/leads/${id}/stage`, { stage_id });
export const getActivities = (id) => client.get(`/leads/${id}/activities`);
export const getNotes = (id) => client.get(`/leads/${id}/notes`);
export const createNote = (id, content) => client.post(`/leads/${id}/notes`, { content });
export const updateNote = (id, noteId, content) => client.patch(`/leads/${id}/notes/${noteId}`, { content });
export const deleteNote = (id, noteId) => client.delete(`/leads/${id}/notes/${noteId}`);
export const getReminders = (id) => client.get(`/leads/${id}/reminders`);
export const createReminder = (id, data) => client.post(`/leads/${id}/reminders`, data);
export const updateReminder = (id, remId, data) => client.patch(`/leads/${id}/reminders/${remId}`, data);
export const deleteReminder = (id, remId) => client.delete(`/leads/${id}/reminders/${remId}`);
