import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMessages, sendMessage } from '../../api/whatsapp.api';
import { formatDateTime } from '../../utils/formatters';
import { getSocket } from '../../socket';

export default function WhatsAppChat({ leadId, leadPhone }) {
  const currentUser = useSelector((s) => s.auth.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getMessages(leadId)
      .then(({ data }) => setMessages(data))
      .catch(() => setError('Failed to load messages'))
      .finally(() => setLoading(false));
  }, [leadId]);

  // Real-time: listen for incoming messages on this lead
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    function onMessage({ leadId: incomingLeadId, message }) {
      if (String(incomingLeadId) !== String(leadId)) return;
      if (typeof message === 'object') {
        setMessages((prev) => {
          // Avoid duplicate if already present
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    }

    socket.on('whatsapp:message', onMessage);
    return () => socket.off('whatsapp:message', onMessage);
  }, [leadId]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');
    try {
      const { data } = await sendMessage(leadId, text.trim());
      setMessages((prev) => [...prev, data]);
      setText('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send message';
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Loading conversation...</p>;

  return (
    <div className="flex flex-col h-[480px]">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200 mb-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.843L.057 23.5l5.82-1.527A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.5-5.228-1.375l-.374-.221-3.884 1.02 1.04-3.79-.242-.39C2.497 15.71 2 13.916 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
          <p className="text-xs text-gray-400">{leadPhone}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            No messages yet. Send one to start the conversation.
          </div>
        )}

        {messages.map((msg) => {
          const isOutbound = msg.direction === 'outbound';
          return (
            <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isOutbound
                  ? 'bg-green-500 text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                <div className={`flex items-center gap-1 mt-1 ${isOutbound ? 'justify-end' : ''}`}>
                  <span className={`text-xs ${isOutbound ? 'text-green-100' : 'text-gray-400'}`}>
                    {formatDateTime(msg.created_at)}
                  </span>
                  {isOutbound && (
                    <span className="text-xs text-green-100">
                      {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
                {isOutbound && msg.sender_name && (
                  <p className="text-xs text-green-100 mt-0.5">{msg.sender_name}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {error && (
        <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}
      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 flex items-center justify-center shrink-0 transition-colors"
        >
          <svg className="w-4 h-4 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
