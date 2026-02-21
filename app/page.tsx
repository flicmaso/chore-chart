'use client'
import { useState, useEffect } from 'react'

type Chore = { id: string; name: string; category: string; done: boolean }
type Person = 'mason' | 'shannon'

const MASON_CHORES = [
  { id: 'm1', name: 'Coffee Table', category: 'Living Room' },
  { id: 'm2', name: 'Vacuuming the Carpet', category: 'Living Room' },
  { id: 'm3', name: 'Balcony Maintaining', category: 'Living Room' },
  { id: 'm4', name: 'Grill', category: 'Garage' },
  { id: 'm5', name: 'Sweeping/Shoveling', category: 'Garage' },
  { id: 'm6', name: 'Mirror Cleaning/Sink', category: 'Guest Bathroom' },
  { id: 'm7', name: 'Shower', category: 'Guest Bathroom' },
  { id: 'm8', name: 'Lint', category: 'Guest Bathroom' },
  { id: 'm9', name: 'Garbage', category: 'Guest Bathroom' },
  { id: 'm10', name: 'Litterbox Monthly', category: 'Guest Bathroom' },
  { id: 'm11', name: 'Sweeping/Mopping Rugs', category: 'Guest Bathroom' },
  { id: 'm12', name: 'Cooking (Mason)', category: 'Kitchen' },
  { id: 'm13', name: 'Air Fryer', category: 'Kitchen' },
  { id: 'm14', name: 'Cleaning Counters', category: 'Kitchen' },
  { id: 'm15', name: 'Ice Machine', category: 'Kitchen' },
  { id: 'm16', name: 'Garbages', category: 'Kitchen' },
  { id: 'm17', name: 'Feeding Shadow', category: 'Entryway' },
  { id: 'm18', name: "Shadow's Water", category: 'Entryway' },
  { id: 'm19', name: 'Rugs', category: 'Entryway' },
  { id: 'm20', name: 'Cleaning Stairs', category: 'Entryway' },
  { id: 'm21', name: 'Dusting Fan', category: 'Entryway' },
  { id: 'm22', name: 'Closet Upkeep', category: 'Entryway' },
  { id: 'm23', name: 'Closet Cleaning', category: 'Main Bathroom' },
  { id: 'm24', name: 'Sink/Mirror', category: 'Main Bathroom' },
  { id: 'm25', name: 'Sweeping/Mopping', category: 'Main Bathroom' },
  ]

const SHANNON_CHORES = [
  { id: 's1', name: "Keeping Shadow's Stuff Clean", category: 'Living Room' },
  { id: 's2', name: 'Dusting', category: 'Living Room' },
  { id: 's3', name: 'Deep Cleaning Couch', category: 'Living Room' },
  { id: 's4', name: 'Maintaining Closet', category: 'Living Room' },
  { id: 's5', name: 'Fridge', category: 'Garage' },
  { id: 's6', name: 'Garbage', category: 'Garage' },
  { id: 's7', name: 'Storage', category: 'Garage' },
  { id: 's8', name: 'Vacuuming', category: 'Office' },
  { id: 's9', name: 'Dusting TV', category: 'Office' },
  { id: 's10', name: 'Keeping Closet Clean', category: 'Office' },
  { id: 's11', name: 'Garbage', category: 'Main Bathroom' },
  { id: 's12', name: 'Toilet', category: 'Main Bathroom' },
  { id: 's13', name: 'Shower', category: 'Main Bathroom' },
  { id: 's14', name: 'Dishes (Shannon)', category: 'Kitchen' },
  { id: 's15', name: 'Pantry', category: 'Kitchen' },
  { id: 's16', name: 'Fridge', category: 'Kitchen' },
  { id: 's17', name: 'Microwave', category: 'Kitchen' },
  { id: 's18', name: 'Sweeping/Floor Upkeep', category: 'Kitchen' },
  { id: 's19', name: 'Cleaning Oven', category: 'Kitchen' },
  { id: 's20', name: 'House Laundry', category: 'Guest Bathroom' },
  { id: 's21', name: 'Litterbox Daily', category: 'Guest Bathroom' },
  { id: 's22', name: 'Toilet', category: 'Guest Bathroom' },
  { id: 's23', name: 'Vacuuming', category: 'Bedroom' },
  { id: 's24', name: 'Dusting', category: 'Bedroom' },
  { id: 's25', name: 'Bedding', category: 'Bedroom' },
  ]

function getWeekKey() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
    return `${now.getFullYear()}-W${week}`
}

function loadState(person: Person): Chore[] {
    if (typeof window === 'undefined') return []
        const key = `chores-${person}-${getWeekKey()}`
    const saved = localStorage.getItem(key)
    const base = person === 'mason' ? MASON_CHORES : SHANNON_CHORES
    if (saved) return JSON.parse(saved)
    return base.map(c => ({ ...c, done: false }))
}

function saveState(person: Person, chores: Chore[]) {
    localStorage.setItem(`chores-${person}-${getWeekKey()}`, JSON.stringify(chores))
}

function groupBy(chores: Chore[]) {
    return chores.reduce((acc: Record<string, Chore[]>, c) => {
          if (!acc[c.category]) acc[c.category] = []
                acc[c.category].push(c)
          return acc
    }, {})
}

const MC = '#f59e0b'
const SC = '#8b5cf6'

export default function Home() {
    const [view, setView] = useState<'home' | Person>('home')
    const [mChores, setMChores] = useState<Chore[]>([])
    const [sChores, setSChores] = useState<Chore[]>([])
    const [ready, setReady] = useState(false)

  useEffect(() => {
        setMChores(loadState('mason'))
        setSChores(loadState('shannon'))
        setReady(true)
  }, [])

  if (!ready) return null

  const toggle = (p: Person, id: string) => {
        if (p === 'mason') {
                const u = mChores.map(c => c.id === id ? { ...c, done: !c.done } : c)
                setMChores(u); saveState('mason', u)
        } else {
                const u = sChores.map(c => c.id === id ? { ...c, done: !c.done } : c)
                setSChores(u); saveState('shannon', u)
        }
  }

  const reset = (p: Person) => {
        if (!confirm(`Reset ${p === 'mason' ? 'Mason' : 'Shannon'} chores for this week?`)) return
        const base = (p === 'mason' ? MASON_CHORES : SHANNON_CHORES).map(c => ({ ...c, done: false }))
        if (p === 'mason') { setMChores(base); saveState('mason', base) }
        else { setSChores(base); saveState('shannon', base) }
  }

  const mDone = mChores.filter(c => c.done).length
    const sDone = sChores.filter(c => c.done).length
    const wk = getWeekKey()

  if (view === 'home') {
        return (
                <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
                          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                                      <h1 style={{ textAlign: 'center', color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Chore Chart</h1>
                                      <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>Week: {wk}</p>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                                                    <button onClick={() => setView('mason')} style={{ background: '#1a1a1a', border: `2px solid ${MC}`, borderRadius: '16px', padding: '28px 20px', cursor: 'pointer', textAlign: 'center' }}>
                                                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏈</div>
                                                                    <h2 style={{ color: MC, fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Mason</h2>
                                                                    <p style={{ color: '#fff', fontWeight: 600, marginBottom: '12px' }}>{mDone} / 25</p>
                                                                    <div style={{ background: '#333', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                                                                                      <div style={{ width: `${(mDone / 25) * 100}%`, background: MC, height: '100%', borderRadius: '99px' }} />
                                                                    </div>
                                                                    <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '8px' }}>Pack Attack</p>
                                                    </button>
                                                    <button onClick={() => setView('shannon')} style={{ background: '#1a1a1a', border: `2px solid ${SC}`, borderRadius: '16px', padding: '28px 20px', cursor: 'pointer', textAlign: 'center' }}>
                                                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏆</div>
                                                                    <h2 style={{ color: SC, fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Shannon</h2>
                                                                    <p style={{ color: '#fff', fontWeight: 600, marginBottom: '12px' }}>{sDone} / 25</p>
                                                                    <div style={{ background: '#333', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                                                                                      <div style={{ width: `${(sDone / 25) * 100}%`, background: SC, height: '100%', borderRadius: '99px' }} />
                                                                    </div>
                                                                    <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '8px' }}>Tofu Titans</p>
                                                    </button>
                                      </div>
                                      <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a2a' }}>
                                                    <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '14px' }}>Weekly Progress</h3>
                                        {([['Mason', mDone, MC], ['Shannon', sDone, SC]] as [string, number, string][]).map(([name, done, color]) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                                  <span style={{ color, width: '65px', fontSize: '0.88rem', fontWeight: 600 }}>{name}</span>
                                                  <div style={{ flex: 1, background: '#333', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
                                                                      <div style={{ width: `${(done / 25) * 100}%`, background: color, height: '100%', borderRadius: '99px' }} />
                                                  </div>
                                                  <span style={{ color: '#ccc', width: '40px', textAlign: 'right', fontSize: '0.85rem' }}>{Math.round((done / 25) * 100)}%</span>
                                </div>
                              ))}
                                      </div>
                          </div>
                </div>
              )
          }

  const p = view as Person
    const chores = p === 'mason' ? mChores : sChores
    const color = p === 'mason' ? MC : SC
    const done = chores.filter(c => c.done).length
    const grouped = groupBy(chores)

  return (
        <div style={{ minHeight: '100vh', background: '#0f0f0f', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ background: '#141414', borderBottom: '1px solid #2a2a2a', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
                          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem' }}>← Back</button>
                                      <span style={{ color, fontWeight: 700, fontSize: '1.1rem' }}>{p === 'mason' ? '🏈 Mason' : '🏆 Shannon'}</span>
                                      <button onClick={() => reset(p)} style={{ background: 'none', border: '1px solid #444', color: '#888', cursor: 'pointer', fontSize: '0.78rem', padding: '4px 10px', borderRadius: '8px' }}>Reset</button>
                          </div>
                </div>
                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px' }}>
                          <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', border: `1px solid ${color}44` }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ color: '#666', fontSize: '0.85rem' }}>Week {wk}</span>
                                                    <span style={{ color, fontWeight: 700 }}>{done} / 25</span>
                                      </div>
                                      <div style={{ background: '#333', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(done / 25) * 100}%`, background: color, height: '100%', borderRadius: '99px' }} />
                                      </div>
                          </div>
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} style={{ marginBottom: '20px' }}>
                                  <h3 style={{ color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', paddingLeft: '10px', borderLeft: `3px solid ${color}` }}>{cat}</h3>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {items.map(chore => (
                                      <button key={chore.id} onClick={() => toggle(p, chore.id)} style={{ background: chore.done ? `${color}1a` : '#1a1a1a', border: `1px solid ${chore.done ? color : '#2a2a2a'}`, borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                                                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${chore.done ? color : '#555'}`, background: chore.done ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {chore.done && <span style={{ color: '#000', fontSize: '11px', fontWeight: 900 }}>✓</span>}
                                                          </div>
                                                          <span style={{ color: chore.done ? '#666' : '#eee', textDecoration: chore.done ? 'line-through' : 'none', fontSize: '0.92rem' }}>{chore.name}</span>
                                      </button>
                                    ))}
                                  </div>
                    </div>
                  ))}
                  {done === 25 && (
                    <div style={{ textAlign: 'center', padding: '28px', background: `${color}1a`, borderRadius: '12px', border: `1px solid ${color}` }}>
                                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
                                  <h2 style={{ color, fontWeight: 800, fontSize: '1.3rem' }}>All done this week!</h2>
                    </div>
                  )}
                </div>
        </div>
      )
}
