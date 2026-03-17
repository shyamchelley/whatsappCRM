import client from './client';

export const getStats = () => client.get('/dashboard/stats');
export const getBySource = () => client.get('/dashboard/by-source');
export const getByStage = () => client.get('/dashboard/by-stage');
export const getRecent = () => client.get('/dashboard/recent');
export const getReminders = () => client.get('/dashboard/reminders');
