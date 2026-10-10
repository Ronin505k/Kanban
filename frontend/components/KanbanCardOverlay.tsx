import type { Card } from "@/lib/types";

type KanbanCardOverlayProps = {
  card: Card;
};

export function KanbanCardOverlay({ card }: KanbanCardOverlayProps) {
  return (
    <div className="w-64 rotate-2 rounded-lg border-2 border-[var(--accent-yellow)] bg-white p-3 shadow-xl">
      <h3 className="text-sm font-semibold text-[var(--dark-navy)]">
        {card.title}
      </h3>
      {card.details ? (
        <p className="mt-1 text-xs leading-relaxed text-[var(--gray-text)]">
          {card.details}
        </p>
      ) : null}
    </div>
  );
}
