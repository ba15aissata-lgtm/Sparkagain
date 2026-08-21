import { useState } from 'react'
import { NavBar, type Tab } from './components/NavBar'
import { Today } from './components/Today'
import { Chores } from './components/Chores'
import { Kids } from './components/Kids'
import { Rewards } from './components/Rewards'
import { History } from './components/History'

export default function App() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="min-h-screen">
      {tab === 'today' && <Today />}
      {tab === 'chores' && <Chores />}
      {tab === 'kids' && <Kids />}
      {tab === 'rewards' && <Rewards />}
      {tab === 'history' && <History />}
      <NavBar active={tab} onChange={setTab} />
    </div>
  )
}
