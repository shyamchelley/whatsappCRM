import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leadsReducer from './leadsSlice';
import pipelineReducer from './pipelineSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    pipeline: pipelineReducer,
    ui: uiReducer,
  },
});
