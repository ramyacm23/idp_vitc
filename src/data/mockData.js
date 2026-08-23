// ─── Mock Health Data ────────────────────────────────────────────────────────
// Replace these with Axios calls to Django REST API when backend is ready.

export const currentVitals = {
  heartRate:   { value: 78,    unit: 'BPM',  status: 'normal',  trend: '+2' },
  spo2:        { value: 98,    unit: '%',    status: 'normal',  trend: '0'  },
  temperature: { value: 36.7,  unit: '°C',   status: 'normal',  trend: '-0.1' },
  ecg:         { rhythm: 'Normal Sinus Rhythm', status: 'normal' },
  motion:      { status: 'Stable', steps: 4820, activity: 'Moderate' },
  device:      { name: 'ESP32-S3', connected: true, wifi: 'Wi-Fi Connected', battery: 87, signal: -62 },
}

export const user = {
  name: 'Ramya',
  fullName: 'Ramya Krishnan',
  email: 'ramya.krishnan@vitalsync.ai',
  age: 22,
  bloodGroup: 'B+',
  height: '163 cm',
  weight: '58 kg',
  emergencyContact: '+91 98765 43210',
  avatar: null,
}

// ─── Time-series helpers ──────────────────────────────────────────────────────
function hoursAgo(h) {
  const d = new Date()
  d.setHours(d.getHours() - h)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function daysAgo(d) {
  const dt = new Date()
  dt.setDate(dt.getDate() - d)
  return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

// ─── Heart Rate ───────────────────────────────────────────────────────────────
export const heartRateToday = [
  { time: hoursAgo(11), value: 72 }, { time: hoursAgo(10), value: 75 },
  { time: hoursAgo(9),  value: 80 }, { time: hoursAgo(8),  value: 85 },
  { time: hoursAgo(7),  value: 78 }, { time: hoursAgo(6),  value: 74 },
  { time: hoursAgo(5),  value: 76 }, { time: hoursAgo(4),  value: 82 },
  { time: hoursAgo(3),  value: 79 }, { time: hoursAgo(2),  value: 77 },
  { time: hoursAgo(1),  value: 78 }, { time: hoursAgo(0),  value: 78 },
]

export const heartRate7Days = Array.from({ length: 7 }, (_, i) => ({
  time: daysAgo(6 - i),
  value: 70 + Math.round(Math.random() * 18),
  min: 62 + Math.round(Math.random() * 8),
  max: 88 + Math.round(Math.random() * 12),
}))

export const heartRate30Days = Array.from({ length: 30 }, (_, i) => ({
  time: daysAgo(29 - i),
  value: 70 + Math.round(Math.random() * 18),
}))

// ─── SpO₂ ─────────────────────────────────────────────────────────────────────
export const spo2Today = [
  { time: hoursAgo(11), value: 97 }, { time: hoursAgo(10), value: 98 },
  { time: hoursAgo(9),  value: 98 }, { time: hoursAgo(8),  value: 97 },
  { time: hoursAgo(7),  value: 99 }, { time: hoursAgo(6),  value: 98 },
  { time: hoursAgo(5),  value: 98 }, { time: hoursAgo(4),  value: 97 },
  { time: hoursAgo(3),  value: 98 }, { time: hoursAgo(2),  value: 99 },
  { time: hoursAgo(1),  value: 98 }, { time: hoursAgo(0),  value: 98 },
]

export const spo27Days = Array.from({ length: 7 }, (_, i) => ({
  time: daysAgo(6 - i), value: 96 + Math.round(Math.random() * 3),
}))

// ─── Temperature ──────────────────────────────────────────────────────────────
export const temperatureToday = [
  { time: hoursAgo(11), value: 36.4 }, { time: hoursAgo(10), value: 36.5 },
  { time: hoursAgo(9),  value: 36.6 }, { time: hoursAgo(8),  value: 36.8 },
  { time: hoursAgo(7),  value: 36.9 }, { time: hoursAgo(6),  value: 36.7 },
  { time: hoursAgo(5),  value: 36.6 }, { time: hoursAgo(4),  value: 36.7 },
  { time: hoursAgo(3),  value: 36.8 }, { time: hoursAgo(2),  value: 36.7 },
  { time: hoursAgo(1),  value: 36.7 }, { time: hoursAgo(0),  value: 36.7 },
]

export const temperature7Days = Array.from({ length: 7 }, (_, i) => ({
  time: daysAgo(6 - i),
  value: parseFloat((36.3 + Math.random() * 0.8).toFixed(1)),
}))

// ─── Activity ─────────────────────────────────────────────────────────────────
export const activityToday = [
  { time: '06:00', steps: 0 },   { time: '07:00', steps: 320 },
  { time: '08:00', steps: 850 }, { time: '09:00', steps: 1200 },
  { time: '10:00', steps: 1600 }, { time: '11:00', steps: 2100 },
  { time: '12:00', steps: 2400 }, { time: '13:00', steps: 2600 },
  { time: '14:00', steps: 3100 }, { time: '15:00', steps: 3700 },
  { time: '16:00', steps: 4200 }, { time: '17:00', steps: 4820 },
]

// ─── ECG waveform points (one PQRST cycle repeated) ──────────────────────────
export const ecgPoints = (() => {
  const cycle = [
    0,0,0.05,0.1,0.08,0.05,0,0,-0.05,-0.08,-0.05,0,
    0,0,0.1,0.2,0.15,0.1,1.2,0.8,-0.3,-0.1,0,0,
    0,0.05,0.15,0.2,0.15,0.05,0,0,0,0,0,0,
  ]
  const pts = []
  for (let r = 0; r < 4; r++) {
    cycle.forEach((v, i) => pts.push({ x: r * cycle.length + i, y: v }))
  }
  return pts
})()

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const alerts = [
  { id: 1, severity: 'info',    type: 'System',      sensor: 'Device',    value: '—',      time: '2 min ago',  status: 'resolved', message: 'Device synchronized successfully' },
  { id: 2, severity: 'warning', type: 'Activity',    sensor: 'MPU6050',   value: 'High',   time: '18 min ago', status: 'active',   message: 'Increased activity detected' },
  { id: 3, severity: 'info',    type: 'Vitals',      sensor: 'MAX30102',  value: '98%',    time: '1 hr ago',   status: 'resolved', message: 'All vitals normal' },
  { id: 4, severity: 'warning', type: 'Heart Rate',  sensor: 'MAX30102',  value: '102 BPM',time: '3 hr ago',   status: 'resolved', message: 'Elevated heart rate detected' },
  { id: 5, severity: 'info',    type: 'Temperature', sensor: 'MLX90614', value: '36.9°C', time: '5 hr ago',   status: 'resolved', message: 'Temperature within normal range' },
  { id: 6, severity: 'danger',  type: 'SpO₂',        sensor: 'MAX30102',  value: '94%',    time: '1 day ago',  status: 'resolved', message: 'Low SpO₂ detected — brief episode' },
]

// ─── Location ─────────────────────────────────────────────────────────────────
export const location = {
  lat: 12.8406,
  lng: 80.1534,
  address: 'VIT Chennai, Vandalur-Kelambakkam Rd',
  status: 'Location Active',
  lastUpdated: '1 min ago',
  movement: 'Stationary',
}

export const locationHistory = [
  { time: '08:00', lat: 12.8401, lng: 80.1530, place: 'Hostel Block A' },
  { time: '09:15', lat: 12.8410, lng: 80.1540, place: 'Academic Block' },
  { time: '11:30', lat: 12.8415, lng: 80.1545, place: 'Library' },
  { time: '13:00', lat: 12.8408, lng: 80.1535, place: 'Cafeteria' },
  { time: '14:30', lat: 12.8412, lng: 80.1542, place: 'Lab Block' },
  { time: '17:00', lat: 12.8406, lng: 80.1534, place: 'Current Location' },
]

// ─── AI Insights ──────────────────────────────────────────────────────────────
export const aiInsights = {
  healthScore: 92,
  observations: [
    { type: 'normal',  text: 'Heart rate is consistently within the normal resting range (60–100 BPM).' },
    { type: 'normal',  text: 'SpO₂ has remained stable at 97–99% throughout the day.' },
    { type: 'normal',  text: 'Body temperature is within the expected range (36.1–37.2 °C).' },
    { type: 'warning', text: 'Activity levels are moderate — consider a short walk to meet daily goals.' },
    { type: 'normal',  text: 'No significant cardiac abnormalities detected in ECG readings.' },
    { type: 'info',    text: 'Sleep-phase heart rate dip observed — indicates healthy autonomic function.' },
  ],
  trends: {
    heartRate:   'stable',
    spo2:        'stable',
    temperature: 'stable',
    activity:    'moderate',
  },
}
