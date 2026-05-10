/**
 * Clamps a number between a minimum and maximum value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Formats a duration in seconds to a human-readable string (HH:MM:SS or MM:SS).
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0 || !Number.isFinite(seconds)) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

/**
 * Parses a volume string like "75%" into a normalized float between 0 and 1.
 * Returns null if the input is invalid.
 */
export function parseVolume(input: string): number | null {
  const match = input.trim().match(/^(\d+(\.\d+)?)%$/)
  if (!match) return null
  const value = parseFloat(match[1])
  return clamp(value, 0, 100) / 100
}

/**
 * Returns true if the given file extension is a supported video format.
 */
export function isSupportedVideoFormat(filename: string): boolean {
  const supported = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'm4v']
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return supported.includes(ext)
}
