import { useState, useEffect, useCallback } from 'react'
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js'
import validateEmployee from '../../../util/validateEmployee.js'
import messageUtility from '../../../util/messageUtility.jsx'

const AddEmployeePage = () => {
    const [departments, setDepartments] = useState([])
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [hireDate, setHireDate] = useState('')
    const [departmentId, setDepartmentId] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isActive, setIsActive] = useState(1)
    const [successMessages, setSuccessMessages] = useState([])
    const [errorMessages, setErrorMessages] = useState([])
    const backEndUrl = import.meta.env.VITE_BACK_END_URL

    const addEmployee = async event => {
        event.preventDefault()
        window.scrollTo(0, 0)
        setSuccessMessages([])
        setErrorMessages([])

        const newErrors = []

        const firstNameValid = validateEmployee.validateFirstName(firstName)
        if (!firstNameValid.valid) newErrors.push(firstNameValid.message)

        const lastNameValid = validateEmployee.validateLastName(lastName)
        if (!lastNameValid.valid) newErrors.push(lastNameValid.message)

        const titleValid = validateEmployee.validateTitle(title)
        if (!titleValid.valid) newErrors.push(titleValid.message)  

        const emailValid = await validateEmployee.validateEmail(email)
        if (!emailValid.valid) newErrors.push(emailValid.message)

        const hireDateValid = validateEmployee.validateHireDate(hireDate)
        if (!hireDateValid.valid) newErrors.push(hireDateValid.message)

        const departmentIdValid =
            await validateEmployee.validateDepartmentId(departmentId)
        if (!departmentIdValid.valid) newErrors.push(departmentIdValid.message)

        const countryCodeValid =
            validateEmployee.validateCountryCode(countryCode)
        if (!countryCodeValid.valid) newErrors.push(countryCodeValid.message)

        const phoneNumberValid =
            validateEmployee.validatePhoneNumber(phoneNumber)
        if (!phoneNumberValid.valid) newErrors.push(phoneNumberValid.message)

        const isActiveValid = validateEmployee.validateIsActive(isActive)
        if (!isActiveValid.valid) newErrors.push(isActiveValid.message)        

        if (newErrors.length > 0) {
            setErrorMessages(newErrors)
            return
        }

        const fetchResult = await fetchFromBackEnd(
            `${backEndUrl}/api/v1/employees`,
            'POST',
            'application/json',
            'same-origin',
            {
                firstName,
                lastName,
                title,
                email,
                hireDate,
                departmentId,
                countryCode,
                phoneNumber,
                isActive
            }
        )

        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setFirstName('')
            setLastName('')
            setTitle('')
            setEmail('')
            setHireDate('')
            setDepartmentId('')
            setCountryCode('')
            setPhoneNumber('')
            setIsActive(1)
            setSuccessMessages(['Employee added successfully'])
            return
        }

        setErrorMessages(
            fetchResult.data?.validationErrors ||
            ['Error adding employee']
        )
    }

    const getDepartments = useCallback(async () => {
        setSuccessMessages([])
        setErrorMessages([])

        const fetchResult =
            await fetchFromBackEnd(`${backEndUrl}/api/v1/departments`)

        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setDepartments(fetchResult.data)
            return
        }
        
        setErrorMessages(['Error loading departments'])
    }, [backEndUrl])

    useEffect(() => {
        getDepartments()
    }, [getDepartments])

    const successMessageDisplay =
        messageUtility.displaySuccessMessages(successMessages)
    const errorMessageDisplay =
        messageUtility.displayErrorMessages(errorMessages)

    const departmentOptions = departments.map(department => {
        return (
            <option key={department.id} value={department.id}>
                {department.name}
            </option>
        )
    })

    return (
        <div className="container mt-4">
            {successMessageDisplay}
            {errorMessageDisplay}
            <h2>Add Employee</h2>

            <br />
            <form onSubmit={addEmployee}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                        First name
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="firstName"
                        value={firstName}
                        onChange={event => setFirstName(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                        Last name
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="lastName"
                        value={lastName}
                        onChange={event => setLastName(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Job title
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="title"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="countryCode" className="form-label">
                        Country code for phone number
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="countryCode"
                        value={countryCode}
                        onChange={event => setCountryCode(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                        Phone number without country code
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={event => setPhoneNumber(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="isActive" className="form-label">
                        Active status
                    </label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input rounded-0"
                            id="isActive"
                            checked={isActive === 1}
                            onChange={
                                event =>
                                    setIsActive(event.target.checked ? 1 : 0)
                            }
                        />
                        <label className="form-check-label" htmlFor="isActive">
                            Active
                        </label>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="departmentId" className="form-label">
                        Department
                    </label>
                    <select
                        className="form-control rounded-0"
                        id="departmentId"
                        value={departmentId}
                        onChange={event => {
                            setDepartmentId(
                                event.target.value === ''
                                    ? ''
                                    : parseInt(event.target.value, 10)
                            )
                        }}
                    >
                        <option value="">Select department...</option>
                        {departmentOptions}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="hireDate" className="form-label">
                        Hire date
                    </label>
                    <input
                        type="date"
                        className="form-control rounded-0"
                        id="hireDate"
                        value={hireDate}
                        onChange={event => setHireDate(event.target.value)}
                    />
                </div>

                <br />
                <button 
                    type="submit"
                    className="btn btn-primary mb-3 rounded-0"
                >
                    Submit
                </button>
            </form>
            <br />
        </div>
    )
}

export default AddEmployeePage
