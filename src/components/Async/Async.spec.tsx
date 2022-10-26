import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.';

test('it renders correctly', async () => {
  render(<Async />)
  
  expect(screen.getByText('Hello World')).toBeInTheDocument()

  await waitForElementToBeRemoved(screen.queryByText('Button'))

  // screen.logTestingPlaygroundURL()

  // await waitFor(() => {
      //nota: get procura e se não achar, dá erro.
      //   return expect(screen.getByText("Button")).not.toBeInTheDocument()
      //nota: query procurar e se não achar, não dá erro.
        // return expect(screen.queryByText("Button")).not.toBeInTheDocument()
      //nota: find procura e se não achar, ele aguarda aparecer.
        // return expect(screen.findByText("Button")).not.toBeInTheDocument()
  // })
});