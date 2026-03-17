import client from './client';

export const getMessages = (leadId) => client.get(`/whatsapp/${leadId}/messages`);
export const sendMessage = (leadId, text) => client.post(`/whatsapp/${leadId}/send`, { text });
