import { NextRequest, NextResponse } from 'next/server'
import { put, head, del } from '@vercel/blob'

function getWeekKey() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
    return `${now.getFullYear()}-W${week}`
}

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

export async function GET(request: NextRequest) {
    try {
          const { searchParams } = new URL(request.url)
          const person = searchParams.get('person') as 'mason' | 'shannon'
          const week = getWeekKey()
          const blobKey = `chores-${person}-${week}.json`
          try {
                  const blobInfo = await head(blobKey)
                  const resp = await fetch(blobInfo.url, { cache: 'no-store' })
                  const data = await resp.json()
                  return NextResponse.json(data)
          } catch {
                  const base = person === 'mason' ? MASON_CHORES : SHANNON_CHORES
                  return NextResponse.json(base.map(c => ({ ...c, done: false })))
          }
    } catch {
          return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
          const { searchParams } = new URL(request.url)
          const person = searchParams.get('person') as 'mason' | 'shannon'
          const week = getWeekKey()
          const blobKey = `chores-${person}-${week}.json`
          const chores = await request.json()
          try { await del(blobKey) } catch {}
          await put(blobKey, JSON.stringify(chores), {
                  access: 'public',
                  contentType: 'application/json',
                  addRandomSuffix: false,
          })
          return NextResponse.json({ success: true })
    } catch {
          return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
}
