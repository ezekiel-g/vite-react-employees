import { describe, it, expect, vi } from 'vitest'
import validateDepartment from '../../util/validateDepartment.js'
import checkForDuplicate from '../../util/checkForDuplicate.js'
import checkForChanges from '../../util/checkForChanges.js'

vi.mock('../../util/checkForDuplicate')
vi.mock('../../util/checkForChanges')

describe('validateDepartment', () => {
    it('validates name correctly', () => {
        const validName = 'Marketing'
        const invalidName1 = ''
        const invalidName2 = 'M@rketing'
        const invalidName3 = 'A'.repeat(101)

        expect(validateDepartment.validateName(validName).valid).toBe(true)
        expect(validateDepartment.validateName(invalidName1).valid).toBe(false)
        expect(validateDepartment.validateName(invalidName2).valid).toBe(false)
        expect(validateDepartment.validateName(invalidName3).valid).toBe(false)
    })

    it('validates code correctly', async () => {
        const validCode = 'ABC123'
        const invalidCode1 = ''
        const invalidCode2 = 'AB123#'
        const duplicateCode = 'DUPLICATE'

        checkForDuplicate.mockResolvedValueOnce('pass')
        checkForDuplicate.mockResolvedValueOnce('fail')

        const validResult = await validateDepartment.validateCode(validCode)
        const invalidResult1 =
            await validateDepartment.validateCode(invalidCode1)
        const invalidResult2 =
            await validateDepartment.validateCode(invalidCode2)
        const invalidResult3 =
            await validateDepartment.validateCode(duplicateCode)

        expect(validResult.valid).toBe(true)
        expect(invalidResult1.valid).toBe(false)
        expect(invalidResult2.valid).toBe(false)
        expect(invalidResult3.valid).toBe(false)
    })

    it('validates location correctly', () => {
        const validLocation = 'New York'
        const invalidLocation1 = ''
        const invalidLocation2 = 'Chicago'

        expect(validateDepartment.validateLocation(validLocation).valid).toBe(
            true
        )
        expect(
            validateDepartment.validateLocation(invalidLocation1).valid
        ).toBe(false)
        expect(
            validateDepartment.validateLocation(invalidLocation2).valid
        ).toBe(false)
    })

    it('validates isActive correctly', () => {
        const validIsActive1 = 0
        const validIsActive2 = 1
        const invalidIsActive = 2

        expect(
            validateDepartment.validateIsActive(validIsActive1).valid
        ).toBe(true)
        expect(
            validateDepartment.validateIsActive(validIsActive2).valid
        ).toBe(true)
        expect(
            validateDepartment.validateIsActive(invalidIsActive).valid
        ).toBe(false)
    })

    it('checks for department changes correctly', async () => {
        const mockEntries = [{ code: 'ABC123', name: 'Marketing' }]
        const departmentId = 1

        checkForChanges.mockResolvedValue(true)

        const changeHappened =
            await validateDepartment.checkForDepartmentChanges(
                mockEntries,
                departmentId
            )

        expect(changeHappened).toBe(true)

        checkForChanges.mockResolvedValue(false)
        
        const changeDidNotHappen =
            await validateDepartment.checkForDepartmentChanges(
                mockEntries,
                departmentId
            )

        expect(changeDidNotHappen).toBe(false)
    })
})
