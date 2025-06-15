import { describe, it, expect } from 'vitest'
import formatDateAndTime from '../../util/formatDateAndTime'

describe('formatDateAndTime', () => {
    it('returns formatted date and time for valid UTC string', () => {
        const formattedDateAndTime = formatDateAndTime('2024-05-01T00:00:00')

        expect(formattedDateAndTime).toBe('2024-05-01')
    })

    it('returns formatted date and time for valid UTC string with time', () => {
        const formattedDateAndTime = formatDateAndTime('2024-05-01T15:30:00')

        expect(formattedDateAndTime).toBe('2024-05-01 at 3:30 PM')
    })

    it('returns "Invalid date" for empty input', () => {
        const formattedDateAndTime = formatDateAndTime('')

        expect(formattedDateAndTime).toBe('Invalid date')
    })

    it('returns "Invalid date" for null input', () => {
        const formattedDateAndTime = formatDateAndTime(null)

        expect(formattedDateAndTime).toBe('Invalid date')
    })

    it('returns formatted date and time for 12:00 AM UTC', () => {
        const formattedDateAndTime = formatDateAndTime('2024-05-01T00:00:00')

        expect(formattedDateAndTime).toBe('2024-05-01')
    })
})
