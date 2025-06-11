import { describe, it, expect, vi } from 'vitest'
import fetchFromBackEnd from '../../util/fetchFromBackEnd.js'
import validateEmployee from '../../util/validateEmployee.js'
import checkForDuplicate from '../../util/checkForDuplicate.js'
import checkForChanges from '../../util/checkForChanges.js'

vi.mock('../../util/fetchFromBackEnd')
vi.mock('../../util/checkForDuplicate')
vi.mock('../../util/checkForChanges')

describe('validateEmployee', () => {
    it('validates first name correctly', () => {
        const validFirstName = 'John'
        const invalidFirstName1 = ''
        const invalidFirstName2 = 'John@Doe'
        const invalidFirstName3 = 'J'.repeat(101)

        expect(validateEmployee.validateFirstName(validFirstName).valid).toBe(
            true
        )
        expect(
            validateEmployee.validateFirstName(invalidFirstName1).valid
        ).toBe(false)
        expect(
            validateEmployee.validateFirstName(invalidFirstName2).valid
        ).toBe(false)
        expect(
            validateEmployee.validateFirstName(invalidFirstName3).valid
        ).toBe(false)
    })

    it('validates last name correctly', () => {
        const validLastName = 'Doe'
        const invalidLastName1 = ''
        const invalidLastName2 = 'Doe@Smith'
        const invalidLastName3 = 'S'.repeat(101)

        expect(validateEmployee.validateLastName(validLastName).valid).toBe(
            true
        )
        expect(validateEmployee.validateLastName(invalidLastName1).valid).toBe(
            false
        )
        expect(validateEmployee.validateLastName(invalidLastName2).valid).toBe(
            false
        )
        expect(validateEmployee.validateLastName(invalidLastName3).valid).toBe(
            false
        )
    })

    it('validates title correctly', () => {
        const validTitle = 'Job Title'
        const invalidTitle1 = ''
        const invalidTitle2 = 'Job@Title'
        const invalidTitle3 = 'T'.repeat(101)

        expect(validateEmployee.validateTitle(validTitle).valid).toBe(
            true
        )
        expect(validateEmployee.validateTitle(invalidTitle1).valid).toBe(
            false
        )
        expect(validateEmployee.validateTitle(invalidTitle2).valid).toBe(
            false
        )
        expect(validateEmployee.validateTitle(invalidTitle3).valid).toBe(
            false
        )
    })

    it('validates email correctly', async () => {
        const validEmail = 'john.doe@example.com'
        const invalidEmail1 = ''
        const invalidEmail2 = 'john.doe.com'
        const duplicateEmail = 'existing.email@example.com'

        checkForDuplicate.mockResolvedValueOnce('pass')
        checkForDuplicate.mockResolvedValueOnce('fail')

        const validResult = await validateEmployee.validateEmail(validEmail)
        const invalidResult1 =
            await validateEmployee.validateEmail(invalidEmail1)
        const invalidResult2 =
            await validateEmployee.validateEmail(invalidEmail2)
        const invalidResult3 =
            await validateEmployee.validateEmail(duplicateEmail)

        expect(validResult.valid).toBe(true)
        expect(invalidResult1.valid).toBe(false)
        expect(invalidResult2.valid).toBe(false)
        expect(invalidResult3.valid).toBe(false)
    })

    it('validates hire date correctly', () => {
        const validHireDate = '2020-01-01'
        const invalidHireDate = ''

        expect(validateEmployee.validateHireDate(validHireDate).valid).toBe(
            true
        )
        expect(validateEmployee.validateHireDate(invalidHireDate).valid).toBe(
            false
        )
    })

    it('validates department ID correctly', async () => {
        const validDepartmentId = 1
        const invalidDepartmentId1 = null
        const invalidDepartmentId2 = 'string'
        const invalidDepartmentId3 = 700

        fetchFromBackEnd.mockResolvedValue({
            data: [{ id: 1, name: 'Marketing' }]
        })

        const validResult =
            await validateEmployee.validateDepartmentId(validDepartmentId)
        const invalidResult1 =
            await validateEmployee.validateDepartmentId(invalidDepartmentId1)
        const invalidResult2 =
            await validateEmployee.validateDepartmentId(invalidDepartmentId2)
        const invalidResult3 =
            await validateEmployee.validateDepartmentId(invalidDepartmentId3)

        expect(validResult.valid).toBe(true)
        expect(invalidResult1.valid).toBe(false)
        expect(invalidResult2.valid).toBe(false)
        expect(invalidResult3.valid).toBe(false)
    })

    it('validates country code correctly', () => {
        const validCountryCode = '+1'
        const invalidCountryCode1 = ''
        const invalidCountryCode2 = 'ABC'
        const invalidCountryCode3 = '+12345'

        expect(
            validateEmployee.validateCountryCode(validCountryCode).valid
        ).toBe(true)
        expect(
            validateEmployee.validateCountryCode(invalidCountryCode1).valid
        ).toBe(false)
        expect(
            validateEmployee.validateCountryCode(invalidCountryCode2).valid
        ).toBe(false)
        expect(
            validateEmployee.validateCountryCode(invalidCountryCode3).valid
        ).toBe(false)
    })

    it('validates phone number correctly', () => {
        const validPhoneNumber = '1234567890'
        const invalidPhoneNumber1 = ''
        const invalidPhoneNumber2 = '12345'
        const invalidPhoneNumber3 = '1234567890123456'

        expect(
            validateEmployee.validatePhoneNumber(validPhoneNumber).valid
        ).toBe(true)
        expect(
            validateEmployee.validatePhoneNumber(invalidPhoneNumber1).valid
        ).toBe(false)
        expect(
            validateEmployee.validatePhoneNumber(invalidPhoneNumber2).valid
        ).toBe(false)
        expect(
            validateEmployee.validatePhoneNumber(invalidPhoneNumber3).valid
        ).toBe(false)
    })

    it('validates isActive correctly', () => {
        const validIsActive1 = 0
        const validIsActive2 = 1
        const invalidIsActive = 2

        expect(validateEmployee.validateIsActive(validIsActive1).valid).toBe(
            true
        )
        expect(validateEmployee.validateIsActive(validIsActive2).valid).toBe(
            true
        )
        expect(validateEmployee.validateIsActive(invalidIsActive).valid).toBe(
            false
        )
    })

    it('checks for employee changes correctly', async () => {
        const mockEntries = [{ firstName: 'John', lastName: 'Doe' }]
        const employeeId = 1

        checkForChanges.mockResolvedValue(true)

        const changeHappened = await validateEmployee.checkForEmployeeChanges(
            mockEntries,
            employeeId
        )

        expect(changeHappened).toBe(true)

        checkForChanges.mockResolvedValue(false)

        const changeDidNotHappen =
            await validateEmployee.checkForEmployeeChanges(
                mockEntries,
                employeeId
            )

        expect(changeDidNotHappen).toBe(false)
    })
})
