import { describe, it, expect, vi } from 'vitest'
import fetchFromBackEnd from '../../util/fetchFromBackEnd.js'

describe('fetchFromBackEnd', () => {
    it('returns the correct response for a successful fetch', async () => {
        const mockResponse = { message: 'Success', data: { key: 'value' } }
        const mockFetch = vi.fn().mockResolvedValue({
            status: 200,
            statusText: 'OK',
            json: vi.fn().mockResolvedValue(mockResponse)
        })
        
        vi.stubGlobal('fetch', mockFetch)

        const result = await fetchFromBackEnd('https://api.example.com')

        expect(result.status).toBe(200)
        expect(result.statusText).toBe('OK')
        expect(result.data).toEqual(mockResponse)
        expect(result.message).toBe('Success')
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
            method: 'GET',
            headers: {},
            credentials: 'same-origin'
        })

        vi.unstubAllGlobals()
    })

    it('returns an error message when fetch fails', async () => {
        const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
        
        vi.stubGlobal('fetch', mockFetch)

        const result = await fetchFromBackEnd('https://api.example.com')

        expect(result.status).toBe(500)
        expect(result.statusText).toBe('Internal server error')
        expect(result.message).toBe('Network error')
        expect(result.data).toBeNull()

        vi.unstubAllGlobals()
    })

    it('sets correct headers when provided as a string', async () => {
        const mockResponse = { message: 'Success' }
        const mockFetch = vi.fn().mockResolvedValue({
            status: 200,
            statusText: 'OK',
            json: vi.fn().mockResolvedValue(mockResponse)
        })

        vi.stubGlobal('fetch', mockFetch)

        const result = await fetchFromBackEnd(
            'https://api.example.com', 
            'POST', 
            'application/xml'
        )

        expect(result.status).toBe(200)
        expect(result.statusText).toBe('OK')
        expect(result.message).toBe('Success')
        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.example.com',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/xml' },
                credentials: 'same-origin'
            }
        )

        vi.unstubAllGlobals()
    })

    it('adds Content-Type header when body is provided', async () => {
        const mockResponse = { message: 'Created' }
        const mockFetch = vi.fn().mockResolvedValue({
            status: 201,
            statusText: 'Created',
            json: vi.fn().mockResolvedValue(mockResponse)
        })

        vi.stubGlobal('fetch', mockFetch)

        const result = await fetchFromBackEnd(
            'https://api.example.com', 
            'POST', 
            {},
            'same-origin',
            { key: 'value' }
        )

        expect(result.status).toBe(201)
        expect(result.statusText).toBe('Created')
        expect(result.message).toBe('Created')
        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.example.com',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: '{"key":"value"}'
            }
        )

        vi.unstubAllGlobals()
    })
})
