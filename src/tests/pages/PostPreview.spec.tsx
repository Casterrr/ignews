import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { useRouter } from 'next/router';


const posts = {
    slug: 'my-new-post',
    title: 'My new Post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Abril'
}

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn()
    })
}))
jest.mock('../../services/prismic')


describe('Post preview page', () => {
    it('Renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        })

        render(<Post post={posts} />)

        expect(screen.getByText('My new Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {

        const useSessionMocked = jest.mocked(useSession)
        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()
        
        // useSessionMocked.mockReturnValueOnce([
        //     { activeSubscription: "fake-active-subscription" },
        //     false
        // ] as any)

        useSessionMocked.mockReturnValueOnce({
            data: { 
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
        } as any)
        
        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<Post post={posts} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('Loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                // uid: 'my-new-post',
                data: {
                    title: [
                        { type: "heading", text: "My new post" }
                    ],
                    content: [
                        { type: "paragraph", text: "Post content", spans: [] }
                    ], 
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        const response = await getStaticProps({ params: { slug: "my-new-post" } })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
               })
        )
    })
})