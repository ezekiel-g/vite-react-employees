import { describe, it, expect, afterEach, vi } from 'vitest'
import fetchFromBackEnd from '../../util/fetchFromBackEnd.js'
import validationHelper from '../../util/validationHelper.js'

vi.mock('../../util/fetchFromBackEnd.js')

const fetchFunction = vi.fn()

describe('validationHelper', () => {
    afterEach(() => { vi.clearAllMocks() })

    describe('getDepartments', () => {
        it('fetches departments using fetchFromBackEnd', async () => {
            const departments = [
                { id: 1, name: 'IT' },
                { id: 2, name: 'HR' }
            ]

            fetchFromBackEnd.mockResolvedValueOnce({ data: departments })

            const fetchResult = await validationHelper.getDepartments()

            expect(fetchResult).toEqual(departments)
        })
    })

    describe('getEmployees', () => {
        it('fetches employees using fetchFromBackEnd', async () => {
            const employees = [
                { id: 1, last_name: 'Smith' },
                { id: 2, last_name: 'Jones' }
            ]

            fetchFromBackEnd.mockResolvedValueOnce({ data: employees })

            const fetchResult = await validationHelper.getEmployees()

            expect(fetchResult).toEqual(employees)
        })
    })

    describe('checkForDuplicate', () => {
        it('returns "pass" when no results returned from fetch', async () => {
            fetchFunction.mockResolvedValueOnce([])

            const duplicateCheck = await validationHelper.checkForDuplicate(
                { name: 'value1' },
                fetchFunction
            )

            expect(duplicateCheck).toBe('pass')
        })

        it('returns "pass" when no duplicate is found', async () => {
            fetchFunction.mockResolvedValueOnce([
                { id: 1, name: 'value2' },
                { id: 2, name: 'value3' }
            ])

            const duplicateCheck = await validationHelper.checkForDuplicate(
                { name: 'value1' },
                fetchFunction
            )

            expect(duplicateCheck).toBe('pass')
        })

        it('returns "fail" when a duplicate is found', async () => {
            fetchFunction.mockResolvedValueOnce([
                { id: 1, name: 'value1' },
                { id: 2, name: 'value2' }
            ])

            const duplicateCheck = await validationHelper.checkForDuplicate(
                { name: 'value1' },
                fetchFunction
            )

            expect(duplicateCheck).toBe('fail')
        })

        it('excludes the ID when one is passed in', async () => {
            fetchFunction.mockResolvedValueOnce([
                { id: 1, name: 'value1' },
                { id: 2, name: 'value2' }
            ])

            const duplicateCheck = await validationHelper.checkForDuplicate(
                { name: 'value1' },
                fetchFunction,
                1
            )

            expect(duplicateCheck).toBe('pass')
        })
    })

    describe('returnSuccess', () => {
        it('returns success message when current value is different', () => {
            const validationResult =
                validationHelper.returnSuccess('Name', 'value1', 'value2')

            expect(validationResult).toEqual({
                valid: true,
                message: 'Name updated successfully'
            })
        })

        it('returns no message when current value is the same', () => {
            const validationResult =
                validationHelper.returnSuccess('Name', 'value1', 'value1')

            expect(validationResult).toEqual({
                valid: true,
                message: null
            })
        })

        it('returns no message if current value is null', () => {
            const validationResult =
                validationHelper.returnSuccess('Name', 'value1', null)

            expect(validationResult).toEqual({
                valid: true,
                message: null
            })
        })

        it('returns no message if current value is undefined', () => {
            const validationResult =
                validationHelper.returnSuccess('Name', 'value1', undefined)

            expect(validationResult).toEqual({
                valid: true,
                message: null
            })
        })
    })
})
