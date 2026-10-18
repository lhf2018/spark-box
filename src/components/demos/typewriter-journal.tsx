"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";

const STORAGE_PREFIX = "spark-box:journal:";
const MAX_LENGTH = 420;

type Mark = { char: string; at: number };

type Journal = { text: string; marks: Mark[] };

function todayKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function readJournal(key: string): Journal {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { text: "", marks: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { text: "", marks: [] };
    const record = parsed as { text?: unknown; marks?: unknown };
    const text = typeof record.text === "string" ? record.text.slice(0, MAX_LENGTH) : "";
    const marks = Array.isArray(record.marks)
      ? record.marks
          .filter(
            (mark): mark is Mark =>
              !!mark &&
              typeof mark === "object" &&
              typeof (mark as Mark).char === "string" &&
              typeof (mark as Mark).at === "number",
          )
          .slice(-80)
      : [];
    return { text, marks };
  } catch {
    return { text: "", marks: [] };
  }
}

export default function TypewriterJournal() {
  const [today, setToday] = useState<Date | null>(null);
  const [text, setText] = useState("");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [ready, setReady] = useState(false);

  const storageKey = useMemo(
    () => (today ? `${STORAGE_PREFIX}${todayKey(today)}` : null),
    [today],
  );

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (!storageKey) return;
    const stored = readJournal(storageKey);
    setText(stored.text);
    setMarks(stored.marks);
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready || !storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ text, marks }));
  }, [ready, storageKey, text, marks]);

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Backspace") return;
    const element = event.currentTarget;
    const start = element.selectionStart ?? text.length;
    const end = element.selectionEnd ?? text.length;
    const from = start === end ? Math.max(0, start - 1) : start;
    const removed = text.slice(from, end || from);
    const chars = Array.from(removed).filter((char) => char.trim().length > 0);
    if (chars.length === 0) return;
    setMarks((current) =>
      [...current, ...chars.map((char, index) => ({ char, at: from + index }))].slice(-80),
    );
  }

  const dateLabel = today
    ? new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(today)
    : "今天";

  return (
    <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-5 py-10 sm:px-8">
      <p className="text-xs tracking-[0.28em] text-lagoon uppercase">Today only</p>
      <h1 className="font-display mt-2 text-4xl text-ink sm:text-5xl">今日一张纸</h1>
      <p className="mt-3 text-sm text-pine/70">{dateLabel} · 退格会留下擦痕，写完就留在这台机器上。</p>

      <div className="relative mt-8 min-h-[28rem] flex-1 overflow-hidden rounded-[2rem] border border-pine/10 bg-[#f7fffb] shadow-[0_30px_80px_-48px_rgba(20,63,56,0.45)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {marks.map((mark, index) => (
            <span
              key={`${mark.at}-${mark.char}-${index}`}
              className="font-display absolute text-xl text-pine/25"
              style={{
                left: `${8 + (mark.at % 12) * 7}%`,
                top: `${12 + (index % 7) * 11}%`,
                transform: `rotate(${(mark.at % 9) - 4}deg)`,
              }}
            >
              {mark.char}
              <span className="absolute top-1/2 -left-1 h-px w-6 -translate-y-1/2 bg-pine/30" />
            </span>
          ))}
        </div>
        <textarea
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={onKeyDown}
          placeholder="今天只写在这一张上。"
          aria-label="今天的日记"
          className="relative z-10 h-full min-h-[28rem] w-full resize-none bg-transparent px-6 py-7 text-lg leading-8 text-ink outline-none placeholder:text-pine/30 sm:px-8"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-pine/55">
        <span>擦痕 {marks.length}</span>
        <span>
          {text.length}/{MAX_LENGTH}
        </span>
      </div>
    </section>
  );
}
