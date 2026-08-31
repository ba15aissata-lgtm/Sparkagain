import { useState } from 'react'
import { NavBar, type Tab } from './components/NavBar'
import { Today } from './components/Today'
import { Challenges } from './components/Challenges'
import { History } from './components/History'
import { ToastHost } from './components/ToastHost'

export default function App() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="min-h-screen">
      {tab === 'today' && <Today />}
      {tab === 'challenges' && <Challenges />}
      {tab === 'history' && <History />}
      <NavBar active={tab} onChange={setTab} />
      <ToastHost />
    </div>
  )
}
