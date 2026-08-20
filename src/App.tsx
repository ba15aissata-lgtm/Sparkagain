import { useState } from 'react'
import { NavBar, type Tab } from './components/NavBar'
import { Today } from './components/Today'
import { History } from './components/History'
import { Stats } from './components/Stats'
import { Outfits } from './components/Outfits'
import { Manage } from './components/Manage'

export default function App() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="min-h-screen">
      {tab === 'today' && <Today />}
      {tab === 'history' && <History />}
      {tab === 'stats' && <Stats />}
      {tab === 'outfits' && <Outfits />}
      {tab === 'manage' && <Manage />}
      <NavBar active={tab} onChange={setTab} />
    </div>
  )
}
