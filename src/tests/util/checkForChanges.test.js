import { describe, it, expect, vi } from 'vitest'
import checkForChanges from '../../util/checkForChanges.js'

describe('checkForChanges', () => {
    it('returns error if entry not found', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({ data: [] })
        
        const changeHappened =
            await checkForChanges({ testColumn: 'newValue' }, fetchFunction, 1)
        
        expect(changeHappened.valid).toBe(false)
        expect(changeHappened.message).toBe('Entry not found')
    })

    it('returns true if there are changes', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({
            data: [{ id: 1, test_column: 'oldValue' }]
        })

        const changeHappened =
            await checkForChanges({ testColumn: 'newValue' }, fetchFunction, 1)
        
        expect(changeHappened.valid).toBe(true)
        expect(changeHappened.message).toBe('')
    })

    it('returns false if no changes detected', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({
            data: [{ id: 1, test_column: 'sameValue' }]
        })

        const changeHappened =
            await checkForChanges({ testColumn: 'sameValue' }, fetchFunction, 1)
        
        expect(changeHappened.valid).toBe(false)
        expect(changeHappened.message).toBe('No changes detected')
    })
})
