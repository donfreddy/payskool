/** QR factice — dessiné pour la démo (URL de vérification réelle en prod). */
export function FakeQR({ className }: { className?: string }) {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const x = i % 7;
    const y = Math.floor(i / 7);
    const border = x === 0 || x === 6 || y === 0 || y === 6;
    const fixed = (x === 0 && y < 3) || (x === 6 && y < 3) || (y === 0 && x < 3) || (y === 6 && x < 3) || (x === 0 && y > 3) || (x === 6 && y > 3) || (y === 0 && x > 3) || (y === 6 && x > 3);
    return border || fixed ? 1 : (i * 7 + x * 3 + y) % 5 < 3 ? 1 : 0;
  });
  return (
    <svg
      viewBox="0 0 7 7"
      className={className ?? "size-20 rounded-sm border border-border bg-white p-1"}
      aria-label="QR code de vérification du reçu"
    >
      {cells.map((v, i) =>
        v ? <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" fill="#0F172A" /> : null,
      )}
    </svg>
  );
}