import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { formatCurrency, timeAgo } from '../../utils/formatters';

const SOURCE_ICONS = { whatsapp: '💬', website: '🌐', manual: '✏️' };

export default function KanbanCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {lead.name || lead.phone}
          </p>
          {lead.name && <p className="text-xs text-gray-400 truncate">{lead.phone}</p>}
        </div>
        <span className="text-base shrink-0" title={lead.source}>{SOURCE_ICONS[lead.source] || '📋'}</span>
      </div>

      {lead.deal_value > 0 && (
        <p className="text-xs font-semibold text-indigo-600 mt-2">{formatCurrency(lead.deal_value)}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">{timeAgo(lead.updated_at)}</span>
        <Link to={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-indigo-500 hover:text-indigo-700">
          View →
        </Link>
      </div>
    </div>
  );
}
