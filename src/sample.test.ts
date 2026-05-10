import { describe, it, expect } from 'vitest'

describe('sample', () => {
  it('adds two numbers', () => {
    expect(1 + 2).toBe(3)
  })

  it('checks a string', () => {
    expect('vitest').toContain('test')
  })
})
