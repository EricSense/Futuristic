const items = [
  "PORTABLE DIGITAL IDENTITY",
  "AUTONOMY CONTRACT ACTIVE",
  "VEHICLE BIND PROVEN",
  "CONNECTED INFRASTRUCTURE",
  "IDENTITY THAT MOVES WITH YOU",
];

export function Marquee() {
  const track = [...items, ...items];

  return (
    <div className="border-y border-border/40 bg-surface/40 overflow-hidden py-3">
      <div className="marquee-track flex gap-12 whitespace-nowrap font-mono text-xs tracking-[0.2em] text-muted">
        {track.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-12">
            <span>{item}</span>
            <span className="text-accent/40">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}
