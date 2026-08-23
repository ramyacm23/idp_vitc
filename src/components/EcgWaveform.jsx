// Large ECG waveform for ECG Monitor page
export default function EcgWaveform({ height = 120, color = '#4ade80', animated = true }) {
  const cycles = 3
  const cycleW = 280
  const totalW = cycleW * cycles * 2 // doubled for seamless loop

  const oneCycle = (ox) => `
    M${ox},${height/2}
    L${ox+15},${height/2}
    L${ox+20},${height/2-6}
    L${ox+23},${height/2+6}
    L${ox+26},${height/2}
    L${ox+40},${height/2}
    L${ox+46},${height/2-4}
    L${ox+50},${height*0.1}
    L${ox+54},${height*0.9}
    L${ox+58},${height/2}
    L${ox+70},${height/2}
    L${ox+76},${height/2-10}
    L${ox+82},${height/2+8}
    L${ox+88},${height/2}
    L${ox+110},${height/2}
    L${ox+115},${height/2-5}
    L${ox+120},${height/2+5}
    L${ox+125},${height/2}
    L${ox+cycleW},${height/2}
  `

  const d = Array.from({ length: cycles * 2 }, (_, i) => oneCycle(i * cycleW)).join(' ')

  return (
    <div className="overflow-hidden w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${cycleW * cycles} ${height}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Grid lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={i}
            x1="0" y1={i * (height / 5)}
            x2={cycleW * cycles} y2={i * (height / 5)}
            stroke="#1a231a" strokeWidth="1"
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1={i * (cycleW * cycles / 11)} y1="0"
            x2={i * (cycleW * cycles / 11)} y2={height}
            stroke="#1a231a" strokeWidth="1"
          />
        ))}

        {/* Waveform */}
        <path
          d={oneCycle(0) + oneCycle(cycleW) + oneCycle(cycleW * 2)}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={animated ? 'ecg-line' : ''}
          strokeDasharray={animated ? '2000' : undefined}
        />
      </svg>
    </div>
  )
}
