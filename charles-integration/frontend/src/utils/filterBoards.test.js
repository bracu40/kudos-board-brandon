import { describe, it, expect } from 'vitest'
import { filterBoards } from './filterBoards'
import { mockBoards } from '../data/mockBoards'

describe('filterBoards', () => {
  describe('search', () => {
    it('matches titles case-insensitively', () => {
      const result = filterBoards(mockBoards, 'thank', 'all')
      expect(result.map((b) => b.title)).toEqual([
        'Thank You, Support Team',
        'Thank You Volunteers',
      ])
    })

    it('is case-insensitive', () => {
      expect(filterBoards(mockBoards, 'CELEBRATION', 'all')).toHaveLength(3)
    })

    it('returns all boards when the query is empty', () => {
      expect(filterBoards(mockBoards, '', 'all')).toHaveLength(mockBoards.length)
    })

    it('returns nothing when no title matches', () => {
      expect(filterBoards(mockBoards, 'zzz', 'all')).toEqual([])
    })
  })

  describe('category filter', () => {
    it('all returns every board', () => {
      expect(filterBoards(mockBoards, '', 'all')).toHaveLength(mockBoards.length)
    })

    it('filters by exact category', () => {
      expect(filterBoards(mockBoards, '', 'celebration')).toHaveLength(3)
      expect(filterBoards(mockBoards, '', 'thank you')).toHaveLength(2)
      expect(filterBoards(mockBoards, '', 'inspiration')).toHaveLength(2)
    })
  })

  describe('recent filter', () => {
    it('sorts by createdAt descending and caps at 6', () => {
      const result = filterBoards(mockBoards, '', 'recent')
      expect(result).toHaveLength(6)
      // First item is the newest board (Birthday, 2026-06-29).
      expect(result[0].title).toBe('Birthday Celebration Wall')
      // Verify strictly descending order.
      for (let i = 1; i < result.length; i++) {
        expect(new Date(result[i - 1].createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(result[i].createdAt).getTime(),
        )
      }
    })

    it('does not mutate the input array', () => {
      const before = mockBoards.map((b) => b.id)
      filterBoards(mockBoards, '', 'recent')
      expect(mockBoards.map((b) => b.id)).toEqual(before)
    })
  })

  describe('combined search + filter', () => {
    it('applies both: search narrows, then category filters', () => {
      // "thank" titles are all category "thank you", so celebration yields none.
      expect(filterBoards(mockBoards, 'thank', 'celebration')).toEqual([])
      // "celebration" title search + celebration category overlap.
      const both = filterBoards(mockBoards, 'celebration', 'celebration')
      expect(both.length).toBeGreaterThan(0)
      expect(both.every((b) => b.category === 'celebration')).toBe(true)
    })
  })
})
