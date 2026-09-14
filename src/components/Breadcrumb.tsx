import Link from 'next/link';

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="bc">
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'contents' }}>
          {item.href ? (
            <Link href={item.href} className="bc-a">{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
          {i < items.length - 1 && <span className="bc-s">/</span>}
        </span>
      ))}
    </div>
  );
}
