import type { BoardState } from "./types";

export const initialBoardState: BoardState = {
  columns: [
    {
      id: "col-1",
      title: "Backlog",
      cards: [
        {
          id: "card-1",
          title: "Research competitors",
          details: "Review three similar products and note key differentiators.",
        },
        {
          id: "card-2",
          title: "Define MVP scope",
          details: "Document must-have features for the first release.",
        },
      ],
    },
    {
      id: "col-2",
      title: "Ready",
      cards: [
        {
          id: "card-3",
          title: "Design mockups",
          details: "Create wireframes for the main board view.",
        },
        {
          id: "card-4",
          title: "Set up CI",
          details: "Configure automated lint and test pipeline.",
        },
      ],
    },
    {
      id: "col-3",
      title: "In Progress",
      cards: [
        {
          id: "card-5",
          title: "Build drag and drop",
          details: "Implement card movement between columns.",
        },
        {
          id: "card-6",
          title: "Style the board",
          details: "Apply brand colors and polish card layout.",
        },
      ],
    },
    {
      id: "col-4",
      title: "Review",
      cards: [
        {
          id: "card-7",
          title: "Write unit tests",
          details: "Cover reducer actions with Vitest.",
        },
      ],
    },
    {
      id: "col-5",
      title: "Done",
      cards: [
        {
          id: "card-8",
          title: "Project scaffolding",
          details: "Next.js app with TypeScript and Tailwind.",
        },
        {
          id: "card-9",
          title: "Seed dummy data",
          details: "Populate board with sample tasks on load.",
        },
      ],
    },
  ],
};
