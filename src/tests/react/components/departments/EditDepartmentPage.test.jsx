import { vi, afterEach, describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditDepartmentPage
    from '../../../../react/components/departments/EditDepartmentPage'
import fetchFromBackEnd from '../../../../util/fetchFromBackEnd.js'

vi.mock('../../../../util/fetchFromBackEnd.js')
vi.mock('../../../../util/validateDepartment.js', () => ({
    default: {
        validateName: vi.fn(() => ({ valid: true })),
        validateCode: vi.fn(async () => ({ valid: true })),
        validateLocation: vi.fn(() => ({ valid: true })),
        checkForDepartmentChanges: vi.fn(async () => ({ valid: true }))
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
        <MemoryRouter initialEntries={['/departments/edit/1']}>
            <Routes>
                <Route
                    path="/departments/edit/:id"
                    element={<EditDepartmentPage />}
                />
            </Routes>
        </MemoryRouter>
    )
}

const originalDepartment = {
    id: 1,
    name: 'Original Department Name',
    code: 'ORIG123',
    location: 'London'
}

const updatedDepartment = {
    name: 'Updated Department Name',
    code: 'UPD123',
    location: 'New York'
}

describe('EditDepartmentPage', () => {
    afterEach(() => { vi.clearAllMocks() })

    it('submits and shows success message on valid edit', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        fetchFromBackEnd
            .mockResolvedValueOnce({ status: 200, data: [originalDepartment] })
            .mockResolvedValueOnce({ status: 200, data: {} })

        renderComponent()

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalled()
        })

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: updatedDepartment.name }
        })
        fireEvent.change(screen.getByLabelText('Code'), {
            target: { value: updatedDepartment.code }
        })
        fireEvent.change(screen.getByLabelText('Location'), {
            target: { value: updatedDepartment.location }
        })
        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(2)
        })

        expect(screen.getByText('Department edited successfully')).toBeDefined()
    })

    it('shows error message on failed API call', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        fetchFromBackEnd
            .mockResolvedValueOnce({ status: 200, data: [originalDepartment] })
            .mockResolvedValueOnce({ status: 500, data: null })

        renderComponent()

        await waitFor(() => { expect(fetchFromBackEnd).toHaveBeenCalled() })

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: updatedDepartment.name }
        })
        fireEvent.change(screen.getByLabelText('Code'), {
            target: { value: updatedDepartment.code }
        })
        fireEvent.change(screen.getByLabelText('Location'), {
            target: { value: updatedDepartment.location }
        })
        fireEvent.click(screen.getAllByText('Submit')[0])

        await waitFor(() => {
            expect(fetchFromBackEnd).toHaveBeenCalledTimes(2)
        })

        expect(screen.getByText('Error editing department')).toBeDefined()
    })
})
