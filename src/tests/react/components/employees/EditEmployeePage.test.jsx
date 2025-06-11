import { vi, afterEach, describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditEmployeePage
    from '../../../../react/components/employees/EditEmployeePage'
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
        validateIsActive: vi.fn(() => ({ valid: true })),
        checkForEmployeeChanges: vi.fn(async () => ({ valid: true }))
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
        <MemoryRouter initialEntries={['/employees/edit/1']}>
            <Routes>
                <Route
                    path="/employees/edit/:id"
                    element={<EditEmployeePage />}
                />
            </Routes>
        </MemoryRouter>
    )
}

const originalEmployee = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    title: 'Developer',
    email: 'john.doe@example.com',
    hire_date: '2020-01-01',
    department_id: 1,
    country_code: '+1',
    phone_number: '1234567890',
    is_active: 1
}

const updatedEmployee = {
    first_name: 'Michael',
    last_name: 'Smith',
    title: 'Senior Developer',
    email: 'michael.smith@example.com',
    hire_date: '2021-05-10',
    department_id: '1',
    country_code: '+44',
    phone_number: '9876543210'
}

const departments = [{ id: 1, name: 'Engineering' }]

describe('EditEmployeePage', () => {
    afterEach(() => { vi.clearAllMocks() })
    
    it('submits and shows success message on valid edit', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        fetchFromBackEnd
            .mockResolvedValueOnce({ status: 200, data: departments })
            .mockResolvedValueOnce({ status: 200, data: [originalEmployee] })
            .mockResolvedValueOnce({ status: 200, data: {} })

        renderComponent()

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(2)
        })

        fireEvent.change(screen.getByLabelText('First name'), {
            target: { value: updatedEmployee.first_name }
        })
        fireEvent.change(screen.getByLabelText('Last name'), {
            target: { value: updatedEmployee.last_name }
        })
        fireEvent.change(screen.getByLabelText('Job title'), {
            target: { value: updatedEmployee.title }
        })
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: updatedEmployee.email }
        })
        fireEvent.change(
            screen.getByLabelText('Country code for phone number'), {
                target: { value: updatedEmployee.country_code }
            }
        )
        fireEvent.change(
            screen.getByLabelText('Phone number without country code'), {
                target: { value: updatedEmployee.phone_number }
            }
        )
        fireEvent.change(screen.getByLabelText('Department'), {
            target: { value: updatedEmployee.department_id }
        })
        fireEvent.change(screen.getByLabelText('Hire date'), {
            target: { value: updatedEmployee.hire_date }
        })
        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(3)
        })

        expect(screen.getByText('Employee edited successfully')).toBeDefined()
    })

    it('shows error message on failed API call', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        fetchFromBackEnd
            .mockResolvedValueOnce({ status: 200, data: departments })
            .mockResolvedValueOnce({ status: 200, data: [originalEmployee] })
            .mockResolvedValueOnce({ status: 500, data: null })

        renderComponent()

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(2)
        })

        fireEvent.change(screen.getByLabelText('First name'), {
            target: { value: updatedEmployee.first_name }
        })
        fireEvent.change(screen.getByLabelText('Last name'), {
            target: { value: updatedEmployee.last_name }
        })
        fireEvent.change(screen.getByLabelText('Job title'), {
            target: { value: updatedEmployee.title }
        })
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: updatedEmployee.email }
        })
        fireEvent.change(
            screen.getByLabelText('Country code for phone number'), {
                target: { value: updatedEmployee.country_code }
            }
        )
        fireEvent.change(
            screen.getByLabelText('Phone number without country code'), {
                target: { value: updatedEmployee.phone_number }
            }
        )
        fireEvent.change(screen.getByLabelText('Department'), {
            target: { value: updatedEmployee.department_id }
        })
        fireEvent.change(screen.getByLabelText('Hire date'), {
            target: { value: updatedEmployee.hire_date }
        })
        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(3)
        })

        expect(screen.getByText('Error editing employee')).toBeDefined()
    })
})
