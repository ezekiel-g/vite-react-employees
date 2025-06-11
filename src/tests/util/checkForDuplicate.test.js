import { describe, it, expect, vi } from 'vitest'
import checkForDuplicate from '../../util/checkForDuplicate.js'

describe('checkForDuplicate', () => {
    it('returns "pass" if no rows are found', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({ data: [] })

        const duplicateCheck = await checkForDuplicate(
            { columnName: 'value' },
            fetchFunction
        )
        
        expect(duplicateCheck).toBe('pass')
    })

    it('returns "pass" if no duplicate is found', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({
            data: [{ id: 1, column_name: 'value' }]
        })

        const duplicateCheck = await checkForDuplicate(
            { columnName: 'newValue' },
            fetchFunction
        )
        
        expect(duplicateCheck).toBe('pass')
    })

    it('returns "fail" if a duplicate is found', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({
            data: [
                { id: 1, column_name: 'value1' },
                { id: 2, column_name: 'value2' }
            ]
        })

        const duplicateCheck = await checkForDuplicate(
            { columnName: 'value1' },
            fetchFunction
        )
        
        expect(duplicateCheck).toBe('fail')
    })

    it('excludes row with excludeIdForUpdate from the check', async () => {
        const fetchFunction = vi.fn().mockResolvedValue({
            data: [
                { id: 1, column_name: 'value1' },
                { id: 2, column_name: 'value2' }
            ]
        })

        const duplicateCheck = await checkForDuplicate(
            { columnName: 'value1' },
            fetchFunction,
            1
        )
        
        expect(duplicateCheck).toBe('pass')
    })
})
