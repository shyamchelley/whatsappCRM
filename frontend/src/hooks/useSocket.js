import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '../socket';
import { upsertLead } from '../store/leadsSlice';
import { moveCard, setBoard } from '../store/pipelineSlice';
import { addToast } from '../store/uiSlice';

export default function useSocket() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('lead:new', ({ lead }) => {
      dispatch(upsertLead(lead));
      dispatch(addToast({ type: 'info', message: `New lead: ${lead.name || lead.phone}` }));
    });

    socket.on('lead:updated', ({ leadId, changes }) => {
      dispatch(upsertLead({ id: leadId, ...changes }));
    });

    socket.on('pipeline:card_moved', ({ leadId, fromStageId, toStageId }) => {
      dispatch(moveCard({ leadId, fromStageId, toStageId }));
    });

    socket.on('whatsapp:message', ({ leadId, message }) => {
      // Show toast only for inbound messages (message is an object from DB)
      if (typeof message === 'object' && message.direction === 'inbound') {
        dispatch(addToast({ type: 'info', message: `💬 WhatsApp from lead #${leadId}: "${message.body?.slice(0, 50)}"` }));
      }
    });

    socket.on('reminder:due', ({ reminder, lead }) => {
      dispatch(addToast({ type: 'warning', message: `⏰ Reminder: ${reminder.message} — ${lead.name || lead.phone}` }));
    });

    return () => {
      const s = getSocket();
      s?.off('lead:new');
      s?.off('lead:updated');
      s?.off('pipeline:card_moved');
      s?.off('whatsapp:message');
      s?.off('reminder:due');
    };
  }, [token, dispatch]);
}
