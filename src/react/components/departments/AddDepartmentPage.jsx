import { useState } from 'react'
import fetchFromBackEnd from '../../../util/fetchFromBackEnd.js'
import validateDepartment from '../../../util/validateDepartment.js'
import messageUtility from '../../../util/messageUtility.jsx'

const AddDepartmentPage = () => {
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [location, setLocation] = useState('')
    const [successMessages, setSuccessMessages] = useState([])
    const [errorMessages, setErrorMessages] = useState([])
    const backEndUrl = import.meta.env.VITE_BACK_END_URL
    
    const addDepartment = async event => {
        event.preventDefault()
        window.scrollTo(0, 0)
        setSuccessMessages([])
        setErrorMessages([])

        const newErrors = []

        const nameValid = validateDepartment.validateName(name)
        if (!nameValid.valid) newErrors.push(nameValid.message)

        const codeValid = await validateDepartment.validateCode(code)
        if (!codeValid.valid) newErrors.push(codeValid.message)

        const locationValid = validateDepartment.validateLocation(location)
        if (!locationValid.valid) newErrors.push(locationValid.message)
        
        if (newErrors.length > 0) {
            setErrorMessages(newErrors)
            return
        }

        const fetchResult = await fetchFromBackEnd(
            `${backEndUrl}/api/v1/departments`,
            'POST',
            'application/json',
            'same-origin',
            { name, code, location }
        )

        if (fetchResult.status >= 200 && fetchResult.status < 300) {
            setName('')
            setCode('')
            setLocation('')
            setSuccessMessages(['Department added successfully'])
            return
        }

        setErrorMessages(
            fetchResult.data?.validationErrors ||
            ['Error adding department']
        )
    }

    const successMessageDisplay =
        messageUtility.displaySuccessMessages(successMessages)
    const errorMessageDisplay =
        messageUtility.displayErrorMessages(errorMessages)

    return (
        <div className="container mt-4">
            {successMessageDisplay}
            {errorMessageDisplay}            
            <h2>Add Department</h2>

            <br />
            <form onSubmit={addDepartment}>
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
                    className="btn btn-primary mb-3 rounded-0"
                >
                    Submit
                </button>
            </form>
            <br />
        </div>
    )
}

export default AddDepartmentPage
