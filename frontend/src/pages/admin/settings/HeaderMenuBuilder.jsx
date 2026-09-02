import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, GripVertical, ChevronDown, ChevronUp, Trash2, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import apiClient from '../../../api/client';

// DRAGGABLE MENU ITEM COMPONENT
const SortableMenuItem = ({ item, allItems, onUpdate, onRemove, expandedId, setExpandedId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const isExpanded = expandedId === item.id;
  const isSubItem = item.parentId !== null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: isSubItem ? '2.5rem' : '0'
  };

  const parentOptions = allItems.filter(p => p.id !== item.id && p.parentId === null);

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-3 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-800/50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <GripVertical className="w-5 h-5" />
          </button>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
            {item.label || '(No Label)'} 
            {isSubItem && <span className="ml-2 text-xs font-normal text-zinc-500 italic">sub item</span>}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 font-medium hidden sm:block">Custom Link</span>
          <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1.5">URL</label>
            <input
               type="text"
               value={item.url}
               onChange={(e) => onUpdate(item.id, 'url', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1.5">Navigation Label</label>
            <input
               type="text"
               value={item.label}
               onChange={(e) => onUpdate(item.id, 'label', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1.5">Menu Parent</label>
          <select
             value={item.parentId || ''}
             onChange={(e) => onUpdate(item.id, 'parentId', e.target.value || null)}
            className="w-full sm:w-1/2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          >
            <option value="">No Parent (Top Level)</option>
            {parentOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Remove
          </button>
          <button onClick={() => setExpandedId(null)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Cancel
          </button>
        </div>
      </div>
    )}
    </div>
  );
}

const HeaderMenuBuilder = () => {
  const [items, setItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchMenu(); }, []);

  const flattenTree = (nestedArray, parentId = null) => {
    let flat = [];
    nestedArray.forEach(node => {
      flat.push({ id: node.id, label: node.label, type: node.type, url: node.url, parentId });
      if (node.children && node.children.length > 0) {
        flat = flat.concat(flattenTree(node.children, node.id));
      }
    });
    return flat;
  };

  const buildTree = (flatArray) => {
    let tree = [];
    let mappedArr = {};
    flatArray.forEach(arrElem => {
      mappedArr[arrElem.id] = { ...arrElem, children: [] };
    });
    flatArray.forEach(arrElem => {
      if (arrElem.parentId) {
        if (mappedArr[arrElem.parentId]) {
          mappedArr[arrElem.parentId].children.push(mappedArr[arrElem.id]);
        }
      } else {
        tree.push(mappedArr[arrElem.id]);
      }
    });

    const cleanTree = (nodes) => nodes.map(({ parentId, ...rest }) => ({
      ...rest,
      children: cleanTree(rest.children)
    }));
    return cleanTree(tree);
  };

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/cms/section/global_header_menu');
      const menuItems = res.data?.data?.content?.menuItems || [];
      setItems(flattenTree(menuItems));
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const nestedData = buildTree(items);
      await apiClient.put('/cms/section/global_header_menu', { 
         content: { menuItems: nestedData } 
       });
      setMessage({ type: 'success', text: 'Menu updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save menu.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    const newItem = {
      id: `item_${Date.now()}`,
      label: 'New Menu Item',
      type: 'custom',
      url: '/',
      parentId: null
    };
    setItems([...items, newItem]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id && item.parentId !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <LinkIcon className="w-5 h-5 text-blue-600" /> Header Menu Builder
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Drag items to reorder. Click to edit links or assign sub-menus.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleAdd} disabled={isLoading} className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2 disabled:opacity-70">
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button onClick={handleSave} disabled={isSaving || isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Menu
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[600px] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />} {message.text}
            </div>
          )}

          <div className="max-w-3xl">
            {items.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-10 text-center border border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-zinc-500 mb-4">Your menu is currently empty.</p>
                <button onClick={handleAdd} className="text-blue-600 font-semibold hover:underline">Add your first link</button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {items.map(item => (
                    <SortableMenuItem 
                      key={item.id} 
                      item={item} 
                      allItems={items}
                      onUpdate={handleUpdate} 
                      onRemove={handleRemove}
                      expandedId={expandedId}
                      setExpandedId={setExpandedId}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenuBuilder;