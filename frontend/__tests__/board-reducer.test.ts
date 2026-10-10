import { describe, expect, it } from "vitest";
import { boardReducer } from "@/lib/board-reducer";
import { initialBoardState } from "@/lib/dummy-data";
import type { BoardState } from "@/lib/types";

function getColumn(state: BoardState, columnId: string) {
  return state.columns.find((column) => column.id === columnId)!;
}

describe("boardReducer", () => {
  it("initial dummy data has 5 columns with cards", () => {
    expect(initialBoardState.columns).toHaveLength(5);
    expect(initialBoardState.columns.every((column) => column.cards.length > 0)).toBe(
      true,
    );
  });

  it("RENAME_COLUMN updates the column title", () => {
    const next = boardReducer(initialBoardState, {
      type: "RENAME_COLUMN",
      columnId: "col-1",
      title: "Ideas",
    });

    expect(getColumn(next, "col-1").title).toBe("Ideas");
  });

  it("RENAME_COLUMN ignores unknown columns", () => {
    const next = boardReducer(initialBoardState, {
      type: "RENAME_COLUMN",
      columnId: "col-missing",
      title: "Nope",
    });

    expect(next).toEqual(initialBoardState);
  });

  it("RENAME_COLUMN rejects empty titles", () => {
    const next = boardReducer(initialBoardState, {
      type: "RENAME_COLUMN",
      columnId: "col-1",
      title: "   ",
    });

    expect(next).toEqual(initialBoardState);
  });

  it("ADD_CARD appends a card to the target column", () => {
    const beforeCount = getColumn(initialBoardState, "col-2").cards.length;

    const next = boardReducer(initialBoardState, {
      type: "ADD_CARD",
      columnId: "col-2",
      title: "New task",
      details: "Some details",
    });

    const column = getColumn(next, "col-2");
    expect(column.cards).toHaveLength(beforeCount + 1);
    expect(column.cards.at(-1)).toMatchObject({
      title: "New task",
      details: "Some details",
    });
    expect(column.cards.at(-1)?.id).toBeTruthy();
  });

  it("ADD_CARD rejects empty titles", () => {
    const next = boardReducer(initialBoardState, {
      type: "ADD_CARD",
      columnId: "col-2",
      title: "  ",
      details: "ignored",
    });

    expect(next).toEqual(initialBoardState);
  });

  it("DELETE_CARD removes a card from the correct column", () => {
    const next = boardReducer(initialBoardState, {
      type: "DELETE_CARD",
      columnId: "col-1",
      cardId: "card-1",
    });

    const column = getColumn(next, "col-1");
    expect(column.cards.some((card) => card.id === "card-1")).toBe(false);
    expect(column.cards).toHaveLength(1);
  });

  it("MOVE_CARD moves a card to another column", () => {
    const next = boardReducer(initialBoardState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      fromColumnId: "col-1",
      toColumnId: "col-3",
      toIndex: 1,
    });

    expect(getColumn(next, "col-1").cards.some((c) => c.id === "card-1")).toBe(
      false,
    );
    expect(getColumn(next, "col-3").cards[1]?.id).toBe("card-1");
  });

  it("MOVE_CARD reorders within the same column", () => {
    const next = boardReducer(initialBoardState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      fromColumnId: "col-1",
      toColumnId: "col-1",
      toIndex: 1,
    });

    const column = getColumn(next, "col-1");
    expect(column.cards.map((card) => card.id)).toEqual(["card-2", "card-1"]);
  });

  it("MOVE_CARD clamps index to column length", () => {
    const next = boardReducer(initialBoardState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      fromColumnId: "col-1",
      toColumnId: "col-5",
      toIndex: 99,
    });

    const column = getColumn(next, "col-5");
    expect(column.cards.at(-1)?.id).toBe("card-1");
  });
});
