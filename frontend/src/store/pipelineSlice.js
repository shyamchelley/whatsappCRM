import { createSlice } from '@reduxjs/toolkit';

const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState: { board: [], loading: false },
  reducers: {
    setBoard(state, { payload }) { state.board = payload; },
    setLoading(state, { payload }) { state.loading = payload; },
    moveCard(state, { payload: { leadId, fromStageId, toStageId } }) {
      const fromCol = state.board.find((s) => s.id === fromStageId);
      const toCol = state.board.find((s) => s.id === toStageId);
      if (!fromCol || !toCol) return;
      const cardIndex = fromCol.leads.findIndex((l) => l.id === leadId);
      if (cardIndex === -1) return;
      const [card] = fromCol.leads.splice(cardIndex, 1);
      card.stage_id = toStageId;
      toCol.leads.unshift(card);
    },
    revertMove(state, { payload: { leadId, fromStageId, toStageId } }) {
      // Undo optimistic update
      const fromCol = state.board.find((s) => s.id === toStageId);
      const toCol = state.board.find((s) => s.id === fromStageId);
      if (!fromCol || !toCol) return;
      const cardIndex = fromCol.leads.findIndex((l) => l.id === leadId);
      if (cardIndex === -1) return;
      const [card] = fromCol.leads.splice(cardIndex, 1);
      card.stage_id = fromStageId;
      toCol.leads.unshift(card);
    },
  },
});

export const { setBoard, setLoading, moveCard, revertMove } = pipelineSlice.actions;
export default pipelineSlice.reducer;
