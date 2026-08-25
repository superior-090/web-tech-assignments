import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlarmClock, Bell, ChevronDown, Clock3, Globe2, Menu, Moon, Pause, Play, Plus, Search, Settings2, Sun, Trash2, Volume2, X } from 'lucide-react';
import './styles.css';

const places = [
  { city: 'New York', zone: 'America/New_York', code: 'EST', color: '#fa8e70' },
  { city: 'London', zone: 'Europe/London', code: 'GMT', color: '#a891f5' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', code: 'JST', color: '#f4c95d' },
  { city: 'Sydney', zone: 'Australia/Sydney', code: 'AEST', color: '#62d2a2' },
];

const pad = (n) => String(n).padStart(2, '0');
function zoneParts(date, zone) {
  const values = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, weekday: 'short', month: 'short', day: 'numeric' }).formatToParts(date);
  return Object.fromEntries(values.filter((x) => x.type !== 'literal').map((x) => [x.type, x.value]));
}
function zoneTime(date, zone) {
  const p = zoneParts(date, zone);
  return { time: `${p.hour}:${p.minute}`, seconds: p.second, date: `${p.weekday}, ${p.month} ${p.day}`, hour: +p.hour, minute: +p.minute, second: +p.second };
}
function greeting(hour) { return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'; }

function AnalogClock({ now, zone }) {
  const t = zoneTime(now, zone);
  const h = (t.hour % 12) * 30 + t.minute / 2;
  const m = t.minute * 6 + t.second / 10;
  const s = t.second * 6;
  return <div className="analog" aria-label="Analog clock">
    <div className="clock-face">
      {[...Array(60)].map((_, i) => <i key={i} className={`tick ${i % 5 === 0 ? 'major' : ''}`} style={{ transform: `rotate(${i * 6}deg)` }} />)}
      <b className="number n12">12</b><b className="number n3">3</b><b className="number n6">6</b><b className="number n9">9</b>
      <span className="hand hour" style={{ transform: `rotate(${h}deg)` }} />
      <span className="hand minute" style={{ transform: `rotate(${m}deg)` }} />
      <span className="hand second" style={{ transform: `rotate(${s}deg)` }} />
      <span className="pin" />
    </div>
  </div>;
}

function App() {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [now, setNow] = useState(new Date());
  const [isDark, setIsDark] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedZone, setSelectedZone] = useState(localZone);
  const [showZones, setShowZones] = useState(false);
  const [alarms, setAlarms] = useState([{ id: 1, time: '07:30', label: 'Morning run', days: 'Weekdays', enabled: true }, { id: 2, time: '09:00', label: 'Team stand-up', days: 'Mon, Wed, Fri', enabled: false }]);
  const [showAlarm, setShowAlarm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '08:00', label: 'New alarm' });
  const timer = useRef();
  useEffect(() => { if (isRunning) timer.current = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer.current); }, [isRunning]);
  const local = zoneTime(now, selectedZone);
  const zoneLabel = selectedZone.replace(/_/g, ' ').split('/').pop();
  const addAlarm = (e) => { e.preventDefault(); setAlarms((a) => [...a, { ...newAlarm, id: Date.now(), days: 'Every day', enabled: true }]); setShowAlarm(false); };
  const toggle = (id) => setAlarms((a) => a.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
  return <main className={isDark ? 'app dark' : 'app'}>
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Clock3 size={20}/></span><span>chronos</span></div>
      <nav><button className="active"><Clock3 /> <span>Dashboard</span></button><button><Globe2 /> <span>World Clock</span></button><button><AlarmClock /> <span>Alarms</span></button></nav>
      <div className="side-bottom"><button><Settings2 /> <span>Settings</span></button><div className="profile"><span>SM</span><div><b> <h3>Suyash Moon
        </h3></b><small>Personal workspace</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <section className="content">
      <header><button className="mobile-menu"><Menu /></button><div><p className="eyebrow">{greeting(local.hour)}, Suyash Moon</p><h1>Your time, beautifully organized.</h1></div><div className="header-actions"><button className="icon-btn" onClick={() => setIsDark(!isDark)} title="Toggle theme">{isDark ? <Sun /> : <Moon />}</button><button className="icon-btn"><Bell /></button><button className="avatar">SM</button></div></header>
      <div className="dashboard-grid">
        <section className="hero card">
          <div className="hero-top"><div><span className="tag"><span /> LIVE · LOCAL TIME</span><div className="timezone-select"><button onClick={() => setShowZones(!showZones)}><Globe2 size={16}/>{zoneLabel}<ChevronDown size={15}/></button>{showZones && <div className="zone-menu">{[...places, { city: 'Your local time', zone: localZone }].map((p) => <button key={p.zone} onClick={() => { setSelectedZone(p.zone); setShowZones(false); }}>{p.city}<small>{p.zone}</small></button>)}</div>}</div></div><button className="pause" onClick={() => setIsRunning(!isRunning)}>{isRunning ? <Pause size={15}/> : <Play size={15}/>} {isRunning ? 'Pause' : 'Resume'}</button></div>
          <div className="clock-hero"><AnalogClock now={now} zone={selectedZone}/><div className="digital"><div className="time">{local.time}<sup>{local.seconds}</sup></div><p>{local.date} · {selectedZone.replace('_', ' ')}</p><div className="running"><span /> {isRunning ? 'Clock is running' : 'Clock paused'}</div></div></div>
        </section>
        <section className="quick card"><div className="section-heading"><div><p className="eyebrow">UP NEXT</p><h2>Alarms</h2></div><button className="round-add" onClick={() => setShowAlarm(true)}><Plus size={18}/></button></div><div className="next-alarm"><div className="alarm-icon"><AlarmClock size={21}/></div><div><strong>{alarms.find(a=>a.enabled)?.time || 'No active alarms'}</strong><p>{alarms.find(a=>a.enabled)?.label || 'Add an alarm to get started'}</p></div></div><button className="view-all">View all alarms <span>→</span></button></section>
      </div>
      <section className="world-section"><div className="section-heading"><div><p className="eyebrow">AROUND THE WORLD</p><h2>World clock</h2></div><button className="text-btn"><Plus size={16}/> Add city</button></div><div className="city-grid">{places.map((place) => { const z = zoneTime(now, place.zone); const daytime = z.hour >= 6 && z.hour < 18; return <article className="city card" key={place.city}><div className="city-head"><span className="city-dot" style={{ background: place.color }} /><div><h3>{place.city}</h3><p>{place.code}</p></div><span className="day-icon">{daytime ? <Sun size={18}/> : <Moon size={17}/>}</span></div><div className="city-time">{z.time}<sup>{z.seconds}</sup></div><p className="city-date">{z.date}</p><div className="city-foot"><span className={daytime ? 'day-pill' : 'night-pill'}>{daytime ? 'DAYTIME' : 'NIGHTTIME'}</span><span>{place.zone.includes('New_York') ? '−9h' : place.zone.includes('London') ? '−4h' : place.zone.includes('Tokyo') ? '+5h' : '+7h'} from you</span></div></article> })}</div></section>
      <section className="alarms-section card"><div className="section-heading"><div><p className="eyebrow">SCHEDULE</p><h2>Your alarms</h2></div><button className="text-btn" onClick={() => setShowAlarm(true)}><Plus size={16}/> New alarm</button></div><div className="alarm-list">{alarms.map((alarm) => <div className="alarm-row" key={alarm.id}><div className="alarm-main"><b>{alarm.time}</b><div><strong>{alarm.label}</strong><p>{alarm.days}</p></div></div><label className="switch"><input type="checkbox" checked={alarm.enabled} onChange={() => toggle(alarm.id)}/><span /></label><button className="delete" onClick={() => setAlarms(a => a.filter(x => x.id !== alarm.id))}><Trash2 size={17}/></button></div>)}</div></section>
    </section>
    {showAlarm && <div className="modal-backdrop" onMouseDown={() => setShowAlarm(false)}><form className="alarm-modal" onSubmit={addAlarm} onMouseDown={e => e.stopPropagation()}><button className="close" type="button" onClick={() => setShowAlarm(false)}><X /></button><div className="modal-icon"><AlarmClock /></div><h2>Set a new alarm</h2><label>Time<input type="time" value={newAlarm.time} onChange={e => setNewAlarm({...newAlarm, time:e.target.value})}/></label><label>Label<input value={newAlarm.label} onChange={e => setNewAlarm({...newAlarm, label:e.target.value})}/></label><button className="save">Create alarm</button></form></div>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
