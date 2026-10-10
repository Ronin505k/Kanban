import type { BoardAction, BoardState, Card } from "./types";

function createCardId(): string {
  return `card-${crypto.randomUUID()}`;
}

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case "RENAME_COLUMN": {
      const title = action.title.trim();
      if (!title) return state;

      return {
        columns: state.columns.map((column) =>
          column.id === action.columnId ? { ...column, title } : column,
        ),
      };
    }

    case "ADD_CARD": {
      const title = action.title.trim();
      if (!title) return state;

      const newCard = {
        id: createCardId(),
        title,
        details: action.details.trim(),
      };

      return {
        columns: state.columns.map((column) =>
          column.id === action.columnId
            ? { ...column, cards: [...column.cards, newCard] }
            : column,
        ),
      };
    }

    case "DELETE_CARD":
      return {
        columns: state.columns.map((column) =>
          column.id === action.columnId
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== action.cardId),
              }
            : column,
        ),
      };

    case "MOVE_CARD": {
      let movedCard: Card | undefined;

      const withoutCard = state.columns.map((column) => {
        const card = column.cards.find((item) => item.id === action.cardId);
        if (card) movedCard = card;

        return {
          ...column,
          cards: column.cards.filter((item) => item.id !== action.cardId),
        };
      });

      if (!movedCard) return state;

      return {
        columns: withoutCard.map((column) => {
          if (column.id !== action.toColumnId) return column;

          const insertIndex = Math.max(
            0,
            Math.min(action.toIndex, column.cards.length),
          );
          const cards = [
            ...column.cards.slice(0, insertIndex),
            movedCard!,
            ...column.cards.slice(insertIndex),
          ];

          return { ...column, cards };
        }),
      };
    }

    default:
      return state;
  }
}
