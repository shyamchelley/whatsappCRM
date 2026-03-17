import client from './client';

export const getBoard = () => client.get('/pipeline/board');
export const getStages = () => client.get('/pipeline/stages');
export const createStage = (data) => client.post('/pipeline/stages', data);
export const updateStage = (id, data) => client.patch(`/pipeline/stages/${id}`, data);
export const deleteStage = (id) => client.delete(`/pipeline/stages/${id}`);
export const reorderStages = (ids) => client.patch('/pipeline/stages/reorder', { ids });
