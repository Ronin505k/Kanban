"use client";

import { FormEvent, useState } from "react";

type AddCardFormProps = {
  columnId: string;
  onAdd: (columnId: string, title: string, details: string) => void;
};

export function AddCardForm({ columnId, onAdd }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    onAdd(columnId, title, details);
    setTitle("");
    setDetails("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        data-testid={`add-card-button-${columnId}`}
        onClick={() => setIsOpen(true)}
        className="mt-2 w-full rounded-lg border border-dashed border-[var(--blue-primary)]/40 px-3 py-2 text-sm font-medium text-[var(--blue-primary)] transition-colors hover:border-[var(--blue-primary)] hover:bg-[var(--blue-primary)]/5"
      >
        Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 space-y-2 rounded-lg border border-[var(--blue-primary)]/20 bg-white p-3 shadow-sm"
      data-testid={`add-card-form-${columnId}`}
    >
      <input
        type="text"
        placeholder="Card title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        data-testid={`add-card-title-${columnId}`}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-[var(--dark-navy)] outline-none focus:border-[var(--blue-primary)]"
        autoFocus
      />
      <textarea
        placeholder="Details (optional)"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        data-testid={`add-card-details-${columnId}`}
        rows={2}
        className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm text-[var(--gray-text)] outline-none focus:border-[var(--blue-primary)]"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          data-testid={`add-card-submit-${columnId}`}
          className="rounded-md bg-[var(--purple-secondary)] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
            setDetails("");
          }}
          className="rounded-md px-3 py-1.5 text-sm text-[var(--gray-text)] transition-colors hover:text-[var(--dark-navy)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
