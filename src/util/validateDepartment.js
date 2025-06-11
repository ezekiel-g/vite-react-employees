import fetchFromBackEnd from './fetchFromBackEnd.js'
import checkForDuplicate from './checkForDuplicate.js'
import checkForChanges from './checkForChanges.js'

const backEndUrl = import.meta.env.VITE_BACK_END_URL

const getDepartments = async () => {
    const fetchResult =
        await fetchFromBackEnd(`${backEndUrl}/api/v1/departments`)
    return fetchResult
}

const validateDepartment = {
    validateName: name => {
        if (!name || name.trim() === '') {
            return { valid: false, message: 'Name required' }
        }

        const nameRegex = /^[A-Za-z'-\s]{1,100}$/

        if (!nameRegex.test(name)) {
            return {
                valid: false,
                message: 'Name can be maximum 100 characters and can contain ' +
                         'only letters, numbers, spaces, hyphens, ' +
                         'apostrophes and periods'
            }
        }

        return { valid: true, message: '' }
    },

    validateCode: async (code, excludeId = null) => {
        if (!code || code.trim() === '') {
            return { valid: false, message: 'Code required' }
        }

        const codeRegex = /^[A-Z0-9]{1,20}$/

        if (!codeRegex.test(code)) {
            return {
                valid: false,
                message: 'Code can be maximum 20 characters and can contain  ' +
                         'only numbers and capital letters'
            }
        }

        const duplicateCheck = await checkForDuplicate(
            { code },
            getDepartments,
            Number(excludeId)
        )

        if (duplicateCheck !== 'pass') {
            return { valid: false, message: 'Code taken' }
        }

        return { valid: true, message: '' }
    },    

    validateLocation: location => {
        const validLocations = new Set(['New York', 'San Francisco', 'London'])

        if (!location || location === 'Select location...') {
            return { valid: false, message: 'Location required' }
        }

        if (!validLocations.has(location)) {
            return { valid: false, message: 'Location not currently valid' }
        }

        return { valid: true, message: '' }
    },

    validateIsActive: isActive => {
        if (isActive !== 0 && isActive !== 1) {
            return { valid: false, message: 'isActive must be 0 or 1' }
        }

        return { valid: true, message: '' }
    },

    checkForDepartmentChanges: async (entries, departmentId) => {
        const changeHappened = await checkForChanges(
            entries,
            getDepartments,
            Number(departmentId)
        )

        return changeHappened
    }    
}

export default validateDepartment
