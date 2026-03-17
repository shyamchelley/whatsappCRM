import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

const leadsSlice = createSlice({
  name: 'leads',
  initialState: adapter.getInitialState({ loading: false, error: null }),
  reducers: {
    setLeads: adapter.setAll,
    upsertLead: adapter.upsertOne,
    removeLead: adapter.removeOne,
    setLoading(state, { payload }) { state.loading = payload; },
    setError(state, { payload }) { state.error = payload; },
  },
});

export const { setLeads, upsertLead, removeLead, setLoading, setError } = leadsSlice.actions;
export const leadsSelectors = adapter.getSelectors((s) => s.leads);
export default leadsSlice.reducer;
