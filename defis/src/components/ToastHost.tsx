import { useEffect, useRef, useState } from 'react'
import { subscribeToast } from '../lib/toast'

export function ToastHost() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return subscribeToast((msg) => {
      setMessage(msg)
      setVisible(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(false), 2500)
    })
  }, [])

  return (
    <div className={`toast ${visible ? 'show' : ''}`}>{message}</div>
  )
}
