import fetchFromBackEnd from './fetchFromBackEnd.js'
import checkForDuplicate from './checkForDuplicate.js'
import checkForChanges from './checkForChanges.js'

const backEndUrl = import.meta.env.VITE_BACK_END_URL

const getDepartments = async () => {
    const fetchResult =
        await fetchFromBackEnd(`${backEndUrl}/api/v1/departments`)
    return fetchResult
}

const getEmployees = async () => {
    const fetchResult =
        await fetchFromBackEnd(`${backEndUrl}/api/v1/employees`)
    return fetchResult
}

const validateEmployee = {
    validateFirstName: firstName => {
        if (!firstName || firstName.trim() === '') {
            return { valid: false, message: 'First name required' }
        }

        const firstNameRegex = /^[A-Za-z'-\s]{1,100}$/

        if (!firstNameRegex.test(firstName)) {
            return {
                valid: false,
                message: 'First name can be maximum 100 characters and can ' +
                         'contain only letters, apostrophes, hyphens and ' +
                         'spaces between words.'
            }
        }

        return { valid: true, message: '' }
    },

    validateLastName: lastName => {
        if (!lastName || lastName.trim() === '') {
            return { valid: false, message: 'Last name required' }
        }

        const lastNameRegex = /^[A-Za-z'-\s]{1,100}$/

        if (!lastNameRegex.test(lastName)) {
            return {
                valid: false,
                message: 'Last name can be maximum 100 characters and can ' +
                         'contain only letters, apostrophes, hyphens and ' +
                         'spaces between words.'
            }
        }

        return { valid: true, message: '' }
    },

    validateTitle: title => {
        if (!title || title.trim() === '') {
            return { valid: false, message: 'Job title required' }
        }

        const titleRegex = /^[A-Za-z'-\s]{1,100}$/

        if (!titleRegex.test(title)) {
            return {
                valid: false,
                message: 'Job title can be maximum 100 characters and can ' +
                         'contain only letters, apostrophes, hyphens and ' +
                         'spaces between words.'
            }
        }

        return { valid: true, message: '' }
    },

    validateEmail: async (
        email,
        excludeId = null,
        skipDuplicateCheck = null
    ) => {
        if (!email || email.trim() === '') {
            return { valid: false, message: 'Email address required' }
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

        if (!emailRegex.test(email)) {
            return {
                valid: false,
                message:
                    'Email address must contain only letters, numbers, ' +
                    'periods, underscores, hyphens, plus signs and percent ' +
                    'signs before the "@", a domain name after the "@", and ' +
                    'a valid domain extension (e.g. ".com", ".net", ".org") ' +
                    'of at least two letters'
            }
        }

        if (skipDuplicateCheck !== 'skipDuplicateCheck') {
            const duplicateCheck = await checkForDuplicate(
                { email },
                getEmployees,
                Number(excludeId)
            )

            if (duplicateCheck !== 'pass') {
                return { valid: false, message: 'Email address taken' }
            }
        }
        
        return { valid: true, message: '' }
    },

    validateHireDate: hireDate => {
        if (!hireDate) {
            return { valid: false, message: 'Hire date is required' }
        }

        return { valid: true, message: '' }
    },

    validateDepartmentId: async departmentId => {
        if (!departmentId) {
            return { valid: false, message: 'Department ID required' }
        }
        
        if (!(Number.isInteger(departmentId) && departmentId > 0)) {
            return {
                valid: false,
                message: 'Department ID must be an integer greater than 0'
            }
        }

        const fetchResult = await getDepartments()
        const departments = fetchResult.data

        if (!departments.some(department => department.id === departmentId)) {
            return { valid: false, message: 'Invalid department' }
        }

        return { valid: true, message: '' }
    },

    validateCountryCode: countryCode => {
        if (!countryCode) {
            return { valid: false, message: 'Country code required' }
        }

        const countryCodeRegex = /^\+?\d{1,4}$/

        if (!countryCodeRegex.test(countryCode)) {
            return {
                valid: false,
                message: 'Country code must be between 1 and 4 digits and ' +
                         'may optionally start with "+"'
            }
        }

        return { valid: true, message: '' }
    },

    validatePhoneNumber: phoneNumber => {
        if (!phoneNumber) {
            return { valid: false, message: 'Phone number required' }
        }

        const phoneNumberRegex = /^\d{7,15}$/

        if (!phoneNumberRegex.test(phoneNumber)) {
            return {
                valid: false,
                message: 'Phone number must be between 7 and 15 digits and ' +
                         'contain only digits'
            }
        }

        return { valid: true, message: '' }
    },

    validateIsActive: isActive => {
        if (isActive !== 0 && isActive !== 1) {
            return { valid: false, message: 'isActive must be 0 or 1' }
        }

        return { valid: true, message: '' }
    },

    checkForEmployeeChanges: async (entries, employeeId) => {
        const changeHappened = await checkForChanges(
            entries,
            getEmployees,
            Number(employeeId)
        )

        return changeHappened
    }    
}



export default validateEmployee