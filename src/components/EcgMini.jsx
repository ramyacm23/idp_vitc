// Tiny inline ECG waveform SVG — used in vital cards and dashboard
export default function EcgMini({ width = 120, height = 36, color = '#4ade80', animated = false }) {
  // One PQRST cycle path
  const path = `M0,18 L8,18 L12,18 L14,14 L16,18 L18,18 L20,18
    L22,18 L24,10 L26,2 L28,28 L30,18 L32,18
    L34,14 L36,16 L38,18 L40,18
    L42,18 L44,14 L46,16 L48,18 L50,18
    L52,18 L54,18 L56,14 L58,18 L60,18 L62,18 L64,18
    L66,10 L68,2 L70,28 L72,18 L74,18
    L76,14 L78,16 L80,18 L82,18
    L84,18 L86,14 L88,16 L90,18 L92,18
    L94,18 L96,18 L98,14 L100,18 L102,18 L104,18 L106,18
    L108,10 L110,2 L112,28 L114,18 L116,18 L118,18 L120,18`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'ecg-line' : ''}
        strokeDasharray={animated ? '400' : undefined}
      />
    </svg>
  )
}
