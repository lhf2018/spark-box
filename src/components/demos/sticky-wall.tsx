"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";

type Note = { id: string; text: string; x: number; y: number };

const KEY = "spark-box:notes";

function readNotes(): Note[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (note): note is Note =>
        !!note &&
        typeof note === "object" &&
        typeof (note as Note).id === "string" &&
        typeof (note as Note).text === "string" &&
        typeof (note as Note).x === "number" &&
        typeof (note as Note).y === "number",
    );
  } catch {
    return [];
  }
}

export default function StickyWall() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotes(readNotes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(notes));
  }, [notes, ready]);

  function addNote() {
    const text = draft.trim();
    if (!text) return;
    setNotes((current) => [
      ...current,
      { id: `${Date.now()}`, text, x: 12 + (current.length % 3) * 28, y: 12 + (current.length % 2) * 24 },
    ]);
    setDraft("");
  }

  function move(event: PointerEvent<HTMLElement>) {
    const current = drag.current;
    const wall = wallRef.current;
    if (!current || !wall) return;
    const rect = wall.getBoundingClientRect();
    const x = ((event.clientX - rect.left - current.dx) / rect.width) * 100;
    const y = ((event.clientY - rect.top - current.dy) / rect.height) * 100;
    setNotes((items) =>
      items.map((note) => {
        if (note.id === current.id) {
          return { ...note, x: Math.min(78, Math.max(0, x)), y: Math.min(72, Math.max(0, y)) };
        }
        const dx = note.x - x;
        const dy = note.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance > 22 || distance === 0) return note;
        const push = (22 - distance) * 0.08;
        return {
          ...note,
          x: Math.min(78, Math.max(0, note.x + (dx / distance) * push)),
          y: Math.min(72, Math.max(0, note.y + (dy / distance) * push)),
        };
      }),
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">便签墙</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-pine/75">拖一张便签，旁边的会微微让开。</p>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addNote();
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="写下一件事"
          aria-label="新便签"
          className="h-11 flex-1 rounded-sm border border-pine/15 bg-foam/70 px-3 text-ink outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        />
        <Button type="submit">贴上</Button>
      </form>
      <div
        ref={wallRef}
        className="relative mt-6 min-h-[28rem] flex-1 border border-pine/10 bg-[linear-gradient(180deg,#f4fbf8,#d7eee6)]"
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        {notes.length === 0 ? (
          <p className="p-6 text-sm text-pine/60">墙上还是空的。</p>
        ) : null}
        {notes.map((note) => (
          <article
            key={note.id}
            role="group"
            aria-label={note.text}
            className="absolute w-36 cursor-grab border border-pine/15 bg-paper p-3 text-sm text-ink active:cursor-grabbing"
            style={{ left: `${note.x}%`, top: `${note.y}%` }}
            onPointerDown={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              drag.current = { id: note.id, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={move}
          >
            {note.text}
            <button
              type="button"
              className="mt-3 block text-xs text-pine/50"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setNotes((items) => items.filter((item) => item.id !== note.id))}
            >
              揭下
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
