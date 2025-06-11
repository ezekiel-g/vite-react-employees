import { vi, afterEach, describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AddEmployeePage
    from '../../../../react/components/employees/AddEmployeePage'
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js'

vi.mock('../../../../util/fetchFromBackEnd.js')
vi.mock('../../../../util/validateEmployee.js', () => ({
    default: {
        validateFirstName: vi.fn(() => ({ valid: true })),
        validateLastName: vi.fn(() => ({ valid: true })),
        validateTitle: vi.fn(() => ({ valid: true })),
        validateEmail: vi.fn(async () => ({ valid: true })),
        validateHireDate: vi.fn(() => ({ valid: true })),
        validateDepartmentId: vi.fn(async () => ({ valid: true })),
        validateCountryCode: vi.fn(() => ({ valid: true })),
        validatePhoneNumber: vi.fn(() => ({ valid: true })),
        validateIsActive: vi.fn(() => ({ valid: true }))
    }
}))
vi.mock('../../../../util/messageUtility.jsx', () => ({
    default: {
        displaySuccessMessages:
            vi.fn(messages => <div>{messages.join(', ')}</div>),
        displayErrorMessages:
            vi.fn(messages => <div>{messages.join(', ')}</div>)
    }
}))

const renderComponent = () => {
    render(
        <MemoryRouter>
            <AddEmployeePage />
        </MemoryRouter>
    )
}

const employeeInput = {
    first_name: 'Jane',
    last_name: 'Doe',
    title: 'Engineer',
    email: 'jane@example.com',
    country_code: '+1',
    phone_number: '5551234567',
    department_id: '1',
    hire_date: '2023-01-01'
}

const departmentData = [{ id: 1, name: 'Engineering' }]

describe('AddEmployeePage', () => {
    afterEach(() => { vi.clearAllMocks() })

    it('submits and shows success message on valid input', async () => {
        fetchFromBackEnd
            .mockResolvedValueOnce({
                status: 200,
                data: departmentData
            })
            .mockResolvedValueOnce({
                status: 201,
                data: {}
            })

        renderComponent(<AddEmployeePage />)

        await waitFor(() => { expect(fetchFromBackEnd).toHaveBeenCalled() })

        fireEvent.change(screen.getByLabelText('First name'), {
            target: { value: employeeInput.first_name }
        })
        fireEvent.change(screen.getByLabelText('Last name'), {
            target: { value: employeeInput.last_name }
        })
        fireEvent.change(screen.getByLabelText('Job title'), {
            target: { value: employeeInput.title }
        })
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: employeeInput.email }
        })
        fireEvent.change(
            screen.getByLabelText('Country code for phone number'), {
                target: { value: employeeInput.country_code }
            }
        )
        fireEvent.change(
            screen.getByLabelText('Phone number without country code'), {
                target: { value: employeeInput.phone_number }
            }
        )
        fireEvent.change(screen.getByLabelText('Department'), {
            target: { value: employeeInput.department_id }
        })
        fireEvent.change(screen.getByLabelText('Hire date'), {
            target: { value: employeeInput.hire_date }
        })

        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(2)
        })

        expect(screen.getByText('Employee added successfully')).toBeDefined()
    })

    it('shows error message on failed API call', async () => {
        fetchFromBackEnd
            .mockResolvedValueOnce({
                status: 200,
                data: departmentData
            })
            .mockResolvedValueOnce({
                status: 500,
                data: null
            })

        renderComponent(<AddEmployeePage />)

        await waitFor(() => { expect(fetchFromBackEnd).toHaveBeenCalled() })

        fireEvent.change(screen.getByLabelText('First name'), {
            target: { value: employeeInput.first_name }
        })
        fireEvent.change(screen.getByLabelText('Last name'), {
            target: { value: employeeInput.last_name }
        })
        fireEvent.change(screen.getByLabelText('Job title'), {
            target: { value: employeeInput.title }
        })
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: employeeInput.email }
        })
        fireEvent.change(
            screen.getByLabelText('Country code for phone number'), {
                target: { value: employeeInput.country_code }
            }
        )
        fireEvent.change(
            screen.getByLabelText('Phone number without country code'), {
                target: { value: employeeInput.phone_number }
            }
        )
        fireEvent.change(screen.getByLabelText('Department'), {
            target: { value: employeeInput.department_id }
        })
        fireEvent.change(screen.getByLabelText('Hire date'), {
            target: { value: employeeInput.hire_date }
        })

        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(2)
        })

        expect(screen.getByText('Error adding employee')).toBeDefined()
    })
})
