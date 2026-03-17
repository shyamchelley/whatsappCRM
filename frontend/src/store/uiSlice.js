import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [], modalOpen: false, modalData: null },
  reducers: {
    addToast(state, { payload }) {
      state.toasts.push({ id: Date.now(), ...payload });
    },
    removeToast(state, { payload }) {
      state.toasts = state.toasts.filter((t) => t.id !== payload);
    },
    openModal(state, { payload }) {
      state.modalOpen = true;
      state.modalData = payload;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.modalData = null;
    },
  },
});

export const { addToast, removeToast, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
