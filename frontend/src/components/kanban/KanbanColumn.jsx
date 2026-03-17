import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ stage }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <h3 className="text-sm font-semibold text-gray-700">{stage.name}</h3>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          {stage.leads.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl p-2 space-y-2 transition-colors ${
          isOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300' : 'bg-gray-100'
        }`}
      >
        <SortableContext items={stage.leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {stage.leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {stage.leads.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-400">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
}
