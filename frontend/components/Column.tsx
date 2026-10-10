"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KeyboardEvent, useState } from "react";
import type { Column as ColumnType } from "@/lib/types";
import { AddCardForm } from "./AddCardForm";
import { KanbanCard } from "./KanbanCard";

type ColumnProps = {
  column: ColumnType;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
};

export function Column({
  column,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  function saveTitle() {
    onRename(column.id, editTitle);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") saveTitle();
    if (event.key === "Escape") {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  }

  return (
    <div
      data-testid={`column-${column.id}`}
      className="flex w-72 shrink-0 flex-col rounded-xl bg-gray-50/80 shadow-sm"
    >
      <div className="border-t-4 border-[var(--accent-yellow)] rounded-t-xl px-4 pt-4">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleKeyDown}
            data-testid={`column-title-input-${column.id}`}
            className="w-full rounded border border-[var(--blue-primary)] bg-white px-2 py-1 text-sm font-semibold text-[var(--dark-navy)] outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            data-testid={`column-title-${column.id}`}
            onClick={() => {
              setEditTitle(column.title);
              setIsEditing(true);
            }}
            className="w-full text-left text-sm font-semibold text-[var(--dark-navy)] transition-colors hover:text-[var(--blue-primary)]"
          >
            {column.title}
          </button>
        )}
        <p className="mt-1 text-xs text-[var(--gray-text)]">
          {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-1 flex-col gap-2 px-3 pb-3 pt-2 transition-colors ${
          isOver ? "bg-[var(--accent-yellow)]/10" : ""
        }`}
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        <AddCardForm columnId={column.id} onAdd={onAddCard} />
      </div>
    </div>
  );
}
