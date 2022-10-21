import { fireEvent, render, screen } from "@testing-library/react"
import { signIn, useSession } from 'next-auth/react'
import { useRouter} from 'next/router'
import { SubscribeButton } from "."

jest.mock('next-auth/react')

//fn is a void function from jest. It is like this () => {}
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn()
    })
}))

describe('SubscribeButton Component', () => {

    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null, 
            status: 'unauthenticated'
        })

        render(
            <SubscribeButton />
        )

        expect(screen.getByText('Subscribe now')).toBeInTheDocument() 
    })

    it('redirects user to sign in when not authenticated', () => {
        const signInMocked = jest.mocked(signIn)
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null, 
            status: 'unauthenticated'
        })

        render(
            <SubscribeButton />
        )

        const subscribleButton = screen.getByText('Subscribe now')

        fireEvent.click(subscribleButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
       
            const useRouterMocked = jest.mocked(useRouter)
            const useSessionMocked = jest.mocked(useSession)
            const pushMock = jest.fn()

            useSessionMocked.mockReturnValueOnce({
                data: {
                    user: { 
                        name: "John Doe", 
                        email: "john.doe@example.com"
                    },
                    activeSubscription: 'fake-active-subscription',
                    expires: "fake-expires"
                },
                status: 'authenticated'
            })

            useRouterMocked.mockReturnValueOnce({
                push: pushMock
            } as any)
    
            render(
                <SubscribeButton />
            )
    
            const subscribleButton = screen.getByText('Subscribe now')

            fireEvent.click(subscribleButton)

            expect(pushMock).toHaveBeenCalledWith('/posts')
    })
} )