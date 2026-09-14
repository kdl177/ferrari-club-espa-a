'use client';

import { useState } from 'react';

export default function FaqItem({ question, answer, last }: { question: string; answer: string; last?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      style={{ borderBottom: last ? 'none' : '1px solid var(--w08)', padding: '1.5rem 0', cursor: 'pointer' }}
      data-r="up"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary style={{ fontFamily: 'var(--fh)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--white)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {question} <span style={{ color: 'var(--red)', fontFamily: 'var(--fd)' }}>{open ? '−' : '+'}</span>
      </summary>
      <p style={{ fontFamily: 'var(--fb)', fontSize: '.9rem', color: 'var(--w60)', lineHeight: 1.85, marginTop: '1rem', paddingLeft: '.5rem' }}>{answer}</p>
    </details>
  );
}
