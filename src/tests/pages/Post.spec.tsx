import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'


const posts = {
    slug: 'my-new-post',
    title: 'My new Post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Abril'
}

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('Renders correctly', () => {

        render(<Post post={posts} />)

        expect(screen.getByText('My new Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {

        const getSessionMocked = jest.mocked(getSession)
        
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null,
        } as any)
        
        const response = await getServerSideProps({ params: {slug: 'my-new-post'}} as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',            
                })
            })
        )
    })

    it('Loads initial data', async () => {
        const getSessionMocked = jest.mocked(getSession)
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                // uid: 'my-new-post',
                data: {
                    title: [
                        { type: "heading", text: "My new post" }
                    ],
                    content: [
                        { type: "paragraph", text: "Post content" }
                    ], 
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription',
        } as any)

        const response = await getServerSideProps({ 
            params: { slug: 'my-new-post' }
        } as any)

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