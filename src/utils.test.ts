import { describe, it, expect } from 'vitest'
import { clamp, formatDuration, parseVolume, isSupportedVideoFormat, getAspectRatio } from './utils'

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to min when below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps to max when above range', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('handles equal min and max', () => {
    expect(clamp(7, 5, 5)).toBe(5)
  })
})

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('0:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2:05')
  })

  it('formats hours, minutes, and seconds', () => {
    expect(formatDuration(3661)).toBe('1:01:01')
  })

  it('pads minutes when hours are present', () => {
    expect(formatDuration(3600)).toBe('1:00:00')
  })

  it('returns 0:00 for negative input', () => {
    expect(formatDuration(-10)).toBe('0:00')
  })

  it('returns 0:00 for non-finite input', () => {
    expect(formatDuration(Infinity)).toBe('0:00')
    expect(formatDuration(NaN)).toBe('0:00')
  })
})

describe('parseVolume', () => {
  it('parses a valid percentage string', () => {
    expect(parseVolume('75%')).toBe(0.75)
  })

  it('parses 0%', () => {
    expect(parseVolume('0%')).toBe(0)
  })

  it('parses 100%', () => {
    expect(parseVolume('100%')).toBe(1)
  })

  it('clamps values above 100%', () => {
    expect(parseVolume('150%')).toBe(1)
  })

  it('parses decimal percentages', () => {
    expect(parseVolume('50.5%')).toBeCloseTo(0.505)
  })

  it('returns null for invalid input', () => {
    expect(parseVolume('abc')).toBeNull()
    expect(parseVolume('75')).toBeNull()
    expect(parseVolume('')).toBeNull()
  })

  it('trims whitespace before parsing', () => {
    expect(parseVolume('  50%  ')).toBe(0.5)
  })
})

describe('isSupportedVideoFormat', () => {
  it('returns true for supported formats', () => {
    expect(isSupportedVideoFormat('movie.mp4')).toBe(true)
    expect(isSupportedVideoFormat('clip.mkv')).toBe(true)
    expect(isSupportedVideoFormat('video.mov')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isSupportedVideoFormat('movie.MP4')).toBe(true)
    expect(isSupportedVideoFormat('clip.MKV')).toBe(true)
  })

  it('returns false for unsupported formats', () => {
    expect(isSupportedVideoFormat('document.pdf')).toBe(false)
    expect(isSupportedVideoFormat('audio.mp3')).toBe(false)
  })

  it('returns false for files with no extension', () => {
    expect(isSupportedVideoFormat('noextension')).toBe(false)
  })
})

describe('getAspectRatio', () => {
  it('returns 16:9 for 1920x1080', () => {
    expect(getAspectRatio(1920, 1080)).toBe('16:9')
  })

  it('returns 4:3 for 1024x768', () => {
    expect(getAspectRatio(1024, 768)).toBe('4:3')
  })

  it('returns 1:1 for square dimensions', () => {
    expect(getAspectRatio(500, 500)).toBe('1:1')
  })

  it('simplifies the ratio', () => {
    expect(getAspectRatio(800, 600)).toBe('4:3')
  })

  it('handles already-simplified ratios', () => {
    expect(getAspectRatio(3, 2)).toBe('3:2')
  })

  it('returns null for zero width', () => {
    expect(getAspectRatio(0, 1080)).toBeNull()
  })

  it('returns null for zero height', () => {
    expect(getAspectRatio(1920, 0)).toBeNull()
  })

  it('returns null for negative dimensions', () => {
    expect(getAspectRatio(-1920, 1080)).toBeNull()
  })

  it('returns null for non-integer inputs', () => {
    expect(getAspectRatio(1920.5, 1080)).toBeNull()
  })
})
