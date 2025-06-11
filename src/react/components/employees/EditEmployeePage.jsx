import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js'
import validateEmployee from '../../../util/validateEmployee.js'
import messageUtility from '../../../util/messageUtility.jsx'

const EditEmployeePage = () => {
    const [employee, setEmployee] = useState({})
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
    const navigate = useNavigate()
    const { id } = useParams()
    const backEndUrl = import.meta.env.VITE_BACK_END_URL

    const editEmployee = async event => {
        event.preventDefault()
        
        if (
            !window.confirm(
                `Edit ${employee.last_name}, ${employee.first_name}?`
            )
        ) {
            return
        }

        window.scrollTo(0, 0)
        setSuccessMessages([])
        setErrorMessages([])

        const newErrors = []
        const changeCheckObject = {}

        const firstNameValid = validateEmployee.validateFirstName(firstName)
        if (!firstNameValid.valid) {
            newErrors.push(firstNameValid.message)
        } else {
            changeCheckObject.firstName = firstName
        }

        const lastNameValid = validateEmployee.validateLastName(lastName)
        if (!lastNameValid.valid) {
            newErrors.push(lastNameValid.message)
        } else {
            changeCheckObject.lastName = lastName 
        }

        const titleValid = validateEmployee.validateTitle(title)
        if (!titleValid.valid) {
            newErrors.push(titleValid.message)
        } else {
            changeCheckObject.title = title 
        }

        const emailValid =
            await validateEmployee.validateEmail(email, employee.id)
        if (!emailValid.valid) {
            newErrors.push(emailValid.message)
        } else {
            changeCheckObject.email = email 
        }

        const hireDateValid = validateEmployee.validateHireDate(hireDate)
        if (!hireDateValid.valid) {
            newErrors.push(hireDateValid.message)
        } else {
            changeCheckObject.hireDate = hireDate
        }

        const departmentIdValid =
            await validateEmployee.validateDepartmentId(departmentId)
        if (!departmentIdValid.valid) {
            newErrors.push(departmentIdValid.message)
        } else {
            changeCheckObject.departmentId = departmentId 
        }

        const countryCodeValid =
            validateEmployee.validateCountryCode(countryCode)
        if (!countryCodeValid.valid) {
            newErrors.push(countryCodeValid.message)
        } else {
            changeCheckObject.countryCode = countryCode 
        }

        const phoneNumberValid =
            validateEmployee.validatePhoneNumber(phoneNumber)
        if (!phoneNumberValid.valid) {
            newErrors.push(phoneNumberValid.message)
        } else {
            changeCheckObject.phoneNumber = phoneNumber
        }

        const isActiveValid = validateEmployee.validateIsActive(isActive)
        if (!isActiveValid.valid) {
            newErrors.push(isActiveValid.message)
        } else {
            changeCheckObject.isActive = isActive
        }

        if (newErrors.length === 0) {
            const changeHappened =
                await validateEmployee.checkForEmployeeChanges(
                    changeCheckObject,
                    employee.id
                )
            
            if (!changeHappened.valid) newErrors.push(changeHappened.message)
        }

        if (newErrors.length > 0) {
            setErrorMessages(newErrors)
            return
        }

        const fetchResult = await fetchFromBackEnd(
            `${backEndUrl}/api/v1/employees/${employee.id}`,
            'PATCH',
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
            setSuccessMessages(['Employee edited successfully'])
            return
        }

        setErrorMessages(
            fetchResult.data?.validationErrors ||
            ['Error editing employee']
        )                
    }

    const getDepartments = useCallback(async () => {
        const fetchResult =
            await fetchFromBackEnd(`${backEndUrl}/api/v1/departments`)

        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setDepartments(fetchResult.data)
            return
        }
        
        setErrorMessages(['Error loading departments'])
    }, [backEndUrl])    

    const getEmployee = useCallback(async () => {
        const fetchResult = await fetchFromBackEnd(
            `${backEndUrl}/api/v1/employees/${id}`
        )
        
        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setEmployee(fetchResult.data[0])
            setFirstName(fetchResult.data[0]?.first_name)
            setLastName(fetchResult.data[0]?.last_name)
            setTitle(fetchResult.data[0]?.title)
            setEmail(fetchResult.data[0]?.email)
            setHireDate(fetchResult.data[0]?.hire_date)
            setDepartmentId(fetchResult.data[0]?.department_id)
            setCountryCode(fetchResult.data[0]?.country_code)
            setPhoneNumber(fetchResult.data[0]?.phone_number)
            setIsActive(fetchResult.data[0]?.is_active)
            return
        }
        
        setErrorMessages(['Error loading employee'])
    }, [backEndUrl, id])

    useEffect(() => {
        setSuccessMessages([])
        setErrorMessages([])
        getDepartments()
        getEmployee()
    }, [getEmployee, getDepartments])

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
            <h2>Edit {employee.last_name}, {employee.first_name}</h2>

            <br />
            <form onSubmit={editEmployee}>

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
                        onChange={event => setLastName(event.target.value)}
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

                <button 
                    type="submit"
                    className="btn btn-primary mb-3 rounded-0 me-2"
                >
                    Submit
                </button>
                <button
                    onClick={event => {
                        event.preventDefault()
                        navigate(`/employees/details/${employee.id}`)
                    }}
                    className="btn btn-secondary mb-3 rounded-0"
                >
                    Back to Details
                </button>
            </form>
        </div>
    )
}

export default EditEmployeePage
