/** Initials for avatar from display name, personal ID, or email (GymPlatform-style). */
export function userInitials(
  displayName?: string | null,
  personalId?: string | null,
  email?: string | null,
): string {
  const name = (displayName ?? '').trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
    }
    const cleaned = name.replace(/[^a-zA-ZÀ-ÿ0-9]/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2).toUpperCase()
    }
    if (cleaned.length === 1) {
      return cleaned.toUpperCase()
    }
  }

  const id = (personalId ?? '').trim()
  if (id) {
    const cleaned = id.replace(/[^a-zA-Z0-9]/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2).toUpperCase()
    }
    if (cleaned.length === 1) {
      return cleaned.toUpperCase()
    }
  }

  const mail = (email ?? '').trim()
  if (mail) {
    const local = mail.split('@')[0] ?? ''
    const parts = local.split(/[._-]+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
    }
    const cleaned = local.replace(/[^a-zA-Z0-9]/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2).toUpperCase()
    }
    if (cleaned.length === 1) {
      return cleaned.toUpperCase()
    }
  }

  return '?'
}
