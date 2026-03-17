import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { moveCard, revertMove } from '../../store/pipelineSlice';
import { moveStage } from '../../api/leads.api';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

export default function KanbanBoard({ board }) {
  const dispatch = useDispatch();
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function findStageByLeadId(leadId) {
    return board.find((stage) => stage.leads.some((l) => l.id === leadId));
  }

  function handleDragStart({ active }) {
    const stage = findStageByLeadId(active.id);
    const lead = stage?.leads.find((l) => l.id === active.id);
    setActiveCard(lead || null);
  }

  async function handleDragEnd({ active, over }) {
    setActiveCard(null);
    if (!over || active.id === over.id) return;

    const fromStage = findStageByLeadId(active.id);
    // over.id could be a stage id or a lead id
    const toStage = board.find((s) => s.id === over.id) || findStageByLeadId(over.id);

    if (!fromStage || !toStage || fromStage.id === toStage.id) return;

    const leadId = active.id;
    const fromStageId = fromStage.id;
    const toStageId = toStage.id;

    // Optimistic update
    dispatch(moveCard({ leadId, fromStageId, toStageId }));

    try {
      await moveStage(leadId, toStageId);
    } catch {
      // Revert on failure
      dispatch(revertMove({ leadId, fromStageId, toStageId }));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.map((stage) => (
          <KanbanColumn key={stage.id} stage={stage} />
        ))}
      </div>

      <DragOverlay>
        {activeCard && <KanbanCard lead={activeCard} />}
      </DragOverlay>
    </DndContext>
  );
}
