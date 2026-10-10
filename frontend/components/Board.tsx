"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useReducer, useState } from "react";
import { boardReducer } from "@/lib/board-reducer";
import { initialBoardState } from "@/lib/dummy-data";
import type { Card } from "@/lib/types";
import { Column } from "./Column";
import { KanbanCardOverlay } from "./KanbanCardOverlay";

function findColumnIdForCard(
  columns: typeof initialBoardState.columns,
  cardId: string,
): string | null {
  for (const column of columns) {
    if (column.cards.some((card) => card.id === cardId)) {
      return column.id;
    }
  }
  return null;
}

export function Board() {
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const cardId = String(event.active.id);
    for (const column of state.columns) {
      const card = column.cards.find((item) => item.id === cardId);
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);

    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const fromColumnId = findColumnIdForCard(state.columns, cardId);
    if (!fromColumnId) return;

    const overData = over.data.current;
    let toColumnId: string;
    let toIndex: number;

    if (overData?.type === "column") {
      toColumnId = overData.columnId as string;
      const targetColumn = state.columns.find(
        (column) => column.id === toColumnId,
      );
      toIndex = targetColumn?.cards.length ?? 0;
    } else {
      toColumnId =
        (overData?.columnId as string) ??
        findColumnIdForCard(state.columns, String(over.id)) ??
        "";
      if (!toColumnId) return;

      const targetColumn = state.columns.find(
        (column) => column.id === toColumnId,
      );
      if (!targetColumn) return;

      const overCardIndex = targetColumn.cards.findIndex(
        (card) => card.id === String(over.id),
      );
      toIndex = overCardIndex === -1 ? targetColumn.cards.length : overCardIndex;
    }

    if (fromColumnId === toColumnId) {
      const column = state.columns.find((item) => item.id === fromColumnId);
      if (!column) return;

      const fromIndex = column.cards.findIndex((card) => card.id === cardId);
      if (fromIndex === toIndex || fromIndex + 1 === toIndex) return;

      if (fromIndex < toIndex) {
        toIndex -= 1;
      }
    }

    dispatch({
      type: "MOVE_CARD",
      cardId,
      fromColumnId,
      toColumnId,
      toIndex,
    });
  }

  if (!mounted) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-[var(--blue-primary)]/20 bg-white px-6 py-5 shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--dark-navy)]">
            Project Board
          </h1>
          <p className="mt-1 text-sm text-[var(--gray-text)]">
            Drag cards between columns to track progress
          </p>
        </header>
        <div
          className="flex flex-1 items-center justify-center p-6 text-[var(--gray-text)]"
          data-testid="board-loading"
        >
          Loading board...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-[var(--blue-primary)]/20 bg-white px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--dark-navy)]">
          Project Board
        </h1>
        <p className="mt-1 text-sm text-[var(--gray-text)]">
          Drag cards between columns to track progress
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="flex flex-1 gap-4 overflow-x-auto p-6"
          data-testid="board"
        >
          {state.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={(columnId, title) =>
                dispatch({ type: "RENAME_COLUMN", columnId, title })
              }
              onAddCard={(columnId, title, details) =>
                dispatch({ type: "ADD_CARD", columnId, title, details })
              }
              onDeleteCard={(columnId, cardId) =>
                dispatch({ type: "DELETE_CARD", columnId, cardId })
              }
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? <KanbanCardOverlay card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
