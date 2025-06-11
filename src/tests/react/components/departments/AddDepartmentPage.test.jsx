import { vi, afterEach, describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AddDepartmentPage
    from '../../../../react/components/departments/AddDepartmentPage'
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js'

vi.mock('../../../../util/fetchFromBackEnd.js')
vi.mock('../../../../util/validateDepartment.js', () => ({
    default: {
        validateName: vi.fn(() => ({ valid: true })),
        validateCode: vi.fn(async () => ({ valid: true })),
        validateLocation: vi.fn(() => ({ valid: true }))
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
            <AddDepartmentPage />
        </MemoryRouter>
    )
}

const departmentInput = {
    name: 'Engineering',
    code: 'ENG123',
    location: 'New York'
}

describe('AddDepartmentPage', () => {
    afterEach(() => { vi.clearAllMocks() })

    it('submits and shows success message on valid input', async () => {
        fetchFromBackEnd.mockResolvedValue({
            status: 201,
            data: {}
        })

        renderComponent()

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: departmentInput.name }
        })
        fireEvent.change(screen.getByLabelText('Code'), {
            target: { value: departmentInput.code }
        })
        fireEvent.change(screen.getByLabelText('Location'), {
            target: { value: departmentInput.location }
        })
        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => { expect(fetchFromBackEnd).toHaveBeenCalled() })

        expect(screen.getByText('Department added successfully')).toBeDefined()
    })

    it('shows error message on failed API call', async () => {
        fetchFromBackEnd.mockResolvedValue({
            status: 500,
            data: null
        })

        renderComponent()

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: departmentInput.name }
        })
        fireEvent.change(screen.getByLabelText('Code'), {
            target: { value: departmentInput.code }
        })
        fireEvent.change(screen.getByLabelText('Location'), {
            target: { value: departmentInput.location }
        })
        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => { expect(fetchFromBackEnd).toHaveBeenCalled() })

        expect(screen.getByText('Error adding department')).toBeDefined()
    })
})
