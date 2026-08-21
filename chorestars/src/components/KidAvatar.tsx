import type { Kid } from '../types'
import { KID_COLOR_STYLES, type KidColorId } from '../data/kidColors'

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-base',
  md: 'h-10 w-10 text-lg',
  lg: 'h-14 w-14 text-2xl',
}

export function KidAvatar({ kid, size = 'md' }: { kid: Kid; size?: keyof typeof SIZE_CLASSES }) {
  const style = KID_COLOR_STYLES[(kid.color as KidColorId) in KID_COLOR_STYLES ? (kid.color as KidColorId) : 'violet']
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${style.bgSoft} ${SIZE_CLASSES[size]}`}
    >
      {kid.emoji}
    </span>
  )
}
