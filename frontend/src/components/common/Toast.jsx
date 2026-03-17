import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/uiSlice';
import { useEffect } from 'react';

const TYPE_STYLES = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  error: 'bg-red-600',
};

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), 4500);
    return () => clearTimeout(t);
  }, [toast.id, dispatch]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-sm ${TYPE_STYLES[toast.type] || TYPE_STYLES.info}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-white/70 hover:text-white ml-2 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((s) => s.ui.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
