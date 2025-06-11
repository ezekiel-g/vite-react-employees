import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js'
import validateDepartment from '../../../util/validateDepartment.js'
import messageUtility from '../../../util/messageUtility.jsx'

const EditDepartmentPage = () => {
    const [department, setDepartment] = useState({})
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [location, setLocation] = useState('')
    const [successMessages, setSuccessMessages] = useState([])
    const [errorMessages, setErrorMessages] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()
    const backEndUrl = import.meta.env.VITE_BACK_END_URL

    const editDepartment = async event => {
        event.preventDefault()
        if (!window.confirm(`Edit ${department.name}?`)) return
        window.scrollTo(0, 0)
        setSuccessMessages([])
        setErrorMessages([])

        const newErrors = []
        const changeCheckObject = {}

        const nameValid = validateDepartment.validateName(name)
        if (!nameValid.valid) {
            newErrors.push(nameValid.message)
        } else {
            changeCheckObject.name = name
        }

        const codeValid =
            await validateDepartment.validateCode(code, department.id)
        if (!codeValid.valid) {
            newErrors.push(codeValid.message)
        } else {
            changeCheckObject.code = code
        }

        const locationValid = validateDepartment.validateLocation(location)
        if (!locationValid.valid) {
            newErrors.push(locationValid.message)
        } else {
            changeCheckObject.location = location
        }
        
        if (newErrors.length === 0) {
            const changeHappened =
                await validateDepartment.checkForDepartmentChanges(
                    changeCheckObject,
                    department.id
                )
            
            if (!changeHappened.valid) newErrors.push(changeHappened.message)
        }

        if (newErrors.length > 0) {
            setErrorMessages(newErrors)
            return
        }

        const fetchResult = await fetchFromBackEnd(
            `${backEndUrl}/api/v1/departments/${department.id}`,
            'PATCH',
            'application/json',
            'same-origin',
            { name, code, location }
        )
        
        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setSuccessMessages(['Department edited successfully'])
            return
        }

        setErrorMessages(
            fetchResult.data?.validationErrors ||
            ['Error editing department']
        )                
    }

    const getDepartment = useCallback(async () => {
        setSuccessMessages([])
        setErrorMessages([])

        const fetchResult = await fetchFromBackEnd(
            `${backEndUrl}/api/v1/departments/${id}`
        )
        
        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setDepartment(fetchResult.data[0])
            setName(fetchResult.data[0]?.name)
            setCode(fetchResult.data[0]?.code)
            setLocation(fetchResult.data[0]?.location)
            return
        }
        
        setErrorMessages(['Error loading department'])
    }, [backEndUrl, id])

    useEffect(() => {
        getDepartment()
    }, [getDepartment])

    const successMessageDisplay =
        messageUtility.displaySuccessMessages(successMessages)
    const errorMessageDisplay =
        messageUtility.displayErrorMessages(errorMessages)
    
    return (
        <div className="container mt-4">
            {successMessageDisplay}
            {errorMessageDisplay}
            <h2>Edit {department.name}</h2>

            <br />
            <form onSubmit={editDepartment}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">
                        Code
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        id="code"
                        value={code}
                        onChange={event => setCode(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <select
                        className="form-control rounded-0"
                        id="location"
                        value={location}
                        onChange={event => setLocation(event.target.value)}
                    >
                        <option value="">Select location...</option>
                        <option value="New York">New York</option>
                        <option value="San Francisco">San Francisco</option>
                        <option value="London">London</option>
                    </select>
                </div>

                <br />
                <button 
                    type="submit"
                    className="btn btn-primary mb-3 rounded-0 me-2"
                >
                    Submit
                </button>
                <button
                    onClick={event => {
                        event.preventDefault()
                        navigate(`/departments/details/${department.id}`)
                    }}
                    className="btn btn-secondary mb-3 rounded-0"
                >
                    Back to Details
                </button>
            </form>
        </div>
    )
}

export default EditDepartmentPage
