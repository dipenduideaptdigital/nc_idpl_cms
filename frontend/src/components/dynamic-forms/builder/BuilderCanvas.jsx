import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableFieldItem from './SortableFieldItem';

const BuilderCanvas = ({ fields, activeFieldId, setActiveFieldId, removeField, onReorder, onDuplicate }) => {
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onReorder(arrayMove(fields, oldIndex, newIndex));
    }
  };

  if (fields.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-10 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Your form is empty.</p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Click fields from the left panel to add them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 group/canvas">
            {fields.map((field) => (
              <SortableFieldItem
                key={field.id}
                field={field}
                isActive={activeFieldId === field.id}
                onSelect={() => setActiveFieldId(field.id)}
                onRemove={removeField}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BuilderCanvas;