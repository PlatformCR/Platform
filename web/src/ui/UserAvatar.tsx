import { useState } from 'react'
import { userInitials } from './userInitials'

type UserAvatarProps = {
  displayName?: string | null
  personalId?: string | null
  email?: string | null
  avatarUrl?: string | null
  className?: string
  size?: 'sm' | 'md'
}

export function UserAvatar({
  displayName,
  personalId,
  email,
  avatarUrl,
  className = '',
  size = 'sm',
}: UserAvatarProps) {
  const [broken, setBroken] = useState(false)
  const initials = userInitials(displayName, personalId, email)
  const showImage = Boolean(avatarUrl?.trim()) && !broken

  return (
    <span
      className={`user-avatar user-avatar--${size}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          className="user-avatar__img"
          src={avatarUrl!}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="user-avatar__initials">{initials}</span>
      )}
    </span>
  )
}
