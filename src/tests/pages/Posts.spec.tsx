import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps, } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

const posts = [
    {   
        slug: 'my-new-post',
        title: 'My new Post',
        excerpt: '<p>Post exerpt</p>',
        updatedAt: '10 de Abril'
    }
] 

jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('Renders correctly', () => {

        render(<Posts posts={posts} />)

        expect(screen.getByText('My new Post')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByType: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My new post' }
                            ], 
                            content: [
                                { type: 'paragraph', text: 'Post content' }
                            ],
                        },
                        last_publication_date: '04-01-2021',
                    }
                ]
            })
        } as any )

        const response = await getStaticProps({
            previewData: undefined,
        })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        excerpt: 'Post content',
                        updatedAt: '01 de abril de 2021'
                    }]
                }
            })
        )
    })
})