// Drawn inline rather than using the 🇮🇳 emoji: Windows has no glyph for
// regional-indicator flags, so the emoji renders as the letters "IN".
export default function IndiaFlag({ width = 22 }) {
  const height = (width * 2) / 3
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 60"
      role="img"
      aria-label="India"
      className="rounded-[2px] shrink-0 ring-1 ring-black/10"
    >
      <rect width="90" height="20" fill="#FF9933" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#138808" />
      <g transform="translate(45 30)">
        <circle r="8" fill="none" stroke="#000080" strokeWidth="1.4" />
        <circle r="1.6" fill="#000080" />
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2="-8"
            stroke="#000080"
            strokeWidth="0.5"
            transform={`rotate(${i * 15})`}
          />
        ))}
      </g>
    </svg>
  )
}
