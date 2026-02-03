import React, { useState, useRef } from 'react';
import { Card } from '../../ui/Card.tsx';
import { Account, Category } from '../../../types.ts';
import { Check, X, Pencil, Archive, Trash2, RotateCcw } from 'lucide-react';

// Styling Constants (Reused for consistency)
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const inputBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';

export type ManageableItem = Account | Category;
export type ItemType = 'account' | 'incomeCategory' | 'expenseCategory';

interface ItemManagerProps {
    title: string;
    description?: string;
    items: ManageableItem[];
    itemType: ItemType;
    newItemPlaceholder: string;
    newNames: { [key: string]: string };
    handleNewNameChange: (type: ItemType, value: string) => void;
    handleAddItem: (type: ItemType) => void;
    handleUpdateItemName: (id: string, newName: string, type: ItemType) => void;
    handleArchiveItem: (id: string, type: ItemType) => void;
    handleRestoreItem: (id: string, type: ItemType) => void;
    handleDeleteItem: (id: string, name: string, type: ItemType) => void;
}

export const ItemManager: React.FC<ItemManagerProps> = ({
    title,
    description,
    items,
    itemType,
    newItemPlaceholder,
    newNames,
    handleNewNameChange,
    handleAddItem,
    handleUpdateItemName,
    handleArchiveItem,
    handleRestoreItem,
    handleDeleteItem
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const archivedContainerRef = useRef<HTMLDivElement>(null);

    const activeItems = items.filter(i => i.isActive);
    const inactiveItems = items.filter(i => !i.isActive);
    const nameKey = itemType;

    const startEditing = (item: ManageableItem) => {
        setEditingId(item.id);
        setEditingName(item.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
    };

    const saveEditing = () => {
        if (editingId && editingName.trim()) {
            handleUpdateItemName(editingId, editingName, itemType);
            cancelEditing();
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEditing();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <Card className="space-y-4">
            <h3 className="text-lg font-bold">{title}</h3>
            {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 -mt-2">{description}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeItems.map(item => (
                    <div key={item.id} className="p-2.5 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-1">
                        {editingId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="flex-grow w-0 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none p-0 m-0"
                                />
                                <button onClick={saveEditing} className="flex-shrink-0 text-neutral-500 hover:text-green-600 p-1 rounded-full focus:outline-none focus:ring-2" title="Guardar">
                                    <Check className="h-4 w-4" />
                                </button>
                                <button onClick={cancelEditing} className="flex-shrink-0 text-neutral-500 hover:text-red-600 p-1 rounded-full focus:outline-none focus:ring-2" title="Cancelar">
                                    <X className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                             <>
                                <span className="text-sm px-1 truncate flex-grow">{item.name}</span>
                                <button onClick={() => startEditing(item)} className="flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-blue-600 p-1 rounded-full" title={`Editar ${title.slice(0, -1)}`}>
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleArchiveItem(item.id, itemType)} className="flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-yellow-600 p-1 rounded-full" title={`Arquivar ${title.slice(0, -1)}`}>
                                    <Archive className="h-4 w-4" />
                                </button>
                                 <button onClick={() => handleDeleteItem(item.id, item.name, itemType)} className="flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-red-600 p-1 rounded-full" title={`Eliminar ${title.slice(0, -1)}`}>
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); handleAddItem(itemType); }}
              className="p-2.5 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newNames[nameKey]}
                  onChange={(e) => handleNewNameChange(nameKey, e.target.value)}
                  placeholder={newItemPlaceholder}
                  className={`${inputBase} flex-grow`}
                />
                <button
                  type="submit"
                  className={`${btnBase} ${btnSize} ${btnPrimary} w-full sm:w-auto`}
                >
                  Adicionar
                </button>
              </div>
            </form>
            {inactiveItems.length > 0 && (
                <div className="pt-4">
                    <button onClick={() => setShowArchived(!showArchived)} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:underline">
                        {showArchived ? 'Ocultar' : 'Ver'} {inactiveItems.length} {inactiveItems.length === 1 ? 'item arquivado' : 'itens arquivados'}
                    </button>
                    <div
                        ref={archivedContainerRef}
                        className="collapsible-content"
                        style={{ maxHeight: showArchived ? archivedContainerRef.current?.scrollHeight : 0 }}
                    >
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Itens Arquivados</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Estes itens estão escondidos de novos registos mas os seus dados históricos são mantidos.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {inactiveItems.map(item => (
                                    <div key={item.id} className="p-2.5 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 opacity-70">
                                        <span className="text-sm text-neutral-500 dark:text-neutral-400 italic">{item.name}</span>
                                        <button onClick={() => handleRestoreItem(item.id, itemType)} className="flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-500 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-500" title={`Restaurar ${title.slice(0, -1)}`}>
                                            <RotateCcw className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
};
