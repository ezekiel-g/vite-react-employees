import { describe, it, expect, vi } from 'vitest'
import messageUtility from '../../util/messageUtility.jsx'

describe('messageUtility', () => {
    describe('displaySuccessMessages', () => {
        it('returns null if messages array is empty', () => {
            const output = messageUtility.displaySuccessMessages([])

            expect(output).toBeNull()
        })

        it('returns message divs for non-empty messages array', () => {
            const messages = ['Success 1', 'Success 2']
            const output = messageUtility.displaySuccessMessages(messages)

            expect(output).toHaveLength(2)
            expect(output[0].props.children).toBe('Success 1')
            expect(output[1].props.children).toBe('Success 2')
        })
    })

    describe('displayErrorMessages', () => {
        it('returns null if messages array is empty', () => {
            const output =
                messageUtility.displayErrorMessages([], 'http://example.com')

            expect(output).toBeNull()
        })

        it('returns error message divs with resolution link', () => {
            const messages = ['Error 1', 'Error 2']
            const resolutionLink = 'http://example.com'
            const output =
                messageUtility.displayErrorMessages(messages, resolutionLink)

            expect(output).toHaveLength(2)
            expect(output[0].props.children).toContain('Error 1')
            expect(output[1].props.children).toContain('Error 2')

            expect(output[0].props.children).toContain(' — ')
            expect(output[0].props.children).toContain('http://example.com')
            expect(output[1].props.children).toContain(' — ')
            expect(output[1].props.children).toContain('http://example.com')
        })

        it('returns error message divs without link if not provided', () => {
            const messages = ['Error 1', 'Error 2']
            const output = messageUtility.displayErrorMessages(messages)

            expect(output).toHaveLength(2)
            expect(output[0].props.children).toContain('Error 1')
            expect(output[1].props.children).toContain('Error 2')
            expect(output[0].props.children).not.toContain(' —')
        })
    })

    describe('setMessagesWithTimeout', () => {
        it('sets messages and clears them after a timeout', () => {
            vi.useFakeTimers()
            
            const setMessages = vi.fn()
            const messages = ['Message 1']

            messageUtility.setMessagesWithTimeout(messages, setMessages)

            expect(setMessages).toHaveBeenCalledWith(messages)

            vi.advanceTimersByTime(2000)
            expect(setMessages).toHaveBeenCalledWith([])

            vi.restoreAllMocks()
        })
    })
})
